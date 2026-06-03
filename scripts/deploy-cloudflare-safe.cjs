const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const projectName = process.env.CLOUDFLARE_PAGES_PROJECT || "printable-tools-lab";
const requiredEnv = ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"];
const forbiddenPathPrefixes = [
  "paid-deliverables/",
  "secrets/",
  ".git/",
  ".wrangler/",
  "node_modules/",
  ".env",
  ".env.",
];
const forbiddenContentPatterns = [
  ["github", "_pat_", "[A-Za-z0-9_]{20,}"],
  ["ghp", "_", "[A-Za-z0-9]{30,}"],
  ["cfat", "_", "[A-Za-z0-9_-]{20,}"],
  ["sk", "-", "[A-Za-z0-9_-]{32,}"],
  ["BEGIN", " PRIVATE"],
  ['"private', '_key"\\s*:'],
  ['"client', '_email"\\s*:'],
  ["canvas", "-sum"],
  ["43", "\\.133\\.226\\.37"],
  ["E:", "\\\\", String.fromCharCode(19979, 36733)],
].map((parts) => new RegExp(parts.join("")));

main();

function main() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Missing Cloudflare env var(s): ${missing.join(", ")}.`);
    console.error("No deploy was attempted. Set the vars, then rerun npm.cmd run deploy:cloudflare:safe.");
    process.exit(2);
  }

  run("npm.cmd", ["run", "build:routes"]);
  run("npm.cmd", ["run", "verify:seo"]);
  run("npm.cmd", ["run", "test:events"]);
  run("npm.cmd", ["run", "verify:adsense"]);

  const trackedFiles = gitTrackedFiles();
  assertNoForbiddenPaths(trackedFiles);
  const deployDir = fs.mkdtempSync(path.join(os.tmpdir(), "ptl-cloudflare-deploy-"));
  try {
    copyTrackedFiles(trackedFiles, deployDir);
    assertNoForbiddenFiles(deployDir);
    const wranglerArgs = ["wrangler", "pages", "deploy", deployDir, "--project-name", projectName, "--commit-dirty=true"];
    const result = spawnSync("npx.cmd", wranglerArgs, {
      cwd: root,
      env: process.env,
      encoding: "utf8",
      stdio: "inherit",
    });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status || 1);
  } finally {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
}

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: "inherit" });
}

function gitTrackedFiles() {
  const output = execFileSync("git", ["ls-files", "-z"], { cwd: root });
  return output
    .toString("utf8")
    .split("\0")
    .map((item) => item.replace(/\\/g, "/"))
    .filter(Boolean);
}

function assertNoForbiddenPaths(files) {
  const offenders = files.filter((file) => forbiddenPathPrefixes.some((prefix) => file === prefix.replace(/\/$/, "") || file.startsWith(prefix)));
  if (offenders.length) {
    throw new Error(`Refusing to deploy forbidden tracked path(s): ${offenders.slice(0, 12).join(", ")}`);
  }
}

function copyTrackedFiles(files, targetDir) {
  for (const file of files) {
    const source = path.join(root, file);
    const target = path.join(targetDir, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
}

function assertNoForbiddenFiles(targetDir) {
  const files = listFiles(targetDir);
  const pathOffenders = files.filter((file) => forbiddenPathPrefixes.some((prefix) => file === prefix.replace(/\/$/, "") || file.startsWith(prefix)));
  if (pathOffenders.length) {
    throw new Error(`Refusing to deploy forbidden file(s): ${pathOffenders.slice(0, 12).join(", ")}`);
  }
  for (const file of files) {
    const fullPath = path.join(targetDir, file);
    if (fs.statSync(fullPath).size > 1024 * 1024) continue;
    const text = fs.readFileSync(fullPath, "utf8");
    if (forbiddenContentPatterns.some((pattern) => pattern.test(text))) {
      throw new Error(`Refusing to deploy sensitive-looking content in ${file}.`);
    }
  }
}

function listFiles(dir, prefix = "") {
  const entries = fs.readdirSync(path.join(dir, prefix), { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return listFiles(dir, relative);
    return relative.replace(/\\/g, "/");
  });
}
