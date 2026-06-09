const fs = require("fs");
const path = require("path");
const { URLSearchParams } = require("url");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const formResponseUrl = "https://docs.google.com/forms/d/e/1FAIpQLScZ3rCt9k2vlaHcT7d1ABmgtezWN-fZLcH_YcxJdexm8aOzRg/formResponse";
const submitPage = "https://freenosignup.com/submit/";
const mappedEntryIds = {
  toolName: "entry.269597412",
  toolUrl: "entry.201672753",
  category: "entry.1927966242",
  description: "entry.88575082",
  keyFeatures: "entry.1466984240",
  submitterName: "entry.1476070271",
  additionalNotes: "entry.183902111",
  submitterEmail: "entry.1308873964",
};

const exactUploadLimitBacklog = [
  ["photo-150x200-20kb", "Photo 150x200 Under 20KB", "photo_150x200_20kb_2026_06", "photo_150x200_20kb_landing", "Free no-signup browser workflow for forms that need a 150 x 200 px photo under 20KB. It routes users through local resize and image-to-KB steps, with reminders to check the downloaded result before uploading elsewhere.", "No signup. Exact 150 x 200 px photo target. Strict 20KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes."],
  ["photo-180x240-50kb", "Photo 180x240 Under 50KB", "photo_180x240_50kb_2026_06", "photo_180x240_50kb_landing", "Free no-signup browser workflow for forms that need a 180 x 240 px photo under 50KB. It routes users through local portrait photo resizing and image-to-KB compression.", "No signup. Exact 180 x 240 px photo target. 50KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes."],
  ["photo-400x514-100kb", "Photo 400x514 Under 100KB", "photo_400x514_100kb_2026_06", "photo_400x514_100kb_landing", "Free no-signup browser workflow for forms that need a 400 x 514 px photo under 100KB. It points users to local portrait photo resizing and compression checks before uploading elsewhere.", "No signup. Exact 400 x 514 px photo target. 100KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes."],
  ["photo-600x800-200kb", "Photo 600x800 Under 200KB", "photo_600x800_200kb_2026_06", "photo_600x800_200kb_landing", "Free no-signup browser workflow for forms that need a 600 x 800 px photo under 200KB. It routes users through local portrait photo resizing and image-to-KB compression.", "No signup. Exact 600 x 800 px photo target. 200KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes."],
  ["signature-100x50-10kb", "Signature 100x50 Under 10KB", "signature_100x50_10kb_2026_06", "signature_100x50_10kb_landing", "Free no-signup browser workflow for signature images that must be 100 x 50 px and under 10KB. It routes users to local signature resize and strict image-to-KB compression.", "No signup. Exact 100 x 50 px signature target. Strict 10KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes."],
  ["signature-200x60-20kb", "Signature 200x60 Under 20KB", "signature_200x60_20kb_2026_06", "signature_200x60_20kb_landing", "Free no-signup browser workflow for signature images that must be 200 x 60 px and under 20KB. It points users to local signature resize and strict image-to-KB compression.", "No signup. Exact 200 x 60 px signature target. Strict 20KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes."],
  ["signature-256x64-20kb", "Signature 256x64 Under 20KB", "signature_256x64_20kb_2026_06", "signature_256x64_20kb_landing", "Free no-signup browser workflow for signature images that must be 256 x 64 px and under 20KB. It routes users to local signature resize and compression steps.", "No signup. Exact 256 x 64 px signature target. Strict 20KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes."],
  ["signature-400x200-100kb", "Signature 400x200 Under 100KB", "signature_400x200_100kb_2026_06", "signature_400x200_100kb_landing", "Free no-signup browser workflow for signature images that must be 400 x 200 px and under 100KB. It routes users to local resize and image-to-KB compression steps.", "No signup. Exact 400 x 200 px signature target. 100KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes."],
];

