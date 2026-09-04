"use client";
import { useEffect, useState } from "react";
export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { fetch("/api/orders").then((r) => r.json()).then((j) => setOrders(j.orders || [])).catch(() => {}); }, []);
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6">
      <h1 className="text-2xl font-extrabold">Orders</h1>
      {orders.length === 0 ? <div className="bg-white border rounded-2xl p-10 text-center mt-4"><p className="font-extrabold">No orders yet</p><a href="/" className="inline-block mt-3 bg-[#FFD400] font-bold px-6 py-2.5 rounded-full">Start shopping</a></div>
        : orders.map((o) => <div key={o.id} className="bg-white border rounded-2xl p-4 mt-3 text-sm"><p className="font-extrabold">{o.id} · {o.status} · ₹{o.total?.toLocaleString("en-IN")}</p><p className="text-gray-500">{o.date} · {o.items?.length} item(s) · {o.pay}</p><a className="underline" href={`/account/orders/${o.id}`}>View details & request return</a></div>)}
    </div>
  );
}
