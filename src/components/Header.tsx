"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/catalog";
import { useCart, useWishlist } from "@/lib/hooks";
import SearchBar from "./SearchBar";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const cart = useCart();
  const wish = useWishlist();
  const count = cart.lines.reduce((s, l) => s + l.qty, 0);
  if (pathname?.startsWith("/admin")) return null;
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-[#111] text-white text-center text-xs sm:text-sm py-2 px-3">
        Free local delivery on selected Imphal orders · Furniture for every room · Special weekend savings
      </div>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center gap-3">
          <button className="lg:hidden min-h-[44px] min-w-[44px] text-2xl" aria-label="Open menu" onClick={() => setOpen(true)}>☰</button>
          <Link href="/" className="flex items-center gap-2 font-extrabold text-lg sm:text-2xl tracking-tight" aria-label="imphalfurniture home">
            <span className="bg-[#FFD400] rounded-lg w-9 h-9 grid place-items-center text-black">◧</span>
            <span><span className="text-black">imphal</span><span className="text-black/70">furniture</span></span>
          </Link>
          <div className="hidden md:block flex-1"><SearchBar /></div>
          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <label className="hidden sm:flex items-center gap-1 text-sm border rounded-full px-3 py-2" title="Delivery PIN">
              📍 <select value={cart.pin} onChange={(e) => cart.setPin(e.target.value)} className="bg-transparent text-sm" aria-label="Delivery PIN">
                {["795001", "795002", "795005", "795101", "795128", "796001", "110001"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <Link href="/account" className="min-h-[44px] min-w-[44px] grid place-items-center" aria-label="Account">👤</Link>
            <Link href="/account/wishlist" className="relative min-h-[44px] min-w-[44px] grid place-items-center" aria-label="Wishlist">♡{wish.slugs.length > 0 && <span className="absolute top-1 right-0 bg-black text-white text-[10px] rounded-full px-1">{wish.slugs.length}</span>}</Link>
            <Link href="/cart" className="relative min-h-[44px] min-w-[44px] grid place-items-center font-bold" aria-label="Cart">🛒{count > 0 && <span className="absolute top-1 right-0 bg-[#FFD400] text-black text-[10px] rounded-full px-1">{count}</span>}</Link>
            <button className="md:hidden min-h-[44px] min-w-[44px]" aria-label="Search" onClick={() => setMobileSearch((v) => !v)}>🔍</button>
          </div>
        </div>
        {mobileSearch && <div className="md:hidden px-3 pb-3"><SearchBar /></div>}
        <nav className="hidden lg:block border-t" aria-label="Categories">
          <ul className="max-w-7xl mx-auto px-4 flex gap-5 text-sm font-bold py-2 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <li key={c.slug} className="group relative">
                <Link href={c.slug === "sale" ? "/sale" : c.slug === "new" ? "/new" : `/category/${c.slug}`} className={c.slug === "sale" ? "text-red-600" : ""}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-label="Menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-white overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-3">
              <strong>imphalfurniture</strong>
              <button className="min-h-[44px] min-w-[44px]" aria-label="Close menu" onClick={() => setOpen(false)}>✕</button>
            </div>
            {CATEGORIES.map((c) => (
              <details key={c.slug} className="border-b py-2">
                <summary className="font-bold cursor-pointer py-2">{c.name}</summary>
                <div className="pl-3 pb-2 text-sm">
                  <Link href={c.slug === "sale" ? "/sale" : c.slug === "new" ? "/new" : `/category/${c.slug}`} onClick={() => setOpen(false)} className="block py-2">Shop all {c.name}</Link>
                </div>
              </details>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="block py-3 font-bold">Contact & Help</Link>
          </div>
        </div>
      )}
    </header>
  );
}
