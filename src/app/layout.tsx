import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/store";

export const metadata: Metadata = {
  title: { default: "Planet Interio | Furniture for good living in Imphal", template: "%s | Planet Interio" },
  description: "Planet Interio, Canchipur Imphal — affordable modern home & office furniture. Sofas, beds, dining, storage & more with Imphal-first delivery. Prices in INR.",
  manifest: "/manifest.webmanifest",
  openGraph: { type: "website", siteName: "Planet Interio", title: "Planet Interio" },
  robots: { index: true, follow: true }
};
export const viewport: Viewport = { themeColor: "#D21F26", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = { "@context": "https://schema.org", "@type": "FurnitureStore", name: "Planet Interio", url: "https://imphalfurniture.vercel.app", telephone: "+91 9429691445", address: "Canchipur, Imphal, India 795003" };
  return (
    <html lang="en-IN">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" href="/icons/icon-192.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-black focus:text-white">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});});}` }} />
      </body>
    </html>
  );
}
