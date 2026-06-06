const { execFileSync } = require("child_process");
const { HIGH_INTENT_TOOL_PATHS, SHARE_KIT_FEATURED_LINKS, SHARE_KIT_POSTS, ZERO_DOMAIN_GAME_EXPERIMENTS, PLATFORM_SUBMIT_COCKPIT, PORTAL_SUBMISSION_PACK, ZERO_COST_MONETIZATION_MAP, siteUrl, tools, SITE_SUMMARY } = require("./seo-content.cjs");

const token = githubToken();
if (!token) {
  console.error("Set GITHUB_TOKEN or GH_TOKEN before running github-discovery.");
  process.exit(1);
}

const repoUrl = execFileSync("git", ["remote", "get-url", "origin"], { encoding: "utf8" }).trim();
const repo = repoUrl.replace(/\.git$/, "").split("github.com/").pop();
if (!repo || repo === repoUrl) {
  console.error(`Cannot detect GitHub repo from origin: ${repoUrl}`);
  process.exit(1);
}

const releaseTag = "free-pdf-tools";
const topics = [
  "pdf-generator",
  "pdf-tools",
  "image-tools",
  "image-compressor",
  "image-resizer",
  "image-converter",
  "background-remover",
  "qr-code",
  "invoice-generator",
  "resume-checker",
  "image-to-pdf",
  "compress-pdf",
  "pdf-to-jpg",
  "pdf-to-word",
  "compress-pdf-to-1mb",
  "compress-pdf-to-500kb",
  "compress-image-to-100kb",
  "passport-photo",
  "no-signup",
  "free-tools",
];

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  await github(`/repos/${repo}`, {
    method: "PATCH",
    body: {
      homepage: siteUrl(""),
      description: "Free no-signup browser PDF, image, QR, and text-data tools for PDF size targets, image KB targets, PDF-to-Word, ATS checks, background removal, text overlays, QR codes, PDF edits, paperwork, labels, resumes, and printables.",
    },
  });
  await github(`/repos/${repo}/topics`, {
    method: "PUT",
    headers: { Accept: "application/vnd.github+json" },
    body: { names: topics },
  });

  const release = await getReleaseByTag(releaseTag);
  const body = mergePreservedBlocks(releaseBody(), release?.body || "");
  if (release) {
    await github(`/repos/${repo}/releases/${release.id}`, {
      method: "PATCH",
      body: {
        name: "Free PDF, Image, and QR Tools Without Signup",
        body,
        prerelease: false,
        draft: false,
      },
    });
    console.log(`Updated GitHub discovery release: ${release.html_url}`);
    return;
  }

  const created = await github(`/repos/${repo}/releases`, {
    method: "POST",
    body: {
      tag_name: releaseTag,
      target_commitish: "main",
      name: "Free PDF, Image, and QR Tools Without Signup",
      body,
      prerelease: false,
      draft: false,
    },
  });
  console.log(`Created GitHub discovery release: ${created.html_url}`);
}

async function getReleaseByTag(tag) {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`, {
    headers: githubHeaders(),
  });
  if (response.status === 404) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub release lookup failed ${response.status}: ${JSON.stringify(payload).slice(0, 240)}`);
  return payload;
}

async function github(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    method: options.method || "GET",
    headers: { ...githubHeaders(), ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub API ${options.method || "GET"} ${path} failed ${response.status}: ${JSON.stringify(payload).slice(0, 240)}`);
  return payload;
}

function githubHeaders() {
  const authScheme = token.startsWith("ghp_") || token.startsWith("github_pat_") ? "token" : "Bearer";
  return {
    Authorization: `${authScheme} ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "PrintableToolsLab-Discovery",
  };
}

