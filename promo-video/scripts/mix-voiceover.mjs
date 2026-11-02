import { spawn } from "node:child_process"
import { readFile } from "node:fs/promises"
import path from "node:path"

const projectDir = path.resolve(import.meta.dirname, "..")
const voiceDir = path.join(projectDir, "assets", "voiceover")
const lines = JSON.parse(
  (await readFile(path.join(voiceDir, "lines.json"), "utf8")).replace(
    /^\uFEFF/,
    "",
  ),
)
const duration = 39
const args = ["-hide_banner", "-loglevel", "error", "-y"]

for (const line of lines) args.push("-i", path.join(voiceDir, line.file))

const filters = lines.map(
  (line, index) =>
    `[${index}:a]adelay=${Math.round(line.start * 1000)}|${Math.round(line.start * 1000)}[v${index}]`,
)
filters.push(
  `${lines.map((_, index) => `[v${index}]`).join("")}amix=inputs=${lines.length}:duration=longest:dropout_transition=0,apad=pad_dur=${duration},atrim=duration=${duration},loudnorm=I=-16:LRA=11:TP=-1.5,aresample=48000[narration]`,
)

args.push(
  "-filter_complex",
  filters.join(";"),
  "-map",
  "[narration]",
  "-c:a",
  "pcm_s16le",
  path.join(projectDir, "assets", "narration.wav"),
)

const child = spawn(process.env.FFMPEG_PATH || "ffmpeg", args, {
  stdio: ["ignore", "inherit", "inherit"],
})
const exitCode = await new Promise((resolve, reject) => {
  child.once("error", reject)
  child.once("close", resolve)
})
if (exitCode !== 0)
  throw new Error(`Narration mix failed with ffmpeg exit code ${exitCode}.`)
console.log("Mixed narration to assets/narration.wav.")
