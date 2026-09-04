"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart, useWishlist } from "@/lib/hooks";
import { INR, deliveryFee } from "@/lib/store";

export default function PDPClient(props: { slug: string; name: string; brand: string; sku: string; price: number; mrp: number; rating: number; reviews: number; colours: string[]; images: string[]; stock: number; avail: string; eta: string; material: string; desc: string; dims: string; related: { slug: string; name: string; price: number; image: string }[] }) {
  const [img, setImg] = useState(0);
  const [colour, setColour] = useState(props.colours[0]);
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("795001");
  const cart = useCart();
  const wish = useWishlist();
  const off = props.mrp > props.price ? Math.round(((props.mrp - props.price) / props.mrp) * 100) : 0;
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={props.images[img]} alt={props.name} className="w-full aspect-[4/3] object-cover rounded-2xl border" />
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {props.images.map((s, k) => (
              // eslint-disable-next-line @next/next/no-img-element
              <button key={k} onClick={() => setImg(k)} aria-label={`View image ${k + 1}`} className={`shrink-0 border-2 rounded-xl overflow-hidden ${k === img ? "border-black" : "border-transparent"}`}><img src={s} alt="" className="w-20 h-16 object-cover" loading="lazy" /></button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">{props.brand} · SKU {props.sku}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{props.name}</h1>
          <p className="text-sm mt-1">★ {props.rating} · {props.reviews} reviews · {props.material}</p>
          <p className="text-2xl mt-3"><strong>{INR(props.price)}</strong> {off > 0 && <><s className="text-gray-400 text-base">{INR(props.mrp)}</s> <span className="text-green-700 text-sm font-bold">{off}% off</span></>}</p>
          <p className="text-xs text-gray-500">Inclusive of GST · EMI from {INR(props.price / 12)}/mo</p>
          <div className="mt-4"><p className="font-bold text-sm mb-2">Colour: {colour}</p>
            <div className="flex gap-2">{props.colours.map((c) => <button key={c} onClick={() => setColour(c)} aria-pressed={colour === c} className={`border rounded-full px-4 py-2 text-sm min-h-[44px] ${colour === c ? "border-black bg-red-50 font-bold" : ""}`}>{c}</button>)}</div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <label className="font-bold text-sm">Qty <input type="number" min={1} max={10} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value))))} className="border rounded-lg w-16 px-2 py-2 ml-2" /></label>
            <span className="text-sm text-green-700 font-bold">{props.avail}</span>
          </div>
          <div className="mt-4 flex gap-2 items-center text-sm">
            <label>Delivery PIN <input value={pin} onChange={(e) => setPin(e.target.value)} className="border rounded-lg px-2 py-2 w-24 ml-1" inputMode="numeric" /></label>
            <span className="text-gray-600">Fee {pin ? INR(deliveryFee(pin, props.price * qty)) : "—"} · {props.stock > 0 ? "ETA " + props.eta : "Backorder"}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => { cart.add({ slug: props.slug, variant: colour, qty, price: props.price, title: props.name, image: props.images[0] }); alert("Added to cart"); }} className="bg-[#D21F26] text-white font-extrabold rounded-full py-3 min-h-[48px]">Add to Cart</button>
            <button onClick={() => { cart.add({ slug: props.slug, variant: colour, qty, price: props.price, title: props.name, image: props.images[0] }); window.location.href = "/checkout"; }} className="bg-black text-white font-extrabold rounded-full py-3 min-h-[48px]">Buy Now</button>
          </div>
          <button onClick={() => wish.toggle(props.slug)} className="mt-2 underline text-sm">{wish.has(props.slug) ? "♥ Saved to wishlist" : "♡ Save to wishlist"}</button>
          <dl className="mt-6 text-sm space-y-2 bg-white border rounded-2xl p-4">
            <div><dt className="font-bold">Description</dt><dd className="text-gray-600">{props.desc}</dd></div>
            <div><dt className="font-bold">Dimensions</dt><dd className="text-gray-600">{props.dims}</dd></div>
            <div><dt className="font-bold">Delivery</dt><dd className="text-gray-600">Imphal-first dispatch. Standard, Furniture Delivery & Click & Collect from the Planet Interio store, Canchipur.</dd></div>
            <div><dt className="font-bold">Returns & Warranty</dt><dd className="text-gray-600">7-day easy returns; 12-month manufacturing warranty. See /returns.</dd></div>
          </dl>
        </div>
      </div>
      {props.related.length > 0 && (
        <section className="mt-10" aria-label="Related products">
          <h2 className="text-xl font-extrabold mb-3">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {props.related.map((r) => (
              <Link key={r.slug} href={`/product/${r.slug}`} className="bg-white border rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt={r.name} className="w-full aspect-[4/3] object-cover" loading="lazy" />
                <p className="p-2 text-sm font-bold line-clamp-2">{r.name}</p>
                <p className="px-2 pb-2 text-sm">{INR(r.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
