const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportDir = path.join(root, "reports");
const reportPath = path.join(reportDir, "directory-monitor.json");
const siteHost = "printable-tools-lab.pages.dev";

const nosignupExactUploadLimitListings = [
  ["Compress Image to 10KB", "image 10KB compressor for strict upload limits"],
  ["Compress Image to 20KB", "image 20KB compressor for strict upload limits"],
  ["Compress Image to 30KB", "image 30KB compressor for strict upload limits"],
  ["Compress Image to 150KB", "image 150KB compressor for upload forms and profiles"],
  ["Compress Image to 300KB", "image 300KB compressor for forms and attachments"],
  ["Compress Image to 500KB", "image 500KB compressor for moderate upload limits"],
  ["Compress PDF to 500KB", "PDF 500KB compressor for strict upload limits"],
  ["Compress PDF to 1MB", "PDF 1MB compressor for common upload limits"],
  ["Compress PDF to 2MB", "PDF 2MB compressor for upload forms"],
  ["Compress PDF to 5MB", "PDF 5MB compressor for readable uploads"],
  ["PDF Size Reducer", "PDF size reducer hub for exact targets"],
  ["File Must Be Less Than 1MB Fix", "file under 1MB upload error fix"],
  ["PDF Must Be Under 500KB Fix", "PDF under 500KB upload error fix"],
  ["Photo Must Be Under 100KB Fix", "photo under 100KB upload error fix"],
  ["Image Must Be Under 500KB Fix", "image under 500KB upload error fix"],
  ["Image Must Be Less Than 2MB Fix", "image under 2MB upload error fix"],
  ["JPG Must Be Under 200KB Fix", "JPG under 200KB upload error fix"],
  ["PNG Screenshot Too Large Fix", "PNG screenshot upload error fix"],
  ["Photo 200x230 Under 20KB", "exact 200 x 230 px and 20KB photo path"],
  ["Photo 200x230 Under 100KB", "exact 200 x 230 px and 100KB photo path"],
  ["Photo 413x531 Under 100KB", "exact 413 x 531 px and 100KB photo path"],
  ["Photo 240x320 Under 50KB", "exact 240 x 320 px and 50KB photo path"],
  ["Photo 295x413 Under 35KB", "exact 295 x 413 px and 35KB photo path"],
  ["Photo 413x531 Under 50KB", "exact 413 x 531 px and 50KB photo path"],
  ["Photo 354x472 Under 100KB", "exact 354 x 472 px and 100KB photo path"],
  ["Photo 300x300 Under 100KB", "exact 300 x 300 px and 100KB photo path"],
  ["Photo 600x600 Under 100KB", "exact 600 x 600 px and 100KB photo path"],
  ["Photo 480x640 Under 200KB", "exact 480 x 640 px and 200KB photo path"],
  ["Photo 512x512 Under 100KB", "exact 512 x 512 px and 100KB photo path"],
  ["Photo 150x200 Under 20KB", "exact 150 x 200 px and 20KB photo path"],
  ["Photo 180x240 Under 50KB", "exact 180 x 240 px and 50KB photo path"],
  ["Photo 400x514 Under 100KB", "exact 400 x 514 px and 100KB photo path"],
  ["Photo 600x800 Under 200KB", "exact 600 x 800 px and 200KB photo path"],
  ["Signature 140x60 Under 20KB", "exact 140 x 60 px and 20KB signature path"],
  ["Signature 140x60 Under 50KB", "exact 140 x 60 px and 50KB signature path"],
  ["Signature 200x100 Under 50KB", "exact 200 x 100 px and 50KB signature path"],
  ["Signature 150x50 Under 20KB", "exact 150 x 50 px and 20KB signature path"],
  ["Signature 160x70 Under 20KB", "exact 160 x 70 px and 20KB signature path"],
  ["Signature 200x50 Under 20KB", "exact 200 x 50 px and 20KB signature path"],
  ["Signature 250x80 Under 50KB", "exact 250 x 80 px and 50KB signature path"],
  ["Signature 300x60 Under 20KB", "exact 300 x 60 px and 20KB signature path"],
  ["Signature 300x80 Under 50KB", "exact 300 x 80 px and 50KB signature path"],
  ["Signature 300x100 Under 50KB", "exact 300 x 100 px and 50KB signature path"],
  ["Signature 400x150 Under 50KB", "exact 400 x 150 px and 50KB signature path"],
  ["Signature 100x50 Under 10KB", "exact 100 x 50 px and 10KB signature path"],
  ["Signature 200x60 Under 20KB", "exact 200 x 60 px and 20KB signature path"],
  ["Signature 256x64 Under 20KB", "exact 256 x 64 px and 20KB signature path"],
  ["Signature 400x200 Under 100KB", "exact 400 x 200 px and 100KB signature path"],
];

const freenosignupUploadFixListings = [
  ["Compress PDF to 500KB", "PDF 500KB upload-limit path"],
  ["Compress PDF to 1MB", "PDF 1MB upload-limit path"],
  ["Compress Image to 100KB", "image 100KB upload-limit path"],
  ["Image Must Be Under 500KB Fix", "image under 500KB upload-error path"],
  ["Passport Photo Size Fixer", "passport-style photo resize and KB fix path"],
  ["Photo 200x230 Under 50KB", "exact 200 x 230 px and 50KB photo path"],
  ["Photo 200x230 Under 20KB", "exact 200 x 230 px and 20KB photo path"],
  ["Photo 200x230 Under 100KB", "exact 200 x 230 px and 100KB photo path"],
  ["Photo 413x531 Under 100KB", "exact 413 x 531 px and 100KB photo path"],
  ["Photo 240x320 Under 50KB", "exact 240 x 320 px and 50KB photo path"],
  ["Photo 295x413 Under 35KB", "exact 295 x 413 px and 35KB photo path"],
  ["Photo 413x531 Under 50KB", "exact 413 x 531 px and 50KB photo path"],
  ["Photo 354x472 Under 100KB", "exact 354 x 472 px and 100KB photo path"],
  ["Photo 300x300 Under 100KB", "exact 300 x 300 px and 100KB photo path"],
  ["Photo 600x600 Under 100KB", "exact 600 x 600 px and 100KB photo path"],
  ["Photo 480x640 Under 200KB", "exact 480 x 640 px and 200KB photo path"],
  ["Photo 512x512 Under 100KB", "exact 512 x 512 px and 100KB photo path"],
  ["Photo 150x200 Under 20KB", "exact 150 x 200 px and 20KB photo path"],
  ["Photo 180x240 Under 50KB", "exact 180 x 240 px and 50KB photo path"],
  ["Photo 400x514 Under 100KB", "exact 400 x 514 px and 100KB photo path"],
  ["Photo 600x800 Under 200KB", "exact 600 x 800 px and 200KB photo path"],
  ["Signature Under 20KB", "strict 20KB signature image path"],
  ["Signature 140x60 Under 20KB", "exact 140 x 60 px and 20KB signature path"],
  ["Signature 140x60 Under 50KB", "exact 140 x 60 px and 50KB signature path"],
  ["Signature 200x100 Under 50KB", "exact 200 x 100 px and 50KB signature path"],
  ["Signature 150x50 Under 20KB", "exact 150 x 50 px and 20KB signature path"],
  ["Signature 160x70 Under 20KB", "exact 160 x 70 px and 20KB signature path"],
  ["Signature 200x50 Under 20KB", "exact 200 x 50 px and 20KB signature path"],
  ["Signature 250x80 Under 50KB", "exact 250 x 80 px and 50KB signature path"],
  ["Signature 300x60 Under 20KB", "exact 300 x 60 px and 20KB signature path"],
  ["Signature 300x80 Under 50KB", "exact 300 x 80 px and 50KB signature path"],
  ["Signature 300x100 Under 50KB", "exact 300 x 100 px and 50KB signature path"],
  ["Signature 400x150 Under 50KB", "exact 400 x 150 px and 50KB signature path"],
  ["Signature 100x50 Under 10KB", "exact 100 x 50 px and 10KB signature path"],
  ["Signature 200x60 Under 20KB", "exact 200 x 60 px and 20KB signature path"],
  ["Signature 256x64 Under 20KB", "exact 256 x 64 px and 20KB signature path"],
  ["Signature 400x200 Under 100KB", "exact 400 x 200 px and 100KB signature path"],
  ["Resize Signature 200x100", "exact 200 x 100 px signature resize path"],
];

