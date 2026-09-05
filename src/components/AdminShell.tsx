"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export const NAV: [string, string][] = [
  ["Dashboard", "/admin/dashboard"], ["Website Editor", "/admin/website"], ["Homepage", "/admin/homepage"],
  ["Hero / Banners", "/admin/hero"], ["Products", "/admin/products"], ["Categories", "/admin/categories"],
  ["Packages", "/admin/packages"], ["Package Enquiries", "/admin/enquiries"], ["Collections", "/admin/collections"],
  ["Brands", "/admin/brands"], ["Orders", "/admin/orders"], ["Customers", "/admin/customers"],
  ["Discounts", "/admin/discounts"], ["Pages", "/admin/pages"], ["Blog / News", "/admin/blog"],
  ["Media Library", "/admin/media"], ["Menus", "/admin/menus"], ["Header", "/admin/header"],
  ["Footer", "/admin/footer"], ["Contact Details", "/admin/contact"], ["Social Media", "/admin/social"],
  ["WhatsApp Buttons", "/admin/floating"], ["Announcement", "/admin/announcement"], ["SEO", "/admin/seo"],
  ["Appearance", "/admin/appearance"], ["Branding", "/admin/branding"], ["Delivery", "/admin/delivery"],
  ["Payments", "/admin/payments"], ["Users & Roles", "/admin/users"], ["Analytics", "/admin/analytics"],
  ["History", "/admin/history"], ["Settings", "/admin/settings"]
];

export default function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<any>(null);
  const [q, setQ] = useState("");
  const [notes, setNotes] = useState(0);
  useEffect(() => {
    fetch("/api/admin/session").then((r) => r.json()).then((j) => setMe(j.ok ? j : null)).catch(() => {});
    fetch("/api/cms?collection=enquiries").then((r) => r.json()).then((j) => setNotes((j.data || []).filter((x: any) => x.status === "new").length)).catch(() => {});
  }, []);
  const go = () => {
    if (!q.trim()) return;
    window.location.href = `/admin/products?q=${encodeURIComponent(q)}`;
  };
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className={`bg-[#0B1B33] text-white fixed lg:static inset-y-0 left-0 w-[270px] z-50 overflow-y-auto transition ${open ? "" : "hidden lg:block"}`}>
        <div className="p-4 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/pi-mark.svg" alt="Planet Interio" className="h-9 w-9" />
          <div><p className="font-extrabold text-[#FF6B6B] leading-none">Planet Interio</p><p className="text-[11px] text-white/60">admin panel</p></div>
        </div>
        <nav className="px-2 pb-4 space-y-0.5 text-sm" aria-label="Admin">
          {NAV.map(([t, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} className={`block px-3 py-2 rounded-lg hover:bg-white/10 min-h-[40px] ${title === t ? "bg-white/10 border-l-2 border-[#D21F26]" : ""}`}>{t}</Link>)}
        </nav>
        <div className="p-3 border-t border-white/10 grid gap-1 text-sm">
          <a href="/" target="_blank" rel="noopener" className="px-3 py-2 rounded-lg hover:bg-white/10">👁 View Website</a>
          <button onClick={() => fetch("/api/admin/session", { method: "DELETE" }).then(() => (window.location.href = "/admin"))} className="text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white/70">Logout</button>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="bg-white border-b px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3 sticky top-0 z-30">
          <button className="lg:hidden min-h-[44px] min-w-[44px]" aria-label="Admin menu" onClick={() => setOpen((v) => !v)}>☰</button>
          <h1 className="font-extrabold truncate">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <form onSubmit={(e) => { e.preventDefault(); go(); }} className="hidden sm:block" role="search">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Global search" className="border rounded-full px-3 py-1.5 text-sm w-44" />
            </form>
            <Link href="/admin/enquiries" className="relative min-h-[44px] min-w-[44px] grid place-items-center" aria-label="Notifications">🔔{notes > 0 && <span className="absolute top-1 right-0 bg-[#D21F26] text-white text-[10px] rounded-full px-1.5">{notes}</span>}</Link>
            <a href="/" target="_blank" rel="noopener" className="hidden sm:block text-xs underline">View Website</a>
            <span className="text-xs bg-gray-100 rounded-full px-2.5 py-1.5 font-bold truncate max-w-[140px]" title={me?.email || ""}>{me?.email?.split("@")[0] || "…"}</span>
          </div>
        </div>
        <div className="p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}
