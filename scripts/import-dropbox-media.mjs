import { createHash } from "node:crypto"

import { readFile, mkdir, rename, writeFile } from "node:fs/promises"

import path from "node:path"

import puppeteer from "puppeteer"

const root = process.cwd()

const manifestPath = path.join(root, "public", "media-library.json")

const listingEndpoint =
  "https://www.dropbox.com/list_shared_link_folder_entries"

const imageExtensions = new Set([
  ".avif",

  ".bmp",

  ".gif",

  ".heic",

  ".heif",

  ".jpeg",

  ".jpg",

  ".png",

  ".tif",

  ".tiff",

  ".webp",
])

const videoExtensions = new Set([
  ".3gp",

  ".avi",

  ".m4v",

  ".mkv",

  ".mov",

  ".mp4",

  ".mpeg",

  ".mpg",

  ".webm",

  ".wmv",
])

async function loadLocalEnv() {
  try {
    const source = await readFile(path.join(root, ".env.local"), "utf8")

    for (const line of source.split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line)

      if (!match || match[1] in process.env) continue

      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2")
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error
  }
}

function requiredEnv(name) {
  const value = process.env[name]?.trim()

  if (!value)
    throw new Error(`Missing ${name}. See .env.example and MEDIA_IMPORT.md.`)

  return value
}

function sharedFolderUrls() {
  return [
    requiredEnv("DROPBOX_MEDIA_FOLDER_URL_1"),

    requiredEnv("DROPBOX_MEDIA_FOLDER_URL_2"),
  ].map((value) => {
    const url = new URL(value)

    if (
      url.protocol !== "https:" ||
      url.hostname !== "www.dropbox.com" ||
      !/^\/(?:scl\/fo|sh)\//.test(url.pathname)
    ) {
      throw new Error(
        "Dropbox folder settings must be public Dropbox shared-folder URLs.",
      )
    }

    return url.toString()
  })
}

function parseDisplayedSize(text) {
  const match = /([\d,.]+)\s*(bytes?|B|KB|MB|GB|TB)\b/i.exec(text)

  if (!match) return null

  const value = Number(match[1].replace(/,/g, ""))

  if (!Number.isFinite(value)) return null

  const unit = match[2].toLowerCase()

  const power =
    unit === "tb"
      ? 4
      : unit === "gb"
        ? 3
        : unit === "mb"
          ? 2
          : unit === "kb"
            ? 1
            : 0

  return Math.round(value * 1024 ** power)
}

function rawFileUrl(sharedFileUrl) {
  const url = new URL(sharedFileUrl)

  if (
    url.protocol !== "https:" ||
    url.hostname !== "www.dropbox.com" ||
    !url.searchParams.has("rlkey")
  ) {
    throw new Error(`Dropbox returned an invalid public file link: ${url.href}`)
  }

  url.searchParams.delete("dl")

  url.searchParams.set("raw", "1")

  return url.toString()
}

function mediaId(file, src) {
  return Number.parseInt(
    createHash("sha256")

      .update(file.file_id || src)

      .digest("hex")

      .slice(0, 12),

    16,
  )
}

function readableSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "Size unavailable"

  const units = ["B", "KB", "MB", "GB", "TB"]

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),

    units.length - 1,
  )

  const value = bytes / 1024 ** unitIndex

  return `${value.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

function extensionOf(name) {
  return path.extname(name).toLowerCase()
}

async function readFolderEntries(page, sharedFolderUrl) {
  const firstListingRequest = page.waitForRequest(
    (request) => request.url() === listingEndpoint,

    { timeout: 30_000 },
  )

  const response = await page.goto(sharedFolderUrl, {
    waitUntil: "domcontentloaded",

    timeout: 60_000,
  })

  if (!response?.ok())
    throw new Error(
      `Dropbox folder page failed (${response?.status() ?? "no response"}): ${sharedFolderUrl}`,
    )

  await page.waitForSelector('a[href*="/scl/fo/"]', { timeout: 30_000 })

  const request = await firstListingRequest

  const postData = request.postData()

  if (!postData)
    throw new Error("Dropbox did not provide a public folder listing request.")

  const initialEntries = (
    await page.$$eval('a[href*="/scl/fo/"]', (links) =>
      links

        .map((link) => {
          const row = link.closest('[role="row"]') || link.closest("tr")

          return {
            filename: link.innerText.trim(),

            href: link.href,

            displayedSize: row?.innerText || "",
          }
        })

        .filter((entry) => entry.filename && entry.href),
    )
  )

    .map((entry) => ({
      filename: entry.filename,

      href: entry.href,

      bytes: parseDisplayedSize(entry.displayedSize),
    }))

  const listing = await page.evaluate(
    async ({ postData, initialEntries, imageExtensions, videoExtensions }) => {
      const params = new URLSearchParams(postData)

      const entries = [...initialEntries]

      let totalEntries = null

      let directories = 0

      let ignoredEntries = 0

      let apiEntries = 0

      let pages = 0

      while (true) {
        const response = await fetch(
          "https://www.dropbox.com/list_shared_link_folder_entries",

          {
            method: "POST",

            credentials: "include",

            headers: { "content-type": "application/x-www-form-urlencoded" },

            body: params,
          },
        )

        if (!response.ok)
          throw new Error(
            `Dropbox listing request failed (${response.status}).`,
          )

        const result = await response.json()

        if (!Array.isArray(result.entries))
          throw new Error("Dropbox returned an invalid folder listing.")

        if (pages === 0) {
          totalEntries = result.total_num_entries

          if (!Number.isInteger(totalEntries))
            throw new Error("Dropbox returned no total folder entry count.")
        }

        pages += 1

        apiEntries += result.entries.length

        for (const entry of result.entries) {
          if (entry.is_dir || entry[".tag"] === "folder") {
            directories += 1

            continue
          }

          const filename = entry.filename

          const extension = filename
            ? `.${filename.split(".").pop().toLowerCase()}`
            : ""

          if (
            filename &&
            (imageExtensions.includes(extension) ||
              videoExtensions.includes(extension))
          ) {
            entries.push({
              filename,

              href: entry.href,

              bytes: entry.bytes,

              file_id: entry.file_id,
            })
          } else {
            ignoredEntries += 1
          }
        }

        if (!result.has_more_entries) break

        if (!result.next_request_voucher)
          throw new Error("Dropbox omitted its next-page listing token.")

        params.set("voucher", result.next_request_voucher)

        if (pages > 1000)
          throw new Error("Dropbox folder listing exceeded 1,000 pages.")
      }

      return {
        entries,

        totalEntries,

        listedEntries: initialEntries.length + apiEntries,

        directories,

        ignoredEntries,

        pages,
      }
    },

    {
      postData,

      initialEntries,

      imageExtensions: [...imageExtensions],

      videoExtensions: [...videoExtensions],
    },
  )

  if (listing.directories > 0)
    throw new Error(
      `Dropbox folder contains ${listing.directories} subfolder(s); move media into the shared folder root before importing.`,
    )

  if (listing.listedEntries !== listing.totalEntries)
    throw new Error(
      `Dropbox listing was incomplete: received ${listing.listedEntries} of ${listing.totalEntries} entries.`,
    )

  if (listing.entries.some((entry) => !entry.href))
    throw new Error("Dropbox returned a media item without a public file link.")

  console.log(
    `Listed ${listing.totalEntries} entries across ${listing.pages} Dropbox pages; found ${listing.entries.length} media files.`,
  )

  return listing
}

async function buildManifest(folderUrls) {
  const browser = await puppeteer.launch({ headless: true })

  const filesByUrl = new Map()

  let ignoredEntries = 0

  try {
    const page = await browser.newPage()

    page.setDefaultTimeout(30_000)

    for (const folderUrl of folderUrls) {
      const listing = await readFolderEntries(page, folderUrl)

      ignoredEntries += listing.ignoredEntries

      for (const file of listing.entries) {
        const extension = extensionOf(file.filename)

        const kind = imageExtensions.has(extension)
          ? "photo"
          : videoExtensions.has(extension)
            ? "video"
            : null

        if (!kind) {
          ignoredEntries += 1

          continue
        }

        const src = rawFileUrl(file.href)

        filesByUrl.set(src, {
          ...file,

          kind,

          size: Number.isFinite(file.bytes) ? file.bytes : 0,

          src,
        })
      }
    }
  } finally {
    await browser.close()
  }

  const files = [...filesByUrl.values()].sort((first, second) =>
    first.filename.localeCompare(second.filename),
  )

  const photos = []

  const videos = []

  const usedIds = new Set()

  for (const file of files) {
    const id = mediaId(file, file.src)

    if (usedIds.has(id))
      throw new Error(`Dropbox media ID collision for ${file.filename}.`)

    usedIds.add(id)

    const item = {
      id,
      title: file.filename.replace(/\.[^.]+$/, ""),
      meta: readableSize(file.size),
      size: file.size,
      src: file.src,
    }

    if (file.kind === "photo") photos.push(item)
    else videos.push(item)
  }

  if (ignoredEntries)
    console.log(`Ignored ${ignoredEntries} unsupported or metadata entries.`)

  return { updatedAt: new Date().toISOString(), photos, videos }
}

async function writeManifest(manifest) {
  await mkdir(path.dirname(manifestPath), { recursive: true })

  const temporary = `${manifestPath}.tmp`

  await writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`)

  await rename(temporary, manifestPath)
}

async function main() {
  await loadLocalEnv()

  const manifest = await buildManifest(sharedFolderUrls())

  if (manifest.photos.length + manifest.videos.length === 0)
    throw new Error("Dropbox folders contained no supported media files.")

  await writeManifest(manifest)

  console.log(
    `Catalog ready: ${manifest.photos.length} photos and ${manifest.videos.length} videos.`,
  )

  console.log("Build and redeploy the site to publish the updated catalog.")
}

main().catch((error) => {
  console.error("Dropbox media import failed:", error)

  process.exitCode = 1
})