const techtoolsExactUploadLimitListings = [
  ["Photo 480x640 Under 200KB", "exact 480 x 640 px and 200KB photo path", 240],
  ["Photo 512x512 Under 100KB", "exact 512 x 512 px and 100KB photo path", 241],
  ["Signature 160x70 Under 20KB", "exact 160 x 70 px and 20KB signature path", 242],
  ["Signature 250x80 Under 50KB", "exact 250 x 80 px and 50KB signature path", 243],
  ["Signature 300x60 Under 20KB", "exact 300 x 60 px and 20KB signature path", 244],
  ["Signature 400x150 Under 50KB", "exact 400 x 150 px and 50KB signature path", 245],
  ["Photo 150x200 Under 20KB", "exact 150 x 200 px and 20KB photo path", 246],
  ["Photo 180x240 Under 50KB", "exact 180 x 240 px and 50KB photo path", 247],
  ["Photo 400x514 Under 100KB", "exact 400 x 514 px and 100KB photo path", 248],
  ["Photo 600x800 Under 200KB", "exact 600 x 800 px and 200KB photo path", 249],
  ["Signature 100x50 Under 10KB", "exact 100 x 50 px and 10KB signature path", null],
  ["Signature 200x60 Under 20KB", "exact 200 x 60 px and 20KB signature path", null],
  ["Signature 256x64 Under 20KB", "exact 256 x 64 px and 20KB signature path", null],
  ["Signature 400x200 Under 100KB", "exact 400 x 200 px and 100KB signature path", null],
];

