const fs = require("fs");
const path = require("path");
const { SHARE_KIT_FEATURED_LINKS, SHARE_KIT_POSTS, SHARE_KIT_RULES, ZERO_DOMAIN_GAME_EXPERIMENTS, PLATFORM_SUBMIT_COCKPIT, siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const marker = "PrintableTools Lab zero-cost share kit";
const filename = "PrintableTools-Lab-zero-cost-share-kit.md";
const reportPath = path.join(root, "reports", "gist-discovery.json");

if (!token) {
  console.error("Set GITHUB_TOKEN or GH_TOKEN before running gist-discovery.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  const videos = readCampaignVideos();
  const body = renderGistBody(videos);
  const existing = await findExistingGist();
  const gist = existing
    ? await github(`/gists/${existing.id}`, { method: "PATCH", body: gistPayload(body) })
    : await github("/gists", { method: "POST", body: gistPayload(body) });

  const rawUrl = gist.files?.[filename]?.raw_url || "";
  const report = {
    generatedAt: new Date().toISOString(),
    action: existing ? "updated" : "created",
    gistId: gist.id,
    htmlUrl: gist.html_url,
    rawUrl,
    public: gist.public,
    file: filename,
    videoAssetCount: videos.length,
  };
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`${existing ? "Updated" : "Created"} public Gist: ${gist.html_url}`);
  console.log(`Report written to ${path.relative(root, reportPath)}`);
}

async function findExistingGist() {
  for (let page = 1; page <= 3; page += 1) {
    const gists = await github(`/gists?per_page=100&page=${page}`);
    const match = gists.find((gist) => {
      const files = Object.keys(gist.files || {});
      return files.includes(filename) || files.some((file) => file.toLowerCase().includes("printabletools-lab-zero-cost-share-kit"));
    });
    if (match) return match;
    if (!Array.isArray(gists) || gists.length < 100) break;
  }
  return null;
}

function gistPayload(content) {
  return {
    public: true,
    description: marker,
    files: {
      [filename]: {
        content,
      },
    },
  };
}

function renderGistBody(videos) {
  const featured = SHARE_KIT_FEATURED_LINKS.map(([title, pathName, reason]) => ({
    title,
    url: `${siteUrl(pathName).replace(/\/$/, "")}?utm_source=gist&utm_medium=organic&utm_campaign=zero_cost_push`,
    reason,
  }));
  const posts = SHARE_KIT_POSTS.map((post) => ({
    ...post,
    url: trackedPostUrl(post),
  }));
  return [
    `# ${marker}`,
    "",
    "PrintableTools Lab is a free no-signup browser utility site for urgent PDF, image, QR, and paperwork tasks. This Gist is a zero-cost distribution page for useful sharing, not an ad-click scheme.",
    "",
    "## Start Here",
    "",
    `- Main share kit: ${siteUrl("share-kit")}`,
    `- Machine-readable share-kit JSON: ${siteUrl("share-kit.json").replace(/\/$/, "")}`,
    `- HTML5 platform submit cockpit: ${siteUrl("platform-submit-cockpit")}`,
    `- Zero-cost monetization map: ${siteUrl("zero-cost-monetization-map")}`,
    `- Free file tools directory: ${siteUrl("free-pdf-tools")}`,
    `- Tool finder: ${siteUrl("pdf-tool-finder")}`,
    "",
    "## Current Platform-Ad Game Route",
    "",
    `- Lead game: ${PLATFORM_SUBMIT_COCKPIT.leadGame}`,
    `- Backup game: ${PLATFORM_SUBMIT_COCKPIT.backupGame}`,
    `- Latest status timestamp: ${PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.lastUpdated}`,
    ...PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.submitted.map((item) => `- ${item}`),
    ...PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.readyBackup.map((item) => `- ${item}`),
    "",
    "## Playable HTML5 Builds",
    "",
    ...ZERO_DOMAIN_GAME_EXPERIMENTS.flatMap((game) => [
      `### ${game.name}`,
      "",
      `- Play: ${game.url}`,
      `- Repository: ${game.repo}`,
      `- Release package: ${game.releaseUrl}`,
      `- HTML5 ZIP: ${game.zipUrl}`,
      `- Demo video: ${game.demoVideoUrl}`,
      `- Submission notes: ${game.submissionNotesUrl}`,
      `- Review readiness: ${game.reviewReadinessUrl}`,
      `- Summary: ${game.summary}`,
      "",
    ]),
    "",
    "## High-Intent Links",
    "",
    ...featured.map((item) => `- [${item.title}](${item.url}) - ${item.reason}`),
    "",
    "## Ready-to-upload MP4 Assets",
    "",
    ...(videos.length ? videos.flatMap((video) => [
      `### ${video.title}`,
      "",
      `- MP4: ${video.downloadUrl}`,
      `- Landing page: ${video.trackedUrl}`,
      `- Caption: ${video.captionEn}`,
      `- Hashtags: ${(video.hashtags || []).join(" ")}`,
      "",
    ]) : ["- Campaign videos are not published yet."]),
    "## Copy Angles",
    "",
    ...posts.flatMap((post) => [
      `### ${post.title}`,
      "",
      `Hook: ${post.hook}`,
      "",
      post.body,
      "",
      `CTA: [${post.cta}](${post.url})`,
      "",
    ]),
    "## Distribution Rules",
    "",
    ...SHARE_KIT_RULES.map((rule) => `- ${rule}`),
    "- Do not claim guaranteed compression, approval, ranking, hiring, or platform acceptance.",
    "- Do not ask users to click ads or watch ads to unlock a tool.",
    "",
    "## Validation Gates",
    "",
    "- 24 hours after a post: continue if at least 1 tracked visit or 1 tool event appears.",
    "- 72 hours: continue if at least 10 tracked visits, 3 tool events, or one useful external reply remains live.",
    "- 7 days: continue if 30 tracked visits, 10 tool events, or Search Console impressions start moving.",
    "",
  ].join("\n");
}

function trackedPostUrl(post) {
  const base = post.absoluteUrl || siteUrl(post.linkPath);
  const normalized = String(base || siteUrl("")).replace(/\/$/, "");
  const separator = normalized.includes("?") ? "&" : "?";
  return `${normalized}${separator}utm_source=gist&utm_medium=organic&utm_campaign=zero_cost_push`;
}

function readCampaignVideos() {
  const reportPath = path.join(root, "reports", "campaign-assets-release.json");
  if (!fs.existsSync(reportPath)) return [];
  try {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    return Array.isArray(report.assets) ? report.assets : [];
  } catch {
    return [];
  }
}

async function github(pathName, options = {}) {
  const response = await fetch(`https://api.github.com${pathName}`, {
    method: options.method || "GET",
    headers: githubHeaders(),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub API ${options.method || "GET"} ${pathName} failed ${response.status}: ${JSON.stringify(payload).slice(0, 360)}`);
  return payload;
}

function githubHeaders() {
  const authScheme = token.startsWith("ghp_") || token.startsWith("github_pat_") ? "token" : "Bearer";
  return {
    Authorization: `${authScheme} ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "PrintableToolsLab-GistDiscovery",
  };
}
