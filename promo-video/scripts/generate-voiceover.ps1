$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Speech

$projectDir = Split-Path -Parent $PSScriptRoot
$voiceDir = Join-Path $projectDir "assets\voiceover"
New-Item -ItemType Directory -Force -Path $voiceDir | Out-Null

$lines = @(
  @{ start = 0.25; file = "01-old-tablet.wav"; text = "Two days ago, I got access to my old tablet again." },
  @{ start = 3.9; file = "02-broken-screen.wav"; text = "The screen was broken. I could barely use it." },
  @{ start = 7.35; file = "03-built-techzilla.wav"; text = "As a web developer, I built Techzilla Cloud." },
  @{ start = 11.5; file = "04-files-everywhere.wav"; text = "I wanted my files on every device, in one place." },
  @{ start = 17.55; file = "05-live-demo.wav"; text = "Here's a little live demo." },
  @{ start = 19.8; file = "06-landing-music.wav"; text = "On the landing page, Recently played is ready to go." },
  @{ start = 25.9; file = "07-music-page.wav"; text = "On the Music page, I can browse quick picks and my full library." },
  @{ start = 35.2; file = "08-closing.wav"; text = "Techzilla Cloud. All your files, together." }
)

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $voice = $synth.GetInstalledVoices() |
    Where-Object { $_.VoiceInfo.Name -eq "Microsoft David Desktop" } |
    Select-Object -First 1
  if (-not $voice) {
    throw "The Microsoft David Desktop voice is unavailable on this computer."
  }
  $synth.SelectVoice($voice.VoiceInfo.Name)
  $synth.Rate = 2
  $synth.Volume = 90

  foreach ($line in $lines) {
    $target = Join-Path $voiceDir $line.file
    $synth.SetOutputToWaveFile($target)
    $synth.Speak($line.text)
    $synth.SetOutputToNull()
  }

  $lines | ConvertTo-Json -Depth 3 | Set-Content -Encoding utf8 (Join-Path $voiceDir "lines.json")
  Write-Output "Generated $($lines.Count) narration lines with Microsoft David Desktop."
} finally {
  $synth.Dispose()
}
