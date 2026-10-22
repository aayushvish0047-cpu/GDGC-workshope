import type { Metadata, Viewport } from "next";
import { Albert_Sans, Inter } from "next/font/google";

import "./globals.css";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert",
  display: "swap",
  preload: true,
  fallback: ["Inter", "Arial", "sans-serif"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alex.dev"),
  title: {
    default: "Alex — Frontend Engineer",
    template: "%s · Alex",
  },
  description:
    "Alex is a frontend engineer building fast, quiet interfaces. Eight years across design systems, realtime data and AI tooling.",
  keywords: [
    "Alex",
    "Frontend Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Design Systems",
    "Portfolio",
  ],
  authors: [{ name: "Alex" }],
  creator: "Alex",
  openGraph: {
    type: "website",
    title: "Alex — Frontend Engineer",
    description:
      "Fast, quiet interfaces built with Next.js, TypeScript and a healthy respect for whitespace.",
    siteName: "Alex",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex — Frontend Engineer",
    description:
      "Fast, quiet interfaces built with Next.js, TypeScript and a healthy respect for whitespace.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${albertSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-paper">{children}</body>
    </html>
  );
}
