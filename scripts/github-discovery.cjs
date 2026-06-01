const { execFileSync } = require("child_process");
const { HIGH_INTENT_TOOL_PATHS, siteUrl, tools, SITE_SUMMARY } = require("./seo-content.cjs");

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
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
  "printable",
  "document-tools",
  "productivity-tools",
  "invoice-generator",
  "business-card",
  "barcode-generator",
  "label-generator",
  "flyer-maker",
  "coupon-generator",
  "resume-builder",
  "image-to-pdf",
  "text-to-pdf",
  "receipt-generator",
  "timesheet",
  "certificate-generator",
  "no-signup",
  "free-tools",
  "pdf-tools",
  "small-business-tools",
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
      description: "Free no-signup browser PDF tools for small business paperwork, labels, flyers, coupons, image-to-PDF, resumes, certificates, and everyday printables.",
    },
  });
  await github(`/repos/${repo}/topics`, {
    method: "PUT",
    headers: { Accept: "application/vnd.github+json" },
    body: { names: topics },
  });

  const release = await getReleaseByTag(releaseTag);
  const body = releaseBody();
  if (release) {
    await github(`/repos/${repo}/releases/${release.id}`, {
      method: "PATCH",
      body: {
        name: "Free PDF Tools Without Signup",
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
      name: "Free PDF Tools Without Signup",
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
  return {
    Authorization: `Bearer ${token}`,
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
    `- [Free PDF tools without signup](${siteUrl("free-pdf-tools")})`,
    `- [PDF tool finder](${siteUrl("pdf-tool-finder")})`,
    "- [GitHub Pages discovery directory](https://yanqr213.github.io/printable-tools-lab/)",
    `- [RSS feed](${siteUrl("feed.xml").replace(/\/$/, "")})`,
    `- [Machine-readable tools.json](${siteUrl("tools.json").replace(/\/$/, "")})`,
    `- [Web app manifest](${siteUrl("site.webmanifest").replace(/\/$/, "")})`,
    ...toolLinks,
    "",
    "Why this exists:",
    "",
    "- No account required.",
    "- No surprise download fee.",
    "- Small business tools cover invoices, receipts, timesheets, business cards, labels, barcode labels, price tags, flyers, and coupons.",
    "- Image conversion runs in the browser without uploading files.",
    "- Ads are disabled until policy review and real search visibility are ready.",
  ].join("\n");
}
