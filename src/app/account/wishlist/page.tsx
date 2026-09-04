"use client";
import { useWishlist } from "@/lib/hooks";
import { PRODUCTS } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
export default function WishlistPage() {
  const w = useWishlist();
  const list = PRODUCTS.filter((p) => w.slugs.includes(p.slug));
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <h1 className="text-2xl font-extrabold">Saved Items</h1>
      {list.length === 0 ? <div className="bg-white border rounded-2xl p-10 text-center mt-4"><p className="font-extrabold text-lg">Nothing saved yet</p><p className="text-sm text-gray-500">Tap ♡ on any product to save it here.</p><a href="/" className="inline-block mt-4 bg-[#D21F26] text-white font-bold px-6 py-2.5 rounded-full">Discover furniture</a></div>
        : <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>}
    </div>
  );
}
