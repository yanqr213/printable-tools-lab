const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync, spawnSync } = require("child_process");

const { siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const reportDir = path.join(root, "reports");
const reportPath = path.join(reportDir, "operate-report.json");
const npmCommand = "npm";
const googleCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS || "E:\\下载\\canvas-sum-498016-g5-11e9a0be90a2.json";

const report = {
  generatedAt: new Date().toISOString(),
  site: siteUrl(""),
  steps: [],
  probes: {},
  blockers: [],
  nextActions: [],
};

const mainBase = siteUrl("").replace(/\/+$/, "");
const githubPagesBase = "https://yanqr213.github.io/printable-tools-lab";

main().catch((error) => {
  report.steps.push({ name: "operate", status: "failed", output: error.message });
  finish(1);
});

async function main() {
  runStep("build routes", npmCommand, ["run", "build:routes"], { timeout: 120000 });
  runStep("verify seo", npmCommand, ["run", "verify:seo"], { timeout: 120000 });
  runStep("verify adsense config", npmCommand, ["run", "verify:adsense"], { timeout: 120000 });
  runStep("test event contracts", npmCommand, ["run", "test:events"], { timeout: 120000 });
  runSecretScan();

  if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
    runStep("refresh GitHub discovery", npmCommand, ["run", "github-discovery"], { timeout: 120000, allowFail: true });
  } else {
    skipStep("refresh GitHub discovery", "GITHUB_TOKEN/GH_TOKEN not set.");
  }

  const searchEnv = searchConsoleEnv();
  if (searchEnv) {
    runStep("submit main sitemap", npmCommand, ["run", "search-console", "--", "submit-sitemap"], {
      env: { ...searchEnv, SEARCH_CONSOLE_SITE_URL: `${mainBase}/`, SITEMAP_URL: `${mainBase}/sitemap.xml` },
      timeout: 60000,
      allowFail: true,
    });
    runStep("submit GitHub Pages discovery sitemap", npmCommand, ["run", "search-console", "--", "submit-sitemap"], {
      env: {
        ...searchEnv,
        SEARCH_CONSOLE_SITE_URL: `${githubPagesBase}/`,
        SITEMAP_URL: `${githubPagesBase}/sitemap.xml`,
      },
      timeout: 60000,
      allowFail: true,
    });
  } else {
    skipStep("submit Search Console sitemaps", "Google service account JSON was not found.");
  }

  runStep("notify IndexNow", npmCommand, ["run", "indexnow"], { timeout: 120000, allowFail: true });
  runStep("monitor directory listings", npmCommand, ["run", "monitor:directories"], { timeout: 120000, allowFail: true });

  report.probes.cloudflare = await probeCloudflare();
  report.probes.adsense = await probeAdsense();

  runStep("validate operating gates", npmCommand, ["run", "validate:ops"], {
    env: searchEnv || process.env,
    timeout: 180000,
    allowFail: true,
  });

  runStep("smoke test browser flows", npmCommand, ["run", "smoke"], { timeout: 240000 });
  if (process.env.OPERATE_FULL === "1") {
    runStep("visual regression check", npmCommand, ["run", "visual"], { timeout: 420000, allowFail: true });
  } else {
    skipStep("visual regression check", "Set OPERATE_FULL=1 to include visual browser screenshots in the operating loop.");
  }

  buildNextActions();
  finish(hasRequiredFailures() ? 1 : 0);
}

function runStep(name, command, args, options = {}) {
  process.stdout.write(`\n[operate] ${name}... `);
  const startedAt = Date.now();
  try {
    const stdout = execFileSync(command, args, {
      cwd: root,
      env: options.env || process.env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
      timeout: options.timeout || 120000,
    });
    const output = trimOutput(stdout);
    report.steps.push({ name, status: "passed", durationMs: Date.now() - startedAt, output });
    process.stdout.write("passed\n");
    if (output) console.log(indent(output));
  } catch (error) {
    const output = trimOutput(`${error.stdout || ""}\n${error.stderr || ""}`.trim() || error.message);
    report.steps.push({ name, status: options.allowFail ? "warning" : "failed", durationMs: Date.now() - startedAt, output });
    process.stdout.write(`${options.allowFail ? "warning" : "failed"}\n`);
    if (output) console.log(indent(output));
    if (!options.allowFail) throw new Error(`${name} failed`);
  }
}

