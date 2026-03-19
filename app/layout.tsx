import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import type { Metadata } from "next";

export const metadata = {
  title: "Emoji Copy Paste | Free Emoji Tool",
  description: "Copy and paste emojis instantly. Search, combine, and use emojis for Instagram, TikTok, Discord, and more.",
  keywords: [
    "emoji copy",
    "emoji paste",
    "emoji generator",
    "emoji combiner",
    "emoji kitchen",
    "free emoji tool"
  ],
  verification: {
    google: "UI4gjpct9CkHk5SAEn2Dyk1RaqgtAtGY36Dy6vPKr-4",
  },
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
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8170455252781139"
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
        <Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8170455252781139"
  crossOrigin="anonymous"
/>
      </body>
    </html>
  );
}