const backlog = [
  {
    report: "freenosignup-compress-pdf-to-500kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Compress+PDF+to+500KB",
    payload: {
      toolName: "Compress PDF to 500KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/compress-pdf-to-500kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=pdf_500kb_2026_06&utm_content=compress_pdf_to_500kb_landing",
      category: "Productivity",
      description: "Free no-signup browser PDF compressor for strict 500KB upload limits on forms, exam portals, school uploads, application portals, and email-style document limits. It keeps ordinary files local during use and includes an optional public-safe USD 9 upload fix-plan request only after users confirm fit.",
      keyFeatures: "No signup. Browser-based PDF compression. 500KB target page. No server file upload for ordinary use. Free export path. Optional public-safe upload fix-plan request is separate.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific free upload-limit tool submission. The page is useful for people searching exact 500KB PDF errors and is not a paid-only product.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-compress-pdf-to-1mb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Compress+PDF+to+1MB",
    payload: {
      toolName: "Compress PDF to 1MB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/compress-pdf-to-1mb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=pdf_1mb_2026_06&utm_content=compress_pdf_to_1mb_landing",
      category: "Productivity",
      description: "Free no-signup browser PDF compressor for common 1MB upload limits on forms, portals, applications, and email attachments. It opens a practical 1MB target workflow and keeps ordinary files local during use.",
      keyFeatures: "No signup. Browser-based PDF compression. Common 1MB target. No ordinary server upload. Free download path. Public-safe upload-error guidance.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific free exact-size PDF tool submission for people blocked by PDF under 1MB upload messages.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-compress-image-to-100kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Compress+Image+to+100KB",
    payload: {
      toolName: "Compress Image to 100KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/compress-image-to-100kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=image_100kb_2026_06&utm_content=compress_image_to_100kb_landing",
      category: "Productivity",
      description: "Free no-signup browser image compressor for 100KB profile photo, school form, job portal, and application upload limits. It routes users to a local image-to-KB workflow and does not require account creation.",
      keyFeatures: "No signup. Browser image compression. 100KB target. Useful for profile photos and application uploads. No ordinary server file upload. Free download path.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific free image upload-limit page submission, not a paid-only product.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-image-must-be-under-500kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Image+Must+Be+Under+500KB+Fix",
    payload: {
      toolName: "Image Must Be Under 500KB Fix by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/image-must-be-under-500kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=image_under_500kb_upload_fix_2026_06&utm_content=image_must_be_under_500kb_landing",
      category: "Productivity",
      description: "Free no-signup upload-error page for forms that reject an image because it must be under 500KB. It points users to the browser image-to-KB compressor with practical target settings and public-safe guidance.",
      keyFeatures: "No signup. Exact upload-error wording. Browser-based image compression path. 500KB target. Public-safe notes only. Free tool before any optional service request.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific free upload-error fix page for exact 500KB image rejection messages.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-passport-photo-size-fixer-submit.json",
    searchUrl: "https://freenosignup.com/?s=Passport+Photo+Size+Fixer",
    payload: {
      toolName: "Passport Photo Size Fixer by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/passport-photo-size-fixer/?utm_source=freenosignup&utm_medium=directory&utm_campaign=passport_photo_size_fixer_2026_06&utm_content=passport_photo_size_fixer_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for passport-style photo size issues, including crop, resize, and KB-limit routing. It is intended for generic photo upload requirements and tells users to review official rules before submitting.",
      keyFeatures: "No signup. Browser-based photo crop and resize routing. KB-limit guidance. Passport-style photo workflow. Public-safe notes only. Free tool path.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific free photo-size utility page. It does not claim official passport or visa approval and does not ask for ID documents, logins, payment, or private account data.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-200x230-50kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+200x230+Under+50KB",
    payload: {
      toolName: "Photo 200x230 Under 50KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-200x230-50kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_200x230_50kb_2026_06&utm_content=photo_200x230_50kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a 200 x 230 px photo under 50KB. It routes users through local resize and image-to-KB steps, with reminders to check the downloaded result before uploading elsewhere.",
      keyFeatures: "No signup. Exact 200 x 230 px photo target. 50KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-200x230-20kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+200x230+Under+20KB",
    payload: {
      toolName: "Photo 200x230 Under 20KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-200x230-20kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_200x230_20kb_2026_06&utm_content=photo_200x230_20kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a 200 x 230 px photo under 20KB. It routes users through local resize and image-to-KB steps and keeps ordinary files on the device during use.",
      keyFeatures: "No signup. Exact 200 x 230 px photo target. Strict 20KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-200x230-100kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+200x230+Under+100KB",
    payload: {
      toolName: "Photo 200x230 Under 100KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-200x230-100kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_200x230_100kb_2026_06&utm_content=photo_200x230_100kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a 200 x 230 px photo under 100KB. It points users to local photo resizing and compression checks before uploading elsewhere.",
      keyFeatures: "No signup. Exact 200 x 230 px photo target. 100KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-413x531-100kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+413x531+Under+100KB",
    payload: {
      toolName: "Photo 413x531 Under 100KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-413x531-100kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_413x531_100kb_2026_06&utm_content=photo_413x531_100kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a 413 x 531 px photo under 100KB. It routes users through local portrait photo resizing and image-to-KB compression.",
      keyFeatures: "No signup. Exact 413 x 531 px photo target. 100KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-240x320-50kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+240x320+Under+50KB",
    payload: {
      toolName: "Photo 240x320 Under 50KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-240x320-50kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_240x320_50kb_2026_06&utm_content=photo_240x320_50kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a 240 x 320 px photo under 50KB. It routes users through local portrait photo resizing and image-to-KB compression, with reminders to check the downloaded result before uploading elsewhere.",
      keyFeatures: "No signup. Exact 240 x 320 px photo target. 50KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-295x413-35kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+295x413+Under+35KB",
    payload: {
      toolName: "Photo 295x413 Under 35KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-295x413-35kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_295x413_35kb_2026_06&utm_content=photo_295x413_35kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a 295 x 413 px photo under 35KB. It routes users through local portrait photo resizing and strict image-to-KB compression, with reminders to check the downloaded result before uploading elsewhere.",
      keyFeatures: "No signup. Exact 295 x 413 px photo target. Strict 35KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-413x531-50kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+413x531+Under+50KB",
    payload: {
      toolName: "Photo 413x531 Under 50KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-413x531-50kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_413x531_50kb_2026_06&utm_content=photo_413x531_50kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a 413 x 531 px photo under 50KB. It routes users through local portrait photo resizing and strict image-to-KB compression.",
      keyFeatures: "No signup. Exact 413 x 531 px photo target. 50KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-354x472-100kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+354x472+Under+100KB",
    payload: {
      toolName: "Photo 354x472 Under 100KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-354x472-100kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_354x472_100kb_2026_06&utm_content=photo_354x472_100kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a 354 x 472 px photo under 100KB. It routes users through local portrait photo resizing and image-to-KB compression before uploading elsewhere.",
      keyFeatures: "No signup. Exact 354 x 472 px photo target. 100KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-300x300-100kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+300x300+Under+100KB",
    payload: {
      toolName: "Photo 300x300 Under 100KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-300x300-100kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_300x300_100kb_2026_06&utm_content=photo_300x300_100kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a square 300 x 300 px photo under 100KB. It points users to local square photo resizing and compression checks before uploading elsewhere.",
      keyFeatures: "No signup. Exact 300 x 300 px square photo target. 100KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-600x600-100kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+600x600+Under+100KB",
    payload: {
      toolName: "Photo 600x600 Under 100KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-600x600-100kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_600x600_100kb_2026_06&utm_content=photo_600x600_100kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a square 600 x 600 px photo under 100KB. It routes users through local square photo resizing and image-to-KB compression.",
      keyFeatures: "No signup. Exact 600 x 600 px square photo target. 100KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-480x640-200kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+480x640+Under+200KB",
    payload: {
      toolName: "Photo 480x640 Under 200KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-480x640-200kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_480x640_200kb_2026_06&utm_content=photo_480x640_200kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a 480 x 640 px photo under 200KB. It routes users through local portrait photo resizing and image-to-KB compression.",
      keyFeatures: "No signup. Exact 480 x 640 px photo target. 200KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-photo-512x512-100kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Photo+512x512+Under+100KB",
    payload: {
      toolName: "Photo 512x512 Under 100KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/photo-512x512-100kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=photo_512x512_100kb_2026_06&utm_content=photo_512x512_100kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for forms that need a square 512 x 512 px photo under 100KB. It routes users through local square photo resizing and image-to-KB compression.",
      keyFeatures: "No signup. Exact 512 x 512 px square photo target. 100KB size guidance. Browser resize and compression steps. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-dimension photo upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-under-20kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+Under+20KB",
    payload: {
      toolName: "Signature Under 20KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-under-20kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_20kb_upload_fix_2026_06&utm_content=signature_under_20kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature image files that must be under 20KB. It routes users to local signature PNG/image compression settings and public-safe upload guidance.",
      keyFeatures: "No signup. Signature image compression path. 20KB target. Browser-based workflow. No ordinary server file upload. Free tool path.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific free signature image upload-limit page; users should review the downloaded file before submitting it to external portals.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-150x50-20kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+150x50+Under+20KB",
    payload: {
      toolName: "Signature 150x50 Under 20KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-150x50-20kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_150x50_20kb_2026_06&utm_content=signature_150x50_20kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 150 x 50 px and under 20KB. It routes users to local signature resize and compression steps.",
      keyFeatures: "No signup. Exact 150 x 50 px signature target. Strict 20KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-160x70-20kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+160x70+Under+20KB",
    payload: {
      toolName: "Signature 160x70 Under 20KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-160x70-20kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_160x70_20kb_2026_06&utm_content=signature_160x70_20kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 160 x 70 px and under 20KB. It routes users to local signature resize and compression steps.",
      keyFeatures: "No signup. Exact 160 x 70 px signature target. Strict 20KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-200x50-20kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+200x50+Under+20KB",
    payload: {
      toolName: "Signature 200x50 Under 20KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-200x50-20kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_200x50_20kb_2026_06&utm_content=signature_200x50_20kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 200 x 50 px and under 20KB. It routes users to local signature resize and compression steps.",
      keyFeatures: "No signup. Exact 200 x 50 px signature target. Strict 20KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-140x60-20kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+140x60+Under+20KB",
    payload: {
      toolName: "Signature 140x60 Under 20KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-140x60-20kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_140x60_20kb_2026_06&utm_content=signature_140x60_20kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 140 x 60 px and under 20KB. It routes users to local signature resize and compression steps.",
      keyFeatures: "No signup. Exact 140 x 60 px signature target. Strict 20KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-300x80-50kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+300x80+Under+50KB",
    payload: {
      toolName: "Signature 300x80 Under 50KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-300x80-50kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_300x80_50kb_2026_06&utm_content=signature_300x80_50kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 300 x 80 px and under 50KB. It points users to local signature resize and compression checks.",
      keyFeatures: "No signup. Exact 300 x 80 px signature target. 50KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-250x80-50kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+250x80+Under+50KB",
    payload: {
      toolName: "Signature 250x80 Under 50KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-250x80-50kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_250x80_50kb_2026_06&utm_content=signature_250x80_50kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 250 x 80 px and under 50KB. It points users to local signature resize and compression checks.",
      keyFeatures: "No signup. Exact 250 x 80 px signature target. 50KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-300x60-20kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+300x60+Under+20KB",
    payload: {
      toolName: "Signature 300x60 Under 20KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-300x60-20kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_300x60_20kb_2026_06&utm_content=signature_300x60_20kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 300 x 60 px and under 20KB. It points users to local signature resize and strict image-to-KB compression.",
      keyFeatures: "No signup. Exact 300 x 60 px signature target. Strict 20KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-300x100-50kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+300x100+Under+50KB",
    payload: {
      toolName: "Signature 300x100 Under 50KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-300x100-50kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_300x100_50kb_2026_06&utm_content=signature_300x100_50kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 300 x 100 px and under 50KB. It routes users to local resize and image-to-KB compression steps.",
      keyFeatures: "No signup. Exact 300 x 100 px signature target. 50KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-400x150-50kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+400x150+Under+50KB",
    payload: {
      toolName: "Signature 400x150 Under 50KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-400x150-50kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_400x150_50kb_2026_06&utm_content=signature_400x150_50kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 400 x 150 px and under 50KB. It routes users to local resize and image-to-KB compression steps.",
      keyFeatures: "No signup. Exact 400 x 150 px signature target. 50KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-140x60-50kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+140x60+Under+50KB",
    payload: {
      toolName: "Signature 140x60 Under 50KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-140x60-50kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_140x60_50kb_2026_06&utm_content=signature_140x60_50kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 140 x 60 px and under 50KB. It points users to local signature resize and compression checks.",
      keyFeatures: "No signup. Exact 140 x 60 px signature target. 50KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-signature-200x100-50kb-submit.json",
    searchUrl: "https://freenosignup.com/?s=Signature+200x100+Under+50KB",
    payload: {
      toolName: "Signature 200x100 Under 50KB by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/signature-200x100-50kb/?utm_source=freenosignup&utm_medium=directory&utm_campaign=signature_200x100_50kb_2026_06&utm_content=signature_200x100_50kb_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for signature images that must be 200 x 100 px and under 50KB. It routes users to local resize and image-to-KB compression steps.",
      keyFeatures: "No signup. Exact 200 x 100 px signature target. 50KB size guidance. Browser resize and compression path. Free tool path. Public-safe upload notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  },
  {
    report: "freenosignup-resize-signature-200x100-submit.json",
    searchUrl: "https://freenosignup.com/?s=Resize+Signature+200x100",
    payload: {
      toolName: "Resize Signature 200x100 by PrintableTools Lab",
      toolUrl: "https://printable-tools-lab.pages.dev/resize-signature-200x100/?utm_source=freenosignup&utm_medium=directory&utm_campaign=resize_signature_200x100_2026_06&utm_content=resize_signature_200x100_landing",
      category: "Productivity",
      description: "Free no-signup browser workflow for resizing a signature image to 200 x 100 px. It points users to local image resizing and compression steps for application and portal upload requirements.",
      keyFeatures: "No signup. Exact 200 x 100 px signature target. Browser-based resize path. Optional KB compression guidance. Free export path. Public-safe notes.",
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size signature utility page for people blocked by signature upload dimensions.",
      submitterEmail: "",
    },
  },
  ...exactUploadLimitBacklog.map(([pathName, name, campaign, content, description, keyFeatures]) => ({
    report: `freenosignup-${pathName}-submit.json`,
    searchUrl: `https://freenosignup.com/?s=${encodeURIComponent(name).replace(/%20/g, "+")}`,
    payload: {
      toolName: `${name} by PrintableTools Lab`,
      toolUrl: `https://printable-tools-lab.pages.dev/${pathName}/?utm_source=freenosignup&utm_medium=directory&utm_campaign=${campaign}&utm_content=${content}`,
      category: "Productivity",
      description,
      keyFeatures,
      submitterName: "PrintableTools Lab",
      additionalNotes: "Specific exact-size photo/signature upload-limit page for long-tail search and directory discovery.",
      submitterEmail: "",
    },
  })),
];

async function main() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const results = [];
  for (const item of backlog) {
    const result = await submitOrSkip(item);
    results.push(result);
    if (!result.skipped) await delay(1500);
  }
  console.log(JSON.stringify({ ok: results.every((item) => item.ok || item.skipped), results }, null, 2));
  if (results.some((item) => !item.ok && !item.skipped)) process.exitCode = 1;
}

async function submitOrSkip(item) {
  const reportPath = path.join(reportsDir, item.report);
  const existing = readJson(reportPath);
  if (existing?.ok) {
    return { report: item.report, skipped: true, reason: "existing_confirmation", searchUrl: item.searchUrl };
  }

  const preSubmitEvidence = await checkUrl(item.searchUrl, item.payload.toolName);
  if (preSubmitEvidence.matchedSite && preSubmitEvidence.matchedTitle) {
    const report = makeReport(item, 200, true, preSubmitEvidence, "already_public_before_submit", "FreeNoSignup search already matched the site and title.");
    writeReport(item.report, report);
    return { report: item.report, skipped: true, reason: "already_public_before_submit", searchUrl: item.searchUrl };
  }

  const response = await fetch(formResponseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: toFormBody(item.payload),
    redirect: "follow",
  });
  const text = await response.text().catch(() => "");
  const accepted = response.ok && /form|response|recorded|docs/i.test(text);
  const report = makeReport(
    item,
    response.status,
    accepted,
    preSubmitEvidence,
    accepted ? "pending_manual_review" : "google_form_submit_failed_pending_retry",
    text.slice(0, 260),
  );
  writeReport(accepted ? item.report : item.report.replace(/\.json$/, "-failed.json"), report);
  return { report: item.report, ok: accepted, status: response.status, searchUrl: item.searchUrl };
}

function makeReport(item, status, ok, preSubmitEvidence, reviewStatus, responseEvidenceSnippet) {
  return {
    generatedAt: new Date().toISOString(),
    directory: "FreeNoSignup",
    submitPage,
    formResponseUrl,
    status,
    ok,
    confirmationMatched: ok,
    preSubmitEvidence,
    mappedEntryIds,
    payload: item.payload,
    searchUrl: item.searchUrl,
    responseEvidenceSnippet,
    reviewStatus,
    reviewWindow: ok ? "3-5 business days" : "",
  };
}

function toFormBody(payload) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    const field = mappedEntryIds[key];
    if (field) params.set(field, value || "");
  }
  params.set("fvv", "1");
  params.set("pageHistory", "0");
  return params.toString();
}

async function checkUrl(url, title) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    const text = await response.text().catch(() => "");
    return {
      url,
      ok: response.ok,
      status: response.status,
      matchedSite: text.includes("printable-tools-lab.pages.dev") || text.includes("PrintableTools Lab"),
      matchedTitle: text.includes(title.replace(" by PrintableTools Lab", "")),
      bytes: text.length,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      matchedSite: false,
      matchedTitle: false,
      error: error.message,
    };
  }
}

function writeReport(name, data) {
  fs.writeFileSync(path.join(reportsDir, name), `${JSON.stringify(data, null, 2)}\n`);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
