"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/store";
import { CATEGORIES } from "@/lib/catalog";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer className="bg-[#111] text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/planet-interior-wordmark.svg" alt="Planet Interior — Furniture for good living" className="h-14 sm:h-16 w-auto" loading="lazy" />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-extrabold mb-3">SHOP</h3>
          {CATEGORIES.slice(2, 8).map((c) => <Link key={c.slug} className="block py-1 text-white/80 hover:text-[#FF6B6B]" href={`/category/${c.slug}`}>{c.name}</Link>)}
        </div>
        <div>
          <h3 className="font-extrabold mb-3">HELP</h3>
          {[["Contact", "/contact"], ["Delivery Information", "/delivery"], ["Cancellations, Returns & Warranty", "/returns"], ["Payment Information", "/delivery#payments"], ["FAQ", "/contact#faq"], ["Assembly & Care", "/delivery#care"]].map(([l, h]) => <Link key={h + l} className="block py-1 text-white/80 hover:text-[#FF6B6B]" href={h}>{l}</Link>)}
        </div>
        <div>
          <h3 className="font-extrabold mb-3">ABOUT</h3>
          {[["About Us", "/about"], ["Store Locations", "/stores"], ["Terms", "/terms"], ["Privacy", "/privacy"], ["Warranty", "/warranty"]].map(([l, h]) => <Link key={h} className="block py-1 text-white/80 hover:text-[#FF6B6B]" href={h}>{l}</Link>)}
        </div>
        <div>
          <h3 className="font-extrabold mb-3">📞 CONTACT US – PLANET INTERIO</h3>
          <p className="text-white/80">📱 Call: <a className="underline" href="tel:+919429691445">{SITE.phone}</a></p>
          <p className="text-white/80 mt-1">💬 WhatsApp: <a className="underline" href="https://wa.me/918974499282">{SITE.whatsapp}</a></p>
          <p className="text-white/80 mt-2">🏠 {SITE.address}</p>
          <p className="text-white/60 mt-1 text-xs">Workshop: {SITE.workshop}</p>
          <p className="text-white/60 mt-1 text-xs">{SITE.hours}</p>
          <div className="flex gap-3 mt-3 text-xl" aria-label="Social links">
            <a href="#" aria-label="Facebook">ⓕ</a><a href="#" aria-label="Instagram">📸</a><a href="#" aria-label="YouTube">▶</a><a href="#" aria-label="Pinterest">📌</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-white/60 py-4 px-4">
        <p>© 2026 {SITE.name} · {SITE.tagline} · Prices in INR (₹) inclusive of GST where applicable.</p>
        <p className="mt-1">Created by <a href="https://www.avitsolutions.tech" target="_blank" rel="noopener" className="underline hover:text-white">AviT Solutions</a> · 📞 <a href="tel:+919856575064" className="underline hover:text-white">9856575064</a></p>
      </div>
    </footer>
  );
}
