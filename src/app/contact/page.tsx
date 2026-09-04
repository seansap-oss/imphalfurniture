"use client";
import { useState } from "react";
export default function Contact() {
  const [ok, setOk] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold">Contact & Help</h1>
      <p className="text-sm text-gray-600 mt-1">Kwakeithel Bazar, Imphal West 795001 · +91 385 241 0000 · care@imphalfurniture.com · Mon–Sat 10–8, Sun 11–6</p>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <form className="bg-white border rounded-2xl p-4 space-y-2 text-sm" onSubmit={(e) => { e.preventDefault(); setOk(true); }}>
          <h2 className="font-extrabold">Send us a message</h2>
          <input required placeholder="Name" className="border rounded-lg px-3 py-2.5 w-full" aria-label="Name" />
          <input required type="email" placeholder="Email" className="border rounded-lg px-3 py-2.5 w-full" aria-label="Email" />
          <input placeholder="Order number (optional)" className="border rounded-lg px-3 py-2.5 w-full" aria-label="Order number" />
          <select className="border rounded-lg px-3 py-2.5 w-full" aria-label="Topic"><option>Delivery / Click & Collect</option><option>Cancellation / Returns / Warranty</option><option>Online payment help</option><option>Product question</option></select>
          <textarea required placeholder="How can we help?" className="border rounded-lg px-3 py-2.5 w-full" aria-label="Message" />
          <button className="bg-[#FFD400] font-extrabold rounded-full px-6 py-2.5">Send</button>
          {ok && <p role="status" className="text-green-700">Thanks — we reply within one working day.</p>}
        </form>
        <div className="text-sm space-y-4" id="faq">
          <div className="bg-white border rounded-2xl p-4"><h2 className="font-extrabold">Delivery / Click & Collect</h2><p className="text-gray-600 mt-1">Imphal Core (795001–795004): same/next-day. Greater Imphal: 1–2 days. Manipur: 2–5 days. Or collect free from Imphal Main Store with SMS confirmation.</p></div>
          <div className="bg-white border rounded-2xl p-4"><h2 className="font-extrabold">Cancellation / Returns / Warranty</h2><p className="text-gray-600 mt-1">Cancel before dispatch for a full refund. 7-day returns for manufacturing defects; 12-month warranty. Raise requests from My Orders.</p></div>
          <div className="bg-white border rounded-2xl p-4"><h2 className="font-extrabold">Online payments</h2><p className="text-gray-600 mt-1">UPI, cards, EMI and Cash on Delivery (Imphal & Manipur). Failed payment? Money auto-reverses in 3–5 days — contact us with the order ID.</p></div>
        </div>
      </div>
    </div>
  );
}
