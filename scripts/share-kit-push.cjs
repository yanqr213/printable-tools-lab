const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { SHARE_KIT_FEATURED_LINKS, SHARE_KIT_POSTS, SHARE_KIT_RULES, siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const reportDir = path.join(root, "reports");
const reportPath = path.join(reportDir, "share-kit-push.json");

main();

function main() {
  const github = run("node", ["scripts/github-discovery.cjs"], { requireToken: true });
  const indexNowRaw = run("node", ["scripts/indexnow.cjs"], { allowFailure: true });
  const indexNowOutput = `${indexNowRaw.stdout}\n${indexNowRaw.stderr}`;
  const indexNow = {
    ...indexNowRaw,
    accepted: /IndexNow (submitted|fallback submitted)/i.test(indexNowOutput),
    warning: /IndexNow key file is not reachable|fallback did not accept|failed/i.test(indexNowOutput),
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
      trackedUrl: `${siteUrl(post.linkPath).replace(/\/$/, "")}?utm_source=${post.channel}&utm_medium=organic`,
    })),
    rules: SHARE_KIT_RULES,
    actions: {
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
    ],
  };
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Share kit push report written to ${path.relative(root, reportPath)}`);
  console.log(`GitHub discovery: ${github.ok ? "ok" : "not run/failed"}`);
  console.log(`IndexNow: ${indexNow.accepted ? "submitted" : "warning"}`);
}

function run(command, args, options = {}) {
  const env = { ...process.env };
  if (options.requireToken && !env.GITHUB_TOKEN && !env.GH_TOKEN) {
    return {
      ok: false,
      skipped: true,
      reason: "GITHUB_TOKEN or GH_TOKEN is not set.",
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

function trimOutput(value) {
  return String(value || "").trim().slice(0, 4000);
}
