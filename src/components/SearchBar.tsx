"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchProducts, CATEGORIES, BRANDS } from "@/lib/catalog";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const router = useRouter();
  const results = q.length > 1 ? searchProducts(q) : [];
  return (
    <div className="relative w-full">
      <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(q)}`); setFocus(false); }} role="search">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          placeholder="What are you looking for?"
          aria-label="Search products"
          className="w-full border-2 border-black rounded-full px-5 py-2.5 text-sm focus:outline-none"
        />
      </form>
      {focus && q.length > 1 && (
        <div className="absolute left-0 right-0 bg-white border rounded-xl shadow-xl mt-1 max-h-96 overflow-auto p-2 z-50">
          {results.length === 0 && <p className="p-3 text-sm text-gray-500">No matches — try “sofa”, “bed” or “dining”.</p>}
          {results.slice(0, 6).map((p) => (
            <button key={p.slug} onMouseDown={() => router.push(`/product/${p.slug}`)} className="flex gap-3 w-full text-left p-2 hover:bg-yellow-50 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded" loading="lazy" />
              <span className="text-sm"><strong>{p.name}</strong><br /><span className="text-gray-500">{p.brand} · ₹{p.price.toLocaleString("en-IN")}</span></span>
            </button>
          ))}
          <div className="p-2 text-xs text-gray-500">Categories: {CATEGORIES.slice(2, 6).map((c) => c.name).join(" · ")} · Brands: {BRANDS.slice(0, 3).map((b) => b.name).join(", ")}</div>
        </div>
      )}
    </div>
  );
}
