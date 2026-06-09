const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const endpoint = "https://techtools.cz/launchpad-api/tools";

const backlog = [
  {
    report: "techtools-image-dimensions-600x600-upload-fix-submit.json",
    payload: {
      name: "Image Dimensions 600x600 Upload Fix by PrintableTools Lab",
      tagline: "No-signup 600 x 600 image resize/crop fix with a public-safe $9 upload plan request.",
      description: "PrintableTools Lab Image Dimensions 600x600 Upload Fix helps people blocked by image dimensions must be 600 x 600 px, square profile photo, school form, application portal, and marketplace image rejection errors. The page points to the browser image resizer with 600 x 600 cover settings and includes a public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist without uploading the private image.",
      url: "https://printable-tools-lab.pages.dev/image-dimensions-600x600/?utm_source=techtools&utm_medium=directory&utm_campaign=image_dimensions_600x600_fix_2026_06&utm_content=image_dimensions_600x600_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 image dimensions 600x600 upload fix path",
    },
  },
  {
    report: "techtools-pdf-not-accepted-jpg-required-submit.json",
    payload: {
      name: "PDF Not Accepted JPG Required Fix by PrintableTools Lab",
      tagline: "No-signup PDF-to-JPG upload fix with a public-safe $9 fallback plan request.",
      description: "PrintableTools Lab PDF Not Accepted JPG Required Fix helps people blocked when a website rejects a PDF but asks for JPG, JPEG, PNG, or image upload instead. The page points to the browser PDF-to-images converter, explains the safe local conversion workflow, and includes a public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist without uploading the private PDF.",
      url: "https://printable-tools-lab.pages.dev/pdf-not-accepted-jpg-required/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_not_accepted_jpg_required_fix_2026_06&utm_content=pdf_to_jpg_required_landing",
      category: "productivity",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 PDF not accepted JPG required upload fix path",
    },
  },
  {
    report: "techtools-email-attachment-too-large-upload-fix-submit.json",
    payload: {
      name: "Email Attachment Too Large PDF Fix by PrintableTools Lab",
      tagline: "No-signup PDF and image attachment-size fix with a public-safe $9 upload plan request.",
      description: "PrintableTools Lab Email Attachment Too Large PDF Fix helps people blocked by email attachment too large, Gmail attachment size, Outlook attachment size, scanned PDF too large, and photo attachment too large errors. The page points to the browser PDF compressor and image-to-KB compressor, starts from practical email-friendly targets, and includes a public-safe $9 Upload Limit Fix Plan request without asking for private files, inbox access, IDs, logins, payment, or tax details.",
      url: "https://printable-tools-lab.pages.dev/email-attachment-too-large/?utm_source=techtools&utm_medium=directory&utm_campaign=email_attachment_too_large_fix_2026_06&utm_content=email_attachment_too_large_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 email attachment too large upload fix path",
    },
  },
  {
    report: "techtools-compress-image-to-kb-submit.json",
    payload: {
      name: "Compress Image to KB by PrintableTools Lab",
      tagline: "No-signup image-to-KB compressor with a one-contact $9 upload fix request.",
      description: "PrintableTools Lab Compress Image to KB helps people blocked by photo, profile, application, marketplace, and portal file-size limits. The free tool runs in the browser without account creation or server upload, supports exact target KB settings, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist.",
      url: "https://printable-tools-lab.pages.dev/tools/compress-image-to-kb/?utm_source=techtools&utm_medium=directory&utm_campaign=compress_image_kb_invoice_first_2026_06&utm_content=compress_image_kb_tool",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress image to KB invoice-first tool path",
    },
  },
  {
    report: "techtools-compress-pdf-to-500kb-submit.json",
    payload: {
      name: "Compress PDF to 500KB by PrintableTools Lab",
      tagline: "Free no-signup PDF compressor for strict 500KB upload limits.",
      description: "PrintableTools Lab Compress PDF to 500KB helps people blocked by strict PDF must be under 500KB limits on forms, exam portals, school uploads, application portals, and government-style upload pages. It opens the browser PDF compressor with the 500KB target selected, keeps files local, and offers an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-pdf-to-500kb/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_500kb_2026_06&utm_content=compress_pdf_to_500kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress PDF to 500KB high-intent landing path",
    },
  },
  {
    report: "techtools-pdf-size-reducer-submit.json",
    payload: {
      name: "PDF Size Reducer by PrintableTools Lab",
      tagline: "Free no-signup PDF size reducer for exact upload limits.",
      description: "PrintableTools Lab PDF Size Reducer helps people blocked by PDF file-size limits on job, school, support, exam, admin, email, and application portals. It points to a local browser PDF compressor with 500KB, 1MB, 2MB, and 5MB target paths, keeps ordinary files on the device, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/pdf-size-reducer/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_size_reducer_2026_06&utm_content=pdf_size_reducer_hub",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 PDF size reducer hub path",
    },
  },
  {
    report: "techtools-compress-pdf-to-2mb-submit.json",
    payload: {
      name: "Compress PDF to 2MB by PrintableTools Lab",
      tagline: "Free no-signup PDF compressor for common 2MB upload limits.",
      description: "PrintableTools Lab Compress PDF to 2MB helps people blocked by 2MB PDF limits on proposal, application, school, support, and document portals. It opens the browser PDF compressor with the 2MB target selected, keeps ordinary files local, and offers an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-pdf-to-2mb/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_2mb_2026_06&utm_content=compress_pdf_to_2mb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress PDF to 2MB high-intent landing path",
    },
  },
  {
    report: "techtools-compress-pdf-to-5mb-submit.json",
    payload: {
      name: "Compress PDF to 5MB by PrintableTools Lab",
      tagline: "Free no-signup PDF compressor for readable 5MB upload limits.",
      description: "PrintableTools Lab Compress PDF to 5MB helps people blocked by 5MB PDF limits on scanned documents, support tickets, email attachments, application portals, and admin upload pages. It opens the browser PDF compressor with the 5MB target selected, keeps ordinary files local, and offers an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-pdf-to-5mb/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_5mb_2026_06&utm_content=compress_pdf_to_5mb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress PDF to 5MB high-intent landing path",
    },
  },
  {
    report: "techtools-pdf-under-2mb-upload-fix-submit.json",
    payload: {
      name: "PDF Under 2MB Upload Fix by PrintableTools Lab",
      tagline: "Free no-signup PDF compressor for 2MB upload limits.",
      description: "PrintableTools Lab PDF Under 2MB Upload Fix helps people blocked by PDF must be under 2MB, proposal PDF too large, application portal PDF limit, school upload PDF limit, and admin form upload errors. It routes visitors to a local browser PDF compressor, keeps ordinary files on the device, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist without private files, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/pdf-must-be-under-2mb/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_under_2mb_upload_fix_2026_06&utm_content=pdf_must_be_under_2mb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 PDF under 2MB upload fix path",
    },
  },
  {
    report: "techtools-pdf-under-5mb-upload-fix-submit.json",
    payload: {
      name: "PDF Under 5MB Upload Fix by PrintableTools Lab",
      tagline: "Free no-signup PDF compressor for 5MB upload limits.",
      description: "PrintableTools Lab PDF Under 5MB Upload Fix helps people blocked by PDF must be under 5MB, scanned PDF too large, document upload limit, school portal PDF size, and admin form upload errors. It routes visitors to a local browser PDF compressor, keeps ordinary files on the device, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist without private files, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/pdf-must-be-under-5mb/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_under_5mb_upload_fix_2026_06&utm_content=pdf_must_be_under_5mb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 PDF under 5MB upload fix path",
    },
  },
  {
    report: "techtools-resume-pdf-under-2mb-upload-fix-submit.json",
    payload: {
      name: "Resume PDF Under 2MB Upload Fix by PrintableTools Lab",
      tagline: "Free no-signup resume PDF compressor for 2MB upload limits.",
      description: "PrintableTools Lab Resume PDF Under 2MB Upload Fix helps job seekers blocked by resume PDF must be under 2MB, career portal upload size, applicant tracking system PDF limit, and job application document errors. It routes visitors to a local browser PDF compressor, keeps ordinary files on the device, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist without private files, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/resume-pdf-under-2mb/?utm_source=techtools&utm_medium=directory&utm_campaign=resume_pdf_under_2mb_upload_fix_2026_06&utm_content=resume_pdf_under_2mb_landing",
      category: "productivity",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 resume PDF under 2MB upload fix path",
    },
  },
  {
    report: "techtools-document-under-5mb-upload-fix-submit.json",
    payload: {
      name: "Document Under 5MB Upload Fix by PrintableTools Lab",
      tagline: "Free no-signup document compressor for 5MB PDF upload limits.",
      description: "PrintableTools Lab Document Under 5MB Upload Fix helps people blocked by document must be under 5MB, scanned document PDF too large, application document upload limit, and admin portal PDF size errors. It routes visitors to a local browser PDF compressor, keeps ordinary files on the device, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist without private files, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/document-must-be-under-5mb/?utm_source=techtools&utm_medium=directory&utm_campaign=document_under_5mb_upload_fix_2026_06&utm_content=document_must_be_under_5mb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 document under 5MB upload fix path",
    },
  },
  {
    report: "techtools-compress-image-to-50kb-submit.json",
    payload: {
      name: "Compress Image to 50KB by PrintableTools Lab",
      tagline: "Free no-signup image compressor for strict 50KB upload limits.",
      description: "PrintableTools Lab Compress Image to 50KB helps people blocked by very small photo, profile, passport-style, school, and application upload limits. It opens the no-upload browser image-to-KB tool with a 50KB target, keeps files local, and offers an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-image-to-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=image_50kb_2026_06&utm_content=compress_image_to_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress image to 50KB high-intent landing path",
    },
  },
  {
    report: "techtools-compress-image-to-100kb-submit.json",
    payload: {
      name: "Compress Image to 100KB by PrintableTools Lab",
      tagline: "Free no-signup image compressor for common 100KB photo limits.",
      description: "PrintableTools Lab Compress Image to 100KB helps people blocked by profile photo, job application, school form, portal, and marketplace image upload limits. It opens the no-upload browser image-to-KB tool with a 100KB target, keeps files local, and offers an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-image-to-100kb/?utm_source=techtools&utm_medium=directory&utm_campaign=image_100kb_2026_06&utm_content=compress_image_to_100kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress image to 100KB high-intent landing path",
    },
  },
  {
    report: "techtools-compress-image-to-200kb-submit.json",
    payload: {
      name: "Compress Image to 200KB by PrintableTools Lab",
      tagline: "Free no-signup image compressor for 200KB upload limits.",
      description: "PrintableTools Lab Compress Image to 200KB helps people blocked by JPG, profile, document photo, application, and portal image size limits. It opens the no-upload browser image-to-KB tool with a 200KB target, keeps files local, and offers an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-image-to-200kb/?utm_source=techtools&utm_medium=directory&utm_campaign=image_200kb_2026_06&utm_content=compress_image_to_200kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress image to 200KB high-intent landing path",
    },
  },
  {
    report: "techtools-compress-jpg-to-50kb-submit.json",
    payload: {
      name: "Compress JPG to 50KB by PrintableTools Lab",
      tagline: "Free no-signup JPG compressor for strict 50KB upload limits.",
      description: "PrintableTools Lab Compress JPG to 50KB helps people blocked by strict JPG photo, profile, exam, school, and application upload limits. It opens the no-upload browser image-to-KB tool with a 50KB target, keeps files local, and includes a one-contact public-safe $9 Upload Limit Fix Plan invoice request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-jpg-to-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=jpg_50kb_2026_06&utm_content=compress_jpg_to_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress JPG to 50KB invoice-ready landing path",
    },
  },
  {
    report: "techtools-compress-jpg-to-100kb-submit.json",
    payload: {
      name: "Compress JPG to 100KB by PrintableTools Lab",
      tagline: "Free no-signup JPG compressor for common 100KB upload limits.",
      description: "PrintableTools Lab Compress JPG to 100KB helps people blocked by JPG profile photo, job application, school form, portal, and admin upload limits. It opens the no-upload browser image-to-KB tool with a 100KB target, keeps files local, and includes a one-contact public-safe $9 Upload Limit Fix Plan invoice request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-jpg-to-100kb/?utm_source=techtools&utm_medium=directory&utm_campaign=jpg_100kb_2026_06&utm_content=compress_jpg_to_100kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress JPG to 100KB invoice-ready landing path",
    },
  },
  {
    report: "techtools-compress-jpg-to-200kb-submit.json",
    payload: {
      name: "Compress JPG to 200KB by PrintableTools Lab",
      tagline: "Free no-signup JPG compressor for 200KB upload limits.",
      description: "PrintableTools Lab Compress JPG to 200KB helps people blocked by JPG marketplace, support, school, profile, and portal upload limits where more detail is needed. It opens the no-upload browser image-to-KB tool with a 200KB target, keeps files local, and includes a one-contact public-safe $9 Upload Limit Fix Plan invoice request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-jpg-to-200kb/?utm_source=techtools&utm_medium=directory&utm_campaign=jpg_200kb_2026_06&utm_content=compress_jpg_to_200kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress JPG to 200KB invoice-ready landing path",
    },
  },
  {
    report: "techtools-compress-png-to-50kb-submit.json",
    payload: {
      name: "Compress PNG to 50KB by PrintableTools Lab",
      tagline: "Free no-signup PNG compressor for strict 50KB upload limits.",
      description: "PrintableTools Lab Compress PNG to 50KB helps people blocked by strict PNG screenshot, graphic, form, and portal upload limits. It opens the no-upload browser image-to-KB tool with a 50KB target, explains that tiny PNG targets may require export format changes, and includes a one-contact public-safe $9 Upload Limit Fix Plan invoice request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-png-to-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=png_50kb_2026_06&utm_content=compress_png_to_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress PNG to 50KB invoice-ready landing path",
    },
  },
  {
    report: "techtools-compress-png-to-100kb-submit.json",
    payload: {
      name: "Compress PNG to 100KB by PrintableTools Lab",
      tagline: "Free no-signup PNG compressor for 100KB upload limits.",
      description: "PrintableTools Lab Compress PNG to 100KB helps people blocked by PNG screenshot, support ticket, form, and upload portal file-size limits. It opens the no-upload browser image-to-KB tool with a 100KB target, keeps files local, and includes a one-contact public-safe $9 Upload Limit Fix Plan invoice request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-png-to-100kb/?utm_source=techtools&utm_medium=directory&utm_campaign=png_100kb_2026_06&utm_content=compress_png_to_100kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress PNG to 100KB invoice-ready landing path",
    },
  },
  {
    report: "techtools-compress-png-to-200kb-submit.json",
    payload: {
      name: "Compress PNG to 200KB by PrintableTools Lab",
      tagline: "Free no-signup PNG compressor for readable 200KB upload limits.",
      description: "PrintableTools Lab Compress PNG to 200KB helps people blocked by PNG screenshot, graphic, support, document image, and portal upload limits where readability still matters. It opens the no-upload browser image-to-KB tool with a 200KB target, keeps files local, and includes a one-contact public-safe $9 Upload Limit Fix Plan invoice request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-png-to-200kb/?utm_source=techtools&utm_medium=directory&utm_campaign=png_200kb_2026_06&utm_content=compress_png_to_200kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress PNG to 200KB invoice-ready landing path",
    },
  },
  {
    report: "techtools-passport-photo-compress-to-50kb-submit.json",
    payload: {
      name: "Passport Photo Compress to 50KB by PrintableTools Lab",
      tagline: "Free no-signup passport-style photo compressor for strict 50KB limits.",
      description: "PrintableTools Lab Passport Photo Compress to 50KB helps people blocked by ID-style photo, exam portal, school, visa-style, and profile upload file-size limits. It opens the no-upload browser image-to-KB tool with a 50KB target, keeps face photos local during ordinary use, and includes a one-contact public-safe $9 Upload Limit Fix Plan invoice request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/passport-photo-compress-to-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=passport_photo_50kb_landing_2026_06&utm_content=passport_photo_compress_to_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 passport photo compress to 50KB invoice-ready landing path",
    },
  },
  {
    report: "techtools-passport-photo-compress-to-100kb-submit.json",
    payload: {
      name: "Passport Photo Compress to 100KB by PrintableTools Lab",
      tagline: "Free no-signup passport-style photo compressor for 100KB limits.",
      description: "PrintableTools Lab Passport Photo Compress to 100KB helps people blocked by ID-style photo, school, exam, application, visa-style, and profile upload file-size limits. It opens the no-upload browser image-to-KB tool with a 100KB target, keeps face photos local during ordinary use, and includes a one-contact public-safe $9 Upload Limit Fix Plan invoice request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/passport-photo-compress-to-100kb/?utm_source=techtools&utm_medium=directory&utm_campaign=passport_photo_100kb_2026_06&utm_content=passport_photo_compress_to_100kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 passport photo compress to 100KB invoice-ready landing path",
    },
  },
  {
    report: "techtools-passport-photo-compress-to-200kb-submit.json",
    payload: {
      name: "Passport Photo Compress to 200KB by PrintableTools Lab",
      tagline: "Free no-signup passport-style photo compressor for 200KB limits.",
      description: "PrintableTools Lab Passport Photo Compress to 200KB helps people blocked by ID-style photo, school, exam, application, visa-style, and profile upload file-size limits where more clarity is allowed. It opens the no-upload browser image-to-KB tool with a 200KB target, keeps face photos local during ordinary use, and includes a one-contact public-safe $9 Upload Limit Fix Plan invoice request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/passport-photo-compress-to-200kb/?utm_source=techtools&utm_medium=directory&utm_campaign=passport_photo_200kb_2026_06&utm_content=passport_photo_compress_to_200kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 passport photo compress to 200KB invoice-ready landing path",
    },
  },
  {
    report: "techtools-compress-pdf-no-upload-submit.json",
    payload: {
      name: "Compress PDF Without Uploading by PrintableTools Lab",
      tagline: "Free browser PDF compressor that keeps ordinary files local.",
      description: "PrintableTools Lab Compress PDF Without Uploading helps people reduce scanned, photo-heavy, and portal-ready PDFs without account creation or server upload during ordinary use. The page routes visitors to browser compression settings for common upload limits, explains privacy-safe checks before sharing files, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-pdf-no-upload/?utm_source=techtools&utm_medium=directory&utm_campaign=compress_pdf_no_upload_2026_06&utm_content=compress_pdf_no_upload_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress PDF no-upload landing path",
    },
  },
  {
    report: "techtools-pdf-to-jpg-no-upload-submit.json",
    payload: {
      name: "PDF to JPG Without Uploading by PrintableTools Lab",
      tagline: "Free browser PDF-to-JPG converter for upload portals that require images.",
      description: "PrintableTools Lab PDF to JPG Without Uploading helps people when a form, portal, listing, or support page rejects PDF files and asks for JPG or image uploads instead. The tool runs in the browser for ordinary files, keeps pages local during conversion, and points visitors to safe image export checks plus the optional $9 Upload Limit Fix Plan request when exact settings are unclear.",
      url: "https://printable-tools-lab.pages.dev/pdf-to-jpg-no-upload/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_to_jpg_no_upload_2026_06&utm_content=pdf_to_jpg_no_upload_landing",
      category: "productivity",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 PDF to JPG no-upload landing path",
    },
  },
  {
    report: "techtools-jpg-to-pdf-no-upload-submit.json",
    payload: {
      name: "JPG to PDF Without Uploading by PrintableTools Lab",
      tagline: "Free browser JPG-to-PDF maker for forms, receipts, and document uploads.",
      description: "PrintableTools Lab JPG to PDF Without Uploading helps people combine photos, scans, receipts, and document images into a PDF without signup or server upload during ordinary use. It is useful when portals require a single PDF instead of separate JPG files, and it includes practical file-size checks plus an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/jpg-to-pdf-no-upload/?utm_source=techtools&utm_medium=directory&utm_campaign=jpg_to_pdf_no_upload_2026_06&utm_content=jpg_to_pdf_no_upload_landing",
      category: "productivity",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 JPG to PDF no-upload landing path",
    },
  },
  {
    report: "techtools-extract-text-from-pdf-no-upload-submit.json",
    payload: {
      name: "Extract Text From PDF Without Uploading by PrintableTools Lab",
      tagline: "Free browser PDF text extractor for copied notes, forms, and drafts.",
      description: "PrintableTools Lab Extract Text From PDF Without Uploading helps people copy text from PDFs, resumes, support files, application documents, notes, and simple scanned-looking exports without signup or server upload during ordinary use. The page routes visitors to a local browser PDF-to-text workflow, explains public-safe checks before pasting private text elsewhere, and connects upload-limit visitors to the optional $9 Upload Limit Fix Plan after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/extract-text-from-pdf-no-upload/?utm_source=techtools&utm_medium=directory&utm_campaign=extract_text_pdf_no_upload_2026_06&utm_content=extract_text_pdf_no_upload_landing",
      category: "productivity",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 extract text from PDF no-upload landing path",
    },
  },
  {
    report: "techtools-merge-pdf-no-upload-submit.json",
    payload: {
      name: "Merge PDF Without Uploading by PrintableTools Lab",
      tagline: "Free browser PDF merger for combining documents without signup.",
      description: "PrintableTools Lab Merge PDF Without Uploading helps people combine application pages, receipts, scans, forms, invoices, notes, and document packets into one PDF without account creation or server upload during ordinary use. The page is useful when a portal asks for one PDF instead of several files, and it includes practical file-size checks plus an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/merge-pdf-no-upload/?utm_source=techtools&utm_medium=directory&utm_campaign=merge_pdf_no_upload_2026_06&utm_content=merge_pdf_no_upload_landing",
      category: "productivity",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 merge PDF no-upload landing path",
    },
  },
  {
    report: "techtools-split-pdf-no-upload-submit.json",
    payload: {
      name: "Split PDF Without Uploading by PrintableTools Lab",
      tagline: "Free browser PDF splitter for removing extra pages before upload.",
      description: "PrintableTools Lab Split PDF Without Uploading helps people separate pages from a PDF, trim document packets, pull one form from a multi-page file, or prepare smaller upload-ready PDFs without signup or server upload during ordinary use. It is useful for application portals, support forms, resumes, scanned documents, and file-size limits, with an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/split-pdf-no-upload/?utm_source=techtools&utm_medium=directory&utm_campaign=split_pdf_no_upload_2026_06&utm_content=split_pdf_no_upload_landing",
      category: "productivity",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 split PDF no-upload landing path",
    },
  },
  {
    report: "techtools-signature-under-20kb-submit.json",
    payload: {
      name: "Signature Under 20KB by PrintableTools Lab",
      tagline: "Free no-signup signature image compressor for strict 20KB upload limits.",
      description: "PrintableTools Lab Signature Under 20KB helps people blocked by tiny scanned signature, exam form, job portal, admin, and application upload caps. The page opens the browser image-to-KB compressor with a 20KB target, keeps ordinary files local during use, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/signature-under-20kb/?utm_source=techtools&utm_medium=directory&utm_campaign=signature_20kb_upload_fix_2026_06&utm_content=signature_under_20kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 signature 20KB upload-fix landing path",
    },
  },
  {
    report: "techtools-passport-photo-size-fixer-submit.json",
    payload: {
      name: "Passport Photo Size Fixer by PrintableTools Lab",
      tagline: "Free no-signup passport photo resize and KB fix workflow.",
      description: "PrintableTools Lab Passport Photo Size Fixer helps people blocked when an ID-style photo needs both exact dimensions and a file-size cap. The page routes visitors to local browser crop, resize, and image-to-KB steps for passport-style, school, exam, and application uploads, then offers an optional public-safe $9 Upload Limit Fix Plan request without asking for private files, IDs, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/passport-photo-size-fixer/?utm_source=techtools&utm_medium=directory&utm_campaign=passport_photo_size_fixer_2026_06&utm_content=passport_photo_size_fixer_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 passport photo size fixer upload-fix landing path",
    },
  },
  {
    report: "techtools-resize-photo-413x531-submit.json",
    payload: {
      name: "Resize Photo 413x531 by PrintableTools Lab",
      tagline: "Free no-signup 413 x 531 photo resize workflow for upload forms.",
      description: "PrintableTools Lab Resize Photo 413x531 helps people blocked by exact 413 x 531 px photo requirements on application, profile, exam, admin, and document upload forms. The page opens the browser image resizer with width 413, height 531, and cover fit settings, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/resize-photo-413x531/?utm_source=techtools&utm_medium=directory&utm_campaign=resize_photo_413x531_2026_06&utm_content=resize_photo_413x531_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 resize photo 413x531 upload-fix landing path",
    },
  },
  {
    report: "techtools-signature-under-50kb-submit.json",
    payload: {
      name: "Signature Under 50KB by PrintableTools Lab",
      tagline: "Free no-signup signature image compressor for 50KB upload limits.",
      description: "PrintableTools Lab Signature Under 50KB helps people blocked by scanned signature, school portal, job application, admin form, and document upload caps. The page opens the browser image-to-KB compressor with a 50KB target, keeps ordinary files local during use, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/signature-under-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=signature_50kb_upload_fix_2026_06&utm_content=signature_under_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 signature 50KB upload-fix landing path",
    },
  },
  {
    report: "techtools-resize-signature-140x60-submit.json",
    payload: {
      name: "Resize Signature 140x60 by PrintableTools Lab",
      tagline: "Free no-signup 140 x 60 signature resize workflow for upload forms.",
      description: "PrintableTools Lab Resize Signature 140x60 helps people blocked when an exam, job, school, or admin upload page requires an exact 140 x 60 px signature image. The page opens the browser image resizer with width 140, height 60, and contain fit settings, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/resize-signature-140x60/?utm_source=techtools&utm_medium=directory&utm_campaign=resize_signature_140x60_2026_06&utm_content=resize_signature_140x60_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 resize signature 140x60 upload-fix landing path",
    },
  },
  {
    report: "techtools-photo-200x230-50kb-submit.json",
    payload: {
      name: "Photo 200x230 Under 50KB by PrintableTools Lab",
      tagline: "Free no-signup 200 x 230 photo and 50KB upload workflow.",
      description: "PrintableTools Lab Photo 200x230 Under 50KB helps people blocked by exam, job, profile, school, and application portals that require both exact 200 x 230 px dimensions and a small 50KB file-size cap. The page points visitors through local browser resize and compression steps, then offers an optional public-safe $9 Upload Limit Fix Plan request without asking for private files, IDs, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/photo-200x230-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=photo_200x230_50kb_2026_06&utm_content=photo_200x230_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 photo 200x230 50KB upload-fix landing path",
    },
  },
  {
    report: "techtools-photo-200x230-20kb-submit.json",
    payload: {
      name: "Photo 200x230 Under 20KB by PrintableTools Lab",
      tagline: "Free no-signup 200 x 230 photo and strict 20KB upload workflow.",
      description: "PrintableTools Lab Photo 200x230 Under 20KB helps people blocked by exam, profile, school, and application portals that require exact 200 x 230 px dimensions and a tiny 20KB file-size cap. The page points visitors through local browser resize and compression steps, then offers an optional public-safe $9 Upload Limit Fix Plan request without asking for private files, IDs, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/photo-200x230-20kb/?utm_source=techtools&utm_medium=directory&utm_campaign=photo_200x230_20kb_2026_06&utm_content=photo_200x230_20kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 photo 200x230 20KB upload-fix landing path",
    },
  },
  {
    report: "techtools-photo-200x230-100kb-submit.json",
    payload: {
      name: "Photo 200x230 Under 100KB by PrintableTools Lab",
      tagline: "Free no-signup 200 x 230 photo and 100KB upload workflow.",
      description: "PrintableTools Lab Photo 200x230 Under 100KB helps people blocked by job, profile, school, exam, and application portals that require exact 200 x 230 px dimensions plus a 100KB file-size cap. The page points visitors through local browser resize and compression steps, then offers an optional public-safe $9 Upload Limit Fix Plan request without asking for private files, IDs, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/photo-200x230-100kb/?utm_source=techtools&utm_medium=directory&utm_campaign=photo_200x230_100kb_2026_06&utm_content=photo_200x230_100kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 photo 200x230 100KB upload-fix landing path",
    },
  },
  {
    report: "techtools-photo-413x531-100kb-submit.json",
    payload: {
      name: "Photo 413x531 Under 100KB by PrintableTools Lab",
      tagline: "Free no-signup 413 x 531 photo and 100KB upload workflow.",
      description: "PrintableTools Lab Photo 413x531 Under 100KB helps people blocked by application, profile, exam, and document upload forms that require exact 413 x 531 px portrait dimensions plus a 100KB cap. The page points visitors through local browser resize and compression steps, then offers an optional public-safe $9 Upload Limit Fix Plan request without asking for private files, IDs, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/photo-413x531-100kb/?utm_source=techtools&utm_medium=directory&utm_campaign=photo_413x531_100kb_2026_06&utm_content=photo_413x531_100kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 photo 413x531 100KB upload-fix landing path",
    },
  },
  {
    report: "techtools-photo-240x320-50kb-submit.json",
    payload: {
      name: "Photo 240x320 Under 50KB by PrintableTools Lab",
      tagline: "Free no-signup 240 x 320 photo and 50KB upload workflow.",
      description: "PrintableTools Lab Photo 240x320 Under 50KB helps people blocked by application, exam, school, profile, and admin portals that require exact 240 x 320 px portrait dimensions plus a 50KB file-size cap. The page points visitors through local browser resize and compression steps, then offers an optional public-safe $9 Upload Limit Fix Plan request without asking for private files, IDs, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/photo-240x320-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=photo_240x320_50kb_2026_06&utm_content=photo_240x320_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 photo 240x320 50KB upload-fix landing path",
    },
  },
  {
    report: "techtools-photo-413x531-50kb-submit.json",
    payload: {
      name: "Photo 413x531 Under 50KB by PrintableTools Lab",
      tagline: "Free no-signup 413 x 531 photo and 50KB upload workflow.",
      description: "PrintableTools Lab Photo 413x531 Under 50KB helps people blocked by application, profile, exam, and document upload forms that require exact 413 x 531 px portrait dimensions plus a strict 50KB cap. The page points visitors through local browser resize and compression steps, then offers an optional public-safe $9 Upload Limit Fix Plan request without asking for private files, IDs, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/photo-413x531-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=photo_413x531_50kb_2026_06&utm_content=photo_413x531_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 photo 413x531 50KB upload-fix landing path",
    },
  },
  {
    report: "techtools-photo-300x300-100kb-submit.json",
    payload: {
      name: "Photo 300x300 Under 100KB by PrintableTools Lab",
      tagline: "Free no-signup 300 x 300 photo and 100KB upload workflow.",
      description: "PrintableTools Lab Photo 300x300 Under 100KB helps people blocked by profile, job, school, marketplace, and application portals that require exact square 300 x 300 px photos plus a 100KB file-size cap. The page points visitors through local browser resize and compression steps, then offers an optional public-safe $9 Upload Limit Fix Plan request without asking for private files, IDs, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/photo-300x300-100kb/?utm_source=techtools&utm_medium=directory&utm_campaign=photo_300x300_100kb_2026_06&utm_content=photo_300x300_100kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 photo 300x300 100KB upload-fix landing path",
    },
  },
  {
    report: "techtools-photo-600x600-100kb-submit.json",
    payload: {
      name: "Photo 600x600 Under 100KB by PrintableTools Lab",
      tagline: "Free no-signup 600 x 600 photo and 100KB upload workflow.",
      description: "PrintableTools Lab Photo 600x600 Under 100KB helps people blocked by profile, school, marketplace, application, and admin upload forms that require exact square 600 x 600 px photos plus a 100KB file-size cap. The page points visitors through local browser resize and compression steps, then offers an optional public-safe $9 Upload Limit Fix Plan request without asking for private files, IDs, logins, or payment details.",
      url: "https://printable-tools-lab.pages.dev/photo-600x600-100kb/?utm_source=techtools&utm_medium=directory&utm_campaign=photo_600x600_100kb_2026_06&utm_content=photo_600x600_100kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 photo 600x600 100KB upload-fix landing path",
    },
  },
  {
    report: "techtools-signature-150x50-20kb-submit.json",
    payload: {
      name: "Signature 150x50 Under 20KB by PrintableTools Lab",
      tagline: "Free no-signup 150 x 50 signature and strict 20KB upload workflow.",
      description: "PrintableTools Lab Signature 150x50 Under 20KB helps people blocked when an exam, job, school, bank, or admin upload page requires both an exact 150 x 50 px signature image and a tiny 20KB cap. The page opens browser resize and compression steps, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/signature-150x50-20kb/?utm_source=techtools&utm_medium=directory&utm_campaign=signature_150x50_20kb_2026_06&utm_content=signature_150x50_20kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 signature 150x50 20KB upload-fix landing path",
    },
  },
  {
    report: "techtools-signature-200x50-20kb-submit.json",
    payload: {
      name: "Signature 200x50 Under 20KB by PrintableTools Lab",
      tagline: "Free no-signup 200 x 50 signature and strict 20KB upload workflow.",
      description: "PrintableTools Lab Signature 200x50 Under 20KB helps people blocked when an exam, job, school, bank, or admin upload page requires both an exact 200 x 50 px signature image and a tiny 20KB cap. The page opens browser resize and compression steps, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/signature-200x50-20kb/?utm_source=techtools&utm_medium=directory&utm_campaign=signature_200x50_20kb_2026_06&utm_content=signature_200x50_20kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 signature 200x50 20KB upload-fix landing path",
    },
  },
  {
    report: "techtools-signature-300x80-50kb-submit.json",
    payload: {
      name: "Signature 300x80 Under 50KB by PrintableTools Lab",
      tagline: "Free no-signup 300 x 80 signature and 50KB upload workflow.",
      description: "PrintableTools Lab Signature 300x80 Under 50KB helps people blocked when an application, school, job, bank, or admin upload page requires both an exact 300 x 80 px signature image and a 50KB cap. The page opens browser resize and compression steps, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/signature-300x80-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=signature_300x80_50kb_2026_06&utm_content=signature_300x80_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 signature 300x80 50KB upload-fix landing path",
    },
  },
  {
    report: "techtools-signature-300x100-50kb-submit.json",
    payload: {
      name: "Signature 300x100 Under 50KB by PrintableTools Lab",
      tagline: "Free no-signup 300 x 100 signature and 50KB upload workflow.",
      description: "PrintableTools Lab Signature 300x100 Under 50KB helps people blocked when a job, exam, school, bank, document, or admin upload page requires both an exact 300 x 100 px signature image and a 50KB cap. The page opens browser resize and compression steps, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/signature-300x100-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=signature_300x100_50kb_2026_06&utm_content=signature_300x100_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 signature 300x100 50KB upload-fix landing path",
    },
  },
  {
    report: "techtools-resize-signature-200x100-submit.json",
    payload: {
      name: "Resize Signature 200x100 by PrintableTools Lab",
      tagline: "Free no-signup 200 x 100 signature resize workflow for upload forms.",
      description: "PrintableTools Lab Resize Signature 200x100 helps people blocked when a job, school, exam, document, or admin upload page requires an exact 200 x 100 px signature image. The page opens the browser image resizer with width 200, height 100, and contain fit settings, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/resize-signature-200x100/?utm_source=techtools&utm_medium=directory&utm_campaign=resize_signature_200x100_2026_06&utm_content=resize_signature_200x100_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 resize signature 200x100 upload-fix landing path",
    },
  },
  {
    report: "techtools-signature-140x60-20kb-submit.json",
    payload: {
      name: "Signature 140x60 Under 20KB by PrintableTools Lab",
      tagline: "Free no-signup 140 x 60 signature and strict 20KB upload workflow.",
      description: "PrintableTools Lab Signature 140x60 Under 20KB helps people blocked when an exam, job, school, or admin upload page requires both an exact 140 x 60 px signature image and a tiny 20KB cap. The page opens browser resize and compression steps, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/signature-140x60-20kb/?utm_source=techtools&utm_medium=directory&utm_campaign=signature_140x60_20kb_2026_06&utm_content=signature_140x60_20kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 signature 140x60 20KB upload-fix landing path",
    },
  },
  {
    report: "techtools-signature-140x60-50kb-submit.json",
    payload: {
      name: "Signature 140x60 Under 50KB by PrintableTools Lab",
      tagline: "Free no-signup 140 x 60 signature and 50KB upload workflow.",
      description: "PrintableTools Lab Signature 140x60 Under 50KB helps people blocked when an application, school, job, or admin upload page requires both an exact 140 x 60 px signature image and a 50KB cap. The page opens browser resize and compression steps, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/signature-140x60-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=signature_140x60_50kb_2026_06&utm_content=signature_140x60_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 signature 140x60 50KB upload-fix landing path",
    },
  },
  {
    report: "techtools-signature-200x100-50kb-submit.json",
    payload: {
      name: "Signature 200x100 Under 50KB by PrintableTools Lab",
      tagline: "Free no-signup 200 x 100 signature and 50KB upload workflow.",
      description: "PrintableTools Lab Signature 200x100 Under 50KB helps people blocked when a job, exam, document, or admin upload page requires both an exact 200 x 100 px signature image and a 50KB cap. The page opens browser resize and compression steps, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/signature-200x100-50kb/?utm_source=techtools&utm_medium=directory&utm_campaign=signature_200x100_50kb_2026_06&utm_content=signature_200x100_50kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 signature 200x100 50KB upload-fix landing path",
    },
  },
  {
    report: "techtools-resize-photo-200x230-submit.json",
    payload: {
      name: "Resize Photo 200x230 by PrintableTools Lab",
      tagline: "Free no-signup 200 x 230 photo resize workflow for upload forms.",
      description: "PrintableTools Lab Resize Photo 200x230 helps people blocked by exact 200 x 230 px photo requirements on exam, job, profile, school, and application upload forms. The page opens the browser image resizer with width 200, height 230, and cover fit settings, keeps ordinary files local, and includes an optional public-safe $9 Upload Limit Fix Plan request after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/resize-photo-200x230/?utm_source=techtools&utm_medium=directory&utm_campaign=resize_photo_200x230_2026_06&utm_content=resize_photo_200x230_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 resize photo 200x230 upload-fix landing path",
    },
  },
  {
    report: "techtools-passport-photo-35x45mm-submit.json",
    payload: {
      name: "Passport Photo 35x45mm by PrintableTools Lab",
      tagline: "Free no-signup 35 x 45 mm passport-style photo workflow.",
      description: "PrintableTools Lab Passport Photo 35x45mm helps people blocked by ID-style upload forms that ask for a common 35 x 45 mm passport photo shape before file-size checks. The page opens the local browser passport photo workflow, keeps ordinary files local during use, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/passport-photo-35x45mm/?utm_source=techtools&utm_medium=directory&utm_campaign=passport_photo_35x45mm_2026_06&utm_content=passport_photo_35x45mm_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 passport photo 35x45mm upload-fix landing path",
    },
  },
];

