"use client";
import { useState } from "react";
import { useCart } from "@/lib/hooks";
import { INR, deliveryFee, zoneForPin } from "@/lib/store";

export default function CheckoutPage() {
  const cart = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", line1: "", city: "Imphal", state: "Manipur", pin: cart.pin || "795001", mode: "delivery", pay: "upi" });
  const [done, setDone] = useState("");
  const sub = cart.subtotal();
  const fee = cart.lines.length ? deliveryFee(form.pin || "795001", sub) : 0;
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  if (done) return <div className="max-w-2xl mx-auto p-10 text-center"><p className="text-5xl">✅</p><h1 className="text-2xl font-extrabold mt-3">Order confirmed</h1><p className="text-sm text-gray-600 mt-1">Order <strong>{done}</strong> · We emailed your invoice. {zoneForPin(form.pin).label} dispatch in {zoneForPin(form.pin).days}.</p><a href="/account/orders" className="inline-block mt-5 bg-[#FFD400] font-bold px-8 py-3 rounded-full">Track in My Orders</a></div>;
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
      <form className="space-y-4" onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, lines: cart.lines }) });
        const j = await res.json();
        if (j.ok) { setDone(j.order); cart.clear(); } else alert(j.error || "Checkout failed");
      }}>
        <h1 className="text-2xl font-extrabold">Checkout</h1>
        <section className="bg-white border rounded-2xl p-4 grid sm:grid-cols-2 gap-3 text-sm">
          <h2 className="sm:col-span-2 font-extrabold">1 · Contact & delivery address</h2>
          {[["name", "Full name"], ["phone", "Mobile (10-digit)"], ["email", "Email"], ["line1", "Address line 1"], ["city", "City"], ["pin", "PIN code"]].map(([k, l]) => (
            <label key={k}>{l}<input required value={(form as any)[k]} onChange={(e) => set(k as any, e.target.value)} className="mt-1 border rounded-lg px-3 py-2.5 w-full" /></label>
          ))}
          <label>State<input value={form.state} onChange={(e) => set("state", e.target.value)} className="mt-1 border rounded-lg px-3 py-2.5 w-full" /></label>
          <label>Country<input value="India" disabled className="mt-1 border rounded-lg px-3 py-2.5 w-full bg-gray-50" /></label>
        </section>
        <section className="bg-white border rounded-2xl p-4 text-sm">
          <h2 className="font-extrabold mb-2">2 · Fulfilment</h2>
          <div className="flex gap-2 flex-wrap">
            {[["delivery", "Home Delivery"], ["pickup", "Click & Collect — Imphal Main Store"]].map(([v, l]) => (
              <button type="button" key={v} onClick={() => set("mode", v)} aria-pressed={form.mode === v} className={`border rounded-full px-4 py-2 min-h-[44px] ${form.mode === v ? "bg-black text-white font-bold" : ""}`}>{l}</button>
            ))}
          </div>
        </section>
        <section className="bg-white border rounded-2xl p-4 text-sm">
          <h2 className="font-extrabold mb-2">3 · Payment (INR ₹)</h2>
          <div className="grid gap-2">
            {[["upi", "UPI (GPay / PhonePe / Paytm)"], ["card", "Credit / Debit Card"], ["cod", "Cash on Delivery (Imphal & Manipur)"], ["emi", "EMI (cards)"]].map(([v, l]) => (
              <label key={v} className="flex gap-2 border rounded-xl px-3 py-2.5"><input type="radio" name="pay" checked={form.pay === v} onChange={() => set("pay", v)} /> {l}</label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Payments are processed via Razorpay/Stripe abstraction server-side. Card numbers never touch our servers in this build; COD available in {zoneForPin(form.pin).cod ? "your zone" : "Imphal/Manipur only — please pick UPI"}.</p>
        </section>
        <button className="bg-[#FFD400] font-extrabold rounded-full px-8 py-3 min-h-[48px]">Place Order · {INR(sub + fee)}</button>
      </form>
      <aside className="bg-white border rounded-2xl p-5 h-fit text-sm">
        <h2 className="font-extrabold mb-2">Order summary</h2>
        {cart.lines.map((l) => <p key={l.slug + l.variant} className="flex justify-between py-1"><span>{l.title} × {l.qty}</span><strong>{INR(l.price * l.qty)}</strong></p>)}
        <p className="flex justify-between border-t pt-2 mt-2"><span>Subtotal</span><strong>{INR(sub)}</strong></p>
        <p className="flex justify-between"><span>Delivery ({zoneForPin(form.pin).label})</span><strong>{fee === 0 ? "FREE" : INR(fee)}</strong></p>
        <p className="flex justify-between text-lg"><span>Total</span><strong>{INR(sub + fee)}</strong></p>
      </aside>
    </div>
  );
}
