const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const reportPath = path.join(reportsDir, "domain-report.json");
const args = parseArgs(process.argv.slice(2));
const accountId = args.account || process.env.CLOUDFLARE_ACCOUNT_ID || "";
const token = process.env.CLOUDFLARE_API_TOKEN || "";
const preferredDomain = normalizeDomain(args.domain || process.env.CUSTOM_DOMAIN || "printabletoolslab.com");
const maxRegistrationUsd = Number(args.maxUsd || process.env.DOMAIN_MAX_USD || 15);
const register = Boolean(args.register || process.env.DOMAIN_REGISTER === "1");
const attach = args.attach !== "0";
const project = args.project || process.env.CLOUDFLARE_PAGES_PROJECT || "printable-tools-lab";

const candidates = unique([
  preferredDomain,
  "printabletools-lab.com",
  "freefiletoolslab.com",
  "browserfiletools.com",
  "browserfilelab.com",
  "freepdfimagetools.com",
  "pdfimage.tools",
]).filter(Boolean);

const report = {
  generatedAt: new Date().toISOString(),
  preferredDomain,
  maxRegistrationUsd,
  registerRequested: register,
  attachRequested: attach,
  selectedDomain: "",
  candidates: [],
  registrationAttempt: null,
  attachAttempt: null,
  blocker: "",
  nextAction: "",
};

main().catch((error) => {
  report.blocker = sanitize(error.message || String(error));
  if (!report.nextAction) {
    report.nextAction = "Fix the blocker, then rerun npm.cmd run register:domain -- --register.";
  }
  writeReport();
  console.error(report.blocker);
  process.exit(1);
});

async function main() {
  if (!token || !accountId) {
    throw new Error("Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID before checking or registering a domain.");
  }
  const checked = await checkDomains(candidates);
  report.candidates = checked;
  const selected = checked.find((domain) => (
    domain.registrable
    && domain.tier === "standard"
    && Number(domain.pricing?.registration_cost || Infinity) <= maxRegistrationUsd
  ));
  if (!selected) {
    throw new Error(`No standard registrable candidate was found under $${maxRegistrationUsd}.`);
  }
  report.selectedDomain = selected.name;

  if (register) {
    report.registrationAttempt = await registerDomain(selected.name);
  } else {
    report.nextAction = `Domain ${selected.name} is available for $${selected.pricing.registration_cost} ${selected.pricing.currency}; rerun with --register after Cloudflare has a default registrant contact.`;
    writeReport();
    console.log(report.nextAction);
    return;
  }

  if (attach) {
    report.attachAttempt = runConfigureDomain(selected.name);
  }
  writeReport();
  console.log(`Domain workflow completed for ${selected.name}.`);
}

async function checkDomains(domains) {
  const response = await cloudflare(`/accounts/${encodeURIComponent(accountId)}/registrar/domain-check`, {
    method: "POST",
    body: JSON.stringify({ domains }),
  });
  return Array.isArray(response.result?.domains) ? response.result.domains : [];
}

async function registerDomain(domainName) {
  try {
    const response = await cloudflare(`/accounts/${encodeURIComponent(accountId)}/registrar/registrations`, {
      method: "POST",
      body: JSON.stringify({
        domain_name: domainName,
        privacy_mode: "redaction",
        years: 1,
        auto_renew: false,
      }),
    });
    return {
      status: "success",
      domain: domainName,
      response: response.result || null,
    };
  } catch (error) {
    const message = sanitize(error.message || String(error));
    report.registrationAttempt = {
      status: "failed",
      domain: domainName,
      error: message,
    };
    report.nextAction = "Add a default registrant contact and valid payment method in Cloudflare Registrar, then rerun this script with --register.";
    throw new Error(`Domain registration failed for ${domainName}: ${message}`);
  }
}

function runConfigureDomain(domainName) {
  const result = spawnSync(process.execPath, [path.join(__dirname, "configure-domain.cjs"), "--domain", domainName], {
    cwd: root,
    env: process.env,
    encoding: "utf8",
  });
  return {
    status: result.status === 0 ? "success" : "failed",
    output: sanitize(`${result.stdout || ""}\n${result.stderr || ""}`).trim(),
  };
}

async function cloudflare(pathname, options = {}) {
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
    const message = Array.isArray(payload.errors) && payload.errors.length
      ? payload.errors.map((error) => error.message || JSON.stringify(error)).join("; ")
      : `Cloudflare API returned ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

function writeReport() {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    if (i + 1 >= argv.length || argv[i + 1].startsWith("--")) {
      parsed[key] = "1";
    } else {
      parsed[key] = argv[i + 1];
      i += 1;
    }
  }
  return parsed;
}

function normalizeDomain(value) {
  const raw = String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(raw)) return "";
  if (raw.endsWith(".pages.dev")) return "";
  return raw;
}

function unique(items) {
  return [...new Set(items)];
}

function sanitize(value) {
  return String(value || "")
    .replace(/ghp_[A-Za-z0-9_]+/g, "ghp_[redacted]")
    .replace(/github_pat_[A-Za-z0-9_]+/g, "github_pat_[redacted]")
    .replace(/cfat_[A-Za-z0-9_-]+/g, "cfat_[redacted]")
    .replace(/sk-[A-Za-z0-9_-]+/g, "sk-[redacted]");
}
