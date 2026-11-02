import { createHash } from "node:crypto"
import { createServer } from "node:http"
import { execFile } from "node:child_process"
import { createReadStream, createWriteStream } from "node:fs"
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { google } from "googleapis"
import yauzl from "yauzl"

const execFileAsync = promisify(execFile)
const root = process.cwd()
const localDir = path.join(root, "scripts", ".local")
const statePath = path.join(localDir, "state.json")
const tokenPath = path.join(localDir, "google-token.json")
const manifestPath = path.join(root, "public", "media-library.json")
const redirectUri = "http://127.0.0.1:53682/oauth2callback"
const imageExtensions = new Set([
  ".avif",
  ".bmp",
  ".dng",
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
const mediaMimeTypes = {
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".dng": "image/x-adobe-dng",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".webp": "image/webp",
  ".3gp": "video/3gpp",
  ".avi": "video/x-msvideo",
  ".m4v": "video/mp4",
  ".mkv": "video/x-matroska",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".mpeg": "video/mpeg",
  ".mpg": "video/mpeg",
  ".webm": "video/webm",
  ".wmv": "video/x-ms-wmv",
}

async function loadLocalEnv() {
  const envPath = path.join(root, ".env.local")
  try {
    const source = await readFile(envPath, "utf8")
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
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}. See .env.example.`)
  return value
}

async function loadState() {
  try {
    return JSON.parse(await readFile(statePath, "utf8"))
  } catch (error) {
    if (error.code !== "ENOENT") throw error
    return { nextAssetId: 100000, assets: {}, archives: {} }
  }
}

async function saveState(state) {
  await mkdir(localDir, { recursive: true })
  const temporary = `${statePath}.tmp`
  await writeFile(temporary, JSON.stringify(state, null, 2))
  await rename(temporary, statePath)
}

async function authorize() {
  const client = new google.auth.OAuth2(
    requiredEnv("GOOGLE_OAUTH_CLIENT_ID"),
    requiredEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
    redirectUri,
  )

  try {
    client.setCredentials(JSON.parse(await readFile(tokenPath, "utf8")))
    await client.getAccessToken()
    return client
  } catch (error) {
    const invalidToken =
      error.response?.status === 400 ||
      error.response?.status === 401 ||
      error.response?.data?.error === "invalid_grant"
    if (error.code !== "ENOENT" && !invalidToken) throw error
    if (invalidToken) await rm(tokenPath, { force: true })
  }

  await mkdir(localDir, { recursive: true })
  const authCode = await new Promise((resolve, reject) => {
    const server = createServer((request, response) => {
      const callbackUrl = new URL(request.url, redirectUri)
      if (callbackUrl.pathname !== "/oauth2callback") {
        response.writeHead(404).end("Not found")
        return
      }
      const code = callbackUrl.searchParams.get("code")
      if (!code) {
        response.writeHead(400).end("Google authorization was not completed.")
        reject(new Error("Google authorization returned no code"))
        server.close()
        return
      }
      response.writeHead(200, { "content-type": "text/plain" })
      response.end("Google Drive connected. You can close this browser tab.")
      server.close(() => resolve(code))
    })
    server.on("error", reject)
    server.listen(53682, "127.0.0.1", () => {
      const authorizationUrl = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/drive.file"],
      })
      console.log("Opening Google sign-in to authorize the local importer...")
      const command =
        process.platform === "win32"
          ? ["rundll32.exe", ["url.dll,FileProtocolHandler", authorizationUrl]]
          : process.platform === "darwin"
            ? ["open", [authorizationUrl]]
            : ["xdg-open", [authorizationUrl]]
      execFileAsync(command[0], command[1]).catch(() => {
        console.log(`Open this URL in your browser:\n${authorizationUrl}`)
      })
    })
  })

  const { tokens } = await client.getToken(authCode)
  client.setCredentials(tokens)
  await writeFile(tokenPath, JSON.stringify(tokens, null, 2))
  return client
}

function openZip(zipPath) {
  return new Promise((resolve, reject) => {
    yauzl.open(
      zipPath,
      { lazyEntries: true, autoClose: false, decodeStrings: true },
      (error, zipFile) => {
        if (error) reject(error)
        else resolve(zipFile)
      },
    )
  })
}

function openZipEntry(zipFile, entry) {
  return new Promise((resolve, reject) => {
    zipFile.openReadStream(entry, (error, stream) => {
      if (error) reject(error)
      else resolve(stream)
    })
  })
}

async function extractEntry(zipFile, entry, targetPath) {
  const stream = await openZipEntry(zipFile, entry)
  await mkdir(path.dirname(targetPath), { recursive: true })
  await new Promise((resolve, reject) => {
    const output = createWriteStream(targetPath, { flags: "wx" })
    stream.on("error", reject)
    output.on("error", reject)
    output.on("finish", resolve)
    stream.pipe(output)
  })
}

async function walk(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(absolutePath)))
    else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".zip")
      files.push(absolutePath)
  }
  return files
}

function inspectArchive(zipFile, archiveDirectory, onFile) {
  return new Promise((resolve, reject) => {
    let failed = false
    zipFile.on("error", (error) => {
      failed = true
      reject(error)
    })
    zipFile.on("end", () => {
      if (!failed) resolve()
    })
    zipFile.on("entry", async (entry) => {
      try {
        const extension = path.extname(entry.fileName).toLowerCase()
        if (
          entry.fileName.endsWith("/") ||
          (!imageExtensions.has(extension) && !videoExtensions.has(extension))
        ) {
          zipFile.readEntry()
          return
        }

        const target = path.resolve(archiveDirectory, entry.fileName)
        const safeRoot = `${path.resolve(archiveDirectory)}${path.sep}`
        if (!target.startsWith(safeRoot))
          throw new Error(`Unsafe file path in archive: ${entry.fileName}`)
        await extractEntry(zipFile, entry, target)
        await onFile(target, entry.fileName, entry.getLastModDate())
        zipFile.readEntry()
      } catch (error) {
        failed = true
        reject(error)
        zipFile.close()
      }
    })
    zipFile.readEntry()
  })
}

async function digestFile(filePath) {
  const hash = createHash("sha256")
  for await (const chunk of createReadStream(filePath)) hash.update(chunk)
  return hash.digest("hex")
}

function readableSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function driveDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`
}

function drivePreviewUrl(fileId) {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w2048`
}

async function writeManifest(drive, folderId, state) {
  const assets = Object.values(state.assets).sort(
    (first, second) => second.sortTime - first.sortTime,
  )
  const photos = []
  const videos = []

  for (const asset of assets) {
    const item = {
      id: asset.id,
      title: asset.title,
      meta: `${asset.date} · ${readableSize(asset.size)}`,
      size: asset.size,
      src: asset.kind === "photo" ? drivePreviewUrl(asset.driveId) : driveDownloadUrl(asset.driveId),
    }
    if (asset.kind === "photo") photos.push(item)
    else videos.push({ ...item, poster: drivePreviewUrl(asset.driveId) })
  }

  const manifest = { updatedAt: new Date().toISOString(), photos, videos }
  const json = JSON.stringify(manifest, null, 2)
  await mkdir(path.dirname(manifestPath), { recursive: true })
  await writeFile(manifestPath, `${json}\n`)

  if (state.manifestDriveId) {
    await drive.files.update({
      fileId: state.manifestDriveId,
      media: { mimeType: "application/json", body: Buffer.from(json) },
      fields: "id",
    })
  } else {
    const response = await drive.files.create({
      requestBody: {
        name: "media-library.json",
        mimeType: "application/json",
        parents: [folderId],
      },
      media: { mimeType: "application/json", body: Buffer.from(json) },
      fields: "id",
      uploadType: "multipart",
    })
    state.manifestDriveId = response.data.id
  }

  return { photos: photos.length, videos: videos.length }
}

async function ensurePublicFolder(drive, state) {
  if (!state.folderId) {
    const response = await drive.files.create({
      requestBody: {
        name: process.env.GOOGLE_MEDIA_FOLDER_NAME || "Techzilla Media",
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id,name",
    })
    state.folderId = response.data.id
    await saveState(state)
    console.log(`Created Google Drive folder: ${response.data.name}`)
  }

  if (!state.publicFolder) {
    console.log(
      "The media folder will be accessible to anyone with its links. Do not put private files in it.",
    )
    const answer = await new Promise((resolve) => {
      process.stdout.write("Allow public link access for the media folder? (yes/no): ")
      process.stdin.once("data", (data) => resolve(data.toString().trim().toLowerCase()))
    })
    if (answer !== "yes") throw new Error("Public folder sharing was not approved.")
    await drive.permissions.create({
      fileId: state.folderId,
      requestBody: { type: "anyone", role: "reader" },
      fields: "id",
    })
    state.publicFolder = true
    await saveState(state)
  }

  return state.folderId
}

async function uploadMedia(drive, folderId, filePath, entryName, date, state) {
  const extension = path.extname(entryName).toLowerCase()
  const kind = imageExtensions.has(extension) ? "photo" : "video"
  const sha256 = await digestFile(filePath)
  const assetKey = `${sha256}:${path.basename(entryName).toLowerCase()}`
  if (state.assets[assetKey]) return false

  const fileStat = await stat(filePath)
  const title = path.basename(entryName).replace(/\.[^.]+$/, "")
  const driveName = `${sha256.slice(0, 12)}-${path.basename(entryName)}`
  const mimeType = mediaMimeTypes[extension]
  if (!mimeType) throw new Error(`Unsupported media type: ${entryName}`)

  const response = await drive.files.create({
    requestBody: {
      name: driveName,
      mimeType,
      parents: [folderId],
    },
    media: { mimeType, body: createReadStream(filePath) },
    fields: "id",
    uploadType: "resumable",
  })
  if (!response.data.id) throw new Error(`Google Drive returned no ID for ${entryName}`)
  const safeDate =
    date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date()
  state.assets[assetKey] = {
    id: state.nextAssetId++,
    driveId: response.data.id,
    title,
    kind,
    size: fileStat.size,
    date: safeDate.toISOString().slice(0, 10),
    sortTime: safeDate.getTime(),
  }
  await saveState(state)
  console.log(`Uploaded ${kind}: ${entryName}`)
  return true
}

async function processArchive(archivePath, drive, folderId, state) {
  const archiveStat = await stat(archivePath)
  const archiveKey = path.resolve(archivePath)
  if (
    state.archives[archiveKey]?.size === archiveStat.size &&
    state.archives[archiveKey]?.mtimeMs === archiveStat.mtimeMs
  ) {
    return false
  }

  const archiveTemp = await mkdtemp(path.join(tmpdir(), "techzilla-takeout-"))
  let zipFile
  try {
    zipFile = await openZip(archivePath)
    await inspectArchive(zipFile, archiveTemp, async (filePath, entryName, date) => {
      await uploadMedia(drive, folderId, filePath, entryName, date, state)
      await rm(filePath, { force: true })
    })
    const counts = await writeManifest(drive, folderId, state)
    state.archives[archiveKey] = {
      size: archiveStat.size,
      mtimeMs: archiveStat.mtimeMs,
      processedAt: new Date().toISOString(),
    }
    await saveState(state)
    console.log(`Catalog ready: ${counts.photos} photos, ${counts.videos} videos.`)

    if (process.env.DELETE_IMPORTED_TAKEOUT_ARCHIVES === "true") {
      await rm(archivePath)
      console.log(`Removed imported archive from the synced Takeout folder: ${archivePath}`)
    }
    return true
  } finally {
    zipFile?.close()
    await rm(archiveTemp, { recursive: true, force: true })
  }
}

async function runOnce() {
  const sourceDirectory = path.resolve(requiredEnv("GOOGLE_TAKEOUT_DIR"))
  const sourceStat = await stat(sourceDirectory)
  if (!sourceStat.isDirectory())
    throw new Error("GOOGLE_TAKEOUT_DIR must point to a local folder.")

  const auth = await authorize()
  const drive = google.drive({ version: "v3", auth })
  const state = await loadState()
  const folderId = await ensurePublicFolder(drive, state)
  const archives = await walk(sourceDirectory)
  if (!archives.length) {
    console.log("No Takeout ZIP archives found.")
    return
  }

  let imported = 0
  const minimumAgeMs = Number(process.env.ARCHIVE_STABLE_MINUTES || 2) * 60_000
  for (const archivePath of archives) {
    const archiveStat = await stat(archivePath)
    if (Date.now() - archiveStat.mtimeMs < minimumAgeMs) {
      console.log(`Waiting for archive sync to finish: ${archivePath}`)
      continue
    }
    if (await processArchive(archivePath, drive, folderId, state)) imported += 1
  }
  if (!imported) console.log("No new or changed Takeout archives to import.")
}

async function main() {
  await loadLocalEnv()
  if (process.argv.includes("--watch")) {
    const intervalMinutes = Number(process.env.MEDIA_POLL_MINUTES || 30)
    if (!Number.isFinite(intervalMinutes) || intervalMinutes < 5)
      throw new Error("MEDIA_POLL_MINUTES must be at least 5.")
    while (true) {
      try {
        await runOnce()
      } catch (error) {
        console.error("Media import failed:", error)
      }
      await new Promise((resolve) =>
        setTimeout(resolve, intervalMinutes * 60_000),
      )
    }
  } else {
    await runOnce()
  }
}

main().catch((error) => {
  console.error("Media import failed:", error)
  process.exitCode = 1
})
