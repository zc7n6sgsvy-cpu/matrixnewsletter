import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Matrix Newsletter — Decode the signal",
  description: "Every Sunday, Matrix Newsletter decodes the week in tech, systems, and the strange machinery quietly shaping how we live online. One signal. Zero filler.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://matrixnewsletter.com"),
  openGraph: {
    title: "Matrix Newsletter — Decode the signal",
    description: "Encrypted transmission · weekly · 0 noise. Join 42,000 readers.",
    images: [{ url: "/og.png" }],
  },
};

import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#040706] text-[#dffaee]">
        <header className="border-b border-[#15301f] bg-[#040706]/95 backdrop-blur sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 text-sm font-mono">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-[2px] hover:text-[#54f0a0] transition-colors">
              <span className="text-[#54f0a0]">▚</span> MATRIX NEWSLETTER
            </Link>
            <div className="flex items-center gap-8 text-[#54f0a0]/80">
              <Link href="/archive" className="hover:text-[#54f0a0] transition-colors">ARCHIVE</Link>
              <Link href="/#subscribe" className="hover:text-[#54f0a0] transition-colors">SUBSCRIBE</Link>
              <a href="https://github.com/zc7n6sgsvy-cpu/matrixnewsletter" target="_blank" className="hover:text-[#54f0a0] transition-colors">SOURCE</a>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
