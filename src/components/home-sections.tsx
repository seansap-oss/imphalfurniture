import Link from "next/link";
import type { Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";
import HeroCarousel from "./HeroCarousel";
import NewsletterForm from "./NewsletterForm";
import { INR } from "@/lib/store";

export function Rail({ title, subtitle, href, items }: { title: string; subtitle?: string; href?: string; items: Product[] }) {
  if (!items.length) return null;
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label={title}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl sm:text-2xl font-extrabold">{title}</h2>
        {href && <Link href={href} className="text-sm font-bold underline">View all</Link>}
      </div>
      {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.slice(0, 5).map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </section>
  );
}

export function RoomsGrid({ title, subtitle, heroes }: { title: string; subtitle?: string; heroes: { image: string }[] }) {
  const rooms: [string, string, number][] = [["Living", "/category/living", 0], ["Bedroom", "/category/bedroom", 1], ["Dining", "/category/dining", 2], ["Kitchen", "/category/kitchen", 2], ["Office", "/category/office", 3], ["Outdoor", "/category/outdoor", 0], ["Kids", "/category/kids", 1], ["Storage", "/category/storage", 3]];
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-6" aria-label={title}>
      <h2 className="text-xl sm:text-2xl font-extrabold mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {rooms.map(([t, h, im]) => (
          <Link key={t} href={h} className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroes[im % heroes.length]?.image} alt={t} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition" loading="lazy" />
            <span className="absolute bottom-2 left-2 bg-black/80 text-white text-sm font-bold px-3 py-1.5 rounded-full">{t}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function PackagesRail({ title, subtitle, pkgs, wa }: { title: string; subtitle?: string; pkgs: any[]; wa: string }) {
  if (!pkgs.length) return null;
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label={title}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl sm:text-2xl font-extrabold">{title}</h2>
        <Link href="/packages" className="text-sm font-bold underline">View all</Link>
      </div>
      {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pkgs.slice(0, 4).map((p: any) => {
          const save = p.mrp > p.price ? p.mrp - p.price : 0;
          const msg = encodeURIComponent(`Hello Planet Interio, I am interested in:\n${p.name} — ₹${p.price.toLocaleString("en-IN")}\nhttps://imphalfurniture.vercel.app/package/${p.slug}`);
          return (
            <article key={p.slug} className="bg-white rounded-2xl overflow-hidden border flex flex-col">
              <Link href={`/package/${p.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.name} loading="lazy" className="w-full aspect-[4/3] object-cover" />
              </Link>
              <div className="p-3 flex flex-col gap-1 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">{p.category} Package</p>
                <Link href={`/package/${p.slug}`} className="font-bold text-sm line-clamp-2">{p.name}</Link>
                <p className="text-sm"><strong>{INR(p.price)}</strong> {save > 0 && <><s className="text-gray-400 text-xs">{INR(p.mrp)}</s> <span className="text-green-700 text-xs font-bold">Save {INR(save)}</span></>}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{p.desc}</p>
                <div className="flex gap-2 mt-2">
                  <Link href={`/package/${p.slug}`} className="flex-1 text-center bg-[#D21F26] text-white font-bold text-sm rounded-full py-2.5">View Package</Link>
                  <a href={`https://wa.me/${wa}?text=${msg}`} target="_blank" rel="noopener" className="border rounded-full px-3 py-2 text-sm grid place-items-center" aria-label={`Enquire about ${p.name} on WhatsApp`}>💬</a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Inspiration({ title, subtitle, heroes }: { title: string; subtitle?: string; heroes: any[] }) {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label={title}>
      <h2 className="text-xl sm:text-2xl font-extrabold mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
      <div className="grid sm:grid-cols-3 gap-3">
        {heroes.slice(0, 3).map((h: any) => (
          <Link key={h.title} href={h.href || "/"} className="relative rounded-2xl overflow-hidden aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={h.image} alt={h.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute bottom-3 left-3 bg-[#D21F26] text-white font-extrabold text-sm px-4 py-2 rounded-full">{h.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function BrandsRow({ title, subtitle, brands }: { title: string; subtitle?: string; brands: { slug: string; name: string }[] }) {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label={title}>
      <h2 className="text-xl sm:text-2xl font-extrabold mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {brands.map((b) => <Link key={b.slug} href={`/brand/${b.slug}`} className="shrink-0 border bg-white rounded-full px-5 py-2.5 text-sm font-bold">{b.name}</Link>)}
      </div>
    </section>
  );
}

export function WhyGrid({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label={title}>
      <h2 className="text-xl sm:text-2xl font-extrabold mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[["Great Value", "Honest INR pricing"], ["Easy Ordering", "Guest & account checkout"], ["Local Support", "Imphal-based help"], ["Secure Payment", "UPI, cards & COD"], ["Fast Delivery", "Imphal-first zones"], ["Easy Returns", "7-day promise"]].map(([t, s]) => (
          <div key={t} className="bg-white rounded-2xl p-4 border text-center"><p className="font-extrabold text-sm">{t}</p><p className="text-xs text-gray-500 mt-1">{s}</p></div>
        ))}
      </div>
    </section>
  );
}

export { HeroCarousel, NewsletterForm };