async function main() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const results = [];
  for (const item of backlog) {
    const reportPath = path.join(reportsDir, item.report);
    if (fs.existsSync(reportPath)) {
      const existing = readJson(reportPath);
      if (existing && existing.ok && existing.shareUrl) {
        results.push({ report: item.report, skipped: true, shareUrl: existing.shareUrl });
        continue;
      }
    }
    const result = await submitItem(item);
    results.push(result);
    if (result.rateLimited) {
      writeReport("techtools-upload-error-backlog-rate-limit.json", {
        generatedAt: new Date().toISOString(),
        endpoint,
        ok: false,
        rateLimited: true,
        retryAfter: result.retryAfter || "Wait 1 hour",
        blockedAt: item.payload.name,
        remaining: backlog.slice(backlog.findIndex((entry) => entry.report === item.report)).map((entry) => entry.payload.name),
      });
      break;
    }
    await delay(3000);
  }
  console.log(JSON.stringify({ ok: results.every((item) => item.ok || item.skipped), results }, null, 2));
  if (results.some((item) => item.rateLimited)) process.exitCode = 2;
}

async function submitItem(item) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item.payload),
  });
  const body = await response.json().catch(() => ({}));
  const id = body && body.data && body.data.id;
  const report = {
    generatedAt: new Date().toISOString(),
    endpoint,
    status: response.status,
    ok: response.ok && body.success === true,
    payload: item.payload,
    response: body,
    shareUrl: body.share_url || (id ? `https://techtools.cz/tools/launchpad/?tool=${id}` : ""),
    evidenceApiUrl: id ? `https://techtools.cz/launchpad-api/tools/${id}` : "",
  };
  if (report.ok) {
    writeReport(item.report, report);
    return { report: item.report, ok: true, id, shareUrl: report.shareUrl, evidenceApiUrl: report.evidenceApiUrl };
  }
  if (response.status === 429 || /rate limit/i.test(String(body.error || ""))) {
    return { report: item.report, ok: false, rateLimited: true, retryAfter: body.retry_after || "" };
  }
  writeReport(item.report.replace(/\.json$/, "-failed.json"), report);
  return { report: item.report, ok: false, status: response.status, error: body.error || "submit_failed" };
}

function writeReport(name, data) {
  fs.writeFileSync(path.join(reportsDir, name), `${JSON.stringify(data, null, 2)}\n`);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
