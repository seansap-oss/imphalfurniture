"use client";
import Link from "next/link";
import { useCart } from "@/lib/hooks";
import { INR, deliveryFee } from "@/lib/store";

export default function CartPage() {
  const cart = useCart();
  const sub = cart.subtotal();
  const fee = cart.lines.length ? deliveryFee(cart.pin, sub) : 0;
  if (cart.lines.length === 0)
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl">🛋️</p>
        <h1 className="text-2xl font-extrabold mt-3">Your cart is empty</h1>
        <p className="text-sm text-gray-500 mt-1">Beautiful rooms start with a single piece.</p>
        <Link href="/" className="inline-block mt-5 bg-[#D21F26] text-white font-extrabold px-8 py-3 rounded-full">Explore Furniture</Link>
      </div>
    );
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Cart ({cart.lines.length})</h1>
        <div className="space-y-3 mt-4">
          {cart.lines.map((l) => (
            <div key={l.slug + l.variant} className="bg-white border rounded-2xl p-3 flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.image} alt="" className="w-24 h-20 object-cover rounded-xl" />
              <div className="flex-1 text-sm">
                <p className="font-bold">{l.title} {l.variant && <span className="text-gray-500">· {l.variant}</span>}</p>
                <p className="text-gray-500">{INR(l.price)} each</p>
                <div className="flex gap-2 items-center mt-2">
                  <button aria-label="Decrease" className="border rounded-full w-9 h-9" onClick={() => cart.setQty(l.slug, l.variant, l.qty - 1)}>−</button>
                  <span>{l.qty}</span>
                  <button aria-label="Increase" className="border rounded-full w-9 h-9" onClick={() => cart.setQty(l.slug, l.variant, l.qty + 1)}>+</button>
                  <button className="underline text-xs ml-2" onClick={() => cart.remove(l.slug, l.variant)}>Remove</button>
                </div>
              </div>
              <strong className="text-sm">{INR(l.price * l.qty)}</strong>
            </div>
          ))}
        </div>
      </div>
      <aside className="bg-white border rounded-2xl p-5 h-fit text-sm space-y-2">
        <label className="block">Delivery PIN <input value={cart.pin} onChange={(e) => cart.setPin(e.target.value)} className="border rounded-lg px-2 py-2 w-28 ml-2" inputMode="numeric" /></label>
        <p className="flex justify-between"><span>Subtotal</span><strong>{INR(sub)}</strong></p>
        <p className="flex justify-between"><span>Delivery</span><strong>{fee === 0 ? "FREE" : INR(fee)}</strong></p>
        <p className="flex justify-between text-lg"><span>Total</span><strong>{INR(sub + fee)}</strong></p>
        <Link href="/checkout" className="block text-center bg-[#D21F26] text-white font-extrabold rounded-full py-3 mt-2">Checkout Securely</Link>
        <Link href="/" className="block text-center underline mt-1">Continue shopping</Link>
      </aside>
    </div>
  );
}
