# FitMyForm - Project Specification & Metadata

## 📌 Project Overview
**FitMyForm** (formerly *FormMitra*) is a specialized, 100% client-side web application designed to format, resize, crop, convert, and compress photographs, signatures, thumb impressions, and PDF documents to match strict portal specifications for competitive exams, government job portals, university admissions, and visa applications.

- **App Name**: FitMyForm
- **Package Name**: `fitmyform`
- **Domain**: `https://fitmyform.com`
- **Primary Audience**: Indian students, job seekers, and competitive exam applicants (SSC, UPSC, IBPS, RRB Railway, CTET, UPTET, NTA NEET/JEE, State PSCs).
- **Core Value Proposition**: 100% browser-based processing (no server uploads), instant feedback with real-time validation checklists, exact KB file size targeting via binary search compression, and pre-configured exam requirement presets.

---

## 🛠️ Technical Stack

| Layer | Technology | Usage / Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.0 (App Router) | Server-Side Rendering (SSR) for static SEO landing pages + Client Components for interactive tools |
| **Language** | TypeScript 5 | Strong typing for document specifications, processing results, crop metadata, and preset schemas |
| **Styling** | Tailwind CSS v4 | Custom dark mode palette, glassmorphism UI, dynamic layout utilities |
| **Icons & Visuals** | Lucide React v1.31, Canvas Confetti | Modern UI icons, micro-animations, and celebratory completion feedback |
| **Image Engine** | HTML5 Canvas & Blob API | Client-side cropping, pixel-perfect resizing, DPI adjustments, and background padding |
| **Iterative Compression** | Custom Binary Search Engine | Dynamically adjusts image quality factors to fit files into strict KB ranges (e.g. 20 KB – 50 KB) |
| **PDF Processing** | `pdf-lib` + `pdfjs-dist 6.2` | Re-encodes, compresses, and renders client-side PDFs; sets metadata |
| **Archive/Batch** | `jszip` | Client-side ZIP packaging for batch downloads |
| **Local Storage** | Web Storage API | Remembers last 10 processed document metadata for quick re-downloading |
| **Deployment** | Cloudflare (via OpenNext) | Edge-deployed via `@opennextjs/cloudflare` + `wrangler` |

---

## 🚀 Deployment & Build

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js dev server |
| `npm run build` | Builds standard production bundle |
| `npm run build:cf` | Builds Cloudflare-compatible bundle via `opennextjs-cloudflare` |
| `npm run deploy` | Builds & deploys to Cloudflare Workers via `wrangler` |
| `npm run start` | Starts local production server |
| `npm run lint` | Runs ESLint on codebase |

---

## 🔒 Privacy Architecture

FitMyForm operates on a **Zero-Server-Upload** model:
1. **Local Processing**: Uploaded photos, sensitive identity proofs (Aadhaar, PAN), and signature scans are processed entirely in memory using the browser's native JavaScript `FileReader`, `HTMLCanvasElement`, and `URL.createObjectURL`.
2. **Data Retention**: Files are never transmitted across the network, stored in cloud buckets, or logged in server telemetry.
3. **Session Store**: Only anonymous file metadata (filename, dimensions, KB size, timestamp) is cached in the user's local `localStorage` (`fitmyform_recent_history`).

---

## 📂 Project Directory Structure

