import { BRANDS, PRODUCTS } from "@/lib/catalog";
import { mergedBrands, mergedProducts } from "@/lib/cms";
import ProductCard from "@/components/ProductCard";
export default async function BrandPage({ params }: { params: { slug: string } }) {
  const brands = await mergedBrands().catch(() => BRANDS);
  const b = brands.find((x: any) => x.slug === params.slug) || BRANDS.find((x) => x.slug === params.slug);
  if (!b) return <div className="max-w-7xl mx-auto p-8"><h1 className="text-2xl font-extrabold">Brand not found</h1></div>;
  const all = await mergedProducts().catch(() => PRODUCTS);
  const list = all.filter((p) => p.brand === (b as any).name);
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <h1 className="text-3xl font-extrabold">{b.name}</h1>
      <p className="text-sm text-gray-600">{b.desc} · {list.length} products.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">{list.slice(0, 40).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
    </div>
  );
}
