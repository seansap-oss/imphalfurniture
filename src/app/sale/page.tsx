import { PRODUCTS } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export default function SalePage() {
  const list = PRODUCTS.filter((p) => p.onSale);
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <h1 className="text-3xl font-extrabold text-red-600">SALE</h1>
      <p className="text-sm text-gray-600">{list.length} bargains with Imphal delivery.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">{list.slice(0, 60).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
    </div>
  );
}
