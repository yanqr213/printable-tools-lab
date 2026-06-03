const fs = require("fs");
const path = require("path");
const {
  serviceDeliveryInputExample,
  validateServiceDeliveryInput,
  zipServiceDelivery,
  sha256Buffer,
} = require("./service-delivery-kit.cjs");
const { CUSTOM_LOCAL_PRINT_PACK_SERVICE } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args["write-template"]) {
    const target = path.resolve(root, args["write-template"]);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${JSON.stringify(serviceDeliveryInputExample(CUSTOM_LOCAL_PRINT_PACK_SERVICE), null, 2)}\n`);
    console.log(`Wrote service delivery input template to ${path.relative(root, target)}`);
    return;
  }

  const inputPath = args.input ? path.resolve(root, args.input) : "";
  if (!inputPath || !fs.existsSync(inputPath)) {
    console.error("Provide --input path/to/order.json, or use --write-template path/to/template.json first.");
    process.exit(1);
  }

  const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const validation = validateServiceDeliveryInput(input, { sample: false });
  if (!validation.ok) {
    console.error(`Cannot generate live delivery:\n- ${validation.errors.join("\n- ")}`);
    process.exit(1);
  }

  const orderId = cleanId(input.orderId || input.businessName || "custom-local-print-pack-order");
  const outDir = args.out ? path.resolve(root, args.out) : path.join(root, "paid-deliverables", "service-orders");
  const zipPath = path.join(outDir, `${orderId}.zip`);
  const reportPath = path.join(outDir, `${orderId}.json`);
  const zip = zipServiceDelivery(input, { sample: false });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(zipPath, zip);
  const report = {
    serviceId: input.serviceId,
    orderId,
    generatedAt: new Date().toISOString(),
    sourceInput: path.relative(root, inputPath),
    deliveryZip: path.relative(root, zipPath),
    sizeBytes: zip.length,
    sha256: sha256Buffer(zip),
    paymentStatus: input.paymentStatus,
    paidOrderVerified: Boolean(input.paidOrderVerified || input.paymentStatus === "paid_order_verified"),
    buyerReviewRequired: true,
    gitIgnoredExpected: path.relative(root, zipPath).startsWith(`paid-deliverables${path.sep}`),
    moneyGate: CUSTOM_LOCAL_PRINT_PACK_SERVICE.successGate,
    warnings: validation.warnings,
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Generated service delivery ZIP: ${path.relative(root, zipPath)}`);
  console.log(`Delivery report: ${path.relative(root, reportPath)}`);
  console.log(`SHA-256: ${report.sha256}`);
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) parsed[key] = true;
    else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function cleanId(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "order";
}
