const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const kitDir = path.join(root, "reports", "campaign-kit");
const videoDir = path.join(kitDir, "videos");
const manifestPath = path.join(videoDir, "videos.json");
const reportPath = path.join(root, "reports", "campaign-assets-release.json");
const releaseTag = "free-pdf-tools";
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

if (!token) {
  console.error("Set GITHUB_TOKEN or GH_TOKEN before running campaign:publish-assets.");
  process.exit(1);
}

const repoUrl = execFileSync("git", ["remote", "get-url", "origin"], { cwd: root, encoding: "utf8" }).trim();
const repo = repoUrl.replace(/\.git$/, "").split("github.com/").pop();
if (!repo || repo === repoUrl) {
  console.error(`Cannot detect GitHub repo from origin: ${repoUrl}`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  if (!fs.existsSync(manifestPath)) throw new Error("Missing campaign video manifest. Run npm.cmd run campaign:videos first.");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.videos) || !manifest.videos.length) throw new Error("No campaign videos found.");

  const release = await getReleaseByTag(releaseTag);
  if (!release) throw new Error(`Missing release tag ${releaseTag}. Run npm.cmd run github-discovery first.`);

  const uploaded = [];
  for (const video of manifest.videos) {
    const filePath = path.join(kitDir, video.file);
    if (!fs.existsSync(filePath)) throw new Error(`Missing video file: ${video.file}`);
    const assetName = `ptl-${video.id}.mp4`;
    await deleteAssetIfPresent(release, assetName);
    const asset = await uploadAsset(release, assetName, filePath);
    uploaded.push({
      id: video.id,
      title: video.title,
      assetName,
      sizeBytes: fs.statSync(filePath).size,
      downloadUrl: asset.browser_download_url,
      trackedUrl: video.trackedUrl,
      captionEn: video.captionEn,
      captionZh: video.captionZh,
      hashtags: video.hashtags,
    });
  }

  const updatedBody = mergeReleaseBody(release.body || "", uploaded);
  await github(`/repos/${repo}/releases/${release.id}`, {
    method: "PATCH",
    body: { body: updatedBody },
  });

  const report = {
    generatedAt: new Date().toISOString(),
    releaseUrl: release.html_url,
    releaseTag,
    assets: uploaded,
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Uploaded ${uploaded.length} campaign video assets to ${release.html_url}`);
  console.log(`Report written to ${path.relative(root, reportPath)}`);
}

async function getReleaseByTag(tag) {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`, {
    headers: githubHeaders(),
  });
  if (response.status === 404) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub release lookup failed ${response.status}: ${JSON.stringify(payload).slice(0, 260)}`);
  return payload;
}

async function deleteAssetIfPresent(release, assetName) {
  const assets = await github(`/repos/${repo}/releases/${release.id}/assets?per_page=100`);
  const existing = assets.find((asset) => asset.name === assetName);
  if (!existing) return;
  await github(`/repos/${repo}/releases/assets/${existing.id}`, { method: "DELETE", expectNoJson: true });
}

async function uploadAsset(release, assetName, filePath) {
  const uploadUrl = release.upload_url.split("{")[0];
  const response = await fetch(`${uploadUrl}?name=${encodeURIComponent(assetName)}`, {
    method: "POST",
    headers: {
      ...githubHeaders(),
      "Content-Type": "video/mp4",
      "Content-Length": String(fs.statSync(filePath).size),
    },
    body: fs.readFileSync(filePath),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub asset upload failed ${response.status}: ${JSON.stringify(payload).slice(0, 320)}`);
  return payload;
}

async function github(pathName, options = {}) {
  const response = await fetch(`https://api.github.com${pathName}`, {
    method: options.method || "GET",
    headers: { ...githubHeaders(), ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (options.expectNoJson && response.ok) return {};
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub API ${options.method || "GET"} ${pathName} failed ${response.status}: ${JSON.stringify(payload).slice(0, 320)}`);
  return payload;
}

function mergeReleaseBody(body, assets) {
  const start = "<!-- campaign-video-assets:start -->";
  const end = "<!-- campaign-video-assets:end -->";
  const block = [
    start,
    "",
    "Short-video campaign assets:",
    "",
    ...assets.flatMap((asset) => [
      `- [${asset.title} MP4](${asset.downloadUrl})`,
      `  - Landing page: ${asset.trackedUrl}`,
      `  - Caption: ${asset.captionEn}`,
      `  - Hashtags: ${asset.hashtags.join(" ")}`,
    ]),
    "",
    "Use these assets for useful short-video demos only. Do not ask users to click ads, watch ads to unlock a tool, or treat compression as guaranteed.",
    "",
    end,
  ].join("\n");

  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);
  if (pattern.test(body)) return body.replace(pattern, block);
  return `${body.trim()}\n\n${block}\n`;
}

function githubHeaders() {
  const authScheme = token.startsWith("ghp_") || token.startsWith("github_pat_") ? "token" : "Bearer";
  return {
    Authorization: `${authScheme} ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "PrintableToolsLab-CampaignAssets",
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
