"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/hooks";
import { INR, deliveryFee, zoneForPin } from "@/lib/store";

function matchZone(pins: string, pin: string) {
  const parts = pins.split(/[,\s]+/).filter(Boolean);
  for (const part of parts) {
    if (part.includes("–") || part.includes("-")) {
      const [a, b] = part.split(/[–-]/).map((x) => parseInt(x, 10));
      const n = parseInt(pin, 10);
      if (!isNaN(a) && !isNaN(b) && !isNaN(n) && n >= a && n <= b) return true;
    } else if (part === pin) return true;
  }
  return false;
}

export default function CheckoutPage() {
  const cart = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", line1: "", city: "Imphal", state: "Manipur", pin: cart.pin || "795001", mode: "delivery", pay: "upi" });
  const [done, setDone] = useState("");
  const [site, setSite] = useState<any>(null);
  const [promo, setPromo] = useState("");
  const [off, setOff] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  useEffect(() => { fetch("/api/site").then((r) => r.json()).then(setSite).catch(() => {}); }, []);
  const sub = cart.subtotal();
  const zones: any[] | null = site?.delivery?.length ? site.delivery : null;
  const zone = zones ? zones.find((z: any) => matchZone(z.pins, form.pin || "795001")) || zones[zones.length - 1] : zoneForPin(form.pin || "795001");
  const fee = cart.lines.length ? (form.mode === "pickup" ? 0 : zones ? ((sub - off) >= (zone.freeAbove || 0) ? 0 : zone.charge) : deliveryFee(form.pin || "795001", sub - off)) : 0;
  const pays: any = site?.payments || { upi: { enabled: true, label: "UPI (GPay / PhonePe / Paytm)" }, card: { enabled: true, label: "Credit / Debit Card" }, cod: { enabled: true, label: "Cash on Delivery (Imphal & Manipur)" }, emi: { enabled: false, label: "EMI (cards)" } };
  const payKeys = Object.keys(pays).filter((k) => pays[k]?.enabled);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const applyPromo = async () => {
    setPromoMsg("");
    const res = await fetch("/api/coupons/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: promo, subtotal: sub }) });
    const j = await res.json();
    if (j.ok) { setOff(j.off); setPromoMsg(`Applied ${j.code} — you save ${INR(j.off)}`); }
    else { setOff(0); setPromoMsg(j.error || "Invalid coupon"); }
  };
  if (done) return <div className="max-w-2xl mx-auto p-10 text-center"><p className="text-5xl">✅</p><h1 className="text-2xl font-extrabold mt-3">Order confirmed</h1><p className="text-sm text-gray-600 mt-1">Order <strong>{done}</strong> · We emailed your invoice. {zone.label} dispatch in {zone.days}.</p><a href="/account/orders" className="inline-block mt-5 bg-[#D21F26] text-white font-bold px-8 py-3 rounded-full">Track in My Orders</a></div>;
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
      <form className="space-y-4" onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, lines: cart.lines, coupon: promo || undefined, discount: off }) });
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
            {[["delivery", "Home Delivery"], ["pickup", "Click & Collect — Planet Interio Store, Canchipur"]].map(([v, l]) => (
              <button type="button" key={v} onClick={() => set("mode", v)} aria-pressed={form.mode === v} className={`border rounded-full px-4 py-2 min-h-[44px] ${form.mode === v ? "bg-black text-white font-bold" : ""}`}>{l}</button>
            ))}
          </div>
        </section>
        <section className="bg-white border rounded-2xl p-4 text-sm">
          <h2 className="font-extrabold mb-2">3 · Payment (INR ₹)</h2>
          <div className="grid gap-2">
            {payKeys.map((v) => (
              <label key={v} className="flex gap-2 border rounded-xl px-3 py-2.5"><input type="radio" name="pay" checked={form.pay === v} onChange={() => set("pay", v)} /> {pays[v].label || v}{pays[v].details ? ` — ${pays[v].details}` : ""}</label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Card numbers never touch our servers; COD available in Imphal & Manipur.</p>
        </section>
        <button className="bg-[#D21F26] text-white font-extrabold rounded-full px-8 py-3 min-h-[48px]">Place Order · {INR(sub - off + fee)}</button>
      </form>
      <aside className="bg-white border rounded-2xl p-5 h-fit text-sm">
        <h2 className="font-extrabold mb-2">Order summary</h2>
        {cart.lines.map((l) => <p key={l.slug + l.variant} className="flex justify-between py-1"><span>{l.title} × {l.qty}</span><strong>{INR(l.price * l.qty)}</strong></p>)}
        <div className="flex gap-2 mt-2">
          <input value={promo} onChange={(e) => setPromo(e.target.value.toUpperCase())} placeholder="Promo code" aria-label="Promo code" className="border rounded-lg px-3 py-2 flex-1 uppercase" />
          <button type="button" onClick={applyPromo} className="border rounded-lg px-4 font-bold">Apply</button>
        </div>
        {promoMsg && <p role="status" className={`text-xs mt-1 ${off ? "text-green-700" : "text-red-600"}`}>{promoMsg}</p>}
        <p className="flex justify-between border-t pt-2 mt-2"><span>Subtotal</span><strong>{INR(sub)}</strong></p>
        {off > 0 && <p className="flex justify-between text-green-700"><span>Discount</span><strong>−{INR(off)}</strong></p>}
        <p className="flex justify-between"><span>Delivery ({zone.label})</span><strong>{fee === 0 ? "FREE" : INR(fee)}</strong></p>
        <p className="flex justify-between text-lg"><span>Total</span><strong>{INR(sub - off + fee)}</strong></p>
      </aside>
    </div>
  );
}
