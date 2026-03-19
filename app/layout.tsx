import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emoji Copy Paste",
  description:
    "Browse emoji categories and click any emoji to copy instantly for social media, captions, messages, and design work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
        />

        <div className="site-shell">
          <header className="site-header">
            <div className="container header-inner">
              <Link href="/" className="brand">
                <span className="brand-mark">😊</span>
                <span className="brand-text">Emoji Copy Paste</span>
              </Link>

              <nav className="header-nav">
                <a href="/" className="nav-link">Home</a>
                <a href="#categories" className="nav-link">Categories</a>
                <a href="#guide" className="nav-link">Guide</a>
                <a href="#faq" className="nav-link">FAQ</a>
              </nav>
            </div>
          </header>

          <div className="site-main">{children}</div>
        </div>
      </body>
    </html>
  );
}