```
FitMyForm/
├── project.md                              # Comprehensive project documentation & metadata
├── README.md                               # Quickstart guide
├── package.json                            # Node dependencies & project metadata
├── next.config.ts                          # Next.js build & runtime configuration
├── postcss.config.mjs                      # PostCSS configuration for Tailwind
├── tsconfig.json                           # TypeScript compiler options
├── wrangler.jsonc                          # Cloudflare Workers deployment config
├── open-next.config.ts                     # OpenNext/Cloudflare adapter config
├── public/                                 # Static assets, favicons, open-graph graphics
├── src/
│   ├── app/                                # Next.js App Router routes & landing pages
│   │   ├── layout.tsx                      # Global root layout, fonts, & metadata (FitMyForm)
│   │   ├── page.tsx                        # Main interactive tool page & FAQ section
│   │   ├── globals.css                     # Custom glassmorphism, gradient text & global styles
│   │   ├── sitemap.ts                      # Dynamic SEO sitemap generator
│   │   ├── robots.ts                       # Search engine crawler instructions
│   │   │
│   │   ├── photo-resizer/                  # SEO route: Passport Photo Resizer
│   │   ├── signature-resizer/              # SEO route: Signature Formatter
│   │   ├── image-compressor/               # SEO route: Target KB Compressor
│   │   ├── ssc-photo-resizer/              # SEO route: SSC CGL/CHSL Preset
│   │   ├── ctet-photo-resizer/             # SEO route: CTET Preset
│   │   ├── uptet-photo-resizer/            # SEO route: UPTET Preset
│   │   ├── pdf-compressor/                 # SEO route: PDF Size Reducer
│   │   ├── image-to-jpg/                   # SEO route: PNG/WEBP to JPG converter
│   │   ├── image-to-png/                   # SEO route: JPG/WEBP to PNG converter
│   │   ├── convert-to-jpg/                 # SEO route: Universal to-JPG converter
│   │   ├── jpg-to-image/                   # SEO route: JPG to other formats
│   │   ├── resize-photo-for-online-form/   # Educational guide landing page
│   │   ├── crop-image/                     # SEO route: Free online image cropper
│   │   ├── rotate-image/                   # SEO route: Image rotation tool
│   │   ├── upscale-image/                  # SEO route: AI-style image upscaler
│   │   ├── watermark-image/                # SEO route: Add text/image watermarks
│   │   ├── blur-face/                      # SEO route: Face/region blur & privacy tool
│   │   ├── meme-generator/                 # SEO route: Meme creator tool
│   │   ├── html-to-image/                  # SEO route: HTML/URL screenshot to image
│   │   ├── photo-editor/                   # SEO route: Full-featured photo editor
│   │   ├── remove-background/              # SEO route: Background removal tool
│   │   ├── pdf-tools/                      # SEO route: PDF toolkit hub
│   │   ├── presets/                        # SEO route: Browse all exam presets
│   │   ├── dashboard/                      # User's recent document processing history
│   │   │
│   │   ├── esignature-compliance-standards/ # e-Signature content: compliance standards
│   │   ├── esignature-features/             # e-Signature content: feature overview
│   │   ├── esignature-security/             # e-Signature content: security guide
│   │   ├── esignatures-for-financial-services/ # e-Signature content: financial services
│   │   ├── esignatures-for-human-resources/    # e-Signature content: HR use cases
│   │   ├── esignatures-for-insurance/          # e-Signature content: insurance use cases
│   │   ├── esignatures-for-legal-services/     # e-Signature content: legal use cases
│   │   ├── esignatures-for-real-estate/        # e-Signature content: real estate use cases
│   │   ├── esignatures-for-sales/              # e-Signature content: sales use cases
│   │   └── legal-validity/                     # e-Signature content: legal validity guide
│   │
│   ├── components/                         # Modular UI Component Library
│   │   ├── header/                         # Navbar with logo, preset search, & privacy badge
│   │   ├── footer/                         # Footer with links, copyright, & sitemap references
│   │   ├── hero/                           # Hero section with headline & feature highlights
│   │   ├── upload/                         # Drag-and-drop file uploader with validation
│   │   ├── editor/                         # Manual specifications form & interactive cropper
│   │   ├── preview/                        # Before/After side-by-side comparison preview
│   │   ├── validation/                     # Live checklist for size, dimensions, format & DPI
│   │   ├── dashboard/                      # Recent documents manager
│   │   ├── presets/                        # Searchable modal for 20+ competitive exam presets
│   │   ├── camera/                         # In-browser camera capture component
│   │   ├── pdf/                            # PDF viewer & manipulation components
│   │   └── seo/                            # Structured JSON-LD schema & SEO content sections
│   │
│   ├── config/
│   │   └── presets.ts                      # Pre-configured exam database (SSC, UPSC, IBPS, etc.)
│   ├── lib/
│   │   ├── compression/                    # Iterative binary search compressor engine
│   │   ├── image/                          # Canvas resizer, background color padder & cropper
│   │   ├── pdf/                            # Client-side PDF compression & metadata updates
│   │   ├── storage/                        # LocalStorage session store manager
│   │   └── validation/                     # Document specifications validator & error reporter
│   └── types/
│       ├── document.ts                     # TypeScript types for document requirements & results
│       └── presets.ts                      # TypeScript types for exam requirement database
```

---

## 🎯 Exam Requirement Database (Pre-configured Presets)

FitMyForm includes built-in spec presets for major national & state application portals:

