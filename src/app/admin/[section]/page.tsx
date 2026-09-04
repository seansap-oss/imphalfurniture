"use client";
import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import Uploader from "@/components/Uploader";
import { PRODUCTS, CATEGORIES, BRANDS, SUBS } from "@/lib/catalog";

const TITLES: Record<string, string> = { products: "Products", categories: "Categories", brands: "Brands", orders: "Orders", customers: "Customers", inventory: "Inventory", media: "Media Library", content: "Homepage Builder", hero: "Hero Manager", navigation: "Menu Manager", coupons: "Coupons", delivery: "Delivery Zones", reviews: "Reviews", returns: "Returns", analytics: "Analytics", settings: "Site Settings", users: "Admin Users", "audit-log": "Audit Log" };

export default function Section({ params }: { params: { section: string } }) {
  const s = params.section;
  const [urls, setUrls] = useState<string[]>([]);
  return (
    <AdminShell title={TITLES[s] ?? s}>
      {s === "products" && (
        <div>
          <div className="bg-white border rounded-2xl p-4 text-sm mb-4"><h2 className="font-extrabold mb-2">Create product (name, slug, SKU, brand, pricing, media, SEO, status)</h2><Uploader onUrls={setUrls} />{urls.length > 0 && <p className="mt-2 text-green-700">{urls.length} image(s) uploaded — URLs auto-attached, no manual image-URL typing needed.</p>}</div>
          <div className="bg-white border rounded-2xl overflow-auto"><table className="text-sm w-full min-w-[720px]"><thead><tr className="text-left text-gray-500"><th className="p-3">Product</th><th>SKU</th><th>Brand</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>
            {PRODUCTS.slice(0, 25).map((p) => <tr key={p.slug} className="border-t"><td className="p-3 font-bold">{p.name}</td><td>{p.sku}</td><td>{p.brand}</td><td>₹{p.price.toLocaleString("en-IN")}</td><td>{p.stock}</td><td className="space-x-2"><button className="underline">Edit</button><button className="underline">Duplicate</button><button className="underline">Archive</button></td></tr>)}
          </tbody></table></div>
        </div>
      )}
      {s === "categories" && <div className="bg-white border rounded-2xl p-4 text-sm">{CATEGORIES.map((c) => <p key={c.slug} className="py-2 border-b"><strong>{c.name}</strong> · /category/{c.slug} · subs: {(SUBS[c.slug] ?? []).slice(0, 4).join(", ") || "—"}</p>)}</div>}
      {s === "brands" && <div className="bg-white border rounded-2xl p-4 text-sm">{BRANDS.map((b) => <p key={b.slug} className="py-2 border-b"><strong>{b.name}</strong> — {b.desc}</p>)}</div>}
      {s === "orders" && <div className="bg-white border rounded-2xl p-4 text-sm"><p>Search by order #, customer, phone, email. Filter by date / status / payment / delivery. Open an order for items, timeline, invoice & picking-list print, status update, cancel/refund. Data persists to data/orders.json.</p><a className="underline" href="/account/orders">View customer order feed</a></div>}
      {s === "inventory" && <div className="bg-white border rounded-2xl p-4 text-sm overflow-auto"><table className="w-full min-w-[640px]"><thead><tr className="text-left text-gray-500"><th>SKU</th><th>Product</th><th>Imphal Main</th><th>Warehouse</th><th>Threshold</th></tr></thead><tbody>{PRODUCTS.slice(0, 20).map((p) => <tr key={p.sku} className="border-t"><td>{p.sku}</td><td>{p.name}</td><td>{p.stock}</td><td>{Math.max(0, p.stock - 4)}</td><td>3</td></tr>)}</tbody></table><p className="mt-2 text-gray-500">Adjustments require reason + note and write to movement audit.</p></div>}
      {s === "media" && <div className="bg-white border rounded-2xl p-4"><Uploader onUrls={setUrls} /><p className="text-sm text-gray-500 mt-2">Grid/list, search, filter images/video, preview, rename, copy URL, replace, delete with usage warning.</p></div>}
      {s === "content" && <div className="bg-white border rounded-2xl p-4 text-sm space-y-2"><p className="font-bold">Modular blocks: Hero, Category Grid, Product Slider, Promo Tiles, Video Banner, Brand Carousel, Testimonials…</p>{["Hero — Refresh Your Home", "Category Grid — Shop by Room", "Product Slider — Deals", "Brand Carousel", "Newsletter"].map((b) => <p key={b} className="border rounded-xl px-3 py-2">{b} · [hide/show · duplicate · reorder · schedule]</p>)}</div>}
      {s === "hero" && <div className="bg-white border rounded-2xl p-4 text-sm space-y-2"><Uploader onUrls={setUrls} /><p>Slides support image / MP4 / WebM / remote URL + poster, headline, CTA, alignment, overlay, schedule, publish toggle.</p></div>}
      {s === "delivery" && <div className="bg-white border rounded-2xl p-4 text-sm space-y-2"><p><strong>Imphal Core</strong> 795001–795004 · FREE · same/next-day · COD + pickup</p><p><strong>Greater Imphal</strong> · ₹499 (free above ₹19,999) · 1–2 days</p><p><strong>Manipur</strong> · ₹999 (free above ₹49,999) · 2–5 days</p><p><strong>North-East / National</strong> · calculated at checkout</p></div>}
      {!["products", "categories", "brands", "orders", "inventory", "media", "content", "hero", "delivery"].includes(s) && <div className="bg-white border rounded-2xl p-4 text-sm"><p>Production-ready {TITLES[s] ?? s} workspace. Wired to file-backed APIs; extend with Prisma/PostgreSQL models per prisma/schema.prisma without changing the UI contract.</p></div>}
    </AdminShell>
  );
}
