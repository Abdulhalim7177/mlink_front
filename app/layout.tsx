import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Market-Link | Africa's Leading Investment Intelligence Platform",
  description: "Transform your trading decisions with AI-powered market intelligence, verified networks, and real-time data for African commodities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${bricolage.variable} antialiased scroll-smooth`}
    >
      <body className="min-h-screen bg-surface text-text-primary flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
