const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const projectName = process.env.CLOUDFLARE_PAGES_PROJECT || "printable-tools-lab";
const requiredEnv = ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"];
const forbiddenPathPrefixes = [
  "paid-deliverables/",
  "secrets/",
  ".git/",
  ".wrangler/",
  "node_modules/",
  "scripts/",
  "reports/",
  ".github/",
  ".env",
  ".env.",
  "package.json",
  "package-lock.json",
  "README.md",
  "OPERATIONS.md",
  "VALIDATION.md",
  "DISTRIBUTION.md",
  "LICENSE.md",
  "wrangler.toml",
];
const allowedPublicFilePatterns = [
  /^_headers$/,
  /^_redirects$/,
  /^index\.html$/,
  /^ads\.txt$/,
  /^app\.js$/,
  /^styles\.css$/,
  /^robots\.txt$/,
  /^sitemap\.xml$/,
  /^feed\.xml$/,
  /^llms\.txt$/,
  /^tools\.json$/,
  /^discovery\.json$/,
  /^share-kit\.json$/,
  /^sponsor-media-kit\.json$/,
  /^sponsor-outreach-pack\.json$/,
  /^sponsor-call\.json$/,
  /^sponsor-opportunities\.json$/,
  /^organic-push-kit\.json$/,
  /^upload-error-cheatsheet\.json$/,
  /^platform-submit-queue\.json$/,
  /^platform-submit-cockpit\.json$/,
  /^platform-outreach-tracker\.json$/,
  /^portal-submission-pack\.json$/,
  /^game-submission-feed\.json$/,
  /^zero-cost-monetization-map\.json$/,
  /^site\.webmanifest$/,
  /^opensearch\.xml$/,
  /^indexnow-key\.txt$/,
  /^fb2b7a50e6a8b37f8d959a1c17b850eb\.txt$/,
  /^google[^/]*(?:\.html)?$/,
  /^assets\/(?:images|vendor)\//,
  /^docs\//,
  /^functions\/api\//,
  /^[a-z0-9][a-z0-9-]*\/index\.html$/,
  /^tools\/[a-z0-9-]+\/index\.html$/,
  /^guides\/[a-z0-9-]+\/index\.html$/,
  /^privacy\/index\.html$/,
  /^terms\/index\.html$/,
  /^about\/index\.html$/,
  /^license\/index\.html$/,
  /^sponsor\/[a-z0-9-]+\/index\.html$/,
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
  const generatedFiles = generatedPublicFiles();
  const deployFiles = publicDeployFiles([...trackedFiles, ...generatedFiles]);
  assertNoForbiddenPaths(deployFiles);
  const deployDir = fs.mkdtempSync(path.join(os.tmpdir(), "ptl-cloudflare-deploy-"));
  try {
    copyTrackedFiles(deployFiles, deployDir);
    assertNoForbiddenFiles(deployDir);
    console.log(`Prepared ${deployFiles.length} public deploy file(s).`);
    const wranglerArgs = ["wrangler", "pages", "deploy", deployDir, "--project-name", projectName, "--branch", "main", "--commit-dirty=true"];
    run("npx.cmd", wranglerArgs);
  } finally {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
}

function run(command, args) {
  execFileSync(resolveCommand(command), resolveArgs(command, args), {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
}

function resolveCommand(command) {
  if (process.platform === "win32" && command.endsWith(".cmd")) return "powershell.exe";
  if (process.platform !== "win32" && command.endsWith(".cmd")) return command.slice(0, -4);
  return command;
}

function resolveArgs(command, args) {
  if (process.platform !== "win32" || !command.endsWith(".cmd")) return args;
  return [
    "-NoProfile",
    "-NonInteractive",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    `$ErrorActionPreference = 'Stop'; & ${command} @args`,
    ...args,
  ];
}

function publicDeployFiles(files) {
  const deployFiles = uniqueFiles(files).filter((file) => allowedPublicFilePatterns.some((pattern) => pattern.test(file)));
  const missingRequired = ["index.html", "app.js", "styles.css", "_redirects", "_headers", "sitemap.xml", "robots.txt", "functions/api/event.js", "functions/api/metrics.js", "functions/api/sponsor-lead.js"]
    .filter((file) => !deployFiles.includes(file));
  if (missingRequired.length) {
    throw new Error(`Public deploy file list is missing required file(s): ${missingRequired.join(", ")}`);
  }
  const accidentallyPublic = deployFiles.filter((file) => forbiddenPathPrefixes.some((prefix) => file === prefix.replace(/\/$/, "") || file.startsWith(prefix)));
  if (accidentallyPublic.length) {
    throw new Error(`Refusing to include non-public file(s): ${accidentallyPublic.slice(0, 12).join(", ")}`);
  }
  return deployFiles;
}

function generatedPublicFiles() {
  return listWorkspaceFiles(root)
    .filter((file) => allowedPublicFilePatterns.some((pattern) => pattern.test(file)))
    .filter((file) => !forbiddenPathPrefixes.some((prefix) => file === prefix.replace(/\/$/, "") || file.startsWith(prefix)));
}

function listWorkspaceFiles(dir, prefix = "") {
  const fullDir = prefix ? path.join(dir, prefix) : dir;
  let entries;
  try {
    entries = fs.readdirSync(fullDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const normalized = relative.replace(/\\/g, "/");
    if (forbiddenPathPrefixes.some((item) => normalized === item.replace(/\/$/, "") || normalized.startsWith(item))) continue;
    if (entry.isDirectory()) {
      files.push(...listWorkspaceFiles(dir, normalized));
    } else if (entry.isFile()) {
      files.push(normalized);
    }
  }
  return files;
}

function uniqueFiles(files) {
  return Array.from(new Set(files.map((file) => file.replace(/\\/g, "/")).filter(Boolean))).sort();
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
