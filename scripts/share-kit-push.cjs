const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");
const { SHARE_KIT_FEATURED_LINKS, SHARE_KIT_POSTS, SHARE_KIT_RULES, ZERO_DOMAIN_GAME_EXPERIMENT, SPONSOR_DEALS, SPONSOR_DISCOVERY_LINKS, siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const reportDir = path.join(root, "reports");
const reportPath = path.join(reportDir, "share-kit-push.json");

main();

function main() {
  const gistDiscovery = run("node", ["scripts/gist-discovery.cjs"], { requireToken: true });
  const githubIssueDiscovery = run("node", ["scripts/github-issue-discovery.cjs"], { requireToken: true });
  const github = run("node", ["scripts/github-discovery.cjs"], { requireToken: true });
  const indexNowRaw = run("node", ["scripts/indexnow.cjs"], { allowFailure: true });
  const indexNowOutput = `${indexNowRaw.stdout}\n${indexNowRaw.stderr}`;
  const indexNowAccepted = /IndexNow (accepted \d+ URL\(s\)|submitted|fallback submitted)/i.test(indexNowOutput);
  const indexNowPartialWarning = /IndexNow did not accept pages\.dev|UserForbiddedToAccessSite/i.test(indexNowOutput);
  const indexNow = {
    ...indexNowRaw,
    accepted: indexNowAccepted,
    partialWarning: indexNowPartialWarning,
    warning: !indexNowAccepted && /IndexNow key file is not reachable|fallback did not accept|failed|did not accept/i.test(indexNowOutput),
  };
  const report = {
    generatedAt: new Date().toISOString(),
    shareKitUrl: siteUrl("share-kit"),
    shareKitJsonUrl: siteUrl("share-kit.json").replace(/\/$/, ""),
    featuredLinks: SHARE_KIT_FEATURED_LINKS.map(([title, pathName, reason]) => ({
      title,
      canonicalUrl: siteUrl(pathName),
      trackedUrl: `${siteUrl(pathName).replace(/\/$/, "")}?utm_source=share-kit&utm_medium=organic`,
      reason,
    })),
    posts: SHARE_KIT_POSTS.map((post) => ({
      channel: post.channel,
      title: post.title,
      hook: post.hook,
      body: post.body,
      cta: post.cta,
      trackedUrl: trackedSharePostUrl(post),
    })),
    rules: SHARE_KIT_RULES,
    zeroDomainGameExperiment: ZERO_DOMAIN_GAME_EXPERIMENT,
    freeToolPath: freeToolPath(),
    sponsorDiscovery: sponsorDiscovery(),
    externalDiscovery: readExternalDiscovery(),
    actions: {
      gistDiscovery,
      githubIssueDiscovery,
      githubDiscovery: github,
      indexNow,
    },
    nextManualQueue: [
      {
        target: "One useful community reply",
        angle: "PDF must be under 1MB",
        url: `${siteUrl("compress-pdf-to-1mb").replace(/\/$/, "")}?utm_source=community&utm_medium=organic`,
        rule: "Only post where someone asks for a PDF upload-size fix.",
      },
      {
        target: "One short video demo",
        angle: "Image under 100KB",
        url: `${siteUrl("compress-image-to-100kb").replace(/\/$/, "")}?utm_source=short-video&utm_medium=organic`,
        rule: "Show a generic sample image, not a private ID or face photo.",
      },
      {
        target: "One directory update",
        angle: "Free no-signup browser file tools",
        url: `${siteUrl("share-kit").replace(/\/$/, "")}?utm_source=directory&utm_medium=organic`,
        rule: "Use directory submission rules and do not resubmit duplicate listings.",
      },
      {
        target: "One sponsor-fit partner reply",
        angle: "Direct sponsor deal room with USD 49 and USD 99-149 pilot options",
        url: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=share-kit-push#sponsor-inquiry`,
        rule: "Use only where sponsor or partner submissions are explicitly welcome; do not send private payment, tax, bank, phone, or identity details.",
      },
    ],
  };
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Share kit push report written to ${path.relative(root, reportPath)}`);
  console.log(`Gist discovery: ${gistDiscovery.ok ? "ok" : "not run/failed"}`);
  console.log(`GitHub issue discovery: ${githubIssueDiscovery.ok ? "ok" : "not run/failed"}`);
  console.log(`GitHub discovery: ${github.ok ? "ok" : "not run/failed"}`);
  console.log(`IndexNow: ${indexNow.accepted ? "submitted" : "warning"}`);
}

function readExternalDiscovery() {
  const gist = readJson(path.join(reportDir, "gist-discovery.json"));
  const issue = readJson(path.join(reportDir, "github-issue-discovery.json"));
  const release = readJson(path.join(reportDir, "campaign-assets-release.json"));
  return {
    gist: gist?.htmlUrl || "",
    githubIssue: issue?.issueUrl || "",
    campaignRelease: release?.releaseUrl || "",
    zeroDomainGame: ZERO_DOMAIN_GAME_EXPERIMENT.url,
    zeroDomainGameRepo: ZERO_DOMAIN_GAME_EXPERIMENT.repo,
    uploadLimitFixer: siteUrl("upload-limit-fixer"),
    uploadErrorCheatsheet: siteUrl("upload-error-cheatsheet"),
  };
}

function freeToolPath() {
  return {
    freeToolDirectoryUrl: `${siteUrl("free-pdf-tools").replace(/\/$/, "")}?utm_source=share-kit-push&utm_medium=organic&utm_campaign=free_tool_depth`,
    uploadLimitFixerUrl: `${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=share-kit-push&utm_medium=organic&utm_campaign=free_tool_depth`,
    uploadErrorCheatsheetUrl: `${siteUrl("upload-error-cheatsheet").replace(/\/$/, "")}?utm_source=share-kit-push&utm_medium=organic&utm_campaign=free_tool_depth`,
    adSafetyRule: "Downloads stay free; future ads must never block tool use or file downloads.",
  };
}

function sponsorDiscovery() {
  return {
    sponsorDealRoomUrl: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=share-kit-push#sponsor-inquiry`,
    sponsorDealRoomJsonUrl: siteUrl("sponsor-deal-room.json").replace(/\/$/, ""),
    sponsorCallUrl: `${siteUrl("sponsor-call").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_call&utm_content=share-kit-push`,
    sponsorFormUrl: `${siteUrl("sponsor").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_call&utm_content=share-kit-push#sponsor-inquiry`,
    sponsorCallJsonUrl: siteUrl("sponsor-call.json").replace(/\/$/, ""),
    mediaKitUrl: siteUrl("sponsor-media-kit.json").replace(/\/$/, ""),
    outreachPackUrl: siteUrl("sponsor-outreach-pack.json").replace(/\/$/, ""),
    deals: SPONSOR_DEALS,
    links: SPONSOR_DISCOVERY_LINKS,
    successGate: "A real qualified sponsor lead, signed agreement, or settled external payment. Clicks alone are not revenue.",
  };
}

function trackedSharePostUrl(post) {
  const base = post.absoluteUrl || siteUrl(post.linkPath).replace(/\/$/, "");
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}utm_source=${post.channel}&utm_medium=organic`;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function run(command, args, options = {}) {
  const env = { ...process.env };
  if (options.requireToken && !hasGithubToken(env)) {
    return {
      ok: false,
      skipped: true,
      reason: "GitHub token is not available from env or gh auth.",
    };
  }
  const result = spawnSync(command, args, {
    cwd: root,
    env,
    encoding: "utf8",
    shell: false,
  });
  const ok = result.status === 0;
  if (!ok && !options.allowFailure) {
    throw new Error(`${command} ${args.join(" ")} failed: ${(result.stderr || result.stdout || "").slice(0, 1000)}`);
  }
  return {
    ok,
    status: result.status,
    stdout: trimOutput(result.stdout),
    stderr: trimOutput(result.stderr),
  };
}

function hasGithubToken(env) {
  if (env.GITHUB_TOKEN || env.GH_TOKEN) return true;
  try {
    return Boolean(execFileSync("gh", ["auth", "token"], {
      cwd: root,
      env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim());
  } catch {
    return false;
  }
}

function trimOutput(value) {
  return String(value || "").trim().slice(0, 4000);
}