const directories = [
  {
    name: "Zearches",
    url: "https://zearches.com/",
    searchUrl: "https://zearches.com/?s=PrintableTools+Lab",
    expected: [siteHost],
    submittedAt: "2026-06-01",
    reviewWindow: "unknown",
  },
  {
    name: "ListAi.cc",
    url: "https://listai.cc/",
    searchUrl: "https://listai.cc/?s=PrintableTools+Lab",
    expected: [siteHost],
    submittedAt: "2026-06-01",
    reviewWindow: "24-48 hours",
  },
  {
    name: "TechTools Launchpad site listing",
    url: "https://techtools.cz/tools/launchpad/",
    searchUrl: "https://techtools.cz/launchpad-api/tools?per_page=100&sort=recent",
    expected: [siteHost, "PrintableTools Lab"],
    submittedAt: "2026-06-06",
    reviewWindow: "auto-approved API listing",
  },
  {
    name: "TechTools Launchpad upload-limit listing",
    url: "https://techtools.cz/tools/launchpad/?tool=162",
    searchUrl: "https://techtools.cz/launchpad-api/tools/162",
    expected: [siteHost, "Upload Limit Fixer"],
    submittedAt: "2026-06-06",
    reviewWindow: "auto-approved API listing for the high-intent upload-limit entry",
  },
  {
    name: "TechTools Launchpad invoice listing",
    url: "https://techtools.cz/tools/launchpad/?tool=168",
    searchUrl: "https://techtools.cz/launchpad-api/tools/168",
    expected: [siteHost, "Invoice Generator"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the invoice-to-service lead path",
  },
  {
    name: "TechTools Launchpad invoice follow-up service listing",
    url: "https://techtools.cz/tools/launchpad/?tool=169",
    searchUrl: "https://techtools.cz/launchpad-api/tools/169",
    expected: [siteHost, "Invoice Follow-up Copy Pack"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the invoice follow-up service path",
  },
  {
    name: "TechTools Launchpad invoice follow-up email generator listing",
    url: "https://techtools.cz/tools/launchpad/?tool=170",
    searchUrl: "https://techtools.cz/launchpad-api/tools/170",
    expected: [siteHost, "Invoice Follow-up Email Generator"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the invoice follow-up email generator path",
  },
  {
    name: "TechTools Launchpad overdue invoice reminder listing",
    url: "https://techtools.cz/tools/launchpad/?tool=171",
    searchUrl: "https://techtools.cz/launchpad-api/tools/171",
    expected: [siteHost, "Overdue Invoice Reminder Email"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the overdue invoice reminder service-lead path",
  },
  {
    name: "TechTools Launchpad upload limit fix plan service listing",
    url: "https://techtools.cz/tools/launchpad/?tool=172",
    searchUrl: "https://techtools.cz/launchpad-api/tools/172",
    expected: [siteHost, "Upload Limit Fix Plan"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the $9 upload fix plan service path",
  },
  {
    name: "TechTools Launchpad upload error cheatsheet listing",
    url: "https://techtools.cz/tools/launchpad/?tool=173",
    searchUrl: "https://techtools.cz/launchpad-api/tools/173",
    expected: [siteHost, "Upload Error Cheatsheet"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the upload error cheatsheet path",
  },
  {
    name: "TechTools Launchpad compress PDF to 1MB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=174",
    searchUrl: "https://techtools.cz/launchpad-api/tools/174",
    expected: [siteHost, "Compress PDF to 1MB"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the high-intent PDF 1MB upload-error path",
  },
  {
    name: "TechTools Launchpad PDF under 1MB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=175",
    searchUrl: "https://techtools.cz/launchpad-api/tools/175",
    expected: [siteHost, "PDF Under 1MB Upload Fix"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the tool-level pre-download upload fix path",
  },
  {
    name: "TechTools Launchpad photo under 100KB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=176",
    searchUrl: "https://techtools.cz/launchpad-api/tools/176",
    expected: [siteHost, "Photo Under 100KB Upload Fix"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the tool-level photo 100KB upload fix path",
  },
  {
    name: "TechTools Launchpad image under 2MB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=177",
    searchUrl: "https://techtools.cz/launchpad-api/tools/177",
    expected: [siteHost, "Image Under 2MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the tool-level image 2MB upload fix path",
  },
  {
    name: "TechTools Launchpad JPG under 200KB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=178",
    searchUrl: "https://techtools.cz/launchpad-api/tools/178",
    expected: [siteHost, "JPG Under 200KB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the tool-level JPG 200KB upload fix path",
  },
  {
    name: "TechTools Launchpad resume PDF too large upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=179",
    searchUrl: "https://techtools.cz/launchpad-api/tools/179",
    expected: [siteHost, "Resume PDF Too Large Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the resume PDF upload fix path",
  },
  {
    name: "TechTools Launchpad PNG screenshot too large upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=180",
    searchUrl: "https://techtools.cz/launchpad-api/tools/180",
    expected: [siteHost, "PNG Screenshot Too Large Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the PNG screenshot upload fix path",
  },
  {
    name: "TechTools Launchpad passport photo 50KB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=181",
    searchUrl: "https://techtools.cz/launchpad-api/tools/181",
    expected: [siteHost, "Passport Photo 50KB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the passport photo 50KB upload fix path",
  },
  {
    name: "TechTools Launchpad PDF under 500KB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=182",
    searchUrl: "https://techtools.cz/launchpad-api/tools/182",
    expected: [siteHost, "PDF Under 500KB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict PDF 500KB upload fix path",
  },
  {
    name: "TechTools Launchpad image under 500KB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=183",
    searchUrl: "https://techtools.cz/launchpad-api/tools/183",
    expected: [siteHost, "Image Under 500KB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the image 500KB upload fix path",
  },
  {
    name: "TechTools Launchpad image dimensions 600x600 upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=184",
    searchUrl: "https://techtools.cz/launchpad-api/tools/184",
    expected: [siteHost, "Image Dimensions 600x600 Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the 600 x 600 image dimensions upload fix path",
  },
  {
    name: "TechTools Launchpad PDF not accepted JPG required fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=185",
    searchUrl: "https://techtools.cz/launchpad-api/tools/185",
    expected: [siteHost, "PDF Not Accepted JPG Required Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the PDF-to-JPG required upload fix path",
  },
  {
    name: "TechTools Launchpad email attachment too large PDF fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=186",
    searchUrl: "https://techtools.cz/launchpad-api/tools/186",
    expected: [siteHost, "Email Attachment Too Large PDF Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the email attachment too large upload fix path",
  },
  {
    name: "TechTools Launchpad compress image to KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=187",
    searchUrl: "https://techtools.cz/launchpad-api/tools/187",
    expected: [siteHost, "Compress Image to KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the invoice-first image-to-KB tool path",
  },
  {
    name: "TechTools Launchpad compress PDF to 500KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=188",
    searchUrl: "https://techtools.cz/launchpad-api/tools/188",
    expected: [siteHost, "Compress PDF to 500KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict PDF 500KB landing path",
  },
  {
    name: "TechTools Launchpad compress image to 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=189",
    searchUrl: "https://techtools.cz/launchpad-api/tools/189",
    expected: [siteHost, "Compress Image to 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict image 50KB landing path",
  },
  {
    name: "TechTools Launchpad compress image to 100KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=190",
    searchUrl: "https://techtools.cz/launchpad-api/tools/190",
    expected: [siteHost, "Compress Image to 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict image 100KB landing path",
  },
  {
    name: "TechTools Launchpad compress image to 200KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=191",
    searchUrl: "https://techtools.cz/launchpad-api/tools/191",
    expected: [siteHost, "Compress Image to 200KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict image 200KB landing path",
  },
  {
    name: "TechTools Launchpad compress JPG to 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=192",
    searchUrl: "https://techtools.cz/launchpad-api/tools/192",
    expected: [siteHost, "Compress JPG to 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict JPG 50KB landing path",
  },
  {
    name: "TechTools Launchpad compress JPG to 100KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=193",
    searchUrl: "https://techtools.cz/launchpad-api/tools/193",
    expected: [siteHost, "Compress JPG to 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict JPG 100KB landing path",
  },
  {
    name: "TechTools Launchpad compress JPG to 200KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=194",
    searchUrl: "https://techtools.cz/launchpad-api/tools/194",
    expected: [siteHost, "Compress JPG to 200KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict JPG 200KB landing path",
  },
  {
    name: "TechTools Launchpad compress PNG to 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=195",
    searchUrl: "https://techtools.cz/launchpad-api/tools/195",
    expected: [siteHost, "Compress PNG to 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict PNG 50KB landing path",
  },
  {
    name: "TechTools Launchpad compress PNG to 100KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=196",
    searchUrl: "https://techtools.cz/launchpad-api/tools/196",
    expected: [siteHost, "Compress PNG to 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict PNG 100KB landing path",
  },
  {
    name: "TechTools Launchpad compress PNG to 200KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=197",
    searchUrl: "https://techtools.cz/launchpad-api/tools/197",
    expected: [siteHost, "Compress PNG to 200KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict PNG 200KB landing path",
  },
  {
    name: "TechTools Launchpad passport photo compress to 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=198",
    searchUrl: "https://techtools.cz/launchpad-api/tools/198",
    expected: [siteHost, "Passport Photo Compress to 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the passport photo 50KB landing path",
  },
  {
    name: "TechTools Launchpad passport photo compress to 100KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=199",
    searchUrl: "https://techtools.cz/launchpad-api/tools/199",
    expected: [siteHost, "Passport Photo Compress to 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the passport photo 100KB landing path",
  },
  {
    name: "TechTools Launchpad passport photo compress to 200KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=200",
    searchUrl: "https://techtools.cz/launchpad-api/tools/200",
    expected: [siteHost, "Passport Photo Compress to 200KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the passport photo 200KB landing path",
  },
  {
    name: "TechTools Launchpad PDF under 2MB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=201",
    searchUrl: "https://techtools.cz/launchpad-api/tools/201",
    expected: [siteHost, "PDF Under 2MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the PDF under 2MB upload-fix landing path",
  },
  {
    name: "TechTools Launchpad PDF under 5MB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=202",
    searchUrl: "https://techtools.cz/launchpad-api/tools/202",
    expected: [siteHost, "PDF Under 5MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the PDF under 5MB upload-fix landing path",
  },
  {
    name: "TechTools Launchpad resume PDF under 2MB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=203",
    searchUrl: "https://techtools.cz/launchpad-api/tools/203",
    expected: [siteHost, "Resume PDF Under 2MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the resume PDF under 2MB upload-fix landing path",
  },
  {
    name: "TechTools Launchpad document under 5MB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=204",
    searchUrl: "https://techtools.cz/launchpad-api/tools/204",
    expected: [siteHost, "Document Under 5MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the document under 5MB upload-fix landing path",
  },
  {
    name: "TechTools Launchpad PDF size reducer listing",
    url: "https://techtools.cz/tools/launchpad/?tool=205",
    searchUrl: "https://techtools.cz/launchpad-api/tools/205",
    expected: [siteHost, "PDF Size Reducer"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the PDF size reducer hub path",
  },
  {
    name: "TechTools Launchpad compress PDF to 2MB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=206",
    searchUrl: "https://techtools.cz/launchpad-api/tools/206",
    expected: [siteHost, "Compress PDF to 2MB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the PDF 2MB target-size landing path",
  },
  {
    name: "TechTools Launchpad compress PDF to 5MB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=207",
    searchUrl: "https://techtools.cz/launchpad-api/tools/207",
    expected: [siteHost, "Compress PDF to 5MB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the PDF 5MB target-size landing path",
  },
  {
    name: "TechTools Launchpad compress PDF without uploading listing",
    url: "https://techtools.cz/tools/launchpad/?tool=208",
    searchUrl: "https://techtools.cz/launchpad-api/tools/208",
    expected: [siteHost, "Compress PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the no-upload PDF compressor landing path",
  },
  {
    name: "TechTools Launchpad PDF to JPG without uploading listing",
    url: "https://techtools.cz/tools/launchpad/?tool=209",
    searchUrl: "https://techtools.cz/launchpad-api/tools/209",
    expected: [siteHost, "PDF to JPG Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the no-upload PDF-to-JPG landing path",
  },
  {
    name: "TechTools Launchpad JPG to PDF without uploading listing",
    url: "https://techtools.cz/tools/launchpad/?tool=210",
    searchUrl: "https://techtools.cz/launchpad-api/tools/210",
    expected: [siteHost, "JPG to PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the no-upload JPG-to-PDF landing path",
  },
  {
    name: "TechTools Launchpad extract text from PDF without uploading listing",
    url: "https://techtools.cz/tools/launchpad/?tool=212",
    searchUrl: "https://techtools.cz/launchpad-api/tools/212",
    expected: [siteHost, "Extract Text From PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the no-upload PDF text extraction landing path",
  },
  {
    name: "TechTools Launchpad merge PDF without uploading listing",
    url: "https://techtools.cz/tools/launchpad/?tool=213",
    searchUrl: "https://techtools.cz/launchpad-api/tools/213",
    expected: [siteHost, "Merge PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the no-upload PDF merge landing path",
  },
  {
    name: "TechTools Launchpad split PDF without uploading listing",
    url: "https://techtools.cz/tools/launchpad/?tool=214",
    searchUrl: "https://techtools.cz/launchpad-api/tools/214",
    expected: [siteHost, "Split PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the no-upload PDF split landing path",
  },
  {
    name: "TechTools Launchpad signature under 20KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=215",
    searchUrl: "https://techtools.cz/launchpad-api/tools/215",
    expected: [siteHost, "Signature Under 20KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the strict signature 20KB upload-fix landing path",
  },
  {
    name: "TechTools Launchpad passport photo size fixer listing",
    url: "https://techtools.cz/tools/launchpad/?tool=216",
    searchUrl: "https://techtools.cz/launchpad-api/tools/216",
    expected: [siteHost, "Passport Photo Size Fixer"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the passport photo dimension-and-KB upload-fix path",
  },
  {
    name: "TechTools Launchpad resize photo 413x531 listing",
    url: "https://techtools.cz/tools/launchpad/?tool=217",
    searchUrl: "https://techtools.cz/launchpad-api/tools/217",
    expected: [siteHost, "Resize Photo 413x531"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 413 x 531 px photo resize path",
  },
  {
    name: "TechTools Launchpad signature under 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=218",
    searchUrl: "https://techtools.cz/launchpad-api/tools/218",
    expected: [siteHost, "Signature Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the signature 50KB upload-fix landing path",
  },
  {
    name: "TechTools Launchpad resize signature 140x60 listing",
    url: "https://techtools.cz/tools/launchpad/?tool=219",
    searchUrl: "https://techtools.cz/launchpad-api/tools/219",
    expected: [siteHost, "Resize Signature 140x60"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 140 x 60 px signature resize path",
  },
  {
    name: "TechTools Launchpad photo 200x230 under 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=220",
    searchUrl: "https://techtools.cz/launchpad-api/tools/220",
    expected: [siteHost, "Photo 200x230 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 200 x 230 px and 50KB photo path",
  },
  {
    name: "TechTools Launchpad photo 200x230 under 20KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=224",
    searchUrl: "https://techtools.cz/launchpad-api/tools/224",
    expected: [siteHost, "Photo 200x230 Under 20KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 200 x 230 px and 20KB photo path",
  },
  {
    name: "TechTools Launchpad photo 200x230 under 100KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=225",
    searchUrl: "https://techtools.cz/launchpad-api/tools/225",
    expected: [siteHost, "Photo 200x230 Under 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 200 x 230 px and 100KB photo path",
  },
  {
    name: "TechTools Launchpad photo 413x531 under 100KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=226",
    searchUrl: "https://techtools.cz/launchpad-api/tools/226",
    expected: [siteHost, "Photo 413x531 Under 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 413 x 531 px and 100KB photo path",
  },
  {
    name: "TechTools Launchpad photo 240x320 under 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=230",
    searchUrl: "https://techtools.cz/launchpad-api/tools/230",
    expected: [siteHost, "Photo 240x320 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 240 x 320 px and 50KB photo path",
  },
  {
    name: "TechTools Launchpad photo 295x413 under 35KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=238",
    searchUrl: "https://techtools.cz/launchpad-api/tools/238",
    expected: [siteHost, "Photo 295x413 Under 35KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 295 x 413 px and 35KB photo path",
  },
  {
    name: "TechTools Launchpad photo 354x472 under 100KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=239",
    searchUrl: "https://techtools.cz/launchpad-api/tools/239",
    expected: [siteHost, "Photo 354x472 Under 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 354 x 472 px and 100KB photo path",
  },
  {
    name: "TechTools Launchpad photo 413x531 under 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=231",
    searchUrl: "https://techtools.cz/launchpad-api/tools/231",
    expected: [siteHost, "Photo 413x531 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 413 x 531 px and 50KB photo path",
  },
  {
    name: "TechTools Launchpad photo 300x300 under 100KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=232",
    searchUrl: "https://techtools.cz/launchpad-api/tools/232",
    expected: [siteHost, "Photo 300x300 Under 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 300 x 300 px and 100KB photo path",
  },
  {
    name: "TechTools Launchpad photo 600x600 under 100KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=233",
    searchUrl: "https://techtools.cz/launchpad-api/tools/233",
    expected: [siteHost, "Photo 600x600 Under 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 600 x 600 px and 100KB photo path",
  },
  {
    name: "TechTools Launchpad resize signature 200x100 listing",
    url: "https://techtools.cz/tools/launchpad/?tool=221",
    searchUrl: "https://techtools.cz/launchpad-api/tools/221",
    expected: [siteHost, "Resize Signature 200x100"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 200 x 100 px signature resize path",
  },
  {
    name: "TechTools Launchpad signature 140x60 under 20KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=227",
    searchUrl: "https://techtools.cz/launchpad-api/tools/227",
    expected: [siteHost, "Signature 140x60 Under 20KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 140 x 60 px and 20KB signature path",
  },
  {
    name: "TechTools Launchpad signature 140x60 under 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=228",
    searchUrl: "https://techtools.cz/launchpad-api/tools/228",
    expected: [siteHost, "Signature 140x60 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 140 x 60 px and 50KB signature path",
  },
  {
    name: "TechTools Launchpad signature 200x100 under 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=229",
    searchUrl: "https://techtools.cz/launchpad-api/tools/229",
    expected: [siteHost, "Signature 200x100 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 200 x 100 px and 50KB signature path",
  },
  {
    name: "TechTools Launchpad signature 150x50 under 20KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=234",
    searchUrl: "https://techtools.cz/launchpad-api/tools/234",
    expected: [siteHost, "Signature 150x50 Under 20KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 150 x 50 px and 20KB signature path",
  },
  {
    name: "TechTools Launchpad signature 200x50 under 20KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=235",
    searchUrl: "https://techtools.cz/launchpad-api/tools/235",
    expected: [siteHost, "Signature 200x50 Under 20KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 200 x 50 px and 20KB signature path",
  },
  {
    name: "TechTools Launchpad signature 300x80 under 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=236",
    searchUrl: "https://techtools.cz/launchpad-api/tools/236",
    expected: [siteHost, "Signature 300x80 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 300 x 80 px and 50KB signature path",
  },
  {
    name: "TechTools Launchpad signature 300x100 under 50KB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=237",
    searchUrl: "https://techtools.cz/launchpad-api/tools/237",
    expected: [siteHost, "Signature 300x100 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 300 x 100 px and 50KB signature path",
  },
  {
    name: "TechTools Launchpad resize photo 200x230 listing",
    url: "https://techtools.cz/tools/launchpad/?tool=222",
    searchUrl: "https://techtools.cz/launchpad-api/tools/222",
    expected: [siteHost, "Resize Photo 200x230"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the exact 200 x 230 px photo resize path",
  },
  {
    name: "TechTools Launchpad passport photo 35x45mm listing",
    url: "https://techtools.cz/tools/launchpad/?tool=223",
    searchUrl: "https://techtools.cz/launchpad-api/tools/223",
    expected: [siteHost, "Passport Photo 35x45mm"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the common 35 x 45 mm passport-style photo workflow",
  },
  ...techtoolsExactUploadLimitListings.map(([title, reason, toolId]) => ({
    name: `TechTools Launchpad ${title.toLowerCase()} listing`,
    url: toolId ? `https://techtools.cz/tools/launchpad/?tool=${toolId}` : "https://techtools.cz/tools/launchpad/",
    searchUrl: toolId ? `https://techtools.cz/launchpad-api/tools/${toolId}` : "https://techtools.cz/launchpad-api/tools?per_page=100&sort=recent",
    expected: [siteHost, title],
    submittedAt: "2026-06-09",
    reviewWindow: toolId ? `auto-approved API listing for the ${reason}` : `pending next rate-limit retry for the ${reason}`,
  })),
  {
    name: "NoSignupTools",
    url: "https://nosignuptools.com/",
    searchUrl: "https://nosignuptools.com/?q=PrintableTools+Lab",
    expected: [siteHost],
    submittedAt: "2026-06-01",
    reviewWindow: "24-48 hours",
  },
  {
    name: "NoSignupTools overdue invoice reminder listing",
    url: "https://nosignuptools.com/tools/overdue-invoice-reminder-email-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Overdue+Invoice+Reminder+Email",
    expected: [siteHost, "Overdue Invoice Reminder Email"],
    submittedAt: "2026-06-08",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools upload limit fixer listing",
    url: "https://nosignuptools.com/tools/upload-limit-fixer-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Upload+Limit+Fixer",
    expected: [siteHost, "Upload Limit Fixer"],
    submittedAt: "2026-06-08",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools upload error cheatsheet listing",
    url: "https://nosignuptools.com/tools/upload-error-cheatsheet-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Upload+Error+Cheatsheet",
    expected: [siteHost, "Upload Error Cheatsheet"],
    submittedAt: "2026-06-08",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools image dimensions 600x600 upload fix listing",
    url: "https://nosignuptools.com/tools/image-dimensions-600x600-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Image+Dimensions+600x600+Upload+Fix",
    expected: [siteHost, "Image Dimensions 600x600 Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools PDF not accepted JPG required upload fix listing",
    url: "https://nosignuptools.com/tools/pdf-not-accepted-jpg-required-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=PDF+Not+Accepted+JPG+Required+Fix",
    expected: [siteHost, "PDF Not Accepted JPG Required Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress image to KB listing",
    url: "https://nosignuptools.com/tools/compress-image-to-kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+to+KB",
    expected: [siteHost, "Compress Image to KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools email attachment too large fix listing",
    url: "https://nosignuptools.com/tools/email-attachment-too-large-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Email+Attachment+Too+Large+Fix",
    expected: [siteHost, "Email Attachment Too Large Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools PDF under 2MB upload fix listing",
    url: "https://nosignuptools.com/tools/pdf-under-2mb-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=PDF+Under+2MB+Upload+Fix",
    expected: [siteHost, "PDF Under 2MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools PDF under 5MB upload fix listing",
    url: "https://nosignuptools.com/tools/pdf-under-5mb-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=PDF+Under+5MB+Upload+Fix",
    expected: [siteHost, "PDF Under 5MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools resume PDF under 2MB upload fix listing",
    url: "https://nosignuptools.com/tools/resume-pdf-under-2mb-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resume+PDF+Under+2MB+Upload+Fix",
    expected: [siteHost, "Resume PDF Under 2MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools document under 5MB upload fix listing",
    url: "https://nosignuptools.com/tools/document-under-5mb-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Document+Under+5MB+Upload+Fix",
    expected: [siteHost, "Document Under 5MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress image to 50KB listing",
    url: "https://nosignuptools.com/tools/compress-image-to-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+to+50KB",
    expected: [siteHost, "Compress Image to 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress image to 100KB listing",
    url: "https://nosignuptools.com/tools/compress-image-to-100kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+to+100KB",
    expected: [siteHost, "Compress Image to 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress image to 200KB listing",
    url: "https://nosignuptools.com/tools/compress-image-to-200kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+to+200KB",
    expected: [siteHost, "Compress Image to 200KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress JPG to 50KB listing",
    url: "https://nosignuptools.com/tools/compress-jpg-to-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+JPG+to+50KB",
    expected: [siteHost, "Compress JPG to 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress JPG to 100KB listing",
    url: "https://nosignuptools.com/tools/compress-jpg-to-100kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+JPG+to+100KB",
    expected: [siteHost, "Compress JPG to 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress JPG to 200KB listing",
    url: "https://nosignuptools.com/tools/compress-jpg-to-200kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+JPG+to+200KB",
    expected: [siteHost, "Compress JPG to 200KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress PNG to 50KB listing",
    url: "https://nosignuptools.com/tools/compress-png-to-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+PNG+to+50KB",
    expected: [siteHost, "Compress PNG to 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress PNG to 100KB listing",
    url: "https://nosignuptools.com/tools/compress-png-to-100kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+PNG+to+100KB",
    expected: [siteHost, "Compress PNG to 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress PNG to 200KB listing",
    url: "https://nosignuptools.com/tools/compress-png-to-200kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+PNG+to+200KB",
    expected: [siteHost, "Compress PNG to 200KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools passport photo compress to 50KB listing",
    url: "https://nosignuptools.com/tools/passport-photo-compress-to-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+Compress+to+50KB",
    expected: [siteHost, "Passport Photo Compress to 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools passport photo compress to 100KB listing",
    url: "https://nosignuptools.com/tools/passport-photo-compress-to-100kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+Compress+to+100KB",
    expected: [siteHost, "Passport Photo Compress to 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools passport photo compress to 200KB listing",
    url: "https://nosignuptools.com/tools/passport-photo-compress-to-200kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+Compress+to+200KB",
    expected: [siteHost, "Passport Photo Compress to 200KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools extract text from PDF without uploading listing",
    url: "https://nosignuptools.com/tools/extract-text-from-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Extract+Text+From+PDF+Without+Uploading",
    expected: [siteHost, "Extract Text From PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools merge PDF without uploading listing",
    url: "https://nosignuptools.com/tools/merge-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Merge+PDF+Without+Uploading",
    expected: [siteHost, "Merge PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools split PDF without uploading listing",
    url: "https://nosignuptools.com/tools/split-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Split+PDF+Without+Uploading",
    expected: [siteHost, "Split PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools rotate PDF pages without uploading listing",
    url: "https://nosignuptools.com/tools/rotate-pdf-pages-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Rotate+PDF+Pages+Without+Uploading",
    expected: [siteHost, "Rotate PDF Pages Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools remove pages from PDF without uploading listing",
    url: "https://nosignuptools.com/tools/remove-pages-from-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Remove+Pages+From+PDF+Without+Uploading",
    expected: [siteHost, "Remove Pages From PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools reorder PDF pages without uploading listing",
    url: "https://nosignuptools.com/tools/reorder-pdf-pages-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Reorder+PDF+Pages+Without+Uploading",
    expected: [siteHost, "Reorder PDF Pages Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools add page numbers to PDF listing",
    url: "https://nosignuptools.com/tools/add-page-numbers-to-pdf-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Add+Page+Numbers+to+PDF",
    expected: [siteHost, "Add Page Numbers to PDF"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools stamp PDF without uploading listing",
    url: "https://nosignuptools.com/tools/stamp-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Stamp+PDF+Without+Uploading",
    expected: [siteHost, "Stamp PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools sign PDF without uploading listing",
    url: "https://nosignuptools.com/tools/sign-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Sign+PDF+Without+Uploading",
    expected: [siteHost, "Sign PDF Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools compress image without uploading listing",
    url: "https://nosignuptools.com/tools/compress-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+Without+Uploading",
    expected: [siteHost, "Compress Image Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools resize image without uploading listing",
    url: "https://nosignuptools.com/tools/resize-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Image+Without+Uploading",
    expected: [siteHost, "Resize Image Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools convert image format without uploading listing",
    url: "https://nosignuptools.com/tools/convert-image-format-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Convert+Image+Format+Without+Uploading",
    expected: [siteHost, "Convert Image Format Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools remove background without uploading listing",
    url: "https://nosignuptools.com/tools/remove-background-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Remove+Background+Without+Uploading",
    expected: [siteHost, "Remove Background Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools crop image without uploading listing",
    url: "https://nosignuptools.com/tools/crop-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Crop+Image+Without+Uploading",
    expected: [siteHost, "Crop Image Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools rotate image without uploading listing",
    url: "https://nosignuptools.com/tools/rotate-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Rotate+Image+Without+Uploading",
    expected: [siteHost, "Rotate Image Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools watermark image without uploading listing",
    url: "https://nosignuptools.com/tools/watermark-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Watermark+Image+Without+Uploading",
    expected: [siteHost, "Watermark Image Without Uploading"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools passport photo size fixer listing",
    url: "https://nosignuptools.com/tools/passport-photo-size-fixer-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+Size+Fixer",
    expected: [siteHost, "Passport Photo Size Fixer"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools resize photo 413x531 listing",
    url: "https://nosignuptools.com/tools/resize-photo-413x531-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Photo+413x531",
    expected: [siteHost, "Resize Photo 413x531"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools passport photo 35x45mm listing",
    url: "https://nosignuptools.com/tools/passport-photo-35x45mm-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+35x45mm",
    expected: [siteHost, "Passport Photo 35x45mm"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools photo 200x230 under 50KB listing",
    url: "https://nosignuptools.com/tools/photo-200x230-under-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Photo+200x230+Under+50KB",
    expected: [siteHost, "Photo 200x230 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools resize photo 200x230 listing",
    url: "https://nosignuptools.com/tools/resize-photo-200x230-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Photo+200x230",
    expected: [siteHost, "Resize Photo 200x230"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools signature under 20KB listing",
    url: "https://nosignuptools.com/tools/signature-under-20kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Signature+Under+20KB",
    expected: [siteHost, "Signature Under 20KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools signature under 50KB listing",
    url: "https://nosignuptools.com/tools/signature-under-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Signature+Under+50KB",
    expected: [siteHost, "Signature Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools resize signature 140x60 listing",
    url: "https://nosignuptools.com/tools/resize-signature-140x60-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Signature+140x60",
    expected: [siteHost, "Resize Signature 140x60"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools resize signature 200x100 listing",
    url: "https://nosignuptools.com/tools/resize-signature-200x100-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Signature+200x100",
    expected: [siteHost, "Resize Signature 200x100"],
    submittedAt: "2026-06-09",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  ...nosignupExactUploadLimitListings.map(([title, reason]) => ({
    name: `NoSignupTools ${title} listing`,
    url: `https://nosignuptools.com/tools/${slugify(title)}-by-printabletools-lab`,
    searchUrl: `https://nosignuptools.com/?q=${encodeURIComponent(title).replace(/%20/g, "+")}`,
    expected: [siteHost, title],
    submittedAt: "2026-06-09",
    reviewWindow: `24-48 hour manual review after public API success response for the ${reason}`,
  })),
  {
    name: "FreeNoSignup",
    url: "https://freenosignup.com/",
    searchUrl: "https://freenosignup.com/?s=PrintableTools+Lab",
    expected: [siteHost],
    submittedAt: "2026-06-01",
    reviewWindow: "3-5 business days",
  },
  {
    name: "FreeNoSignup overdue invoice reminder listing",
    url: "https://freenosignup.com/",
    searchUrl: "https://freenosignup.com/?s=Overdue+Invoice+Reminder+Email",
    expected: [siteHost, "Overdue Invoice Reminder Email"],
    submittedAt: "2026-06-08",
    reviewWindow: "3-5 business day manual review after public Google Form confirmation",
  },
  {
    name: "FreeNoSignup upload limit fixer listing",
    url: "https://freenosignup.com/",
    searchUrl: "https://freenosignup.com/?s=Upload+Limit+Fixer",
    expected: [siteHost, "Upload Limit Fixer"],
    submittedAt: "2026-06-08",
    reviewWindow: "3-5 business day manual review after public Google Form confirmation",
  },
  {
    name: "FreeNoSignup upload error cheatsheet listing",
    url: "https://freenosignup.com/",
    searchUrl: "https://freenosignup.com/?s=Upload+Error+Cheatsheet",
    expected: [siteHost, "Upload Error Cheatsheet"],
    submittedAt: "2026-06-08",
    reviewWindow: "3-5 business day manual review after public Google Form confirmation",
  },
  ...freenosignupUploadFixListings.map(([title, reason]) => ({
    name: `FreeNoSignup ${title} listing`,
    url: "https://freenosignup.com/",
    searchUrl: `https://freenosignup.com/?s=${encodeURIComponent(title).replace(/%20/g, "+")}`,
    expected: [siteHost, title],
    submittedAt: "2026-06-09",
    reviewWindow: `3-5 business day manual review after public Google Form confirmation for the ${reason}`,
  })),
  {
    name: "NoLogin.tools",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev",
    searchUrl: "https://nologin.tools/?q=PrintableTools+Lab",
    expected: [siteHost, "PrintableTools Lab"],
    submittedAt: "2026-06-03",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev",
  },
  {
    name: "NoLogin.tools upload-limit listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-limit-fixer",
    searchUrl: "https://nologin.tools/?q=Upload+Limit+Fixer",
    expected: [siteHost, "Upload Limit Fixer"],
    submittedAt: "2026-06-06",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-upload-limit-fixer",
  },
  {
    name: "NoLogin.tools upload error cheatsheet listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-error-cheatsheet",
    searchUrl: "https://nologin.tools/?q=Upload+Error+Cheatsheet",
    expected: [siteHost, "Upload Error Cheatsheet"],
    submittedAt: "2026-06-08",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-upload-error-cheatsheet",
  },
  {
    name: "NoLogin.tools invoice follow-up email generator listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-tools-invoice-followup-email",
    searchUrl: "https://nologin.tools/?q=Invoice+Follow-up+Email+Generator",
    expected: [siteHost, "Invoice Follow-up Email Generator"],
    submittedAt: "2026-06-08",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-tools-invoice-followup-email",
  },
  {
    name: "NoLogin.tools overdue invoice reminder listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-overdue-invoice-reminder-email",
    searchUrl: "https://nologin.tools/?q=Overdue+Invoice+Reminder+Email",
    expected: [siteHost, "Overdue Invoice Reminder Email"],
    submittedAt: "2026-06-08",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-overdue-invoice-reminder-email",
  },
  {
    name: "NoLogin.tools compress image to KB listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-tools-compress-image-to-kb",
    searchUrl: "https://nologin.tools/?q=Compress+Image+to+KB",
    expected: [siteHost, "Compress Image to KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-tools-compress-image-to-kb",
  },
  {
    name: "NoLogin.tools image dimensions 600x600 upload fix listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-image-dimensions-600x600",
    searchUrl: "https://nologin.tools/?q=Image+Dimensions+600x600+Upload+Fix",
    expected: [siteHost, "Image Dimensions 600x600 Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-image-dimensions-600x600",
  },
  {
    name: "NoLogin.tools PDF not accepted JPG required upload fix listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-pdf-not-accepted-jpg-required",
    searchUrl: "https://nologin.tools/?q=PDF+Not+Accepted+JPG+Required+Fix",
    expected: [siteHost, "PDF Not Accepted JPG Required Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-pdf-not-accepted-jpg-required",
  },
  {
    name: "NoLogin.tools email attachment too large fix listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-email-attachment-too-large",
    searchUrl: "https://nologin.tools/?q=Email+Attachment+Too+Large+Fix",
    expected: [siteHost, "Email Attachment Too Large Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-email-attachment-too-large",
  },
  {
    name: "NoLogin.tools compress image to 50KB listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-compress-image-to-50kb",
    searchUrl: "https://nologin.tools/?q=Compress+Image+to+50KB",
    expected: [siteHost, "Compress Image to 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-compress-image-to-50kb",
  },
  {
    name: "NoLogin.tools compress image to 100KB listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-compress-image-to-100kb",
    searchUrl: "https://nologin.tools/?q=Compress+Image+to+100KB",
    expected: [siteHost, "Compress Image to 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-compress-image-to-100kb",
  },
  {
    name: "NoLogin.tools photo 200x230 under 20KB listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-200x230-20kb",
    searchUrl: "https://nologin.tools/?q=Photo+200x230+Under+20KB",
    expected: [siteHost, "Photo 200x230 Under 20KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-photo-200x230-20kb",
  },
  {
    name: "NoLogin.tools photo 200x230 under 100KB listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-200x230-100kb",
    searchUrl: "https://nologin.tools/?q=Photo+200x230+Under+100KB",
    expected: [siteHost, "Photo 200x230 Under 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-photo-200x230-100kb",
  },
  {
    name: "NoLogin.tools photo 413x531 under 100KB listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-413x531-100kb",
    searchUrl: "https://nologin.tools/?q=Photo+413x531+Under+100KB",
    expected: [siteHost, "Photo 413x531 Under 100KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-photo-413x531-100kb",
  },
  {
    name: "NoLogin.tools signature 140x60 under 20KB listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-140x60-20kb",
    searchUrl: "https://nologin.tools/?q=Signature+140x60+Under+20KB",
    expected: [siteHost, "Signature 140x60 Under 20KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-signature-140x60-20kb",
  },
  {
    name: "NoLogin.tools signature 140x60 under 50KB listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-140x60-50kb",
    searchUrl: "https://nologin.tools/?q=Signature+140x60+Under+50KB",
    expected: [siteHost, "Signature 140x60 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-signature-140x60-50kb",
  },
  {
    name: "NoLogin.tools signature 200x100 under 50KB listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-200x100-50kb",
    searchUrl: "https://nologin.tools/?q=Signature+200x100+Under+50KB",
    expected: [siteHost, "Signature 200x100 Under 50KB"],
    submittedAt: "2026-06-09",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-signature-200x100-50kb",
  },
  {
    name: "NoSubscription.org",
    url: "https://nosubscription.org/",
    searchUrl: "https://nosubscription.org/?s=PrintableTools+Lab",
    expected: [siteHost, "PrintableTools Lab"],
    submittedAt: "2026-06-03",
    reviewWindow: "free open-source submission accepted by Google Apps Script endpoint; slow review states 4-6 weeks",
  },
  {
    name: "JS.ORG free subdomain",
    url: "https://github.com/js-org/js.org/pull/11512",
    searchUrl: "https://github.com/js-org/js.org/pull/11512",
    expected: ["Add printable-tools-lab.js.org", "printable-tools-lab.pages.dev"],
    submittedAt: "2026-06-02",
    reviewWindow: "maintainer review",
  },
];

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  const results = [];
  for (const directory of directories) {
    results.push(await checkDirectory(directory));
  }
  const report = {
    generatedAt: new Date().toISOString(),
    site: `https://${siteHost}/`,
    listedCount: results.filter((item) => item.status === "listed").length,
    pendingCount: results.filter((item) => item.status === "pending").length,
    errorCount: results.filter((item) => item.status === "error").length,
    results,
  };
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  printReport(report);
}

async function checkDirectory(directory) {
  if (directory.name.includes("JS.ORG")) return checkJsOrg(directory);
  const targets = [directory.searchUrl, directory.url].filter(Boolean);
  const checked = [];
  for (const url of targets) {
    const result = await fetchText(url, directory.expected);
    checked.push(slimCheck(result));
    if (result.ok && result.matched) {
      return {
        ...directory,
        status: "listed",
        evidenceUrl: url,
        checked,
      };
    }
  }
  if (checked.some((item) => item.ok)) {
    return {
      ...directory,
      status: "pending",
      evidenceUrl: "",
      checked,
    };
  }
  return {
    ...directory,
    status: "error",
    evidenceUrl: "",
    checked,
  };
}

async function checkJsOrg(directory) {
  const headers = githubHeaders();
  const [page, api, checks] = await Promise.all([
    fetchText(directory.url, directory.expected),
    fetchJson("https://api.github.com/repos/js-org/js.org/pulls/11512", headers),
    fetchJson("https://api.github.com/repos/js-org/js.org/commits/f68060b27af6e352d344ecedc64065d93911326b/check-runs", headers),
  ]);
  const apiAvailable = Boolean(api.ok);
  const checksAvailable = Boolean(checks.ok);
  const body = String(api.json?.body || "");
  const pageHasExpectedText = page.matched;
  const templateOk = apiAvailable ? body.includes("- [x] There is reasonable content")
    && body.includes("- [x] I have read and accepted")
    && body.includes("https://printable-tools-lab.pages.dev/")
    && body.includes("relevant to JavaScript developers") : null;
  const pageShowsClosedOrRejected = /unrelated\s*\/\s*unqualified/i.test(page.text || "")
    || /State:\s*Closed/i.test(page.text || "")
    || /status:\s*closed/i.test(page.text || "");
  const latestChecks = checksAvailable ? latestCheckRuns(checks.json?.check_runs || []) : [];
  const checksOk = checksAvailable ? latestChecks.length > 0 && latestChecks.every((check) => check.conclusion === "success") : null;
  let status = "pending";
  if (apiAvailable && api.json?.merged) status = "listed";
  else if (apiAvailable && api.json?.state === "closed") status = "error";
  else if (page.ok && pageShowsClosedOrRejected) status = "error";
  else if (apiAvailable && templateOk === false) status = "error";
  else if (checksAvailable && latestChecks.some((check) => check.conclusion === "failure")) status = "error";
  else if (!page.ok || !pageHasExpectedText) status = "error";
  return {
    ...directory,
    status,
    evidenceUrl: directory.url,
    apiAvailable,
    checksAvailable,
    templateOk,
    checksOk,
    checks: latestChecks,
    prState: api.json?.state || "unknown",
    mergeable: api.json?.mergeable ?? null,
    checked: [
      slimCheck(page),
      slimCheck(api, { matched: templateOk === null ? false : templateOk }),
      slimCheck(checks, { matched: checksOk === null ? false : checksOk }),
    ],
  };
}

async function fetchText(url, expected = [siteHost]) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "PrintableToolsLab-DirectoryMonitor" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await response.text();
    return {
      url,
      ok: response.ok,
      status: response.status,
      bytes: Buffer.byteLength(text),
      matched: hasExpectedText(text, expected),
      text,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      bytes: 0,
      matched: false,
      error: error.message,
    };
  }
}

async function fetchJson(url, extraHeaders = {}) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "PrintableToolsLab-DirectoryMonitor",
        ...extraHeaders,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const json = await response.json().catch(() => null);
    return {
      url,
      ok: response.ok,
      status: response.status,
      bytes: JSON.stringify(json || "").length,
      matched: false,
      json,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      bytes: 0,
      matched: false,
      error: error.message,
    };
  }
}

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function hasExpectedText(text, expected) {
  const haystack = String(text).toLowerCase();
  return expected.every((needle) => haystack.includes(String(needle).toLowerCase()));
}

function latestCheckRuns(runs) {
  const byName = new Map();
  for (const run of runs) {
    const current = byName.get(run.name);
    if (!current || Date.parse(run.started_at || "") > Date.parse(current.started_at || "")) byName.set(run.name, run);
  }
  return Array.from(byName.values()).map((run) => ({
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    startedAt: run.started_at,
    url: run.html_url,
  }));
}

function slimCheck(result, overrides = {}) {
  return {
    url: result.url,
    ok: Boolean(result.ok),
    status: result.status,
    bytes: result.bytes,
    matched: Boolean(overrides.matched ?? result.matched),
    error: result.error || undefined,
  };
}

function printReport(report) {
  console.log(`Directory monitor: ${report.listedCount} listed, ${report.pendingCount} pending, ${report.errorCount} error`);
  for (const item of report.results) {
    const suffix = item.evidenceUrl ? ` (${item.evidenceUrl})` : "";
    console.log(`- ${item.name}: ${item.status}${suffix}`);
  }
  console.log(`Report written to ${path.relative(root, reportPath)}`);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
