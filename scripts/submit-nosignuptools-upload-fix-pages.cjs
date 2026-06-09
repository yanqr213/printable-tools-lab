const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const endpoint = "https://nosignuptools.com/api/submit";

const common = {
  icon_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
  screenshots: ["https://printable-tools-lab.pages.dev/assets/images/free-pdf-tools-screenshot.png"],
  tag_ids: [3, 5],
  submitter_name: "PrintableTools Lab",
  submitter_email: null,
};

const exactUploadLimitBacklog = [
  ["compress-image-to-10kb", "Compress Image to 10KB", "image_10kb_2026_06", "compress_image_to_10kb_landing", "Free no-signup 10KB image compressor for extremely strict upload limits.", "A free browser-based image compressor for extremely strict 10KB upload limits on profile, exam, school, and application forms. It runs locally in the browser, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-image-to-20kb", "Compress Image to 20KB", "image_20kb_2026_06", "compress_image_to_20kb_landing", "Free no-signup 20KB image compressor for strict photo upload limits.", "A free browser-based image compressor for strict 20KB exam, profile, school, and application photo limits. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-image-to-30kb", "Compress Image to 30KB", "image_30kb_2026_06", "compress_image_to_30kb_landing", "Free no-signup 30KB image compressor for strict form upload limits.", "A free browser-based image compressor for strict 30KB form, profile, school, and exam upload limits. It runs locally in the browser, requires no signup, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-image-to-150kb", "Compress Image to 150KB", "image_150kb_2026_06", "compress_image_to_150kb_landing", "Free no-signup 150KB image compressor for upload forms and profiles.", "A free browser-based image compressor for 150KB upload forms, profiles, job portals, and support attachments. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-image-to-300kb", "Compress Image to 300KB", "image_300kb_2026_06", "compress_image_to_300kb_landing", "Free no-signup 300KB image compressor for forms, listings, and attachments.", "A free browser-based image compressor for 300KB forms, listings, support tickets, and email attachments. It requires no account, keeps ordinary files local during use, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-image-to-500kb", "Compress Image to 500KB", "image_500kb_2026_06", "compress_image_to_500kb_landing", "Free no-signup 500KB image compressor for moderate upload limits.", "A free browser-based image compressor for 500KB upload limits where readability and detail still matter. It keeps ordinary files local, requires no signup, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-pdf-to-100kb", "Compress PDF to 100KB", "pdf_100kb_2026_06", "compress_pdf_to_100kb_landing", "Free no-signup PDF compressor for very strict 100KB upload limits.", "A free browser-based PDF compressor for very strict 100KB upload limits on forms, exam portals, school uploads, and application portals. It opens the local PDF compressor with a 100KB target, keeps ordinary files on the device during use, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-pdf-to-200kb", "Compress PDF to 200KB", "pdf_200kb_2026_06", "compress_pdf_to_200kb_landing", "Free no-signup PDF compressor for strict 200KB upload limits.", "A free browser-based PDF compressor for strict 200KB upload limits on application forms, exam portals, school uploads, and admin pages. It opens the local PDF compressor with a 200KB target, keeps ordinary files on the device during use, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-pdf-to-300kb", "Compress PDF to 300KB", "pdf_300kb_2026_06", "compress_pdf_to_300kb_landing", "Free no-signup PDF compressor for strict 300KB upload limits.", "A free browser-based PDF compressor for strict 300KB upload limits where the file needs a little more readable detail than 100KB or 200KB. It opens the local PDF compressor with a 300KB target, requires no account, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-pdf-to-500kb", "Compress PDF to 500KB", "pdf_500kb_2026_06", "compress_pdf_to_500kb_landing", "Free no-signup PDF compressor for strict 500KB upload limits.", "A free browser-based PDF compressor for strict 500KB upload limits on forms, exam portals, school uploads, application portals, and government-style upload pages. It keeps ordinary files local and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-pdf-to-1mb", "Compress PDF to 1MB", "pdf_1mb_2026_06", "compress_pdf_to_1mb_landing", "Free no-signup PDF compressor for common 1MB upload limits.", "A free browser-based PDF compressor for common 1MB upload limits on forms, portals, email attachments, and applications. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-pdf-to-2mb", "Compress PDF to 2MB", "pdf_2mb_2026_06", "compress_pdf_to_2mb_landing", "Free no-signup PDF compressor for 2MB upload limits.", "A free browser-based PDF compressor for 2MB proposal, school, support, and portal upload limits. It requires no account, keeps ordinary files local, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-pdf-to-5mb", "Compress PDF to 5MB", "pdf_5mb_2026_06", "compress_pdf_to_5mb_landing", "Free no-signup PDF compressor for readable 5MB upload limits.", "A free browser-based PDF compressor for 5MB email, portal, support ticket, and application upload limits. It keeps ordinary files local and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["compress-pdf-to-10mb", "Compress PDF to 10MB", "pdf_10mb_2026_06", "compress_pdf_to_10mb_landing", "Free no-signup PDF compressor for wider 10MB upload limits.", "A free browser-based PDF compressor for 10MB email, support, school, document, and portal upload limits that still reject large scans. It opens the local PDF compressor with a 10MB target, keeps ordinary files on the device, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["pdf-size-reducer", "PDF Size Reducer", "pdf_size_reducer_2026_06", "pdf_size_reducer_hub", "Free no-signup PDF size reducer for exact 500KB, 1MB, 2MB, and 5MB limits.", "A free browser-based PDF size reducer hub for people choosing between 500KB, 1MB, 2MB, and 5MB targets. It routes visitors to local PDF compression paths, requires no account, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["file-must-be-less-than-1mb", "File Must Be Less Than 1MB Fix", "file_under_1mb_upload_fix_2026_06", "file_must_be_less_than_1mb_landing", "Free no-signup fix for file must be less than 1MB upload errors.", "A free browser-based upload error fixer for forms that say a file must be less than 1MB. It routes visitors to local PDF and image size tools, requires no account, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["pdf-must-be-under-100kb", "PDF Must Be Under 100KB Fix", "pdf_under_100kb_upload_fix_2026_06", "pdf_must_be_under_100kb_landing", "Free no-signup PDF under 100KB upload-limit fix.", "A free browser-based PDF under 100KB upload fixer for forms that reject PDFs over 100KB. It routes visitors to local PDF compression with the 100KB target selected, requires no account, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["pdf-must-be-under-200kb", "PDF Must Be Under 200KB Fix", "pdf_under_200kb_upload_fix_2026_06", "pdf_must_be_under_200kb_landing", "Free no-signup PDF under 200KB upload-limit fix.", "A free browser-based PDF under 200KB upload fixer for forms that reject PDFs over 200KB. It routes visitors to local PDF compression with the 200KB target selected, requires no account, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["pdf-must-be-under-300kb", "PDF Must Be Under 300KB Fix", "pdf_under_300kb_upload_fix_2026_06", "pdf_must_be_under_300kb_landing", "Free no-signup PDF under 300KB upload-limit fix.", "A free browser-based PDF under 300KB upload fixer for forms that reject PDFs over 300KB. It routes visitors to local PDF compression with the 300KB target selected, requires no account, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["pdf-must-be-under-500kb", "PDF Must Be Under 500KB Fix", "pdf_under_500kb_upload_fix_2026_06", "pdf_must_be_under_500kb_landing", "Free no-signup PDF under 500KB upload-limit fix.", "A free browser-based PDF under 500KB upload fixer for forms that reject PDFs over 500KB. It routes visitors to local PDF compression, requires no account, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["pdf-must-be-under-10mb", "PDF Must Be Under 10MB Fix", "pdf_under_10mb_upload_fix_2026_06", "pdf_must_be_under_10mb_landing", "Free no-signup PDF under 10MB upload-limit fix.", "A free browser-based PDF under 10MB upload fixer for email, support, school, document, and portal forms that reject large scans. It routes visitors to local PDF compression with the 10MB target selected, requires no account, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-must-be-under-100kb", "Photo Must Be Under 100KB Fix", "photo_under_100kb_upload_fix_2026_06", "photo_must_be_under_100kb_landing", "Free no-signup photo under 100KB upload-limit fix.", "A free browser-based photo under 100KB upload fixer for job, profile, school, and application forms that reject image file size. It keeps ordinary files local and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["image-must-be-under-500kb", "Image Must Be Under 500KB Fix", "image_under_500kb_upload_fix_2026_06", "image_must_be_under_500kb_landing", "Free no-signup image under 500KB upload-limit fix.", "A free browser-based image under 500KB upload fixer for photos, screenshots, avatars, and product images. It runs locally in the browser and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["image-must-be-less-than-2mb", "Image Must Be Less Than 2MB Fix", "image_under_2mb_upload_fix_2026_06", "image_must_be_less_than_2mb_landing", "Free no-signup image under 2MB upload-limit fix.", "A free browser-based image under 2MB upload fixer for profile, marketplace, support, and application forms. It keeps ordinary files local and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["jpg-must-be-under-200kb", "JPG Must Be Under 200KB Fix", "jpg_under_200kb_upload_fix_2026_06", "jpg_must_be_under_200kb_landing", "Free no-signup JPG under 200KB upload-limit fix.", "A free browser-based JPG under 200KB upload fixer for applications, profiles, marketplaces, and school forms. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["png-screenshot-too-large", "PNG Screenshot Too Large Fix", "png_screenshot_too_large_fix_2026_06", "png_screenshot_too_large_landing", "Free no-signup PNG screenshot size fix for upload forms.", "A free browser-based PNG screenshot too large fixer for support forms, admin portals, and upload pages that reject screenshots as too large. It keeps ordinary files local and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-120x160-20kb", "Photo 120x160 Under 20KB", "photo_120x160_20kb_2026_06", "photo_120x160_20kb_landing", "Free no-signup 120 x 160 photo workflow for strict 20KB upload limits.", "A free browser-based 120 x 160 photo under 20KB workflow for exam, school, profile, and application forms that require exact portrait pixels plus a tiny file-size cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-160x200-30kb", "Photo 160x200 Under 30KB", "photo_160x200_30kb_2026_06", "photo_160x200_30kb_landing", "Free no-signup 160 x 200 photo workflow for 30KB upload limits.", "A free browser-based 160 x 200 photo under 30KB workflow for forms that require exact compact portrait pixels plus a strict KB cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-300x400-100kb", "Photo 300x400 Under 100KB", "photo_300x400_100kb_2026_06", "photo_300x400_100kb_landing", "Free no-signup 300 x 400 photo workflow for 100KB upload limits.", "A free browser-based 300 x 400 photo under 100KB workflow for application, school, profile, and admin upload forms that require exact portrait pixels plus a 100KB cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-350x450-100kb", "Photo 350x450 Under 100KB", "photo_350x450_100kb_2026_06", "photo_350x450_100kb_landing", "Free no-signup 350 x 450 photo workflow for 100KB upload limits.", "A free browser-based 350 x 450 photo under 100KB workflow for ID-style, school, application, profile, and admin upload forms that require exact portrait pixels plus a 100KB cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-360x480-100kb", "Photo 360x480 Under 100KB", "photo_360x480_100kb_2026_06", "photo_360x480_100kb_landing", "Free no-signup 360 x 480 photo workflow for 100KB upload limits.", "A free browser-based 360 x 480 photo under 100KB workflow for application, school, profile, and admin upload forms that require exact portrait pixels plus a 100KB cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-420x560-200kb", "Photo 420x560 Under 200KB", "photo_420x560_200kb_2026_06", "photo_420x560_200kb_landing", "Free no-signup 420 x 560 photo workflow for 200KB upload limits.", "A free browser-based 420 x 560 photo under 200KB workflow for application, school, profile, marketplace, and admin upload forms that require exact portrait pixels plus a 200KB cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-200x230-20kb", "Photo 200x230 Under 20KB", "photo_200x230_20kb_2026_06", "photo_200x230_20kb_landing", "Free no-signup 200 x 230 photo workflow for strict 20KB upload limits.", "A free browser-based 200 x 230 photo under 20KB workflow for exam, profile, school, and application portals that require both exact pixels and a tiny file-size cap. It points to local resize and compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-200x230-100kb", "Photo 200x230 Under 100KB", "photo_200x230_100kb_2026_06", "photo_200x230_100kb_landing", "Free no-signup 200 x 230 photo workflow for 100KB upload limits.", "A free browser-based 200 x 230 photo under 100KB workflow for job, profile, school, exam, and application portals that validate both exact pixels and file size. It points to local resize and image-to-KB steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-413x531-100kb", "Photo 413x531 Under 100KB", "photo_413x531_100kb_2026_06", "photo_413x531_100kb_landing", "Free no-signup 413 x 531 photo workflow for 100KB upload limits.", "A free browser-based 413 x 531 photo under 100KB workflow for application, profile, exam, and document upload forms that require exact portrait pixels plus a small KB cap. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-240x320-50kb", "Photo 240x320 Under 50KB", "photo_240x320_50kb_2026_06", "photo_240x320_50kb_landing", "Free no-signup 240 x 320 photo workflow for 50KB upload limits.", "A free browser-based 240 x 320 photo under 50KB workflow for application, exam, school, profile, and admin portals that require exact portrait pixels plus a small KB cap. It points to local resize and image-to-KB steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-295x413-35kb", "Photo 295x413 Under 35KB", "photo_295x413_35kb_2026_06", "photo_295x413_35kb_landing", "Free no-signup 295 x 413 photo workflow for strict 35KB upload limits.", "A free browser-based 295 x 413 photo under 35KB workflow for application, profile, exam, school, and admin upload forms that require exact portrait pixels plus a strict KB cap. It points to local resize and image-to-KB steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-413x531-50kb", "Photo 413x531 Under 50KB", "photo_413x531_50kb_2026_06", "photo_413x531_50kb_landing", "Free no-signup 413 x 531 photo workflow for strict 50KB upload limits.", "A free browser-based 413 x 531 photo under 50KB workflow for application, profile, exam, and document upload forms that require exact portrait pixels plus a strict KB cap. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-354x472-100kb", "Photo 354x472 Under 100KB", "photo_354x472_100kb_2026_06", "photo_354x472_100kb_landing", "Free no-signup 354 x 472 photo workflow for 100KB upload limits.", "A free browser-based 354 x 472 photo under 100KB workflow for application, profile, exam, school, and admin upload forms that require exact portrait pixels plus a 100KB cap. It points to local resize and image-to-KB steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-300x300-100kb", "Photo 300x300 Under 100KB", "photo_300x300_100kb_2026_06", "photo_300x300_100kb_landing", "Free no-signup 300 x 300 square photo workflow for 100KB upload limits.", "A free browser-based 300 x 300 photo under 100KB workflow for profile, job, school, marketplace, and application portals that validate both square pixels and file size. It points to local resize and image-to-KB steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-600x600-100kb", "Photo 600x600 Under 100KB", "photo_600x600_100kb_2026_06", "photo_600x600_100kb_landing", "Free no-signup 600 x 600 square photo workflow for 100KB upload limits.", "A free browser-based 600 x 600 photo under 100KB workflow for profile, school, marketplace, application, and admin upload forms that require exact square pixels plus a small KB cap. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-480x640-200kb", "Photo 480x640 Under 200KB", "photo_480x640_200kb_2026_06", "photo_480x640_200kb_landing", "Free no-signup 480 x 640 photo workflow for 200KB upload limits.", "A free browser-based 480 x 640 photo under 200KB workflow for application, profile, school, marketplace, and admin upload forms that require exact portrait pixels plus a moderate KB cap. It points to local resize and image-to-KB steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-512x512-100kb", "Photo 512x512 Under 100KB", "photo_512x512_100kb_2026_06", "photo_512x512_100kb_landing", "Free no-signup 512 x 512 square photo workflow for 100KB upload limits.", "A free browser-based 512 x 512 photo under 100KB workflow for profile, application, school, marketplace, and admin upload forms that require exact square pixels plus a 100KB cap. It points to local resize and image-to-KB steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-140x60-20kb", "Signature 140x60 Under 20KB", "signature_140x60_20kb_2026_06", "signature_140x60_20kb_landing", "Free no-signup 140 x 60 signature workflow for strict 20KB upload limits.", "A free browser-based 140 x 60 signature under 20KB workflow for exam, job, school, and admin upload pages that require both exact signature dimensions and a tiny file-size cap. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-140x60-50kb", "Signature 140x60 Under 50KB", "signature_140x60_50kb_2026_06", "signature_140x60_50kb_landing", "Free no-signup 140 x 60 signature workflow for 50KB upload limits.", "A free browser-based 140 x 60 signature under 50KB workflow for application, school, job, and admin forms that require exact signature dimensions plus a small KB cap. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-200x100-50kb", "Signature 200x100 Under 50KB", "signature_200x100_50kb_2026_06", "signature_200x100_50kb_landing", "Free no-signup 200 x 100 signature workflow for 50KB upload limits.", "A free browser-based 200 x 100 signature under 50KB workflow for job, exam, document, and admin upload pages that require a wider signature image plus a small KB cap. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-150x50-20kb", "Signature 150x50 Under 20KB", "signature_150x50_20kb_2026_06", "signature_150x50_20kb_landing", "Free no-signup 150 x 50 signature workflow for strict 20KB upload limits.", "A free browser-based 150 x 50 signature under 20KB workflow for exam, job, school, bank, and admin upload pages that require both exact signature dimensions and a tiny file-size cap. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-160x70-20kb", "Signature 160x70 Under 20KB", "signature_160x70_20kb_2026_06", "signature_160x70_20kb_landing", "Free no-signup 160 x 70 signature workflow for strict 20KB upload limits.", "A free browser-based 160 x 70 signature under 20KB workflow for exam, job, school, bank, and admin upload pages that require exact signature dimensions plus a tiny file-size cap. It points to local resize and compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-200x50-20kb", "Signature 200x50 Under 20KB", "signature_200x50_20kb_2026_06", "signature_200x50_20kb_landing", "Free no-signup 200 x 50 signature workflow for strict 20KB upload limits.", "A free browser-based 200 x 50 signature under 20KB workflow for exam, job, school, bank, and admin upload pages that require both exact signature dimensions and a tiny file-size cap. It points to local resize and compression steps and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-250x80-50kb", "Signature 250x80 Under 50KB", "signature_250x80_50kb_2026_06", "signature_250x80_50kb_landing", "Free no-signup 250 x 80 signature workflow for 50KB upload limits.", "A free browser-based 250 x 80 signature under 50KB workflow for application, school, job, bank, and admin forms that require exact signature dimensions plus a small KB cap. It points to local resize and compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-300x60-20kb", "Signature 300x60 Under 20KB", "signature_300x60_20kb_2026_06", "signature_300x60_20kb_landing", "Free no-signup 300 x 60 signature workflow for strict 20KB upload limits.", "A free browser-based 300 x 60 signature under 20KB workflow for exam, job, school, bank, and admin upload pages that require a wide signature image plus a tiny KB cap. It points to local resize and compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-300x80-50kb", "Signature 300x80 Under 50KB", "signature_300x80_50kb_2026_06", "signature_300x80_50kb_landing", "Free no-signup 300 x 80 signature workflow for 50KB upload limits.", "A free browser-based 300 x 80 signature under 50KB workflow for application, school, job, bank, and admin forms that require exact signature dimensions plus a small KB cap. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-300x100-50kb", "Signature 300x100 Under 50KB", "signature_300x100_50kb_2026_06", "signature_300x100_50kb_landing", "Free no-signup 300 x 100 signature workflow for 50KB upload limits.", "A free browser-based 300 x 100 signature under 50KB workflow for job, exam, school, bank, document, and admin upload pages that require a wide signature image plus a small KB cap. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-400x150-50kb", "Signature 400x150 Under 50KB", "signature_400x150_50kb_2026_06", "signature_400x150_50kb_landing", "Free no-signup 400 x 150 signature workflow for 50KB upload limits.", "A free browser-based 400 x 150 signature under 50KB workflow for document, job, school, bank, and admin upload pages that require a large signature image plus a small KB cap. It points to local resize and compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-150x200-20kb", "Photo 150x200 Under 20KB", "photo_150x200_20kb_2026_06", "photo_150x200_20kb_landing", "Free no-signup 150 x 200 photo workflow for strict 20KB upload limits.", "A free browser-based 150 x 200 photo under 20KB workflow for forms that require exact portrait pixels plus a tiny file-size cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-180x240-50kb", "Photo 180x240 Under 50KB", "photo_180x240_50kb_2026_06", "photo_180x240_50kb_landing", "Free no-signup 180 x 240 photo workflow for 50KB upload limits.", "A free browser-based 180 x 240 photo under 50KB workflow for application, school, profile, and exam portals that require exact portrait pixels plus a small KB cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-400x514-100kb", "Photo 400x514 Under 100KB", "photo_400x514_100kb_2026_06", "photo_400x514_100kb_landing", "Free no-signup 400 x 514 photo workflow for 100KB upload limits.", "A free browser-based 400 x 514 photo under 100KB workflow for portals that require exact portrait pixels plus a 100KB cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["photo-600x800-200kb", "Photo 600x800 Under 200KB", "photo_600x800_200kb_2026_06", "photo_600x800_200kb_landing", "Free no-signup 600 x 800 photo workflow for 200KB upload limits.", "A free browser-based 600 x 800 photo under 200KB workflow for application, school, profile, and admin upload pages that require exact portrait pixels plus a moderate KB cap. It points to local resize and image-to-KB compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-100x50-10kb", "Signature 100x50 Under 10KB", "signature_100x50_10kb_2026_06", "signature_100x50_10kb_landing", "Free no-signup 100 x 50 signature workflow for strict 10KB upload limits.", "A free browser-based 100 x 50 signature under 10KB workflow for forms that require a small signature image plus an extremely tight KB cap. It points to local resize and compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-200x60-20kb", "Signature 200x60 Under 20KB", "signature_200x60_20kb_2026_06", "signature_200x60_20kb_landing", "Free no-signup 200 x 60 signature workflow for strict 20KB upload limits.", "A free browser-based 200 x 60 signature under 20KB workflow for job, school, exam, bank, and admin upload pages that require exact signature dimensions plus a tiny KB cap. It points to local resize and compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-256x64-20kb", "Signature 256x64 Under 20KB", "signature_256x64_20kb_2026_06", "signature_256x64_20kb_landing", "Free no-signup 256 x 64 signature workflow for strict 20KB upload limits.", "A free browser-based 256 x 64 signature under 20KB workflow for portals that validate both exact signature pixels and a strict file-size cap. It points to local resize and compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
  ["signature-400x200-100kb", "Signature 400x200 Under 100KB", "signature_400x200_100kb_2026_06", "signature_400x200_100kb_landing", "Free no-signup 400 x 200 signature workflow for 100KB upload limits.", "A free browser-based 400 x 200 signature under 100KB workflow for document, job, school, bank, and admin upload pages that require a large signature image plus a 100KB cap. It points to local resize and compression steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check."],
];

const backlog = [
  {
    report: "nosignuptools-image-dimensions-600x600-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/image-dimensions-600x600-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Image+Dimensions+600x600+Upload+Fix",
    payload: {
      ...common,
      name: "Image Dimensions 600x600 Upload Fix by PrintableTools Lab",
      slug: "image-dimensions-600x600-upload-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/image-dimensions-600x600/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=image_dimensions_600x600_fix_2026_06&utm_content=image_dimensions_600x600_landing",
      category: "productivity",
      short_description: "Free no-signup 600 x 600 image resize and crop fix for blocked upload forms.",
      long_description: "A free browser-based 600 x 600 image resize and crop fixer for people blocked by school forms, profile photos, marketplace listings, and application portals that require exact square dimensions. It points to local resize, crop, and image compression tools, requires no account and no server file upload, and includes an optional USD 9 manual upload fix-plan request only after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-pdf-not-accepted-jpg-required-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/pdf-not-accepted-jpg-required-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=PDF+Not+Accepted+JPG+Required+Fix",
    payload: {
      ...common,
      name: "PDF Not Accepted JPG Required Fix by PrintableTools Lab",
      slug: "pdf-not-accepted-jpg-required-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/pdf-not-accepted-jpg-required/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=pdf_not_accepted_jpg_required_fix_2026_06&utm_content=pdf_to_jpg_required_landing",
      category: "productivity",
      short_description: "Free no-signup PDF to JPG or PNG fix for upload forms that reject PDFs.",
      long_description: "A free browser-based PDF not accepted JPG required fixer for people whose portal rejects a PDF but accepts JPG, JPEG, PNG, or another image upload. It points to local PDF-to-image conversion and image compression tools, requires no account and no server file upload, and includes an optional USD 9 manual upload fix-plan request only after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-compress-image-to-kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-image-to-kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+to+KB",
    payload: {
      ...common,
      name: "Compress Image to KB by PrintableTools Lab",
      slug: "compress-image-to-kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/tools/compress-image-to-kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=compress_image_kb_invoice_first_2026_06&utm_content=compress_image_kb_tool",
      category: "productivity",
      short_description: "Free no-signup image-to-KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based image-to-KB compressor for people whose forms, portals, profiles, or applications reject photos over a target size. It works without an account or server upload and now exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-email-attachment-too-large-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/email-attachment-too-large-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Email+Attachment+Too+Large+Fix",
    payload: {
      ...common,
      name: "Email Attachment Too Large Fix by PrintableTools Lab",
      slug: "email-attachment-too-large-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/email-attachment-too-large/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=email_attachment_too_large_fix_2026_06&utm_content=email_attachment_too_large_landing",
      category: "productivity",
      short_description: "Free no-signup PDF and image attachment-size fix for email upload limits.",
      long_description: "A free browser-based email attachment too large fixer for Gmail, Outlook, webmail, and inbox size errors. It points to PDF compression and image-to-KB tools without an account or server upload and includes an optional USD 9 Upload Limit Fix Plan request for public-safe target settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-pdf-under-2mb-upload-fix-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/pdf-under-2mb-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=PDF+Under+2MB+Upload+Fix",
    payload: {
      ...common,
      name: "PDF Under 2MB Upload Fix by PrintableTools Lab",
      slug: "pdf-under-2mb-upload-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/pdf-must-be-under-2mb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=pdf_under_2mb_upload_fix_2026_06&utm_content=pdf_must_be_under_2mb_landing",
      category: "productivity",
      short_description: "Free no-signup PDF compressor for 2MB upload limits with an optional USD 9 upload fix-plan request.",
      long_description: "A free browser-based PDF under 2MB upload fixer for proposal, application, school, admin, and portal PDF size errors. It points to local PDF compression, requires no account and no server file upload, and includes an optional USD 9 manual Upload Limit Fix Plan request only after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-pdf-under-5mb-upload-fix-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/pdf-under-5mb-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=PDF+Under+5MB+Upload+Fix",
    payload: {
      ...common,
      name: "PDF Under 5MB Upload Fix by PrintableTools Lab",
      slug: "pdf-under-5mb-upload-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/pdf-must-be-under-5mb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=pdf_under_5mb_upload_fix_2026_06&utm_content=pdf_must_be_under_5mb_landing",
      category: "productivity",
      short_description: "Free no-signup PDF compressor for 5MB upload limits with an optional USD 9 upload fix-plan request.",
      long_description: "A free browser-based PDF under 5MB upload fixer for scanned documents, school forms, application portals, admin uploads, and email-style PDF size errors. It points to local PDF compression, requires no account and no server file upload, and includes an optional USD 9 manual Upload Limit Fix Plan request only after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-resume-pdf-under-2mb-upload-fix-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/resume-pdf-under-2mb-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resume+PDF+Under+2MB+Upload+Fix",
    payload: {
      ...common,
      name: "Resume PDF Under 2MB Upload Fix by PrintableTools Lab",
      slug: "resume-pdf-under-2mb-upload-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/resume-pdf-under-2mb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=resume_pdf_under_2mb_upload_fix_2026_06&utm_content=resume_pdf_under_2mb_landing",
      category: "productivity",
      short_description: "Free no-signup resume PDF compressor for 2MB job-portal upload limits.",
      long_description: "A free browser-based resume PDF under 2MB upload fixer for applicant tracking systems, career portals, and job application forms that reject large resume PDFs. It points to local PDF compression, requires no account and no server file upload, and includes an optional USD 9 manual Upload Limit Fix Plan request only after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-document-under-5mb-upload-fix-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/document-under-5mb-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Document+Under+5MB+Upload+Fix",
    payload: {
      ...common,
      name: "Document Under 5MB Upload Fix by PrintableTools Lab",
      slug: "document-under-5mb-upload-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/document-must-be-under-5mb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=document_under_5mb_upload_fix_2026_06&utm_content=document_must_be_under_5mb_landing",
      category: "productivity",
      short_description: "Free no-signup document PDF compressor for 5MB upload limits.",
      long_description: "A free browser-based document under 5MB upload fixer for scanned PDFs, document portals, application forms, and admin uploads that reject files over 5MB. It points to local PDF compression, requires no account and no server file upload, and includes an optional USD 9 manual Upload Limit Fix Plan request only after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-compress-image-to-50kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-image-to-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+to+50KB",
    payload: {
      ...common,
      name: "Compress Image to 50KB by PrintableTools Lab",
      slug: "compress-image-to-50kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-image-to-50kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=image_50kb_2026_06&utm_content=compress_image_to_50kb_landing",
      category: "productivity",
      short_description: "Free no-signup 50KB image compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based image compressor for strict 50KB upload limits, passport-style photos, forms, and application portals. It works without an account or server upload and now exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-compress-image-to-100kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-image-to-100kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+to+100KB",
    payload: {
      ...common,
      name: "Compress Image to 100KB by PrintableTools Lab",
      slug: "compress-image-to-100kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-image-to-100kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=image_100kb_2026_06&utm_content=compress_image_to_100kb_landing",
      category: "productivity",
      short_description: "Free no-signup 100KB image compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based image compressor for 100KB photo upload limits on job portals, school forms, profile pages, and applications. It works without an account or server upload and now exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-compress-image-to-200kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-image-to-200kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+to+200KB",
    payload: {
      ...common,
      name: "Compress Image to 200KB by PrintableTools Lab",
      slug: "compress-image-to-200kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-image-to-200kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=image_200kb_2026_06&utm_content=compress_image_to_200kb_landing",
      category: "productivity",
      short_description: "Free no-signup 200KB image compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based image compressor for 200KB JPG, PNG, portal, and form upload limits. It works without an account or server upload and now exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-compress-jpg-to-50kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-jpg-to-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+JPG+to+50KB",
    payload: {
      ...common,
      name: "Compress JPG to 50KB by PrintableTools Lab",
      slug: "compress-jpg-to-50kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-jpg-to-50kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=jpg_50kb_2026_06&utm_content=compress_jpg_to_50kb_landing",
      category: "productivity",
      short_description: "Free no-signup JPG 50KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based JPG compressor for strict 50KB upload limits on forms, profiles, passport-style photos, and applications. It works without an account or server upload and exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-compress-jpg-to-100kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-jpg-to-100kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+JPG+to+100KB",
    payload: {
      ...common,
      name: "Compress JPG to 100KB by PrintableTools Lab",
      slug: "compress-jpg-to-100kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-jpg-to-100kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=jpg_100kb_2026_06&utm_content=compress_jpg_to_100kb_landing",
      category: "productivity",
      short_description: "Free no-signup JPG 100KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based JPG compressor for 100KB job portal, profile, school, and application upload limits. It works without an account or server upload and exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-compress-jpg-to-200kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-jpg-to-200kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+JPG+to+200KB",
    payload: {
      ...common,
      name: "Compress JPG to 200KB by PrintableTools Lab",
      slug: "compress-jpg-to-200kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-jpg-to-200kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=jpg_200kb_2026_06&utm_content=compress_jpg_to_200kb_landing",
      category: "productivity",
      short_description: "Free no-signup JPG 200KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based JPG compressor for 200KB portal, marketplace, profile, and application upload limits. It works without an account or server upload and exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-compress-png-to-50kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-png-to-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+PNG+to+50KB",
    payload: {
      ...common,
      name: "Compress PNG to 50KB by PrintableTools Lab",
      slug: "compress-png-to-50kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-png-to-50kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=png_50kb_2026_06&utm_content=compress_png_to_50kb_landing",
      category: "productivity",
      short_description: "Free no-signup PNG 50KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based PNG compressor for strict 50KB screenshots, icons, document scans, and application upload limits. It works without an account or server upload and exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-compress-png-to-100kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-png-to-100kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+PNG+to+100KB",
    payload: {
      ...common,
      name: "Compress PNG to 100KB by PrintableTools Lab",
      slug: "compress-png-to-100kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-png-to-100kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=png_100kb_2026_06&utm_content=compress_png_to_100kb_landing",
      category: "productivity",
      short_description: "Free no-signup PNG 100KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based PNG compressor for 100KB screenshots, school forms, profile uploads, and application portals. It works without an account or server upload and exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-compress-png-to-200kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-png-to-200kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+PNG+to+200KB",
    payload: {
      ...common,
      name: "Compress PNG to 200KB by PrintableTools Lab",
      slug: "compress-png-to-200kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-png-to-200kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=png_200kb_2026_06&utm_content=compress_png_to_200kb_landing",
      category: "productivity",
      short_description: "Free no-signup PNG 200KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based PNG compressor for 200KB screenshots, scans, document images, and portal upload limits. It works without an account or server upload and exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-passport-photo-compress-to-50kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/passport-photo-compress-to-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+Compress+to+50KB",
    payload: {
      ...common,
      name: "Passport Photo Compress to 50KB by PrintableTools Lab",
      slug: "passport-photo-compress-to-50kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/passport-photo-compress-to-50kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=passport_50kb_2026_06&utm_content=passport_photo_compress_to_50kb_landing",
      category: "productivity",
      short_description: "Free no-signup passport photo 50KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based passport photo compressor for strict 50KB application, visa, exam, school, and document upload limits. It works without an account or server upload and exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-passport-photo-compress-to-100kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/passport-photo-compress-to-100kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+Compress+to+100KB",
    payload: {
      ...common,
      name: "Passport Photo Compress to 100KB by PrintableTools Lab",
      slug: "passport-photo-compress-to-100kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/passport-photo-compress-to-100kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=passport_100kb_2026_06&utm_content=passport_photo_compress_to_100kb_landing",
      category: "productivity",
      short_description: "Free no-signup passport photo 100KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based passport photo compressor for 100KB application, visa, exam, school, and document upload limits. It works without an account or server upload and exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-passport-photo-compress-to-200kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/passport-photo-compress-to-200kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+Compress+to+200KB",
    payload: {
      ...common,
      name: "Passport Photo Compress to 200KB by PrintableTools Lab",
      slug: "passport-photo-compress-to-200kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/passport-photo-compress-to-200kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=passport_200kb_2026_06&utm_content=passport_photo_compress_to_200kb_landing",
      category: "productivity",
      short_description: "Free no-signup passport photo 200KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based passport photo compressor for 200KB application, visa, exam, school, and document upload limits. It works without an account or server upload and exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact public-safe settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-extract-text-from-pdf-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/extract-text-from-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Extract+Text+From+PDF+Without+Uploading",
    payload: {
      ...common,
      name: "Extract Text From PDF Without Uploading by PrintableTools Lab",
      slug: "extract-text-from-pdf-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/extract-text-from-pdf-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=extract_text_pdf_no_upload_2026_06&utm_content=extract_text_pdf_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser PDF text extractor for notes, forms, resumes, and drafts.",
      long_description: "A free browser-based PDF text extractor for people who need to copy text from PDFs, resumes, support files, application documents, notes, or simple document exports. It requires no account, keeps ordinary files local during use, and connects upload-limit visitors to an optional USD 9 Upload Limit Fix Plan request only after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-merge-pdf-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/merge-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Merge+PDF+Without+Uploading",
    payload: {
      ...common,
      name: "Merge PDF Without Uploading by PrintableTools Lab",
      slug: "merge-pdf-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/merge-pdf-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=merge_pdf_no_upload_2026_06&utm_content=merge_pdf_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser PDF merger for combining documents before upload.",
      long_description: "A free browser-based PDF merger for combining application pages, receipts, scans, forms, invoices, notes, and document packets into one PDF. It requires no account, keeps ordinary files local during use, and includes practical upload-size checks plus an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-split-pdf-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/split-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Split+PDF+Without+Uploading",
    payload: {
      ...common,
      name: "Split PDF Without Uploading by PrintableTools Lab",
      slug: "split-pdf-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/split-pdf-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=split_pdf_no_upload_2026_06&utm_content=split_pdf_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser PDF splitter for removing or separating pages.",
      long_description: "A free browser-based PDF splitter for separating pages, trimming document packets, pulling one form from a multi-page file, or preparing smaller upload-ready PDFs. It requires no account, keeps ordinary files local during use, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-rotate-pdf-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/rotate-pdf-pages-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Rotate+PDF+Pages+Without+Uploading",
    payload: {
      ...common,
      name: "Rotate PDF Pages Without Uploading by PrintableTools Lab",
      slug: "rotate-pdf-pages-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/rotate-pdf-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=rotate_pdf_no_upload_2026_06&utm_content=rotate_pdf_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser PDF page rotator for sideways scans and forms.",
      long_description: "A free browser-based PDF page rotator for fixing sideways scans, forms, notes, packets, and document uploads. It requires no account, keeps ordinary files local during use, and helps users prepare cleaner upload-ready PDFs before sharing or submitting them.",
    },
  },
  {
    report: "nosignuptools-remove-pages-from-pdf-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/remove-pages-from-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Remove+Pages+From+PDF+Without+Uploading",
    payload: {
      ...common,
      name: "Remove Pages From PDF Without Uploading by PrintableTools Lab",
      slug: "remove-pages-from-pdf-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/remove-pages-from-pdf-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=remove_pages_pdf_no_upload_2026_06&utm_content=remove_pages_pdf_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser PDF page remover for trimming extra pages before upload.",
      long_description: "A free browser-based PDF page remover for deleting blank pages, extra scans, unneeded covers, and private pages before uploading a document. It requires no account, keeps ordinary files local during use, and helps reduce upload risk and file size before submission.",
    },
  },
  {
    report: "nosignuptools-reorder-pdf-pages-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/reorder-pdf-pages-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Reorder+PDF+Pages+Without+Uploading",
    payload: {
      ...common,
      name: "Reorder PDF Pages Without Uploading by PrintableTools Lab",
      slug: "reorder-pdf-pages-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/reorder-pdf-pages-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=reorder_pdf_pages_no_upload_2026_06&utm_content=reorder_pdf_pages_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser PDF page reorder tool for arranging packets.",
      long_description: "A free browser-based PDF page reorder tool for arranging application packets, scans, forms, receipts, and document bundles before upload. It requires no account, keeps ordinary files local during use, and helps users prepare correctly ordered PDFs without a full PDF editor.",
    },
  },
  {
    report: "nosignuptools-add-page-numbers-to-pdf-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/add-page-numbers-to-pdf-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Add+Page+Numbers+to+PDF",
    payload: {
      ...common,
      name: "Add Page Numbers to PDF by PrintableTools Lab",
      slug: "add-page-numbers-to-pdf-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/add-page-numbers-to-pdf/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=add_page_numbers_pdf_2026_06&utm_content=add_page_numbers_pdf_landing",
      category: "productivity",
      short_description: "Free no-signup browser tool for adding simple page numbers to a PDF.",
      long_description: "A free browser-based PDF page numbering tool for reports, packets, forms, drafts, handouts, and document reviews. It requires no account, keeps ordinary files local during use, and helps users make multi-page PDFs easier to reference before sharing or uploading.",
    },
  },
  {
    report: "nosignuptools-stamp-pdf-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/stamp-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Stamp+PDF+Without+Uploading",
    payload: {
      ...common,
      name: "Stamp PDF Without Uploading by PrintableTools Lab",
      slug: "stamp-pdf-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/stamp-pdf-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=stamp_pdf_no_upload_2026_06&utm_content=stamp_pdf_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser PDF stamp tool for labels, notes, and draft marks.",
      long_description: "A free browser-based PDF stamping tool for adding simple draft marks, labels, notes, received stamps, or status text before sharing a document. It requires no account, keeps ordinary files local during use, and helps users prepare clearer PDFs without a full PDF editor.",
    },
  },
  {
    report: "nosignuptools-sign-pdf-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/sign-pdf-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Sign+PDF+Without+Uploading",
    payload: {
      ...common,
      name: "Sign PDF Without Uploading by PrintableTools Lab",
      slug: "sign-pdf-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/sign-pdf-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=sign_pdf_no_upload_2026_06&utm_content=sign_pdf_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser PDF signing helper for simple signature text placement.",
      long_description: "A free browser-based PDF signing helper for placing simple signature text, names, initials, or approval notes on a PDF before sharing. It requires no account, keeps ordinary files local during use, and gives users a quick lightweight option for non-legal, low-risk document marking.",
    },
  },
  {
    report: "nosignuptools-compress-image-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+Without+Uploading",
    payload: {
      ...common,
      name: "Compress Image Without Uploading by PrintableTools Lab",
      slug: "compress-image-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/compress-image-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=compress_image_no_upload_2026_06&utm_content=compress_image_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser image compressor that keeps ordinary files local.",
      long_description: "A free browser-based image compressor for people who need smaller JPG, PNG, WebP, profile photos, screenshots, and form uploads without creating an account or sending ordinary files to a server. It helps users test quality and target size locally before sharing, submitting, or requesting a public-safe upload fix plan.",
    },
  },
  {
    report: "nosignuptools-resize-image-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/resize-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Image+Without+Uploading",
    payload: {
      ...common,
      name: "Resize Image Without Uploading by PrintableTools Lab",
      slug: "resize-image-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/resize-image-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=resize_image_no_upload_2026_06&utm_content=resize_image_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser image resizer for exact pixel dimensions.",
      long_description: "A free browser-based image resizer for profile photos, school forms, marketplace images, support screenshots, and application portals that ask for exact pixel dimensions. It requires no account, keeps ordinary files local during use, and helps users prepare upload-ready images quickly.",
    },
  },
  {
    report: "nosignuptools-convert-image-format-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/convert-image-format-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Convert+Image+Format+Without+Uploading",
    payload: {
      ...common,
      name: "Convert Image Format Without Uploading by PrintableTools Lab",
      slug: "convert-image-format-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/convert-image-format-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=convert_image_format_no_upload_2026_06&utm_content=convert_image_format_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser image converter for JPG, PNG, and WebP-style workflows.",
      long_description: "A free browser-based image format converter for upload forms that require JPG, PNG, or a smaller web-friendly image file. It requires no account, keeps ordinary files local during use, and helps users fix invalid image type errors before submitting to portals.",
    },
  },
  {
    report: "nosignuptools-remove-background-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/remove-background-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Remove+Background+Without+Uploading",
    payload: {
      ...common,
      name: "Remove Background Without Uploading by PrintableTools Lab",
      slug: "remove-background-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/remove-background-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=remove_background_no_upload_2026_06&utm_content=remove_background_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup transparent PNG helper for simple image backgrounds.",
      long_description: "A free browser-based background removal helper for simple product photos, logos, signatures, and profile graphics. It requires no account, keeps ordinary files local during use, and gives users a lightweight transparent PNG workflow before posting or uploading images.",
    },
  },
  {
    report: "nosignuptools-crop-image-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/crop-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Crop+Image+Without+Uploading",
    payload: {
      ...common,
      name: "Crop Image Without Uploading by PrintableTools Lab",
      slug: "crop-image-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/crop-image-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=crop_image_no_upload_2026_06&utm_content=crop_image_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser crop tool for profile photos, forms, and product images.",
      long_description: "A free browser-based crop tool for profile photos, document images, support screenshots, marketplace photos, and application portals that require a tighter image area. It requires no account, keeps ordinary files local during use, and helps users prepare cleaner upload-ready images.",
    },
  },
  {
    report: "nosignuptools-rotate-image-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/rotate-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Rotate+Image+Without+Uploading",
    payload: {
      ...common,
      name: "Rotate Image Without Uploading by PrintableTools Lab",
      slug: "rotate-image-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/rotate-image-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=rotate_image_no_upload_2026_06&utm_content=rotate_image_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser image rotator for sideways photos and scans.",
      long_description: "A free browser-based image rotator for sideways photos, scans, screenshots, receipts, and document images. It requires no account, keeps ordinary files local during use, and helps users fix orientation before upload or sharing.",
    },
  },
  {
    report: "nosignuptools-watermark-image-no-upload-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/watermark-image-without-uploading-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Watermark+Image+Without+Uploading",
    payload: {
      ...common,
      name: "Watermark Image Without Uploading by PrintableTools Lab",
      slug: "watermark-image-without-uploading-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/watermark-image-no-upload/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=watermark_image_no_upload_2026_06&utm_content=watermark_image_no_upload_landing",
      category: "productivity",
      short_description: "Free no-signup browser watermark tool for simple image labels.",
      long_description: "A free browser-based image watermark tool for adding simple text labels, draft marks, source notes, shop names, or proof marks before posting or sharing an image. It requires no account, keeps ordinary files local during use, and gives users a quick lightweight editing step.",
    },
  },
  {
    report: "nosignuptools-passport-photo-size-fixer-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/passport-photo-size-fixer-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+Size+Fixer",
    payload: {
      ...common,
      name: "Passport Photo Size Fixer by PrintableTools Lab",
      slug: "passport-photo-size-fixer-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/passport-photo-size-fixer/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=passport_photo_size_fixer_2026_06&utm_content=passport_photo_size_fixer_landing",
      category: "productivity",
      short_description: "Free no-signup passport photo resize and KB fix workflow for upload forms.",
      long_description: "A free browser-based passport photo size fixer for people blocked by ID-style crop, dimension, and file-size rules. It points to local crop, resize, and compression tools, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-resize-photo-413x531-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/resize-photo-413x531-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Photo+413x531",
    payload: {
      ...common,
      name: "Resize Photo 413x531 by PrintableTools Lab",
      slug: "resize-photo-413x531-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/resize-photo-413x531/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=resize_photo_413x531_2026_06&utm_content=resize_photo_413x531_landing",
      category: "productivity",
      short_description: "Free no-signup 413 x 531 photo resize workflow for strict upload forms.",
      long_description: "A free browser-based 413 x 531 photo resize helper for application, profile, exam, admin, and document upload forms that validate exact pixel dimensions. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-passport-photo-35x45mm-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/passport-photo-35x45mm-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Passport+Photo+35x45mm",
    payload: {
      ...common,
      name: "Passport Photo 35x45mm by PrintableTools Lab",
      slug: "passport-photo-35x45mm-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/passport-photo-35x45mm/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=passport_photo_35x45mm_2026_06&utm_content=passport_photo_35x45mm_landing",
      category: "productivity",
      short_description: "Free no-signup 35 x 45 mm passport-style photo workflow.",
      long_description: "A free browser-based passport photo 35 x 45 mm workflow for forms that ask for a common ID-style photo shape before file-size checks. It routes visitors to local crop and resize steps, requires no account and no server file upload, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-photo-200x230-50kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/photo-200x230-under-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Photo+200x230+Under+50KB",
    payload: {
      ...common,
      name: "Photo 200x230 Under 50KB by PrintableTools Lab",
      slug: "photo-200x230-under-50kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/photo-200x230-50kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=photo_200x230_50kb_2026_06&utm_content=photo_200x230_50kb_landing",
      category: "productivity",
      short_description: "Free no-signup 200 x 230 photo and 50KB upload workflow.",
      long_description: "A free browser-based 200 x 230 photo under 50KB workflow for exam, job, profile, school, and application portals that require both exact pixels and a small file-size cap. It points to local resize and compression steps and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-resize-photo-200x230-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/resize-photo-200x230-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Photo+200x230",
    payload: {
      ...common,
      name: "Resize Photo 200x230 by PrintableTools Lab",
      slug: "resize-photo-200x230-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/resize-photo-200x230/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=resize_photo_200x230_2026_06&utm_content=resize_photo_200x230_landing",
      category: "productivity",
      short_description: "Free no-signup 200 x 230 photo resize workflow for upload forms.",
      long_description: "A free browser-based 200 x 230 photo resize helper for exam, job, profile, school, and application upload forms that validate exact pixel dimensions. It opens a local resize workflow, keeps ordinary files on the device, and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-signature-under-20kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/signature-under-20kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Signature+Under+20KB",
    payload: {
      ...common,
      name: "Signature Under 20KB by PrintableTools Lab",
      slug: "signature-under-20kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/signature-under-20kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=signature_20kb_upload_fix_2026_06&utm_content=signature_under_20kb_landing",
      category: "productivity",
      short_description: "Free no-signup signature image compressor for strict 20KB upload limits.",
      long_description: "A free browser-based signature under 20KB compressor for tiny scanned signature, exam form, job portal, admin, and application upload caps. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-signature-under-50kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/signature-under-50kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Signature+Under+50KB",
    payload: {
      ...common,
      name: "Signature Under 50KB by PrintableTools Lab",
      slug: "signature-under-50kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/signature-under-50kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=signature_50kb_upload_fix_2026_06&utm_content=signature_under_50kb_landing",
      category: "productivity",
      short_description: "Free no-signup signature image compressor for 50KB upload limits.",
      long_description: "A free browser-based signature under 50KB compressor for scanned signature, school portal, job application, admin form, and document upload caps. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-resize-signature-140x60-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/resize-signature-140x60-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Signature+140x60",
    payload: {
      ...common,
      name: "Resize Signature 140x60 by PrintableTools Lab",
      slug: "resize-signature-140x60-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/resize-signature-140x60/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=resize_signature_140x60_2026_06&utm_content=resize_signature_140x60_landing",
      category: "productivity",
      short_description: "Free no-signup 140 x 60 signature resize workflow for upload forms.",
      long_description: "A free browser-based 140 x 60 signature resize helper for exam, job, school, and admin upload pages that require exact signature image dimensions. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-resize-signature-200x100-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/resize-signature-200x100-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Resize+Signature+200x100",
    payload: {
      ...common,
      name: "Resize Signature 200x100 by PrintableTools Lab",
      slug: "resize-signature-200x100-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/resize-signature-200x100/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=resize_signature_200x100_2026_06&utm_content=resize_signature_200x100_landing",
      category: "productivity",
      short_description: "Free no-signup 200 x 100 signature resize workflow for upload forms.",
      long_description: "A free browser-based 200 x 100 signature resize helper for job, school, exam, document, and admin upload pages that require a wider signature image. It keeps ordinary files local during use and includes an optional USD 9 Upload Limit Fix Plan request after a public-safe fit check.",
    },
  },
  ...exactUploadLimitBacklog.map(([pathName, name, campaign, content, short_description, long_description]) => ({
    report: `nosignuptools-${pathName}-submit.json`,
    expectedReviewUrl: `https://nosignuptools.com/tools/${slugify(name)}-by-printabletools-lab`,
    searchUrl: `https://nosignuptools.com/?q=${encodeURIComponent(name).replace(/%20/g, "+")}`,
    payload: {
      ...common,
      name: `${name} by PrintableTools Lab`,
      slug: `${slugify(name)}-by-printabletools-lab`,
      url: `https://printable-tools-lab.pages.dev/${pathName}/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=${campaign}&utm_content=${content}`,
      category: "productivity",
      short_description,
      long_description,
    },
  })),
];

async function main() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const results = [];

  for (const item of backlog) {
    const result = await submitOrSkip(item);
    results.push(result);
    if (!result.skipped) await delay(3000);
  }

  console.log(JSON.stringify({ ok: results.every((item) => item.ok || item.skipped), results }, null, 2));
  if (results.some((item) => !item.ok && !item.skipped)) process.exitCode = 1;
}

async function submitOrSkip(item) {
  const reportPath = path.join(reportsDir, item.report);
  const existing = readJson(reportPath);
  if (existing && existing.ok) {
    return { report: item.report, skipped: true, reason: "existing_api_acceptance", expectedReviewUrl: existing.expectedReviewUrl };
  }

  const preSubmitEvidence = {
    expectedReviewUrl: await checkUrl(item.expectedReviewUrl),
    searchUrl: await checkUrl(item.searchUrl),
  };

  if (preSubmitEvidence.expectedReviewUrl.status === 200 && preSubmitEvidence.expectedReviewUrl.matched) {
    const report = {
      generatedAt: new Date().toISOString(),
      directory: "NoSignupTools",
      endpoint,
      status: 200,
      ok: true,
      skipped: true,
      result: "already_public_before_submit",
      preSubmitEvidence,
      payload: item.payload,
      response: { success: true },
      reviewStatus: "already_public",
      reviewWindow: "",
      expectedReviewUrl: item.expectedReviewUrl,
    };
    writeReport(item.report, report);
    return { report: item.report, skipped: true, reason: "already_public_before_submit", expectedReviewUrl: item.expectedReviewUrl };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item.payload),
  });
  const body = await response.json().catch(async () => ({ raw: await response.text().catch(() => "") }));
  const accepted = response.ok && body?.success === true;
  const report = {
    generatedAt: new Date().toISOString(),
    directory: "NoSignupTools",
    endpoint,
    status: response.status,
    ok: accepted,
    preSubmitEvidence: {
      expectedReviewUrlStatus: preSubmitEvidence.expectedReviewUrl.status,
      searchMatchedExistingListing: preSubmitEvidence.searchUrl.matched,
    },
    payload: item.payload,
    response: body,
    reviewStatus: accepted ? "pending_manual_review" : "api_submit_failed_pending_retry",
    reviewWindow: accepted ? "24-48 hours" : "",
    expectedReviewUrl: item.expectedReviewUrl,
  };
  writeReport(accepted ? item.report : item.report.replace(/\.json$/, "-failed.json"), report);
  return { report: item.report, ok: accepted, status: response.status, expectedReviewUrl: item.expectedReviewUrl };
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    const text = await response.text().catch(() => "");
    return {
      url,
      ok: response.ok,
      status: response.status,
      matched: text.includes("printable-tools-lab.pages.dev") || text.includes("PrintableTools Lab"),
      bytes: text.length,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      matched: false,
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
  } catch (error) {
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