function skipStep(name, reason) {
  report.steps.push({ name, status: "skipped", output: reason });
  console.log(`\n[operate] ${name}... skipped`);
  console.log(indent(reason));
}

function runSecretScan() {
  process.stdout.write("\n[operate] secret scan... ");
  const tokenPatterns = [
    ["ghp_", "[A-Za-z0-9_]{20,}"].join(""),
    ["github_pat_", "[A-Za-z0-9_]{20,}"].join(""),
    ["cfat_", "[A-Za-z0-9_-]{20,}"].join(""),
    ["sk-", "[A-Za-z0-9_-]{20,}"].join(""),
    ["43", "\\.133\\.226\\.37"].join(""),
    ["CLOUDFLARE_API_TOKEN", "='"].join(""),
    ["GITHUB_TOKEN", "='"].join(""),
    ["AI_API_KEY", "\\s*="].join(""),
    ["api_key", "\\s*="].join(""),
  ];
  const args = [
    "-n",
    tokenPatterns.join("|"),
    ".",
    "-S",
    "--glob",
    "!assets/vendor/**",
    "--glob",
    "!node_modules/**",
    "--glob",
    "!reports/**",
  ];
  const result = spawnSync("rg", args, { cwd: root, encoding: "utf8" });
  if (result.status === 1) {
    report.steps.push({ name: "secret scan", status: "passed", output: "No committed secrets matched the operating scan." });
    process.stdout.write("passed\n");
    return;
  }
  if (result.status === 0) {
    const output = trimOutput(result.stdout);
    report.steps.push({ name: "secret scan", status: "failed", output });
    process.stdout.write("failed\n");
    console.log(indent(output));
    throw new Error("secret scan failed");
  }
  const output = trimOutput(result.stderr || "rg was unavailable.");
  report.steps.push({ name: "secret scan", status: "warning", output });
  process.stdout.write("warning\n");
  console.log(indent(output));
}

function searchConsoleEnv() {
  if (!googleCredentials || !fs.existsSync(googleCredentials)) return null;
  return { ...process.env, GOOGLE_APPLICATION_CREDENTIALS: googleCredentials };
}

async function probeCloudflare() {
  const token = process.env.CLOUDFLARE_API_TOKEN || "";
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
  const state = {
    available: Boolean(token && accountId),
    accountId: accountId ? maskId(accountId) : "",
    zones: [],
    pagesProjectFound: false,
    pagesDomains: [],
    registrarCandidate: null,
    blocker: "",
  };
  if (!state.available) {
    state.blocker = "CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required for automatic custom-domain checks.";
    report.blockers.push(state.blocker);
    return state;
  }
  try {
    const zones = await cloudflare(`/zones?account.id=${encodeURIComponent(accountId)}&per_page=50`, token);
    state.zones = Array.isArray(zones.result) ? zones.result.map((zone) => zone.name).filter(Boolean) : [];
    const project = await cloudflare(`/accounts/${encodeURIComponent(accountId)}/pages/projects/printable-tools-lab`, token);
    state.pagesProjectFound = Boolean(project.result?.name);
    const domains = await cloudflare(`/accounts/${encodeURIComponent(accountId)}/pages/projects/printable-tools-lab/domains`, token);
    state.pagesDomains = Array.isArray(domains.result)
      ? domains.result.map((domain) => ({ name: domain.name, status: domain.status || "" }))
      : [];
    const checked = await cloudflare(`/accounts/${encodeURIComponent(accountId)}/registrar/domain-check`, token, {
      method: "POST",
      body: JSON.stringify({ domains: ["printabletoolslab.com"] }),
    });
    const candidate = Array.isArray(checked.result?.domains) ? checked.result.domains[0] : null;
    if (candidate) {
      state.registrarCandidate = {
        name: candidate.name || "printabletoolslab.com",
        registrable: Boolean(candidate.registrable),
        tier: candidate.tier || "",
        pricing: candidate.pricing || null,
        reason: candidate.reason || "",
      };
    }
    if (!state.zones.length) {
      state.blocker = "Cloudflare account has no DNS zone/domain, so a real custom domain cannot be attached automatically yet.";
      report.blockers.push(state.blocker);
    }
  } catch (error) {
    state.blocker = `Cloudflare probe failed: ${sanitizeError(error.message)}`;
    report.blockers.push(state.blocker);
  }
  return state;
}

