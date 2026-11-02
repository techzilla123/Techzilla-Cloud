import { spawn } from "node:child_process"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import puppeteer from "puppeteer"

const projectDir = path.resolve(import.meta.dirname, "..")
const assetDir = path.join(projectDir, "assets")
const baseUrl = process.env.TECHZILLA_PREVIEW_URL || "http://localhost:8443/"
const width = 1400
const height = 788
const fps = 30

async function clickButton(page, selector, label) {
  const buttons = await page.$$(selector)
  for (const button of buttons) {
    const text = await button.evaluate((element) => element.innerText.trim())
    if (text === label) {
      await button.click()
      return
    }
  }
  throw new Error(`Could not find the "${label}" button in ${selector}.`)
}

async function clickSong(page, selector, bringIntoView = false) {
  const song = await page.$(selector)
  if (!song) throw new Error(`Could not find the real song control: ${selector}`)
  if (bringIntoView) {
    const heading = await page.$(".music-page .music-shelf-title")
    if (!heading) throw new Error("Could not find the Quick picks shelf heading.")
    await heading.evaluate((element) =>
      element.scrollIntoView({ behavior: "smooth", block: "start" }),
    )
    await delay(700)
  }
  const bounds = await song.boundingBox()
  if (!bounds) throw new Error(`Song control is not visible: ${selector}`)

  await page.mouse.move(width - 36, height - 38)
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
    { steps: 32 },
  )
  await delay(250)
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
  await delay(350)
}

async function ensurePlayback(page) {
  const audio = await page.$("audio")
  if (!audio) throw new Error("The music player audio element is missing.")

  if (await audio.evaluate((element) => element.paused)) {
    const playButton = await page.$('button[aria-label="Play song"]')
    if (!playButton) throw new Error("The selected song is not playing.")
    const bounds = await playButton.boundingBox()
    if (!bounds) throw new Error("The music player's Play button is not visible.")
    await page.mouse.move(width - 36, height - 38)
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
      { steps: 24 },
    )
    await delay(250)
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
  }

  await page.waitForFunction(
    () => {
      const currentAudio = document.querySelector("audio")
      return currentAudio && !currentAudio.paused && currentAudio.currentTime > 0
    },
    { timeout: 5000 },
  )
}

async function installVisibleCursor(page) {
  await page.evaluate(() => {
    const cursor = document.createElement("div")
    cursor.id = "techzilla-demo-cursor"
    cursor.setAttribute("aria-hidden", "true")
    cursor.innerHTML = `
      <svg viewBox="0 0 34 44" width="38" height="48">
        <path d="M4 3v32l8-8 6 13 7-3-7-13h12L4 3z"
          fill="#fff" stroke="#07484a" stroke-linejoin="round" stroke-width="2.6"/>
      </svg>
      <span class="cursor-click-ring"></span>
    `
    const style = document.createElement("style")
    style.id = "techzilla-demo-cursor-style"
    style.textContent = `
      html.techzilla-demo-recording,
      html.techzilla-demo-recording * { cursor: none !important; }
      #techzilla-demo-cursor {
        position: fixed; z-index: 2147483647; left: 0; top: 0;
        width: 38px; height: 48px; pointer-events: none;
        transform: translate(-100px, -100px); transition: transform 40ms linear;
        filter: drop-shadow(0 3px 4px rgba(7,72,74,.36));
      }
      #techzilla-demo-cursor svg { display: block; position: relative; z-index: 1; }
      #techzilla-demo-cursor .cursor-click-ring {
        position: absolute; z-index: 0; left: 4px; top: 3px;
        width: 31px; height: 31px; border: 2px solid #07484a;
        border-radius: 50%; opacity: 0; transform: scale(.35);
        background: rgba(224,246,241,.76);
      }
      #techzilla-demo-cursor.is-clicking .cursor-click-ring {
        animation: techzilla-cursor-click 480ms ease-out;
      }
      @keyframes techzilla-cursor-click {
        0% { opacity: .9; transform: scale(.35); }
        75% { opacity: .44; transform: scale(1.55); }
        100% { opacity: 0; transform: scale(1.8); }
      }
    `
    document.documentElement.classList.add("techzilla-demo-recording")
    document.head.append(style)
    document.body.append(cursor)

    const move = (event) => {
      cursor.style.transform = `translate(${event.clientX - 2}px, ${event.clientY - 2}px)`
    }
    const click = () => {
      cursor.classList.remove("is-clicking")
      void cursor.offsetWidth
      cursor.classList.add("is-clicking")
    }
    document.addEventListener("mousemove", move, { passive: true })
    document.addEventListener("click", click, { passive: true })
    window.__techzillaCursorCleanup = () => {
      document.removeEventListener("mousemove", move)
      document.removeEventListener("click", click)
      cursor.remove()
      style.remove()
      document.documentElement.classList.remove("techzilla-demo-recording")
    }
  })
}

