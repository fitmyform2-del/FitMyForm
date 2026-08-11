# FitMyForm - Project Specification & Metadata

## 📌 Project Overview
**FitMyForm** (formerly *FormMitra*) is a specialized, 100% client-side web application designed to format, resize, crop, convert, and compress photographs, signatures, thumb impressions, and PDF documents to match strict portal specifications for competitive exams, government job portals, university admissions, and visa applications.

- **App Name**: FitMyForm
- **Package Name**: `fit-my-form`
- **Domain**: `https://fitmyform.com`
- **Primary Audience**: Indian students, job seekers, and competitive exam applicants (SSC, UPSC, IBPS, RRB Railway, CTET, UPTET, NTA NEET/JEE, State PSCs).
- **Core Value Proposition**: 100% browser-based processing (no server uploads), instant feedback with real-time validation checklists, exact KB file size targeting via binary search compression, and pre-configured exam requirement presets.

---

## 🛠️ Technical Stack

| Layer | Technology | Usage / Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server-Side Rendering (SSR) for static SEO landing pages + Client Components for interactive tools |
| **Language** | TypeScript | Strong typing for document specifications, processing results, crop metadata, and preset schemas |
| **Styling** | Tailwind CSS v3 | Custom dark mode palette, glassmorphism UI, dynamic layout utilities |
| **Icons & Visuals** | Lucide React, Canvas Confetti | Modern UI icons, micro-animations, and celebratory completion feedback |
| **Image Engine** | HTML5 Canvas & Blob API | Client-side cropping, pixel-perfect resizing, DPI adjustments, and background padding |
| **Iterative Compression** | Custom Binary Search Engine | Dynamically adjusts image quality factors to fit files into strict KB ranges (e.g. 20 KB – 50 KB) |
| **PDF Processing** | `pdf-lib` | Re-encodes and compresses client-side PDF documents and sets metadata |
| **Local Storage** | Web Storage API | Remembers last 10 processed document metadata for quick re-downloading |

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
├── project.md                          # Comprehensive project documentation & metadata
├── README.md                           # Quickstart guide
├── package.json                        # Node dependencies & project metadata
├── next.config.ts                      # Next.js build & runtime configuration
├── postcss.config.mjs                  # PostCSS configuration for Tailwind
├── tsconfig.json                       # TypeScript compiler options
├── public/                             # Static assets, favicons, open-graph graphics
├── src/
│   ├── app/                            # Next.js App Router routes & landing pages
│   │   ├── layout.tsx                  # Global root layout, fonts, & metadata (FitMyForm)
│   │   ├── page.tsx                    # Main interactive tool page & FAQ section
│   │   ├── globals.css                 # Custom glassmorphism, gradient text & global styles
│   │   ├── sitemap.ts                  # Dynamic SEO sitemap generator
│   │   ├── robots.ts                   # Search engine crawler instructions
│   │   ├── photo-resizer/              # Dedicated SEO route: Passport Photo Resizer
│   │   ├── signature-resizer/          # Dedicated SEO route: Signature Formatter
│   │   ├── image-compressor/           # Dedicated SEO route: Target KB Compressor
│   │   ├── ssc-photo-resizer/          # Dedicated SEO route: SSC CGL/CHSL Preset
│   │   ├── ctet-photo-resizer/         # Dedicated SEO route: CTET Preset
│   │   ├── uptet-photo-resizer/        # Dedicated SEO route: UPTET Preset
│   │   ├── pdf-compressor/             # Dedicated SEO route: PDF Size Reducer
│   │   ├── image-to-jpg/               # Dedicated SEO route: PNG/WEBP to JPG
│   │   ├── image-to-png/               # Dedicated SEO route: JPG/WEBP to PNG
│   │   ├── resize-photo-for-online-form/# Educational Guide landing page
│   │   └── dashboard/                  # User's recent document processing history
│   ├── components/                     # Modular UI Component Library
│   │   ├── header/                     # Navbar with logo, preset search, & privacy badge
│   │   ├── footer/                     # Footer with links, copyright, & sitemap references
│   │   ├── hero/                       # Hero section with headline & feature highlights
│   │   ├── upload/                     # Drag-and-drop file uploader with validation
│   │   ├── editor/                     # Manual specifications form & interactive cropper
│   │   ├── preview/                    # Before/After side-by-side comparison preview
│   │   ├── validation/                 # Live checklist for size, dimensions, format & DPI
│   │   ├── dashboard/                  # Recent documents manager
│   │   ├── presets/                    # Searchable modal for 20+ competitive exam presets
│   │   └── seo/                       # Structured JSON-LD schema & SEO content sections
│   ├── config/
│   │   └── presets.ts                  # Pre-configured exam database (SSC, UPSC, IBPS, etc.)
│   ├── lib/
│   │   ├── compression/                # Iterative binary search compressor engine
│   │   ├── image/                      # Canvas resizer, background color padder & cropper
│   │   ├── pdf/                        # Client-side PDF compression & metadata updates
│   │   ├── storage/                    # LocalStorage session store manager
│   │   └── validation/                 # Document specifications validator & error reporter
│   └── types/
│       ├── document.ts                 # TypeScript types for document requirements & results
│       └── presets.ts                  # TypeScript types for exam requirement database
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

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 📄 License & Copyright
© 2026 **FitMyForm**. All Rights Reserved.  
Built for students and applicants to ensure error-free form submissions.
