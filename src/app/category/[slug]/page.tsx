import { PRODUCTS, CATEGORIES, SUBS, BRANDS } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/Filters";

export default function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: Record<string, string | undefined> }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return <div className="max-w-7xl mx-auto p-6"><h1 className="text-2xl font-extrabold">Category not found</h1></div>;
  let list = PRODUCTS.filter((p) => p.category === params.slug);
  const { brand, max, colour, sort, sub, sale } = searchParams;
  if (sub) list = list.filter((p) => p.sub === sub);
  if (brand) list = list.filter((p) => p.brand === brand);
  if (colour) list = list.filter((p) => p.colours.includes(colour));
  if (max) list = list.filter((p) => p.price <= Number(max));
  if (sale === "1") list = list.filter((p) => p.onSale);
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
  const subs = SUBS[params.slug] ?? [];
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <nav className="text-xs text-gray-500" aria-label="Breadcrumb"><a href="/">Home</a> / {cat.name}</nav>
      <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{cat.name}</h1>
      <p className="text-sm text-gray-600 mt-1">{cat.blurb} · {list.length} products · Prices in ₹ INR</p>
      {subs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4" aria-label="Subcategories">
          {subs.map((s) => <a key={s} href={`/category/${params.slug}?sub=${encodeURIComponent(s)}`} className="shrink-0 bg-white border rounded-full px-4 py-2 text-sm font-bold">{s}</a>)}
        </div>
      )}
      <div className="grid lg:grid-cols-[240px_1fr] gap-6 mt-6">
        <Filters brands={BRANDS.map((b) => b.name)} />
        <div>
          <div className="flex justify-end mb-3">
            <nav className="text-sm flex gap-2" aria-label="Sort">
              <span className="text-gray-500 py-2">Sort:</span>
              {[["Featured", ""], ["Price ↑", "low"], ["Price ↓", "high"], ["Top Rated", "rating"]].map(([t, v]) => (
                <a key={t} href={v ? `/category/${params.slug}?sort=${v}${sub ? `&sub=${encodeURIComponent(sub)}` : ""}` : `/category/${params.slug}${sub ? `?sub=${encodeURIComponent(sub)}` : ""}`} className={`border rounded-full px-3 py-2 ${sort === v || (!sort && !v) ? "bg-black text-white font-bold" : ""}`}>{t}</a>
              ))}
            </nav>
          </div>
          {list.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border"><p className="font-extrabold text-lg">No products match those filters</p><p className="text-sm text-gray-500 mt-1">Try clearing a filter or two.</p><a href={`/category/${params.slug}`} className="inline-block mt-4 bg-[#D21F26] text-white font-bold px-6 py-2.5 rounded-full">Clear filters</a></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">{list.slice(0, 60).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
          )}
          <p className="text-sm text-gray-500 mt-6">Showing up to 60 of {list.length}. Use search and filters to narrow down. Free Imphal-core delivery on selected orders; Click & Collect available at the Planet Interio store, Canchipur.</p>
        </div>
      </div>
    </div>
  );
}
