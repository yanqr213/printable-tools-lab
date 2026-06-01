const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const kitDir = path.join(root, "reports", "campaign-kit");
const videoDir = path.join(kitDir, "videos");
const manifestPath = path.join(videoDir, "videos.json");
const failures = [];

if (!fs.existsSync(manifestPath)) {
  failures.push("Missing videos.json. Run npm.cmd run campaign:videos first.");
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.videos) || manifest.videos.length < 6) failures.push("videos.json needs at least 6 videos.");
  for (const video of manifest.videos || []) {
    const filePath = path.join(kitDir, video.file || "");
    if (!fs.existsSync(filePath)) {
      failures.push(`${video.id} missing MP4 file`);
      continue;
    }
    const size = fs.statSync(filePath).size;
    if (size < 50000) failures.push(`${video.id} MP4 is too small (${size} bytes)`);
    const probe = ffprobe(filePath);
    if (!probe) continue;
    if (Number(probe.width) !== 720 || Number(probe.height) !== 1280) failures.push(`${video.id} dimensions are ${probe.width}x${probe.height}`);
    const duration = Number(probe.duration || 0);
    if (duration < 19 || duration > 22) failures.push(`${video.id} duration is ${duration.toFixed(2)}s`);
    if (!String(video.trackedUrl || "").includes("utm_campaign=zero_cost_push")) failures.push(`${video.id} missing UTM tracked URL`);
    const safeText = [video.captionEn, video.captionZh, video.postingNote].join("\n");
    for (const pattern of [/click\s+ads?\s+to\s+(download|unlock|get|use)/i, /tap\s+ads?\s+to\s+(download|unlock|get|use)/i, /watch\s+ads?\s+to\s+unlock/i, /guaranteed\s+(approval|acceptance|result)/i]) {
      if (pattern.test(safeText)) failures.push(`${video.id} includes risky wording: ${pattern}`);
    }
  }
}

for (const fileName of fs.existsSync(videoDir) ? fs.readdirSync(videoDir) : []) {
  if (/frame\d+\.png$/i.test(fileName)) failures.push(`Temporary QA frame should not be kept in videos/: ${fileName}`);
}
if (fs.existsSync(path.join(videoDir, "frames"))) failures.push("Temporary source frame directory should not be kept in videos/.");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Campaign video verification passed.");

function ffprobe(filePath) {
  const result = spawnSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration",
    "-of", "json",
    filePath,
  ], { encoding: "utf8", shell: false });
  if (result.status !== 0) {
    failures.push(`ffprobe failed for ${filePath}: ${(result.stderr || result.stdout || "").slice(0, 300)}`);
    return null;
  }
  const parsed = JSON.parse(result.stdout);
  return {
    width: parsed.streams && parsed.streams[0] && parsed.streams[0].width,
    height: parsed.streams && parsed.streams[0] && parsed.streams[0].height,
    duration: parsed.format && parsed.format.duration,
  };
}
