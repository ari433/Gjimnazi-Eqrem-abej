import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL, asset } from "@/lib/utils";
import "./globals.css";

const grotesk = localFont({
  src: "../fonts/schibsted-grotesk.woff2",
  variable: "--font-grotesk",
  weight: "400 900",
  display: "swap",
});

const news = localFont({
  src: [
    { path: "../fonts/newsreader.woff2", style: "normal", weight: "200 800" },
    { path: "../fonts/newsreader-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-news",
  display: "swap",
});

const DESCRIPTION =
  "Faqja zyrtare e Gjimnazit \"Eqrem Çabej\" në Prishtinë: gjimnaz i shkencave shoqërore-gjuhësore. Lajme, njoftime, kalendari, programet dhe dokumentet e shkollës.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gjimnazi \"Eqrem Çabej\" · Prishtinë",
    template: "%s · Gjimnazi \"Eqrem Çabej\"",
  },
  description: DESCRIPTION,
  applicationName: "Gjimnazi \"Eqrem Çabej\"",
  keywords: ["Gjimnazi Eqrem Çabej", "gjimnaz Prishtinë", "shkencat shoqërore-gjuhësore", "shkollë e mesme", "Kosovë"],
  alternates: { canonical: "/" },
  icons: { icon: asset("/logo.png"), apple: asset("/logo.png") },
  openGraph: {
    type: "website",
    locale: "sq_AL",
    siteName: "Gjimnazi \"Eqrem Çabej\"",
    title: "Gjimnazi \"Eqrem Çabej\" · Prishtinë",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a1838",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${grotesk.variable} ${news.variable}`}>
      <body>{children}</body>
    </html>
  );
}
