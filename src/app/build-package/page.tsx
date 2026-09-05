"use client";
import { useState } from "react";
const ROOMS = ["Bedroom furniture", "Living furniture", "Dining furniture", "Mattress", "Wardrobes", "Decor", "Other"];
export default function BuildPackage() {
  const [items, setItems] = useState<string[]>(["Bedroom furniture"]);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const toggle = (r: string) => setItems((v) => (v.includes(r) ? v.filter((x) => x !== r) : [...v, r]));
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Build Your Package / Request Custom Package</h1>
      <p className="text-sm text-gray-600 mt-1">Tell us what you need — our Canchipur team will call back with a quote on Call or WhatsApp.</p>
      {done ? <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mt-5"><p className="text-4xl">✅</p><h2 className="font-extrabold text-xl mt-2">Enquiry received</h2><p className="text-sm text-gray-600">We reply within one working day.</p></div> : (
        <form className="bg-white border rounded-2xl p-4 mt-5 space-y-3 text-sm" onSubmit={async (e) => {
          e.preventDefault(); setErr("");
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(fd.entries()), items, type: "custom-package" }) });
          const j = await res.json();
          if (j.ok) setDone(true); else setErr(j.error || "Failed — please WhatsApp us directly.");
        }}>
          <div><p className="font-bold mb-2">I need:</p><div className="flex flex-wrap gap-2">{ROOMS.map((r) => <button type="button" key={r} onClick={() => toggle(r)} aria-pressed={items.includes(r)} className={`border rounded-full px-4 py-2 min-h-[44px] ${items.includes(r) ? "bg-black text-white font-bold" : ""}`}>{r}</button>)}</div></div>
          <div className="grid sm:grid-cols-2 gap-2">
            <input name="name" required placeholder="Your name" className="border rounded-lg px-3 py-2.5" aria-label="Name" />
            <input name="phone" required placeholder="Phone" className="border rounded-lg px-3 py-2.5" aria-label="Phone" />
            <input name="whatsapp" placeholder="WhatsApp (if different)" className="border rounded-lg px-3 py-2.5" aria-label="WhatsApp" />
            <input name="email" type="email" placeholder="Email (optional)" className="border rounded-lg px-3 py-2.5" aria-label="Email" />
            <input name="budget" placeholder="Budget ₹ (optional)" className="border rounded-lg px-3 py-2.5" aria-label="Budget" />
            <input name="date" placeholder="Wedding / delivery date (optional)" className="border rounded-lg px-3 py-2.5" aria-label="Date" />
          </div>
          <input name="address" placeholder="Delivery address" className="border rounded-lg px-3 py-2.5 w-full" aria-label="Address" />
          <textarea name="notes" placeholder="Notes — rooms, sizes, colours you like…" className="border rounded-lg px-3 py-2.5 w-full" aria-label="Notes" />
          <button className="bg-[#D21F26] text-white font-extrabold rounded-full px-8 py-3">Submit Enquiry</button>
          {err && <p role="alert" className="text-red-600">{err}</p>}
        </form>
      )}
    </div>
  );
}
