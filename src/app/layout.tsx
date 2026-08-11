import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "FitMyForm - Exact Photo, Signature & Document Resizer for Online Exams",
  description: "Free client-side document resizer & target KB compressor for Indian competitive exams (SSC CGL/CHSL, UPSC, IBPS, RRB, CTET). Resize photo to 200x230 px & 20-50 KB JPG.",
  keywords: [
    "FitMyForm",
    "student document resizer",
    "ssc photo resizer 20-50 kb",
    "signature resizer 140x60",
    "upsc photo resizer 350x350",
    "online exam photo converter",
    "image compressor to target kb",
    "pdf size reducer browser"
  ],
  metadataBase: new URL("https://fitmyform.com"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "FitMyForm - Student Document Resizer & Formatter",
    description: "Format passport photos & signatures to exact pixel dimensions & KB limits for SSC, UPSC, Banking, & State online forms. 100% Client-Side Privacy.",
    url: "https://fitmyform.com",
    siteName: "FitMyForm",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "FitMyForm - Student Document Resizer for Online Forms",
    description: "Resize photos & signatures for SSC, UPSC, Banking & College forms with 100% browser privacy."
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0b0f19] text-gray-100 font-sans">
        {children}
      </body>
    </html>
  );
}
