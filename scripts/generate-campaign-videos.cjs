const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright-core");
const qrcode = require("qrcode-generator");

const root = path.resolve(__dirname, "..");
const kitDir = path.join(root, "reports", "campaign-kit");
const videoDir = path.join(kitDir, "videos");
const frameDir = path.join(videoDir, "frames");
const manifestPath = path.join(videoDir, "videos.json");

const frameWidth = 720;
const frameHeight = 1280;
const fps = 30;
const secondsPerFrame = 4;
const framesPerCampaign = 5;
const colors = ["#0d6b70", "#9c3f32", "#2f5f8f", "#7b5f11", "#395846", "#693d60"];

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  ensureFfmpeg();
  const campaigns = readCampaigns();
  fs.mkdirSync(frameDir, { recursive: true });
  fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: frameWidth, height: frameHeight }, deviceScaleFactor: 1 });
  const videos = [];

  for (const [index, campaign] of campaigns.entries()) {
    const campaignFrameDir = path.join(frameDir, campaign.id);
    fs.mkdirSync(campaignFrameDir, { recursive: true });
    const frameFiles = [];
    for (let frameIndex = 0; frameIndex < framesPerCampaign; frameIndex += 1) {
      const htmlPath = path.join(campaignFrameDir, `frame-${String(frameIndex + 1).padStart(2, "0")}.html`);
      const pngPath = path.join(campaignFrameDir, `frame-${String(frameIndex + 1).padStart(2, "0")}.png`);
      fs.writeFileSync(htmlPath, renderFrame(campaign, frameIndex, colors[index % colors.length]), "utf8");
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
      await page.screenshot({ path: pngPath, fullPage: true });
      frameFiles.push(pngPath);
    }
    const concatPath = path.join(campaignFrameDir, "concat.txt");
    fs.writeFileSync(concatPath, renderConcat(frameFiles), "utf8");
    const mp4Path = path.join(videoDir, `${campaign.id}.mp4`);
    createVideo(concatPath, mp4Path);
    videos.push({
      id: campaign.id,
      title: campaign.title,
      seconds: framesPerCampaign * secondsPerFrame,
      sizeBytes: fs.statSync(mp4Path).size,
      file: path.relative(kitDir, mp4Path).replace(/\\/g, "/"),
      cover: campaign.posterPng,
      trackedUrl: campaign.trackedUrl,
      captionEn: campaign.captionEn,
      captionZh: campaign.captionZh,
      hashtags: campaign.hashtags,
      postingNote: "Upload the MP4 with the matching caption. Do not ask users to interact with ads or imply guaranteed compression.",
    });
  }

  await browser.close();
  fs.writeFileSync(manifestPath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    format: "720x1280 MP4, 30fps, silent",
    purpose: "Ready-to-upload zero-cost short-video assets for real traffic validation.",
    videos,
  }, null, 2)}\n`, "utf8");
  fs.rmSync(frameDir, { recursive: true, force: true });
  console.log(`Generated ${videos.length} campaign videos in ${path.relative(root, videoDir)}`);
}

function ensureFfmpeg() {
  const result = spawnSync("ffmpeg", ["-version"], { encoding: "utf8", shell: false });
  if (result.status !== 0) {
    throw new Error("ffmpeg is required to generate MP4 campaign videos.");
  }
}

function readCampaigns() {
  const file = path.join(kitDir, "campaigns.json");
  if (!fs.existsSync(file)) {
    throw new Error("Missing campaign kit. Run npm.cmd run campaign:generate first.");
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(data.campaigns) || data.campaigns.length === 0) {
    throw new Error("campaigns.json has no campaigns.");
  }
  return data.campaigns;
}

function createVideo(concatPath, mp4Path) {
  const result = spawnSync("ffmpeg", [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatPath,
    "-vf", `fps=${fps},format=yuv420p`,
    "-movflags", "+faststart",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "23",
    mp4Path,
  ], { cwd: root, encoding: "utf8", shell: false });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${mp4Path}: ${(result.stderr || result.stdout || "").slice(0, 1600)}`);
  }
}

