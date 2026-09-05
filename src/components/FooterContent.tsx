import Link from "next/link";
import { SITE } from "@/lib/store";
import { getCMS, mergedCategories } from "@/lib/cms";

const SOCIAL_META: [string, string, string][] = [
  ["facebook", "Facebook", "ⓕ"], ["instagram", "Instagram", "📸"], ["youtube", "YouTube", "▶"],
  ["pinterest", "Pinterest", "📌"], ["twitter", "X / Twitter", "𝕏"], ["linkedin", "LinkedIn", "in"], ["tiktok", "TikTok", "♪"]
];

export default async function FooterContent() {
  const cms = await getCMS().catch(() => null);
  const contact: any = cms?.contact || SITE;
  const social: Record<string, any> = {};
  for (const [k, v] of Object.entries((cms?.social || {}) as Record<string, any>)) if (v?.enabled && v?.url) social[k] = v;
  const foot = cms?.footer || { tagline: SITE.tagline, copyright: `© 2026 ${SITE.name}`, credit: { enabled: true, name: "AviT Solutions", phone: "9856575064", url: "https://www.avitsolutions.tech" } };
  const cats = cms ? (await mergedCategories().catch(() => [])) : [];
  const shop = cats.length ? cats.slice(0, 6) : [{ slug: "sofas", name: "SOFAS" }, { slug: "living", name: "LIVING" }, { slug: "dining", name: "DINING" }, { slug: "bedroom", name: "BEDROOM" }, { slug: "kitchen", name: "KITCHEN" }, { slug: "outdoor", name: "OUTDOOR" }];
  return (
    <footer className="bg-[#111] text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/planet-interior-wordmark.svg" alt="Planet Interior — Furniture for good living" className="h-14 sm:h-16 w-auto" loading="lazy" />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-extrabold mb-3">SHOP</h3>
          {shop.map((c: any) => <Link key={c.slug} className="block py-1 text-white/80 hover:text-[#FF6B6B]" href={c.slug === "sale" ? "/sale" : c.slug === "new" ? "/new" : `/category/${c.slug}`}>{c.name}</Link>)}
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
          <h3 className="font-extrabold mb-3">📞 CONTACT US – {String(SITE.name).toUpperCase()}</h3>
          <p className="text-white/80">📱 Call: <a className="underline" href={`tel:+${String(contact.call).replace(/\D/g, "")}`}>{contact.call}</a></p>
          <p className="text-white/80 mt-1">💬 WhatsApp: <a className="underline" href={`https://wa.me/${String(contact.whatsapp).replace(/\D/g, "")}`}>{contact.whatsapp}</a></p>
          <p className="text-white/80 mt-2">🏠 {contact.address}</p>
          {contact.workshop && <p className="text-white/60 mt-1 text-xs">Workshop: {contact.workshop}</p>}
          {contact.hours && <p className="text-white/60 mt-1 text-xs">{contact.hours}</p>}
          <div className="flex gap-3 mt-3 text-xl" aria-label="Social links">
            {SOCIAL_META.filter(([k]) => social[k]).map(([k, label, icon]) => (
              <a key={k} href={social[k].url} target={social[k].newTab === false ? "_self" : "_blank"} rel="noopener" aria-label={label}>{icon}</a>
            ))}
            {Object.keys(social).length === 0 && (<><a href="#" aria-label="Facebook">ⓕ</a><a href="#" aria-label="Instagram">📸</a><a href="#" aria-label="YouTube">▶</a><a href="#" aria-label="Pinterest">📌</a></>)}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-white/60 py-4 px-4">
        <p>{foot.copyright || `© 2026 ${SITE.name}`} · {foot.tagline || SITE.tagline} · Prices in INR (₹) inclusive of GST where applicable.</p>
        {foot.credit?.enabled !== false && <p className="mt-1">Created by <a href={foot.credit?.url || "https://www.avitsolutions.tech"} target="_blank" rel="noopener" className="underline hover:text-white">{foot.credit?.name || "AviT Solutions"}</a> · 📞 <a href={`tel:+91${String(foot.credit?.phone || "9856575064").replace(/\D/g, "").slice(-10)}`} className="underline hover:text-white">{foot.credit?.phone || "9856575064"}</a></p>}
      </div>
    </footer>
  );
}
