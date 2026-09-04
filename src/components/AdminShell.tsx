"use client";
import Link from "next/link";
import { useState } from "react";
const NAV = [["Dashboard", "/admin/dashboard"], ["Products", "/admin/products"], ["Categories", "/admin/categories"], ["Brands", "/admin/brands"], ["Orders", "/admin/orders"], ["Customers", "/admin/customers"], ["Inventory", "/admin/inventory"], ["Media", "/admin/media"], ["Homepage", "/admin/content"], ["Hero", "/admin/hero"], ["Navigation", "/admin/navigation"], ["Coupons", "/admin/coupons"], ["Delivery", "/admin/delivery"], ["Reviews", "/admin/reviews"], ["Returns", "/admin/returns"], ["Analytics", "/admin/analytics"], ["Settings", "/admin/settings"], ["Admins", "/admin/users"], ["Audit Log", "/admin/audit-log"]];
export default function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className={`bg-[#111] text-white p-4 fixed lg:static inset-y-0 left-0 w-64 z-50 overflow-auto transition ${open ? "" : "hidden lg:block"}`}>
        <p className="font-extrabold text-[#FFD400]">imphalfurniture · admin</p>
        <nav className="mt-4 space-y-1 text-sm" aria-label="Admin">
          {NAV.map(([t, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-white/10 min-h-[44px]">{t}</Link>)}
        </nav>
        <button onClick={() => fetch("/api/admin/session", { method: "DELETE" }).then(() => (window.location.href = "/admin"))} className="mt-4 text-xs underline text-white/70">Logout</button>
      </aside>
      <div>
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button className="lg:hidden min-h-[44px] min-w-[44px]" aria-label="Admin menu" onClick={() => setOpen((v) => !v)}>☰</button>
          <h1 className="font-extrabold">{title}</h1>
          <a href="/" className="ml-auto text-xs underline">View store</a>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