| Preset Name | Photo Dimensions | Photo KB Limit | Signature Specs | Sig KB Limit |
| :--- | :--- | :--- | :--- | :--- |
| **SSC (CGL / CHSL / MTS)** | 200 × 230 px | 20 – 50 KB | 140 × 60 px | 10 – 20 KB |
| **UPSC Civil Services** | 350 × 350 px (Min) | 20 – 300 KB | 350 × 350 px (Min) | 20 – 300 KB |
| **IBPS Bank PO / Clerk** | 200 × 230 px | 20 – 50 KB | 140 × 60 px | 10 – 20 KB |
| **CTET (Teacher Eligibility)** | 3.5 cm × 4.5 cm | 10 – 100 KB | 3.5 cm × 1.5 cm | 3 – 30 KB |
| **UPTET / UP Police** | 3.5 cm × 4.5 cm | 20 – 50 KB | 3.5 cm × 1.5 cm | 5 – 20 KB |
| **Railway RRB (NTPC/Group D)**| 350 × 450 px | 20 – 50 KB | 140 × 60 px | 10 – 20 KB |

---

## 🧩 Feature Modules

| Feature | Route(s) | Description |
| :--- | :--- | :--- |
| **Photo/Signature Resizer** | `/`, `/photo-resizer`, `/signature-resizer` | Core tool — resize, crop, compress with exam presets |
| **Image Compressor** | `/image-compressor` | Target-KB compression with binary search quality engine |
| **PDF Compressor** | `/pdf-compressor` | Client-side PDF re-encoding and size reduction |
| **PDF Tools** | `/pdf-tools` | Hub for all PDF utilities |
| **Format Conversion** | `/image-to-jpg`, `/image-to-png`, `/convert-to-jpg`, `/jpg-to-image` | Client-side image format conversion |
| **Image Crop** | `/crop-image` | Freeform and aspect-ratio-locked cropping |
| **Image Rotate** | `/rotate-image` | Rotate & flip images with lossless output |
| **Image Upscale** | `/upscale-image` | Canvas-based image enlargement with sharpening |
| **Watermark** | `/watermark-image` | Overlay text or image watermarks on photos |
| **Blur / Privacy** | `/blur-face` | Region/face blurring for privacy compliance |
| **Meme Generator** | `/meme-generator` | Add captions and overlays to images |
| **HTML to Image** | `/html-to-image` | Screenshot HTML content or URLs as images |
| **Photo Editor** | `/photo-editor` | Full-featured client-side photo editing suite |
| **Remove Background** | `/remove-background` | Client-side background removal tool |
| **Camera Capture** | In-tool component | Live in-browser camera capture for photo uploads |
| **Dashboard** | `/dashboard` | Recent processing history from localStorage |
| **Exam Presets** | `/presets` | Browse & search all built-in exam preset configurations |
| **e-Signature Guides** | `/esignature-*`, `/legal-validity` | SEO content cluster on e-signature laws & use cases |

---

## 📦 Key Dependencies

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `next` | 16.3.0 | Core framework (App Router, SSR/SSG) |
| `react` / `react-dom` | 19.2.8 | UI rendering |
| `typescript` | ^5 | Static typing |
| `tailwindcss` | ^4 | Utility-first CSS |
| `lucide-react` | ^1.31.0 | Icon library |
| `canvas-confetti` | ^1.9.4 | Celebratory animation on successful processing |
| `pdf-lib` | ^1.17.1 | Client-side PDF creation & compression |
| `pdfjs-dist` | ^6.2.108 | PDF rendering & parsing in browser |
| `jszip` | ^3.10.1 | Client-side ZIP packaging for batch export |
| `@opennextjs/cloudflare` | ^1.20.2 | Adapter for deploying Next.js on Cloudflare |
| `wrangler` | ^4.121.0 | Cloudflare Workers CLI for deployment |

---

## 🌐 SEO Content Cluster

FitMyForm includes a growing SEO content cluster targeting high-volume informational keywords:

| Content Group | Routes |
| :--- | :--- |
| **Exam-specific tools** | `/ssc-photo-resizer`, `/ctet-photo-resizer`, `/uptet-photo-resizer`, `/resize-photo-for-online-form` |
| **e-Signature guides** | `/esignature-features`, `/esignature-security`, `/esignature-compliance-standards`, `/legal-validity` |
| **Industry use cases** | `/esignatures-for-financial-services`, `/esignatures-for-human-resources`, `/esignatures-for-insurance`, `/esignatures-for-legal-services`, `/esignatures-for-real-estate`, `/esignatures-for-sales` |

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js `v18+`
- npm `v9+`

### Installation & Execution
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle (standard)
npm run build

# Build for Cloudflare
npm run build:cf

# Deploy to Cloudflare Workers
npm run deploy

# Start local production server
npm run start
```

---

## 📄 License & Copyright
© 2026 **FitMyForm**. All Rights Reserved.  
Built for students and applicants to ensure error-free form submissions.