async function probeAdsense() {
  const state = {
    available: Boolean(googleCredentials && fs.existsSync(googleCredentials)),
    accountCount: 0,
    accounts: [],
    blocker: "",
  };
  if (!state.available) {
    state.blocker = "Google service account JSON was not found, so AdSense API access could not be checked.";
    report.blockers.push(state.blocker);
    return state;
  }
  try {
    const token = await getAccessToken(googleCredentials, "https://www.googleapis.com/auth/adsense.readonly");
    const response = await fetch("https://adsense.googleapis.com/v2/accounts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`AdSense API ${response.status}: ${JSON.stringify(payload).slice(0, 220)}`);
    const accounts = Array.isArray(payload.accounts) ? payload.accounts : [];
    state.accountCount = accounts.length;
    state.accounts = accounts.map((account) => ({
      name: account.name || "",
      state: account.state || "",
      displayName: account.displayName || "",
    }));
    if (!accounts.length) {
      state.blocker = "The service account can call AdSense API, but no AdSense accounts are visible to it; publisher ID/ad slot creation still needs the AdSense account UI or a user OAuth grant.";
      report.blockers.push(state.blocker);
    }
  } catch (error) {
    state.blocker = `AdSense probe failed: ${sanitizeError(error.message)}`;
    report.blockers.push(state.blocker);
  }
  return state;
}

async function cloudflare(pathname, token, options = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new Error(`Cloudflare API ${response.status}: ${JSON.stringify(payload.errors || payload).slice(0, 220)}`);
  }
  return payload;
}

async function getAccessToken(keyFile, scope) {
  const credentials = JSON.parse(fs.readFileSync(keyFile, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: credentials.client_email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(credentials.private_key, "base64url");
  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: `${unsigned}.${signature}`,
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Token error ${response.status}: ${JSON.stringify(data).slice(0, 180)}`);
  return data.access_token;
}

function buildNextActions() {
  const failed = report.steps.filter((step) => step.status === "failed");
  const warnings = report.steps.filter((step) => step.status === "warning");
  if (failed.length) report.nextActions.push(`Fix failed automation step(s): ${failed.map((step) => step.name).join(", ")}.`);
  if (warnings.length) report.nextActions.push(`Review warning step(s): ${warnings.map((step) => step.name).join(", ")}.`);
  if (report.probes.cloudflare?.blocker) report.nextActions.push(report.probes.cloudflare.blocker);
  if (report.probes.adsense?.blocker) report.nextActions.push(report.probes.adsense.blocker);
  report.nextActions.push("Keep live ads disabled until a real publisher ID, policy-compliant review state, and non-intrusive placements are available.");
  report.nextActions.push("Keep using Search Console plus live download/generation metrics as the decision gate before adding paid features.");
}

function hasRequiredFailures() {
  return report.steps.some((step) => step.status === "failed");
}

function finish(exitCode) {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\n[operate] report written to ${path.relative(root, reportPath)}`);
  if (report.blockers.length) {
    console.log("[operate] current blockers:");
    for (const blocker of report.blockers) console.log(`- ${blocker}`);
  }
  process.exit(exitCode);
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function trimOutput(output) {
  return redact(String(output || "").trim()).slice(-2600);
}

function redact(value) {
  return value
    .replace(/ghp_[A-Za-z0-9_]+/g, "ghp_[redacted]")
    .replace(/github_pat_[A-Za-z0-9_]+/g, "github_pat_[redacted]")
    .replace(/cfat_[A-Za-z0-9_-]+/g, "cfat_[redacted]")
    .replace(/sk-[A-Za-z0-9_-]+/g, "sk-[redacted]");
}

function sanitizeError(message) {
  return redact(String(message || "").replace(/\s+/g, " ").trim());
}

function maskId(value) {
  const text = String(value || "");
  return text.length <= 10 ? "[set]" : `${text.slice(0, 4)}...${text.slice(-4)}`;
}

function indent(text) {
  return String(text).split("\n").map((line) => `  ${line}`).join("\n");
}
