"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Field, inp, Toggle, SaveBar, StatusPill, Confirm, Empty, Thumb, MediaPicker, api, cmsGet, cmsPut, cmsPost, cmsDel } from "./ui";

// ============================== DASHBOARD ==============================
export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const [o, p, s] = await Promise.all([api("/api/admin/orders").catch(() => null), api("/api/products?admin=1").catch(() => null), api("/api/site").catch(() => null)]);
      const orders = o?.orders || [];
      const revenue = orders.filter((x: any) => !["Cancelled", "Refunded"].includes(x.status)).reduce((t: number, x: any) => t + (x.total || 0), 0);
      setStats({
        products: p?.total || 0, categories: s?.categories?.length || 0,
        packages: (s?.packages || []).length, orders: orders.length, revenue,
        pending: orders.filter((x: any) => ["Pending", "Confirmed", "Processing"].includes(x.status)).length,
        low: (p?.products || []).filter((x: any) => (x.stock || 0) <= 3).length,
        recent: orders.slice(0, 5)
      });
    })();
  }, []);
  if (!stats) return <Card><p>Loading dashboard…</p></Card>;
  const cards: [string, string][] = [["Products", String(stats.products)], ["Categories", String(stats.categories)], ["Packages", String(stats.packages)], ["Orders", String(stats.orders)], ["Revenue", `₹${stats.revenue.toLocaleString("en-IN")}`], ["Pending orders", String(stats.pending)], ["Low stock", String(stats.low)]];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map(([t, v]) => <Card key={t}><p className="text-xs text-gray-500">{t}</p><p className="text-xl font-extrabold">{v}</p></Card>)}
      </div>
      <div className="grid lg:grid-cols-[1fr_280px] gap-4 mt-4">
        <Card>
          <h2 className="font-extrabold mb-2">Recent orders</h2>
          {stats.recent.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
          {stats.recent.map((o: any) => <p key={o.id} className="text-sm py-1.5 border-t flex justify-between"><span><strong>{o.id}</strong> · {o.name} · {o.status}</span><strong>₹{(o.total || 0).toLocaleString("en-IN")}</strong></p>)}
          <Link href="/admin/orders" className="text-sm underline font-bold">Open orders →</Link>
        </Card>
        <Card>
          <h2 className="font-extrabold mb-2">Quick actions</h2>
          <div className="grid gap-2 text-sm font-bold">
            {[["+ Add Product", "/admin/products"], ["+ Add Category", "/admin/categories"], ["+ Create Package", "/admin/packages"], ["+ Add Hero Slide", "/admin/hero"], ["+ Upload Media", "/admin/media"], ["+ Create Discount", "/admin/discounts"], ["+ Create Page", "/admin/pages"]].map(([t, h]) => <Link key={h + t} href={h} className="bg-black text-white rounded-full px-4 py-2.5 text-center">{t}</Link>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================== WEBSITE EDITOR ==============================
const FIXED_ROWS: [string, string, string][] = [
  ["HEADER", "Logo, menu, search & icons", "/admin/header"], ["ANNOUNCEMENT BAR", "Top offer messages", "/admin/announcement"],
  ["NAVIGATION", "Menu links", "/admin/menus"], ["FOOTER", "Columns, contact, social", "/admin/footer"],
  ["FLOATING CONTACT BUTTONS", "WhatsApp + Call", "/admin/floating"]
];
export function WebsiteEditor() {
  const [sections, setSections] = useState<any[]>([]);
  const load = async () => { const s = await cmsGet("sections"); setSections([...s].sort((a: any, b: any) => a.sort - b.sort)); };
  useEffect(() => { load(); }, []);
  const saveOrder = async (next: any[]) => { setSections(next); await cmsPut("sections", next.map((s, i) => ({ ...s, sort: i }))); };
  const move = (i: number, d: number) => { const n = [...sections]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; saveOrder(n); };
  const toggle = async (s: any) => { const n = sections.map((x) => (x.id === s.id ? { ...x, visible: !x.visible } : x)); setSections(n); await cmsPut("sections", n); };
  const dup = async (s: any) => { const c = { ...s, id: `${s.id}-copy-${Date.now().toString(36)}`, title: `${s.title} (Copy)` }; const n = [...sections, c]; setSections(n); await cmsPut("sections", n); };
  const del = async (s: any) => { if (!confirm(`Delete section “${s.title}”?`)) return; const n = sections.filter((x) => x.id !== s.id); setSections(n); await cmsPut("sections", n); };
  const onDrop = (e: React.DragEvent, i: number) => { e.preventDefault(); const from = Number(e.dataTransfer.getData("text/plain")); if (isNaN(from) || from === i) return; const n = [...sections]; const [m] = n.splice(from, 1); n.splice(i, 0, m); saveOrder(n); };
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Drag cards to reorder the homepage. Changes go live on Save automatically.</p>
      {FIXED_ROWS.map(([t, d, h]) => (
        <Card key={t}><div className="flex items-center gap-3 text-sm"><span className="text-2xl">🧩</span><div className="flex-1"><p className="font-extrabold">{t}</p><p className="text-gray-500 text-xs">{d}</p></div><Link href={h} className="border rounded-full px-4 py-2 font-bold">Edit</Link></div></Card>
      ))}
      {sections.map((s, i) => (
        <Card key={s.id}>
          <div draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, i)} className="flex items-center gap-3 text-sm cursor-grab">
            <span className="text-gray-300">⋮⋮</span>
            <div className="flex-1"><p className="font-extrabold">{s.title || s.type} {!s.visible && <span className="text-xs font-normal text-gray-400">(hidden)</span>}</p><p className="text-gray-500 text-xs">{s.type}{s.subtitle ? ` — ${s.subtitle}` : ""}</p></div>
            <Toggle value={!!s.visible} onChange={() => toggle(s)} label={`Show ${s.title}`} />
            <button onClick={() => move(i, -1)} className="border rounded-lg px-2" aria-label="Move up">↑</button>
            <button onClick={() => move(i, 1)} className="border rounded-lg px-2" aria-label="Move down">↓</button>
            <button onClick={() => dup(s)} className="underline text-xs">Duplicate</button>
            <Link href="/admin/homepage" className="underline text-xs">Edit</Link>
            <button onClick={() => del(s)} className="underline text-xs text-red-600">Delete</button>
          </div>
        </Card>
      ))}
      <Link href="/" target="_blank" rel="noopener" className="inline-block bg-black text-white rounded-full px-6 py-2.5 text-sm font-bold">Preview website ↗</Link>
    </div>
  );
}

