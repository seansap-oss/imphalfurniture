import Link from "next/link";
import { PRODUCTS } from "@/lib/catalog";
import { getCMS, mergedProducts } from "@/lib/cms";
import ProductCard from "@/components/ProductCard";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? "";
  const s = q.trim().toLowerCase();
  const all = await mergedProducts().catch(() => PRODUCTS);
  const results = s ? all.filter((p) => [p.name, p.sku, p.brand, p.category, p.sub, p.room, p.material, ...p.colours, ...p.tags].join(" ").toLowerCase().includes(s)).slice(0, 24) : [];
  const cms = q ? await getCMS().catch(() => null) : null;
  const pkgs = cms ? (cms.packages || []).filter((p: any) => p.status === "active" && `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <h1 className="text-2xl font-extrabold">Search{q && <>: “{q}”</>}</h1>
      <p className="text-sm text-gray-500 mt-1">{results.length} result(s) across products, SKUs, brands, categories, rooms & materials.</p>
      {results.length === 0 && pkgs.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center mt-6">
          <p className="font-extrabold text-lg">{q ? "Nothing found — try “sofa”, “bed”, “dining” or “lamp”." : "Start typing above to search the store."}</p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">{["sofa", "bed", "dining", "wardrobe", "lamp", "rug"].map((t) => <a key={t} href={`/search?q=${t}`} className="border rounded-full px-4 py-2 text-sm font-bold">{t}</a>)}</div>
          <h2 className="font-extrabold mt-8 mb-3">Popular right now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{PRODUCTS.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        </div>
      ) : (
        <div>
          {pkgs.length > 0 && <div className="grid sm:grid-cols-2 gap-3 mt-6">{pkgs.map((p: any) => <Link key={p.slug} href={`/package/${p.slug}`} className="bg-white border rounded-2xl p-4 font-bold">📦 {p.name} <span className="text-sm font-normal text-gray-500">— package</span></Link>)}</div>}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">{results.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        </div>
      )}
    </div>
  );
}