function releaseBody() {
  const toolLinks = HIGH_INTENT_TOOL_PATHS.map((toolPath) => {
    const tool = tools.find((item) => item.path === toolPath);
    return tool ? `- [${tool.title}](${siteUrl(tool.path)}): ${tool.description}` : "";
  }).filter(Boolean);

  return [
    SITE_SUMMARY.description,
    "",
    "Start here:",
    "",
    `- [Free PDF, image, and QR tools without signup](${siteUrl("free-pdf-tools")})`,
    `- [PDF, image, and QR tool finder](${siteUrl("pdf-tool-finder")})`,
    `- [Zero-budget share kit](${siteUrl("share-kit")})`,
    `- [Machine-readable share-kit.json](${siteUrl("share-kit.json").replace(/\/$/, "")})`,
    ...externalDiscoveryLinks(),
    `- [HTML5 platform submit cockpit](${siteUrl("platform-submit-cockpit")})`,
    `- [HTML5 portal submission pack](${siteUrl("portal-submission-pack")})`,
    `- [Zero-cost monetization map](${siteUrl("zero-cost-monetization-map")})`,
    ...ZERO_DOMAIN_GAME_EXPERIMENTS.flatMap((game) => [
      `- [${game.name} playable build](${game.url})`,
      `- [${game.name} release package](${game.releaseUrl})`,
    ]),
    "- [GitHub Pages discovery directory](https://yanqr213.github.io/printable-tools-lab/)",
    `- [Directory submission pack](${siteUrl("submit-directory")})`,
    `- [RSS feed](${siteUrl("feed.xml").replace(/\/$/, "")})`,
    `- [Machine-readable tools.json](${siteUrl("tools.json").replace(/\/$/, "")})`,
    `- [Web app manifest](${siteUrl("site.webmanifest").replace(/\/$/, "")})`,
    "",
    "High-intent upload-limit entry points:",
    "",
    ...SHARE_KIT_FEATURED_LINKS.map(([title, pathName, reason]) => `- [${title}](${siteUrl(pathName)}): ${reason}`),
    "",
    "Share-kit copy angles:",
    "",
    ...SHARE_KIT_POSTS.map((post) => `- ${post.title}: ${post.hook}`),
    "",
    "Platform-ad game route:",
    "",
    `- Lead game: ${PLATFORM_SUBMIT_COCKPIT.leadGame}`,
    `- Backup game: ${PLATFORM_SUBMIT_COCKPIT.backupGame}`,
    `- Last platform status update: ${PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.lastUpdated}`,
    ...PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.submitted.map((item) => `- ${item}`),
    ...PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.readyBackup.map((item) => `- ${item}`),
    `- Expanded backup portals: ${PORTAL_SUBMISSION_PACK.lowFrictionResearch.map((item) => item.platform).join(", ")}`,
    `- Manual-consent rule: ${PORTAL_SUBMISSION_PACK.candidatePolicy[1]}`,
    `- Completion gate: ${ZERO_COST_MONETIZATION_MAP.moneyGate}`,
    "",
    "High-intent tool pages:",
    "",
    ...toolLinks,
    "",
    "Why this exists:",
    "",
    "- No account required.",
    "- No surprise download fee.",
    "- ATS resume checks run locally on pasted text and export a practical PDF report without upload.",
    "- Passport photo sizing, image compression, resizing, simple background removal, text overlays, cropping, rotation, watermarking, and JPG/PNG/WebP conversion run locally in the browser without uploading files.",
    "- Static QR, WiFi QR, and contact QR generation runs in the browser without a signup wall.",
    "- Small business tools cover invoices, receipts, timesheets, business cards, labels, barcode labels, price tags, flyers, and coupons.",
    "- PDF tools cover PDF-to-Word, compression, merge, split, rotate, remove pages, reorder pages, watermarks, stamps, signatures, page numbers, image-to-PDF, and text-to-PDF workflows.",
    "- Ads are disabled until policy review and real search visibility are ready.",
  ].join("\n");
}

function externalDiscoveryLinks() {
  const links = [];
  const gist = readReport("gist-discovery.json");
  const issue = readReport("github-issue-discovery.json");
  if (gist?.htmlUrl) links.push(`- [Public Gist share kit](${gist.htmlUrl})`);
  if (issue?.issueUrl) links.push(`- [Public GitHub growth issue](${issue.issueUrl})`);
  return links;
}

function readReport(fileName) {
  const fs = require("fs");
  const path = require("path");
  const filePath = path.join(__dirname, "..", "reports", fileName);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function mergePreservedBlocks(nextBody, currentBody) {
  return preserveBlock(nextBody, currentBody, "campaign-video-assets");
}

function preserveBlock(nextBody, currentBody, blockName) {
  const start = `<!-- ${blockName}:start -->`;
  const end = `<!-- ${blockName}:end -->`;
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);
  const existing = String(currentBody || "").match(pattern);
  if (!existing) return nextBody;
  if (pattern.test(nextBody)) return nextBody.replace(pattern, existing[0]);
  return `${nextBody.trim()}\n\n${existing[0]}\n`;
}

function githubToken() {
  const envToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
  if (envToken) return envToken;
  try {
    return execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
