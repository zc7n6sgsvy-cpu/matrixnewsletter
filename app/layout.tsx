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
  openGraph: {
    title: "Matrix Newsletter — Decode the signal",
    description: "Encrypted transmission · weekly · 0 noise. Join 42,000 readers.",
    images: [{ url: "/og.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#040706] text-[#dffaee]">{children}</body>
    </html>
  );
}
