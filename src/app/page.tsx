import Link from "next/link";
import { PRODUCTS, HEROES, BRANDS, CATEGORIES } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import NewsletterForm from "@/components/NewsletterForm";

const byCat = (c: string) => PRODUCTS.filter((p) => p.category === c).slice(0, 10);
const deals = PRODUCTS.filter((p) => p.onSale).slice(0, 10);
const fresh = PRODUCTS.filter((p) => p.isNew).slice(0, 10);

export default function Home() {
  return (
    <div>
      <HeroCarousel />
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-6" aria-label="Shop by room">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Shop by Room</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[["Living", "/category/living", HEROES[0].image], ["Bedroom", "/category/bedroom", HEROES[1].image], ["Dining", "/category/dining", HEROES[2].image], ["Kitchen", "/category/kitchen", HEROES[2].image], ["Office", "/category/office", HEROES[3].image], ["Outdoor", "/category/outdoor", HEROES[0].image], ["Kids", "/category/kids", HEROES[1].image], ["Storage", "/category/storage", HEROES[3].image]].map(([t, h, im]) => (
            <Link key={t as string} href={h as string} className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im as string} alt={t as string} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition" loading="lazy" />
              <span className="absolute bottom-2 left-2 bg-black/80 text-white text-sm font-bold px-3 py-1.5 rounded-full">{t}</span>
            </Link>
          ))}
        </div>
      </section>

      <Rail title="Deals of the Week" href="/sale" ids={deals} />
      <Rail title="New Arrivals" href="/new" ids={fresh} />
      <Rail title="Shop Sofas" href="/category/sofas" ids={byCat("sofas")} />
      <Rail title="Shop Bedroom" href="/category/bedroom" ids={byCat("bedroom")} />
      <Rail title="Shop Dining" href="/category/dining" ids={byCat("dining")} />
      <Rail title="Shop Storage" href="/category/storage" ids={byCat("storage")} />

      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label="Room inspiration">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Room Inspiration</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {HEROES.slice(0, 3).map((h) => (
            <Link key={h.title} href={h.href} className="relative rounded-2xl overflow-hidden aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.image} alt={h.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute bottom-3 left-3 bg-[#FFD400] font-extrabold text-sm px-4 py-2 rounded-full">{h.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label="Brands">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Our Brands</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {BRANDS.map((b) => <Link key={b.slug} href={`/brand/${b.slug}`} className="shrink-0 border bg-white rounded-full px-5 py-2.5 text-sm font-bold">{b.name}</Link>)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label="Why shop with us">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Why shop imphalfurniture</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[["Great Value", "Honest INR pricing"], ["Easy Ordering", "Guest & account checkout"], ["Local Support", "Imphal-based help"], ["Secure Payment", "UPI, cards & COD"], ["Fast Delivery", "Imphal-first zones"], ["Easy Returns", "7-day promise"]].map(([t, s]) => (
            <div key={t} className="bg-white rounded-2xl p-4 border text-center"><p className="font-extrabold text-sm">{t}</p><p className="text-xs text-gray-500 mt-1">{s}</p></div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label="Newsletter">
        <NewsletterForm />
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8 text-sm text-gray-600" aria-label="About strip">
        <p>Categories: {CATEGORIES.map((c) => c.name).join(" · ")}</p>
      </section>
    </div>
  );
}

function Rail({ title, href, ids }: { title: string; href: string; ids: typeof PRODUCTS }) {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label={title}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl sm:text-2xl font-extrabold">{title}</h2>
        <Link href={href} className="text-sm font-bold underline">View all</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ids.slice(0, 5).map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </section>
  );
}
