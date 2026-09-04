"use client";
import { useEffect, useState } from "react";
export default function OrderDetail({ params }: { params: { id: string } }) {
  const [o, setO] = useState<any>(null);
  useEffect(() => { fetch("/api/orders").then((r) => r.json()).then((j) => setO((j.orders || []).find((x: any) => x.id === decodeURIComponent(params.id)) || null)); }, [params.id]);
  if (!o) return <div className="max-w-3xl mx-auto p-8"><h1 className="text-xl font-extrabold">Order {decodeURIComponent(params.id)}</h1><p className="text-sm text-gray-500">Loading…</p></div>;
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-sm">
      <h1 className="text-2xl font-extrabold">Order {o.id}</h1>
      <p className="text-gray-600">Status: <strong>{o.status}</strong> · Payment: {o.pay} · Total ₹{o.total?.toLocaleString("en-IN")}</p>
      <div className="bg-white border rounded-2xl p-4 mt-4">{o.items?.map((i: any, k: number) => <p key={k} className="py-1">{i.title} × {i.qty}</p>)}</div>
      <form className="bg-white border rounded-2xl p-4 mt-4 space-y-2" onSubmit={(e) => { e.preventDefault(); alert("Return request submitted — our Imphal team will call you to schedule collection."); }}>
        <h2 className="font-extrabold">Request return / cancellation</h2>
        <select className="border rounded-lg px-3 py-2 w-full" aria-label="Reason"><option>Changed mind</option><option>Damaged on delivery</option><option>Wrong item</option><option>Warranty issue</option></select>
        <textarea placeholder="Notes" className="border rounded-lg px-3 py-2 w-full" aria-label="Notes" />
        <button className="bg-black text-white rounded-full px-6 py-2.5 font-bold">Submit request</button>
      </form>
    </div>
  );
}
