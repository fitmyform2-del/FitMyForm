import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#080b11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "FitMyForm - Exact Photo, Signature & Document Resizer for Online Exams",
  description: "Free client-side document resizer & target KB compressor for Indian competitive exams (SSC CGL/CHSL, UPSC, IBPS, RRB, CTET). Resize photo to 200x230 px & 20-50 KB JPG with zero server uploads.",
  keywords: [
    "FitMyForm",
    "student document resizer",
    "ssc photo resizer 20-50 kb",
    "signature resizer 140x60",
    "upsc photo resizer 350x350",
    "online exam photo converter",
    "image compressor to target kb",
    "pdf size reducer browser",
    "free pdf merge split online",
    "offline interactive whiteboard",
    "remove background free client side",
    "passport size photo maker online"
  ],
  metadataBase: new URL("https://fitmyform.com"),
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    title: "FitMyForm - Student Document Resizer & Image PDF Utilities",
    description: "Format passport photos & signatures to exact pixel dimensions & KB limits for SSC, UPSC, Banking, & State online forms. 100% Client-Side Privacy.",
    url: "https://fitmyform.com",
    siteName: "FitMyForm",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "FitMyForm - Free Online Exam Document Resizer & PDF Tools",
    description: "Resize photos & signatures for SSC, UPSC, Banking & College forms with 100% browser privacy."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FitMyForm",
  "url": "https://fitmyform.com",
  "logo": "https://fitmyform.com/icon.svg",
  "description": "Free, 100% private client-side document resizer, photo editor, interactive digital whiteboard, and PDF tools."
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "FitMyForm",
  "url": "https://fitmyform.com"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#080b11] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