// ============================== HOMEPAGE SECTIONS ==============================
export function HomepageSections() {
  const [sections, setSections] = useState<any[]>([]);
  const [all, setAll] = useState<any[]>([]);
  const load = async () => { setSections((await cmsGet("sections")).sort((a: any, b: any) => a.sort - b.sort)); const p = await api("/api/products?admin=1").catch(() => null); setAll(p?.products || []); };
  useEffect(() => { load(); }, []);
  const save = async (s: any) => { await cmsPut("sections", s, s.id); };
  const edit = (id: string, patch: any) => setSections((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const saveOne = async (s: any) => { await save(s); };
  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <Card key={s.id}>
          <div className="flex items-center gap-2"><p className="font-extrabold">{s.title || s.type}</p><span className="text-xs text-gray-400">{s.type}</span>
            <span className="ml-auto" /><Toggle value={!!s.visible} onChange={(v) => { const n = { ...s, visible: v }; edit(s.id, { visible: v }); saveOne(n); }} label="Visible" />
          </div>
          <div className="grid sm:grid-cols-2 gap-2 mt-2 text-sm">
            <Field label="Title"><input value={s.title || ""} onChange={(e) => edit(s.id, { title: e.target.value })} onBlur={() => saveOne(sections.find((x) => x.id === s.id))} className={inp} /></Field>
            <Field label="Subtitle"><input value={s.subtitle || ""} onChange={(e) => edit(s.id, { subtitle: e.target.value })} onBlur={() => saveOne(sections.find((x) => x.id === s.id))} className={inp} /></Field>
            {s.type === "products" && (
              <>
                <Field label="Source"><select value={s.config?.source || "auto"} onChange={(e) => { const n = { ...s, config: { ...s.config, source: e.target.value } }; edit(s.id, { config: n.config }); saveOne(n); }} className={inp}><option value="auto">Automatic</option><option value="manual">Manual — pick products</option></select></Field>
                <Field label="Category (automatic)"><input value={s.config?.category || ""} onChange={(e) => edit(s.id, { config: { ...s.config, category: e.target.value } })} onBlur={() => saveOne(sections.find((x) => x.id === s.id))} placeholder="sofas / __sale / __new" className={inp} /></Field>
              </>
            )}
            <Field label="“View all” link"><input value={s.config?.link || ""} onChange={(e) => edit(s.id, { config: { ...s.config, link: e.target.value } })} onBlur={() => saveOne(sections.find((x) => x.id === s.id))} className={inp} /></Field>
          </div>
          {s.type === "products" && s.config?.source === "manual" && <ManualPicker slugs={s.config.slugs || []} all={all} onChange={async (slugs: string[]) => { const n = { ...s, config: { ...s.config, slugs } }; edit(s.id, { config: n.config }); await saveOne(n); }} />}
        </Card>
      ))}
    </div>
  );
}
function ManualPicker({ slugs, all, onChange }: any) {
  const [q, setQ] = useState("");
  return (
    <div className="mt-2 text-sm">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to add products…" className={inp} aria-label="Find products" />
      {q && <div className="border rounded-xl mt-1 max-h-40 overflow-auto">{all.filter((p: any) => `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6).map((p: any) => <button type="button" key={p.slug} onClick={() => { if (!slugs.includes(p.slug)) onChange([...slugs, p.slug]); setQ(""); }} className="block w-full text-left px-3 py-2 hover:bg-gray-50">+ {p.name}</button>)}</div>}
      <div className="flex flex-wrap gap-1 mt-2">{slugs.map((s: string) => <span key={s} className="bg-gray-100 rounded-full px-2 py-1 text-xs">{s} <button type="button" onClick={() => onChange(slugs.filter((x: string) => x !== s))} aria-label="Remove">✕</button></span>)}</div>
    </div>
  );
}

// ============================== HERO ==============================
const MTYPES = ["image", "video", "youtube", "vimeo", "url"];
export function HeroManager() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const load = async () => setList((await cmsGet("heroes")).sort((a: any, b: any) => a.sort - b.sort));
  useEffect(() => { load(); }, []);
  const move = async (i: number, d: number) => { const n = [...list]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; for (const [k, s] of n.entries()) await cmsPut("heroes", { ...s, sort: k }, s.id); load(); };
  return (
    <div>
      <button onClick={() => setEditing({ title: "", sub: "", cta: "SHOP NOW", href: "/", mediaType: "image", image: "", enabled: true, sort: list.length })} className="bg-[#D21F26] text-white font-extrabold rounded-full px-5 py-2 text-sm mb-3">+ Add Slide</button>
      <div className="space-y-2">
        {list.map((h, i) => (
          <Card key={h.id}>
            <div className="flex items-center gap-3 text-sm">
              <Thumb src={h.image} />
              <div className="flex-1"><p className="font-extrabold">{h.title || "(untitled)"} <span className="font-normal text-xs text-gray-400">[{h.mediaType}]</span></p><p className="text-gray-500 text-xs">{h.sub}</p></div>
              <Toggle value={!!h.enabled} onChange={async (v) => { await cmsPut("heroes", { ...h, enabled: v }, h.id); load(); }} label="Enabled" />
              <button onClick={() => move(i, -1)} className="border rounded-lg px-2" aria-label="Move up">↑</button>
              <button onClick={() => move(i, 1)} className="border rounded-lg px-2" aria-label="Move down">↓</button>
              <button className="underline text-xs" onClick={() => setPreview(h)}>Preview</button>
              <button className="underline text-xs" onClick={() => setEditing(h)}>Edit</button>
              <button className="underline text-xs" onClick={async () => { const { id, ...rest } = h; await cmsPost("heroes", { ...rest, title: `${h.title} (Copy)`, enabled: false }); load(); }}>Duplicate</button>
              <button className="underline text-xs text-red-600" onClick={async () => { if (confirm(`Delete “${h.title}”?`)) { await cmsDel("heroes", h.id); load(); } }}>Delete</button>
            </div>
          </Card>
        ))}
      </div>
      {editing && <HeroForm initial={editing} onClose={() => setEditing(null)} onSaved={load} />}
      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-label="Slide preview">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPreview(null)} />
          <div className="relative bg-black text-white rounded-2xl overflow-hidden max-w-3xl w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.image} alt="" className="w-full h-72 object-cover opacity-80" />
            <div className="absolute inset-0 grid place-items-center text-center"><div><h3 className="text-3xl font-extrabold">{preview.title}</h3><p>{preview.sub}</p><span className="inline-block mt-3 bg-[#D21F26] px-6 py-2 rounded-full font-bold text-sm">{preview.cta}</span></div></div>
            <button onClick={() => setPreview(null)} className="absolute top-2 right-2 bg-white text-black rounded-full w-9 h-9">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
function HeroForm({ initial, onClose, onSaved }: any) {
  const [f, setF] = useState<any>({ overlay: 20, align: "center", textColor: "#ffffff", anim: "fade", ...initial });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setF((s: any) => ({ ...s, [k]: v }));
  const save = async () => { setSaving(true); if (f.id) await cmsPut("heroes", f, f.id); else await cmsPost("heroes", f); setSaving(false); onSaved(); onClose(); };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-label="Slide editor">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-5 max-w-2xl mx-auto my-8 text-sm">
        <h3 className="font-extrabold text-lg">Hero slide</h3>
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          <Field label="Title"><input value={f.title || ""} onChange={(e) => set("title", e.target.value)} className={inp} /></Field>
          <Field label="Subtitle"><input value={f.sub || ""} onChange={(e) => set("sub", e.target.value)} className={inp} /></Field>
          <Field label="Description"><input value={f.desc || ""} onChange={(e) => set("desc", e.target.value)} className={inp} /></Field>
          <Field label="Animation"><select value={f.anim || "fade"} onChange={(e) => set("anim", e.target.value)} className={inp}><option value="fade">Fade</option><option value="slide">Slide</option><option value="zoom">Zoom</option></select></Field>
          <Field label="Button 1 text"><input value={f.cta || ""} onChange={(e) => set("cta", e.target.value)} className={inp} /></Field>
          <Field label="Button 1 link"><input value={f.href || ""} onChange={(e) => set("href", e.target.value)} className={inp} /></Field>
          <Field label="Button 2 text"><input value={f.cta2 || ""} onChange={(e) => set("cta2", e.target.value)} className={inp} /></Field>
          <Field label="Button 2 link"><input value={f.href2 || ""} onChange={(e) => set("href2", e.target.value)} className={inp} /></Field>
          <Field label="Media type"><select value={f.mediaType || "image"} onChange={(e) => set("mediaType", e.target.value)} className={inp}>{MTYPES.map((m) => <option key={m} value={m}>{m === "url" ? "External video URL" : m}</option>)}</select></Field>
          {(f.mediaType === "youtube" || f.mediaType === "vimeo" || f.mediaType === "url") && <Field label="Video URL"><input value={f.videoUrl || ""} onChange={(e) => set("videoUrl", e.target.value)} className={inp} placeholder="https://…" /></Field>}
          <Field label="Text alignment"><select value={f.align || "center"} onChange={(e) => set("align", e.target.value)} className={inp}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></Field>
          <Field label="Text colour"><input type="color" value={f.textColor || "#ffffff"} onChange={(e) => set("textColor", e.target.value)} className="h-11 w-20 border rounded-lg" /></Field>
          <Field label="Overlay %"><input type="number" min={0} max={80} value={f.overlay ?? 20} onChange={(e) => set("overlay", Number(e.target.value))} className={inp} /></Field>
          <Field label="Background"><input type="color" value={f.bg || "#111111"} onChange={(e) => set("bg", e.target.value)} className="h-11 w-20 border rounded-lg" /></Field>
          <Field label="Start date"><input type="date" value={f.start || ""} onChange={(e) => set("start", e.target.value)} className={inp} /></Field>
          <Field label="End date"><input type="date" value={f.end || ""} onChange={(e) => set("end", e.target.value)} className={inp} /></Field>
        </div>
        <div className="mt-2"><MediaPicker value={f.image} onPick={(u) => set("image", u)} label="Desktop image" /></div>
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          <MediaPicker value={f.tabletImage} onPick={(u) => set("tabletImage", u)} label="Tablet image" />
          <MediaPicker value={f.mobileImage} onPick={(u) => set("mobileImage", u)} label="Mobile image" />
        </div>
        {(f.mediaType === "video") && <div className="mt-2"><MediaPicker value={f.videoUrl} onPick={(u) => set("videoUrl", u)} label="MP4 / WebM upload" accept=".mp4,.webm" /></div>}
        <label className="flex items-center gap-2 mt-3 font-bold">Enabled <Toggle value={!!f.enabled} onChange={(v) => set("enabled", v)} label="Enabled" /></label>
        <div className="flex gap-2 mt-4"><button onClick={save} disabled={saving} className="bg-[#D21F26] text-white rounded-full px-8 py-2.5 font-bold">{saving ? "Saving…" : "Save & Publish"}</button><button onClick={onClose} className="underline">Cancel</button></div>
      </div>
    </div>
  );
}

// ============================== ORDERS ==============================
const STATUSES = ["Pending", "Confirmed", "Processing", "Ready", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Refunded"];
export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [st, setSt] = useState("");
  const [open, setOpen] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const load = async () => { const j = await api("/api/admin/orders").catch(() => null); setOrders(j?.orders || []); };
  useEffect(() => { load(); }, []);
  const rows = orders.filter((o) => (!q || `${o.id} ${o.name} ${o.phone} ${o.email}`.toLowerCase().includes(q.toLowerCase())) && (!st || o.status === st));
  const payLabel: any = { upi: "UPI", card: "Card", cod: "COD", emi: "EMI", bank: "Bank" };
  return (
    <div>
      <div className="flex gap-2 mb-3 text-sm">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order, customer, phone…" className="border rounded-full px-4 py-2 flex-1" aria-label="Search orders" />
        <select value={st} onChange={(e) => setSt(e.target.value)} className="border rounded-full px-3 py-2" aria-label="Status filter"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <Card><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm">
        <thead><tr className="text-left text-gray-500"><th className="p-2">Order</th><th>Customer</th><th>Amount</th><th>Pay</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>{rows.map((o) => <tr key={o.id} className="border-t"><td className="p-2 font-bold">{o.id}</td><td>{o.name}<br /><span className="text-xs text-gray-500">{o.phone}</span></td><td>₹{(o.total || 0).toLocaleString("en-IN")}{o.discount ? <span className="text-xs text-green-700"> (−₹{o.discount})</span> : ""}</td><td>{payLabel[o.pay] || o.pay}</td><td><StatusPill s={o.status} /></td><td className="text-xs">{new Date(o.date).toLocaleDateString("en-IN")}</td><td><button className="underline" onClick={() => { setOpen(o); setNotes(o.notes || ""); }}>Open</button></td></tr>)}</tbody>
      </table></div></Card>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-label="Order detail">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(null)} />
          <div className="relative bg-white rounded-2xl p-5 max-w-2xl mx-auto my-8 text-sm" id="invoice">
            <h3 className="font-extrabold text-lg">Order {open.id}</h3>
            <p className="text-gray-500">{open.name} · {open.phone} · {open.email} · {open.city} {open.pin} · {open.mode}</p>
            <div className="mt-2">{(open.items || []).map((it: any, k: number) => <p key={k} className="py-1 border-t flex justify-between"><span>{it.title} × {it.qty}</span><strong>₹{(it.price * it.qty).toLocaleString("en-IN")}</strong></p>)}</div>
            <p className="flex justify-between border-t pt-2 mt-1"><span>Subtotal</span><strong>₹{(open.subtotal || 0).toLocaleString("en-IN")}</strong></p>
            {!!open.discount && <p className="flex justify-between text-green-700"><span>Discount {open.coupon ? `(${open.coupon})` : ""}</span><strong>−₹{open.discount}</strong></p>}
            <p className="flex justify-between"><span>Delivery</span><strong>₹{(open.delivery || 0).toLocaleString("en-IN")}</strong></p>
            <p className="flex justify-between text-lg"><span>Total</span><strong>₹{(open.total || 0).toLocaleString("en-IN")}</strong></p>
            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              <Field label="Status"><select value={open.status} onChange={async (e) => { const j = await api("/api/admin/orders", { method: "PATCH", body: JSON.stringify({ id: open.id, status: e.target.value }) }); if (j.ok) { setOpen(j.order); load(); } }} className={inp}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Internal notes"><input value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={async () => { await api("/api/admin/orders", { method: "PATCH", body: JSON.stringify({ id: open.id, notes }) }); load(); }} className={inp} /></Field>
            </div>
            <div className="mt-2"><p className="font-bold text-xs mb-1">Timeline</p>{(open.history || []).map((h: any, k: number) => <p key={k} className="text-xs text-gray-500">{h.s} — {new Date(h.t).toLocaleString("en-IN")}{h.by ? ` by ${h.by}` : ""}</p>)}</div>
            <div className="flex flex-wrap gap-2 mt-4">
              <a href={`tel:+${String(open.phone).replace(/\D/g, "")}`} className="border rounded-full px-4 py-2 font-bold">📞 Call</a>
              <a href={`https://wa.me/${String(open.phone).replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${open.name}, this is Planet Interio about order ${open.id}.`)}`} target="_blank" rel="noopener" className="border rounded-full px-4 py-2 font-bold">💬 WhatsApp</a>
              <button onClick={() => window.print()} className="border rounded-full px-4 py-2 font-bold">🖨 Invoice</button>
              <button onClick={() => setOpen(null)} className="underline ml-auto">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================== CUSTOMERS ==============================
export function Customers() {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const load = async () => { const j = await api("/api/admin/customers").catch(() => null); setList(j?.customers || []); };
  useEffect(() => { load(); }, []);
  const rows = list.filter((c) => !q || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className="border rounded-full px-4 py-2 text-sm mb-3 w-full max-w-sm" aria-label="Search customers" />
      <Card><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm">
        <thead><tr className="text-left text-gray-500"><th className="p-2">Customer</th><th>Phone</th><th>Orders</th><th>Spent</th><th>Notes</th></tr></thead>
        <tbody>{rows.map((c) => <tr key={c.email} className="border-t"><td className="p-2 font-bold">{c.name}<br /><span className="font-normal text-xs text-gray-500">{c.email}</span></td><td>{c.phone}</td><td>{c.orders}</td><td>₹{c.spent.toLocaleString("en-IN")}</td>
          <td><input defaultValue={c.notes} onBlur={async (e) => { await api("/api/admin/customers", { method: "PATCH", body: JSON.stringify({ email: c.email, notes: e.target.value }) }); }} placeholder="Add note…" className="border rounded-lg px-2 py-1.5 w-full" aria-label={`Notes for ${c.name}`} /></td></tr>)}</tbody>
      </table></div></Card>
    </div>
  );
}

// ============================== PAGES & BLOG ==============================
function PageForm({ initial, collection, base, onClose, onSaved }: any) {
  const [f, setF] = useState<any>({ status: "published", ...initial });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const slug = (f.slug || f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");
    if (f.id) await cmsPut(collection, { ...f, slug }, f.id);
    else await cmsPost(collection, { ...f, slug, date: new Date().toISOString().slice(0, 10) });
    setSaving(false); onSaved(); onClose();
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-label="Editor">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-5 max-w-2xl mx-auto my-8 text-sm">
        <div className="grid sm:grid-cols-2 gap-2">
          <Field label="Title"><input value={f.title || ""} onChange={(e) => setF({ ...f, title: e.target.value })} className={inp} /></Field>
          <Field label="Slug"><input value={f.slug || ""} onChange={(e) => setF({ ...f, slug: e.target.value })} className={inp} /></Field>
        </div>
        <Field label="Content"><textarea value={f.body || ""} onChange={(e) => setF({ ...f, body: e.target.value })} className={inp} rows={10} /></Field>
        <MediaPicker value={f.image} onPick={(u) => setF({ ...f, image: u })} label="Hero image" />
        <label className="flex items-center gap-2 mt-2 font-bold">Published <Toggle value={f.status === "published"} onChange={(v) => setF({ ...f, status: v ? "published" : "draft" })} label="Published" /></label>
        <div className="flex gap-2 mt-4">
          <button onClick={save} disabled={saving} className="bg-black text-white rounded-full px-6 py-2.5 font-bold">{saving ? "Saving…" : "Save & Publish"}</button>
          <button onClick={async () => { setF({ ...f, status: "draft" }); setSaving(true); if (f.id) await cmsPut(collection, { ...f, status: "draft" }, f.id); else await cmsPost(collection, { ...f, status: "draft" }); setSaving(false); onSaved(); onClose(); }} className="border rounded-full px-5 font-bold">Save Draft</button>
          {f.slug && <a href={`${base}/${f.slug}`} target="_blank" rel="noopener" className="border rounded-full px-5 py-2.5 font-bold">Preview</a>}
          <button onClick={onClose} className="underline ml-auto">Close</button>
        </div>
      </div>
    </div>
  );
}
export function Pages() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const load = async () => setList(await cmsGet("pages"));
  useEffect(() => { load(); }, []);
  return (
    <div>
      <button onClick={() => setEditing({ title: "", body: "", status: "draft" })} className="bg-[#D21F26] text-white font-extrabold rounded-full px-5 py-2 text-sm mb-3">+ Create Page</button>
      <div className="space-y-2">{list.map((p) => <Card key={p.id}><div className="flex items-center gap-2 text-sm"><div className="flex-1"><p className="font-extrabold">{p.title}</p><p className="text-xs text-gray-500">/p/{p.slug}</p></div><StatusPill s={p.status} /><button className="underline text-xs" onClick={() => setEditing(p)}>Edit</button><a className="underline text-xs" href={`/p/${p.slug}`} target="_blank" rel="noopener">Preview</a><button className="underline text-xs text-red-600" onClick={async () => { if (confirm(`Delete “${p.title}”?`)) { await cmsDel("pages", p.id); load(); } }}>Delete</button></div></Card>)}</div>
      {editing && <PageForm initial={editing} collection="pages" base="/p" onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}
export function Blog() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const load = async () => setList(await cmsGet("posts"));
  useEffect(() => { load(); }, []);
  return (
    <div>
      <button onClick={() => setEditing({ title: "", body: "", status: "draft" })} className="bg-[#D21F26] text-white font-extrabold rounded-full px-5 py-2 text-sm mb-3">+ New Post</button>
      <div className="space-y-2">{list.map((p) => <Card key={p.id}><div className="flex items-center gap-2 text-sm"><Thumb src={p.image} /><div className="flex-1"><p className="font-extrabold">{p.title}</p><p className="text-xs text-gray-500">{p.date}</p></div><StatusPill s={p.status} /><button className="underline text-xs" onClick={() => setEditing(p)}>Edit</button><a className="underline text-xs" href={`/blog/${p.slug}`} target="_blank" rel="noopener">Preview</a><button className="underline text-xs text-red-600" onClick={async () => { if (confirm(`Delete “${p.title}”?`)) { await cmsDel("posts", p.id); load(); } }}>Delete</button></div></Card>)}</div>
      {editing && <PageForm initial={editing} collection="posts" base="/blog" onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

// ============================== USERS & ROLES ==============================
export function UsersRoles() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [me, setMe] = useState("");
  const [form, setForm] = useState({ email: "", password: "", role: "READ_ONLY" });
  const load = async () => { const j = await api("/api/admin/users").catch(() => null); if (j?.ok) { setUsers(j.users); setRoles(j.roles); setMe(j.me); } };
  useEffect(() => { load(); }, []);
  const isSuper = users.find((u) => u.email === me)?.role === "SUPER_ADMIN";
  return (
    <div>
      <Card><h2 className="font-extrabold mb-2">Roles</h2>
        <div className="text-xs text-gray-600 grid sm:grid-cols-2 gap-1">
          <p><strong>Super Admin</strong> — everything + staff</p><p><strong>Manager</strong> — products, packages, orders, content</p>
          <p><strong>Catalog Editor</strong> — products, categories, packages</p><p><strong>Content Editor</strong> — pages, hero, social, footer</p>
          <p><strong>Order Staff</strong> — orders, customers</p><p><strong>Read Only</strong> — view only</p>
        </div>
      </Card>
      <Card className="mt-3"><h2 className="font-extrabold mb-2">Staff accounts</h2>
        {users.map((u) => <p key={u.email} className="text-sm py-1.5 border-t flex justify-between"><span><strong>{u.email}</strong> · {u.role}</span>{isSuper && u.email !== me && <button className="underline text-red-600 text-xs" onClick={async () => { if (confirm(`Remove ${u.email}?`)) { await api(`/api/admin/users?email=${encodeURIComponent(u.email)}`, { method: "DELETE" }); load(); } }}>Remove</button>}</p>)}
        {isSuper ? (
          <div className="grid sm:grid-cols-4 gap-2 mt-3 text-sm">
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={inp} aria-label="Email" />
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" className={inp} aria-label="Password" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inp} aria-label="Role">{roles.map((r) => <option key={r}>{r}</option>)}</select>
            <button onClick={async () => { const j = await api("/api/admin/users", { method: "POST", body: JSON.stringify(form) }); if (j.ok) { setForm({ email: "", password: "", role: "READ_ONLY" }); load(); } else alert(j.error); }} className="bg-black text-white rounded-full font-bold">+ Add staff</button>
          </div>
        ) : <p className="text-xs text-gray-500 mt-2">Only Super Admin can manage staff.</p>}
      </Card>
    </div>
  );
}

// ============================== ANALYTICS ==============================
export function Analytics() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { api("/api/admin/orders").then((j) => setOrders(j?.orders || [])).catch(() => {}); }, []);
  const valid = orders.filter((o) => !["Cancelled", "Refunded"].includes(o.status));
  const revenue = valid.reduce((t, o) => t + (o.total || 0), 0);
  const counts: Record<string, { qty: number; rev: number; title: string }> = {};
  valid.forEach((o) => (o.items || []).forEach((it: any) => { counts[it.title] = counts[it.title] || { qty: 0, rev: 0, title: it.title }; counts[it.title].qty += it.qty; counts[it.title].rev += it.price * it.qty; }));
  const top = Object.values(counts).sort((a, b) => b.rev - a.rev).slice(0, 10);
  const csv = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([["id,date,status,total", ...orders.map((o) => [o.id, o.date, o.status, o.total].join(","))].join("\n")], { type: "text/csv" })); a.download = "orders.csv"; a.click(); };
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Revenue", `₹${revenue.toLocaleString("en-IN")}`], ["Orders", String(orders.length)], ["Avg order", orders.length ? `₹${Math.round(revenue / Math.max(1, valid.length)).toLocaleString("en-IN")}` : "—"], ["Refund rate", orders.length ? `${Math.round((orders.filter((o) => ["Refunded", "Returned"].includes(o.status)).length / orders.length) * 100)}%` : "—"]].map(([t, v]) => <Card key={t}><p className="text-xs text-gray-500">{t}</p><p className="text-xl font-extrabold">{v}</p></Card>)}
      </div>
      <Card className="mt-3"><div className="flex items-center"><h2 className="font-extrabold">Top products</h2><button onClick={csv} className="ml-auto border rounded-full px-4 py-1.5 text-xs font-bold">Export orders CSV</button></div>
        {top.map((t) => <p key={t.title} className="text-sm py-1 border-t flex justify-between"><span>{t.title} × {t.qty}</span><strong>₹{t.rev.toLocaleString("en-IN")}</strong></p>)}
        {top.length === 0 && <p className="text-sm text-gray-500">No sales yet.</p>}
      </Card>
    </div>
  );
}

// ============================== HISTORY ==============================
export function History() {
  const [list, setList] = useState<any[]>([]);
  const load = async () => { const j = await api("/api/cms?collection=history").catch(() => null); setList(j?.data || []); };
  useEffect(() => { load(); }, []);
  const restore = async (h: any) => {
    if (h.prev === undefined || !h.collection) return alert("No snapshot for this entry.");
    if (!confirm(`Restore ${h.collection} to the version from ${new Date(h.t).toLocaleString("en-IN")}?`)) return;
    await cmsPut(h.collection, h.prev);
    load();
  };
  return (
    <Card>
      <h2 className="font-extrabold mb-2">Change history</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
        <thead><tr className="text-left text-gray-500"><th className="p-2">When</th><th>Who</th><th>What</th><th>Detail</th><th></th></tr></thead>
        <tbody>{list.slice(0, 100).map((h, i) => <tr key={i} className="border-t"><td className="p-2 text-xs">{new Date(h.t).toLocaleString("en-IN")}</td><td>{h.by}</td><td>{h.action}</td><td className="text-xs text-gray-500">{h.detail}</td><td>{h.prev !== undefined && <button className="underline text-xs" onClick={() => restore(h)}>Restore</button>}</td></tr>)}</tbody>
      </table></div>
    </Card>
  );
}
