import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getCMS } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const cms = await getCMS();
    return {
      title: { default: cms.seo.title, template: `%s | ${cms.settings.siteName}` },
      description: cms.seo.description,
      keywords: cms.seo.keywords,
      manifest: "/manifest.webmanifest",
      openGraph: { type: "website", siteName: cms.settings.siteName, title: cms.settings.siteName, images: [cms.seo.ogImage] },
      robots: { index: true, follow: true }
    };
  } catch {
    return { title: "Planet Interio", manifest: "/manifest.webmanifest" };
  }
}
export const viewport: Viewport = { themeColor: "#D21F26", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let cms: any = null;
  try { cms = await getCMS(); } catch {}
  const a = cms?.appearance || { primary: "#D21F26", secondary: "#171717", accent: "#FF6B6B", text: "#171717", header: "#FFFFFF", footer: "#111111", radius: "16" };
  const contact = cms?.contact || { call: "+91 9429691445", whatsapp: "+91 8974499282" };
  const floating = cms?.floating || { whatsapp: { enabled: true, number: contact.whatsapp, message: "Hello Planet Interio" }, call: { enabled: true, number: contact.call }, color: "#25D366" };
  const org = { "@context": "https://schema.org", "@type": "FurnitureStore", name: cms?.settings?.siteName || "Planet Interio", url: "https://imphalfurniture.vercel.app", telephone: contact.call, address: contact.address };
  return (
    <html lang="en-IN">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" href="/icons/icon-192.png" />
        <style dangerouslySetInnerHTML={{ __html: `:root{--color-primary:${a.primary};--color-secondary:${a.secondary};--color-accent:${a.accent};--color-header:${a.header};--color-footer:${a.footer};--radius:${a.radius}px}` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-black focus:text-white">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <FloatingButtons cfg={floating} />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});});}` }} />
      </body>
    </html>
  );
}
