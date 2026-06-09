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
];

async function main() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const results = [];

  for (const item of backlog) {
    const result = await submitOrSkip(item);
    results.push(result);
    await delay(3000);
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

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