async function waitForFrame(session, getFrame) {
  const deadline = Date.now() + 5000
  while (!getFrame() && Date.now() < deadline) await delay(50)
  if (!getFrame()) {
    await session.send("Page.stopScreencast")
    throw new Error("The browser did not provide a desktop capture frame.")
  }
}

async function recordSegment(page, fileName, durationSeconds, onStart) {
  const outputPath = path.join(assetDir, fileName)
  const session = await page.createCDPSession()
  let latestFrame
  let failure
  session.on("Page.screencastFrame", ({ data, sessionId }) => {
    latestFrame = Buffer.from(data, "base64")
    session
      .send("Page.screencastFrameAck", { sessionId })
      .catch((error) => (failure = error))
  })

  await session.send("Page.startScreencast", {
    format: "jpeg",
    quality: 88,
    maxWidth: width,
    maxHeight: height,
    everyNthFrame: 1,
  })
  await waitForFrame(session, () => latestFrame)

  const ffmpeg = spawn(
    process.env.FFMPEG_PATH || "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-thread_queue_size",
      "512",
      "-f",
      "image2pipe",
      "-framerate",
      String(fps),
      "-vcodec",
      "mjpeg",
      "-i",
      "pipe:0",
      "-vf",
      "scale=1920:1080:flags=lanczos",
      "-r",
      String(fps),
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "19",
      "-pix_fmt",
      "yuv420p",
      "-an",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    { stdio: ["pipe", "ignore", "pipe"] },
  )

  let stderr = ""
  ffmpeg.stderr.setEncoding("utf8")
  ffmpeg.stderr.on("data", (chunk) => (stderr += chunk))
  const exited = new Promise((resolve, reject) => {
    ffmpeg.once("error", reject)
    ffmpeg.once("close", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`))
    })
  })

  const frameCount = Math.ceil(durationSeconds * fps)
  const startTime = performance.now()
  try {
    for (let frame = 0; frame < frameCount; frame += 1) {
      if (failure) throw failure
      if (frame === 30 && onStart) await onStart()
      if (!latestFrame) throw new Error("The desktop capture frame was lost.")
      if (!ffmpeg.stdin.write(latestFrame))
        await new Promise((resolve) => ffmpeg.stdin.once("drain", resolve))
      const targetTime = startTime + ((frame + 1) * 1000) / fps
      const remaining = targetTime - performance.now()
      if (remaining > 0) await delay(remaining)
    }

    ffmpeg.stdin.end()
    await exited
    console.log(`Recorded ${fileName} at ${width} × ${height} desktop viewport.`)
  } finally {
    await session.send("Page.stopScreencast").catch(() => {})
    await session.detach().catch(() => {})
  }
}

await mkdir(assetDir, { recursive: true })
const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--autoplay-policy=no-user-gesture-required",
    "--disable-features=Translate",
  ],
})
let page

try {
  page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.goto(baseUrl, { waitUntil: "networkidle2", timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)
  const logoPage = await browser.newPage()
  await logoPage.setViewport({ width, height, deviceScaleFactor: 4 })
  await logoPage.goto(baseUrl, { waitUntil: "networkidle2", timeout: 60000 })
  await logoPage.evaluate(() => document.fonts.ready)
  const logo = await logoPage.$(".brand-cube")
  if (!logo) throw new Error("Could not locate the real Techzilla brand mark.")
  await logo.screenshot({
    path: path.join(assetDir, "techzilla-mark.png"),
    omitBackground: true,
  })
  await logoPage.close()
  await page.evaluate(() => {
    document.querySelector("#music")?.scrollIntoView({ block: "start" })
  })
  await delay(1000)
  await installVisibleCursor(page)

  await recordSegment(page, "landing-music.mp4", 7.5, () =>
    clickSong(page, ".music-section .track-cover"),
  )

  await clickButton(page, ".main-nav button", "Music")
  await page.waitForFunction(
    () => document.querySelector(".music-page")?.innerText.includes("Listen again"),
    { timeout: 15000 },
  )
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
  await delay(800)

  await recordSegment(page, "music-page.mp4", 10, async () => {
    await clickSong(page, ".music-page .music-quick-grid button", true)
    await ensurePlayback(page)
  })

  const audioState = await page.evaluate(() => {
    const audio = document.querySelector("audio")
    return {
      paused: audio?.paused ?? true,
      currentTime: audio?.currentTime ?? 0,
      title: document.querySelector(".music-page")?.innerText.slice(0, 160),
    }
  })
  console.log(`Music-page capture finished: ${JSON.stringify(audioState)}`)
} finally {
  if (page) {
    await page
      .evaluate(() => {
        document.querySelectorAll("audio, video").forEach((media) => media.pause())
        window.__techzillaCursorCleanup?.()
      })
      .catch(() => {})
    await page.close({ runBeforeUnload: false }).catch(() => {})
  }
  await browser.close()
}