function renderConcat(frameFiles) {
  return frameFiles.map((file) => [
    `file '${file.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`,
    `duration ${secondsPerFrame}`,
  ].join("\n")).join("\n") + "\n";
}

function renderFrame(campaign, frameIndex, accent) {
  const steps = Array.isArray(campaign.demoSteps) ? campaign.demoSteps : [];
  const frame = [
    {
      eyebrow: "Upload limit fix",
      headline: campaign.pain,
      body: campaign.target,
      footer: "Free browser tool. No signup.",
    },
    {
      eyebrow: "Step 1",
      headline: steps[0] || campaign.title,
      body: "Start from the exact page for this upload problem.",
      footer: campaign.displayUrl,
    },
    {
      eyebrow: "Step 2",
      headline: steps[1] || "Choose your file locally",
      body: "The workflow runs in the browser. Avoid showing private documents in videos.",
      footer: "Use a generic sample file for demos.",
    },
    {
      eyebrow: "Step 3",
      headline: steps[2] || "Download the result",
      body: campaign.proof,
      footer: "Review before submitting anywhere.",
    },
    {
      eyebrow: "Try it",
      headline: campaign.title,
      body: campaign.captionEn,
      footer: campaign.displayUrl,
      qr: true,
    },
  ][frameIndex];

  const qrOrUrl = frame.qr ? `<div class="qr">${makeQrSvg(campaign.trackedUrl)}</div>` : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(campaign.id)} frame ${frameIndex + 1}</title>
<style>
* { box-sizing: border-box; }
body {
  margin: 0;
  width: ${frameWidth}px;
  height: ${frameHeight}px;
  overflow: hidden;
  font-family: Inter, Arial, sans-serif;
  color: #172226;
  background: #f8f4e8;
}
.frame {
  width: ${frameWidth}px;
  height: ${frameHeight}px;
  padding: 48px 46px 44px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 24px;
  border-top: 24px solid ${accent};
}
.brand {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 900;
  font-size: 25px;
}
.chip {
  border: 2px solid #172226;
  background: #f4c84d;
  padding: 9px 13px;
  font-size: 18px;
}
.content {
  display: grid;
  align-content: start;
  gap: 22px;
  padding-top: 44px;
}
.eyebrow {
  display: inline-block;
  width: fit-content;
  border: 3px solid #172226;
  background: #ffffff;
  color: ${accent};
  font-size: 28px;
  font-weight: 900;
  padding: 10px 16px;
}
h1 {
  margin: 0;
  font-size: ${frame.headline.length > 46 ? 62 : 74}px;
  line-height: 1;
  letter-spacing: 0;
}
.body {
  margin: 0;
  color: #415154;
  font-size: 33px;
  line-height: 1.18;
  font-weight: 800;
}
.card {
  border: 3px solid #172226;
  background: #fffdf8;
  padding: 26px;
  box-shadow: 14px 14px 0 ${accent};
}
.footer {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 18px;
}
.url {
  font-size: 27px;
  line-height: 1.18;
  font-weight: 900;
  overflow-wrap: anywhere;
}
.small {
  margin-top: 14px;
  color: #5d686b;
  font-size: 20px;
  line-height: 1.2;
}
.qr {
  width: 176px;
  height: 176px;
  border: 3px solid #172226;
  background: white;
  padding: 10px;
}
.qr svg {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
</head>
<body>
<main class="frame">
  <div class="brand"><span>PrintableTools Lab</span><span class="chip">Free / No signup</span></div>
  <section class="content">
    <div class="eyebrow">${escapeHtml(frame.eyebrow)}</div>
    <div class="card">
      <h1>${escapeHtml(frame.headline)}</h1>
      <p class="body">${escapeHtml(frame.body)}</p>
    </div>
  </section>
  <section class="footer">
    <div>
      <div class="url">${escapeHtml(frame.footer)}</div>
      <div class="small">Review the result before submitting it anywhere.</div>
    </div>
    ${qrOrUrl}
  </section>
</main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function makeQrSvg(value) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  return qr.createSvgTag(4, 0).replace("<svg", "<svg aria-label=\"tracked campaign link\"");
}
