import { PRODUCTS } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
export default function NewPage() {
  const list = PRODUCTS.filter((p) => p.isNew);
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <h1 className="text-3xl font-extrabold">NEW ARRIVALS</h1>
      <p className="text-sm text-gray-600">{list.length} fresh pieces this season.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
    </div>
  );
}
