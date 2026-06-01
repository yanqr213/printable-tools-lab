# Zero-cost Distribution Runbook

Generated: 2026-06-01T20:43:24.306Z

## Purpose

Use the existing no-signup tools to get real traffic, downloads, and Search Console signals before paid ads or paid features. This is distribution work, not an ad-click scheme.

## What Is Ready

- Six high-intent campaigns.
- English captions for global short-video platforms.
- Chinese captions for Bilibili and Douyin posting.
- Community replies that only fit real user questions.
- UTM links for separating short-video and community tests.
- Vertical 9:16 poster images in `posters/`.

## Accounts Needed

- Bilibili or Douyin account for Chinese distribution.
- TikTok, YouTube Shorts, Instagram Reels, or similar account for global distribution.
- One relevant community account only if self-promotion is allowed and the reply directly solves a user's problem.

## Safe Posting Rules

- Post only where free tools or file utilities are relevant to the community.
- Do not ask for ad clicks, ad views, upvotes, or artificial engagement.
- Do not claim guaranteed compression results; say the tool tries toward a target and users should review the output.
- Do not post private documents, IDs, payment details, or user files in examples.
- Use UTM source labels so the live metrics can separate directory, community, video, and social tests.

## First 24 Hours

1. Publish one PDF upload-limit short video using `pdf-under-1mb`.
2. Publish one image upload-limit short video using `image-under-100kb`.
3. Do one useful community reply only if someone has asked about the exact file-size or format problem.
4. Run `npm.cmd run validate:ops` after posting to check whether UTM traffic or downloads moved.

## Campaigns

### Compress PDF to 1MB

- Pain: Portal says your PDF must be under 1MB?
- Target: Job, school, email, and application portal uploads
- Link: https://printable-tools-lab.pages.dev/compress-pdf-to-1mb?utm_source=short-video&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=pdf-under-1mb
- Poster: posters/pdf-under-1mb.png
- English caption: PDF upload blocked by a 1MB limit? This free no-upload tool tries to compress scans and image-heavy PDFs in your browser.
- Chinese caption: 表格要求 PDF 小于 1MB？这个免费工具在浏览器里压缩，不用上传文件，适合扫描件和图片型 PDF，下载前记得检查效果。
- Hashtags: #PDFTools #FileUpload #NoSignup #JobSearch #StudentTools

### Compress PDF to 500KB

- Pain: Government-style form rejects PDFs over 500KB?
- Target: Strict file-size portals and form uploads
- Link: https://printable-tools-lab.pages.dev/compress-pdf-to-500kb?utm_source=community&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=pdf-under-500kb
- Poster: posters/pdf-under-500kb.png
- English caption: When a form asks for a tiny 500KB PDF, use a no-upload compressor and check the result before submitting.
- Chinese caption: 遇到 500KB 的 PDF 上传限制，可以先用这个无上传压缩工具试一下。压得越小画质可能越差，提交前一定检查。
- Hashtags: #PDFCompressor #UploadLimit #NoUpload #FormHelp #FreeTools

### Compress Image to 100KB

- Pain: Profile photo rejected because it is over 100KB?
- Target: Job forms, school portals, profile photos, and exam uploads
- Link: https://printable-tools-lab.pages.dev/compress-image-to-100kb?utm_source=short-video&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=image-under-100kb
- Poster: posters/image-under-100kb.png
- English caption: Photo upload too large? Compress an image toward 100KB locally in the browser, without creating an account.
- Chinese caption: 照片超过 100KB 被表单拒绝？这个工具可以在浏览器本地压缩，不需要注册账号，也不用上传原图。
- Hashtags: #ImageCompressor #100KB #ProfilePhoto #NoSignup #BrowserTools

### Compress Image to 50KB

- Pain: Tiny photo limit: 50KB or less?
- Target: Strict ID, exam, and lightweight profile-image uploads
- Link: https://printable-tools-lab.pages.dev/compress-image-to-50kb?utm_source=community&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=image-under-50kb
- Poster: posters/image-under-50kb.png
- English caption: Need a very small 50KB image? Try browser-local compression and review the preview before uploading it anywhere.
- Chinese caption: 如果系统要求图片小于 50KB，可以先用这个本地压缩工具试一下。50KB 很小，预览确认后再提交。
- Hashtags: #50KB #ImageTools #UploadFix #NoUpload #FreeUtility

### PDF to JPG Without Upload

- Pain: The form accepts images but rejects your PDF?
- Target: PDF-to-image conversion for forms, previews, and thumbnails
- Link: https://printable-tools-lab.pages.dev/pdf-to-jpg-no-upload?utm_source=short-video&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=pdf-to-jpg-no-upload
- Poster: posters/pdf-to-jpg-no-upload.png
- English caption: If a form rejects PDF but accepts JPG, convert PDF pages to images locally in the browser.
- Chinese caption: 有些表单不要 PDF、只收 JPG。这个工具可以在浏览器里把 PDF 页面转成图片，不用上传文件。
- Hashtags: #PDFToJPG #NoUpload #FileConverter #FormHelp #FreeTools

### Remove Background Without Upload

- Pain: Need a transparent PNG for a product, logo, or signature scan?
- Target: Simple white, solid, and near-solid image backgrounds
- Link: https://printable-tools-lab.pages.dev/remove-background-no-upload?utm_source=community&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=background-removal
- Poster: posters/background-removal.png
- English caption: For simple white or solid backgrounds, remove the background locally and export a transparent PNG.
- Chinese caption: 白底商品图、Logo 或签名扫描件，可以试试这个本地去背景工具。它适合简单背景，不是人像精修工具。
- Hashtags: #TransparentPNG #BackgroundRemover #ProductPhoto #NoUpload #DesignTools
