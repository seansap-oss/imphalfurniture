"use client";
import Link from "next/link";
import { useWishlist, useCart } from "@/lib/hooks";
import type { Product } from "@/lib/catalog";
import { INR } from "@/lib/store";

export default function ProductCard({ p }: { p: Product }) {
  const wish = useWishlist();
  const cart = useCart();
  const saved = wish.has(p.slug);
  const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  return (
    <article className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition group flex flex-col">
      <div className="relative">
        <Link href={`/product/${p.slug}`} aria-label={p.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full aspect-[4/3] object-cover" />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {p.badges.slice(0, 2).map((b) => (
            <span key={b} className={`text-[10px] font-extrabold px-2 py-1 rounded ${b === "SALE" ? "bg-red-600 text-white" : b === "NEW" ? "bg-black text-[#FF6B6B]" : "bg-[#D21F26] text-white"}`}>{b}</span>
          ))}
        </div>
        <button onClick={() => wish.toggle(p.slug)} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={saved} className="absolute top-2 right-2 bg-white rounded-full min-h-[44px] min-w-[44px] grid place-items-center text-xl">
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-gray-500">{p.brand}</p>
        <Link href={`/product/${p.slug}`} className="font-bold text-sm line-clamp-2 leading-snug">{p.name}</Link>
        <p className="text-xs text-gray-500">★ {p.rating} ({p.reviews}) · {p.colours[0]}</p>
        <p className="text-sm mt-1"><strong>{INR(p.price)}</strong> {off > 0 && <><s className="text-gray-400 text-xs">{INR(p.mrp)}</s> <span className="text-green-700 text-xs font-bold">{off}% off</span></>}</p>
        <p className="text-[11px] text-gray-500">{p.stock > 0 ? (p.stock <= 3 ? `Only ${p.stock} left` : "In stock") : "Backorder"}</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => cart.add({ slug: p.slug, qty: 1, price: p.price, title: p.name, image: p.images[0] })} className="flex-1 bg-[#D21F26] text-white font-extrabold text-sm rounded-full py-2.5 min-h-[44px] hover:bg-[#A3121A]">Add to Cart</button>
          <Link href={`/product/${p.slug}`} className="border rounded-full px-3 py-2 text-sm min-h-[44px] grid place-items-center">View</Link>
        </div>
      </div>
    </article>
  );
}
