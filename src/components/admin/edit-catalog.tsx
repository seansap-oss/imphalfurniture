"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, Field, inp, Toggle, SaveBar, StatusPill, Confirm, Empty, Thumb, MediaPicker, api, cmsGet, cmsPut, cmsPost, cmsDel } from "./ui";

// ============================== PRODUCTS ==============================
const BADGES = ["SALE", "NEW", "BEST SELLER", "ONLINE EXCLUSIVE", "LOW STOCK", "FEATURED"];

export function Products() {
  const [list, setList] = useState<any[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [customSlugs, setCustomSlugs] = useState<string[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [catF, setCatF] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [editing, setEditing] = useState<any>(null); // null | {} new | product
  const [confirm, setConfirm] = useState<any>(null);
  const [showImport, setShowImport] = useState(false);
  const load = async () => {
    const j = await api("/api/products?admin=1");
    setList(j.products || []); setHidden(j.hidden || []); setCustomSlugs(j.customs || []);
    const s = await api("/api/site").catch(() => null);
    if (s) { setCats(s.categories || []); setBrands(s.brands || []); }
  };
  useEffect(() => { load(); }, []);
  const rows = useMemo(() => list.filter((p) => (!q || `${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(q.toLowerCase())) && (!catF || p.category === catF)), [list, q, catF]);
  const statusOf = (p: any) => (hidden.includes(p.slug) ? "Hidden" : "Published");
  const bulk = async (op: string, extra?: any) => {
    for (const slug of sel) {
      const isCustom = customSlugs.includes(slug);
      if (op === "publish") {
        if (isCustom) { const c = await cmsGet("customProducts"); const it = c.find((x: any) => x.slug === slug); if (it) await cmsPut("customProducts", { ...it, hidden: false, status: "published" }, it.id); }
        else await api("/api/cms", { method: "DELETE", body: "" }).catch(() => {});
      }
    }
    if (op === "publish") for (const slug of sel) await fetch(`/api/cms?collection=productOverride&id=${encodeURIComponent(slug)}`, { method: "DELETE" });
    if (op === "hide") for (const slug of sel) {
      if (customSlugs.includes(slug)) { const c = await cmsGet("customProducts"); const it = c.find((x: any) => x.slug === slug); if (it) await cmsPut("customProducts", { ...it, hidden: true }, it.id); }
      else await cmsPut("productOverride", { hidden: true }, undefined, slug);
    }
    if (op === "delete") for (const slug of sel) {
      if (customSlugs.includes(slug)) await cmsDel("customProducts", slug);
      else await cmsPut("productOverride", { hidden: true }, undefined, slug);
    }
    if (op === "category" && extra) for (const slug of sel) {
      if (customSlugs.includes(slug)) { const c = await cmsGet("customProducts"); const it = c.find((x: any) => x.slug === slug); if (it) await cmsPut("customProducts", { ...it, category: extra }, it.id); }
      else await cmsPut("productOverride", { category: extra }, undefined, slug);
    }
    setSel([]); load();
  };
  const exportCSV = () => {
    const head = "SKU,Name,Category,Price,Stock,Description,Images";
    const lines = rows.map((p: any) => [p.sku, `"${String(p.name).replace(/"/g, '""')}"`, p.category, p.price, p.stock, `"${String(p.desc || "").replace(/"/g, '""')}"`, (p.images || []).join("|")].join(","));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[head, ...lines].join("\n")], { type: "text/csv" }));
    a.download = "products.csv"; a.click();
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, SKU…" className="border rounded-full px-4 py-2 text-sm flex-1 min-w-[180px]" aria-label="Search products" />
        <select value={catF} onChange={(e) => setCatF(e.target.value)} className="border rounded-full px-3 py-2 text-sm" aria-label="Category filter"><option value="">All categories</option>{cats.map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        <button onClick={() => setEditing({})} className="bg-[#D21F26] text-white font-extrabold rounded-full px-5 py-2 text-sm">+ Add Product</button>
        <button onClick={exportCSV} className="border rounded-full px-4 py-2 text-sm font-bold">Export CSV</button>
        <button onClick={() => setShowImport(true)} className="border rounded-full px-4 py-2 text-sm font-bold">Import CSV</button>
      </div>
      {sel.length > 0 && (
        <div className="bg-black text-white rounded-2xl p-3 mb-3 flex flex-wrap gap-2 items-center text-sm">
          <strong>{sel.length} selected</strong>
          <button onClick={() => bulk("publish")} className="bg-white text-black rounded-full px-3 py-1.5 font-bold">Publish</button>
          <button onClick={() => bulk("hide")} className="bg-white text-black rounded-full px-3 py-1.5 font-bold">Hide</button>
          <select onChange={(e) => e.target.value && bulk("category", e.target.value)} className="rounded-full px-3 py-1.5 text-black" defaultValue="" aria-label="Change category"><option value="">Move to…</option>{cats.map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
          <button onClick={() => setConfirm({ bulk: true })} className="bg-red-600 rounded-full px-3 py-1.5 font-bold">Delete</button>
        </div>
      )}
      <Card>
        <div className="overflow-x-auto"><table className="text-sm w-full min-w-[860px]">
          <thead><tr className="text-left text-gray-500"><th className="p-2"><input type="checkbox" checked={sel.length === rows.length && rows.length > 0} onChange={(e) => setSel(e.target.checked ? rows.map((p: any) => p.slug) : [])} aria-label="Select all" /></th><th>Product</th><th>SKU</th><th>Brand</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.slice(0, 100).map((p: any) => (
              <tr key={p.slug} className="border-t">
                <td className="p-2"><input type="checkbox" checked={sel.includes(p.slug)} onChange={(e) => setSel(e.target.checked ? [...sel, p.slug] : sel.filter((s) => s !== p.slug))} aria-label={`Select ${p.name}`} /></td>
                <td className="p-2"><div className="flex items-center gap-2"><Thumb src={p.images?.[0]} /><span className="font-bold">{p.name}{customSlugs.includes(p.slug) && <span className="text-xs text-gray-400"> (custom)</span>}</span></div></td>
                <td>{p.sku}</td><td>{p.brand}</td><td>₹{p.price?.toLocaleString("en-IN")}</td><td>{p.stock}</td>
                <td><StatusPill s={statusOf(p)} /></td>
                <td className="whitespace-nowrap space-x-1 text-xs">
                  <button className="underline" onClick={() => setEditing(p)}>Edit</button>
                  <button className="underline" onClick={() => setEditing({ ...p, slug: `${p.slug}-copy`, sku: `${p.sku}-C`, name: `${p.name} (Copy)`, _dup: true })}>Duplicate</button>
                  <a className="underline" href={`/product/${p.slug}`} target="_blank" rel="noopener">Preview</a>
                  <button className="underline text-red-600" onClick={() => setConfirm(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <p className="text-xs text-gray-500 mt-2">Showing {Math.min(100, rows.length)} of {rows.length}. Seed products soft-hide on delete to protect order history.</p>
      </Card>
      {editing && <ProductForm initial={editing} cats={cats} brands={brands} isNew={!editing.slug || editing._new || !!editing._dup} onClose={() => setEditing(null)} onSaved={load} />}
      {confirm && <Confirm title={confirm.bulk ? `Delete ${sel.length} products?` : `Delete “${confirm.name}”?`} onCancel={() => setConfirm(null)} onDelete={async () => {
        if (confirm.bulk) await bulk("delete");
        else { if (customSlugs.includes(confirm.slug)) await cmsDel("customProducts", confirm.slug); else await cmsPut("productOverride", { hidden: true }, undefined, confirm.slug); load(); }
        setConfirm(null);
      }} />}
      {showImport && <CsvImport onClose={() => setShowImport(false)} onDone={() => { setShowImport(false); load(); }} />}
    </div>
  );
}

function ProductForm({ initial, cats, brands, isNew, onClose, onSaved }: any) {
  const [f, setF] = useState<any>({ colours: [], images: [], tags: [], badges: [], ...initial, price: initial.price ?? 9999, mrp: initial.mrp ?? 12999, stock: initial.stock ?? 10 });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setF((s: any) => ({ ...s, [k]: v }));
  const save = async (asDraft = false) => {
    setSaving(true);
    const slug = (f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");
    const data = { ...f, slug, tags: Array.isArray(f.tags) ? f.tags : String(f.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean), colours: Array.isArray(f.colours) ? f.colours : String(f.colours || "").split(",").map((t: string) => t.trim()).filter(Boolean), onSale: (f.badges || []).includes("SALE") || f.price < f.mrp, status: asDraft ? "draft" : "published", hidden: asDraft ? true : false, updated: new Date().toISOString() };
    if (isNew || f._dup) { const { _dup, _new, id, ...rest } = data; await cmsPost("customProducts", rest); }
    else if ((initial.id || 0) >= 9000 || initial._custom) await cmsPut("customProducts", data, initial.id || initial.slug);
    else await cmsPut("productOverride", data, undefined, initial.slug);
    setSaving(false); onSaved(); onClose();
  };
  const moveImg = (i: number, d: number) => { const n = [...(f.images || [])]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; set("images", n); };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-label="Product editor">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#F7F5F0] min-h-full lg:ml-auto lg:max-w-4xl p-4 space-y-4">
        <div className="flex items-center gap-3"><h2 className="font-extrabold text-xl">{isNew ? "Add product" : "Edit product"}</h2><button className="ml-auto border rounded-full px-4 py-2 text-sm font-bold" onClick={onClose}>Close</button></div>
        <Card><h3 className="font-extrabold mb-2">General</h3><div className="grid sm:grid-cols-2 gap-3">
          <Field label="Product name"><input value={f.name || ""} onChange={(e) => set("name", e.target.value)} className={inp} /></Field>
          <Field label="Slug"><input value={f.slug || ""} onChange={(e) => set("slug", e.target.value)} className={inp} /></Field>
          <Field label="SKU"><input value={f.sku || ""} onChange={(e) => set("sku", e.target.value)} className={inp} /></Field>
          <Field label="Barcode (optional)"><input value={f.barcode || ""} onChange={(e) => set("barcode", e.target.value)} className={inp} /></Field>
          <Field label="Short description"><textarea value={f.short || ""} onChange={(e) => set("short", e.target.value)} className={inp} rows={2} /></Field>
          <Field label="Full description"><textarea value={f.desc || ""} onChange={(e) => set("desc", e.target.value)} className={inp} rows={4} /></Field>
        </div></Card>
        <Card><h3 className="font-extrabold mb-2">Classification</h3><div className="grid sm:grid-cols-2 gap-3">
          <Field label="Category"><select value={f.category || ""} onChange={(e) => set("category", e.target.value)} className={inp}>{cats.map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></Field>
          <Field label="Subcategory"><input value={f.sub || ""} onChange={(e) => set("sub", e.target.value)} className={inp} /></Field>
          <Field label="Brand"><select value={f.brand || ""} onChange={(e) => set("brand", e.target.value)} className={inp}>{brands.map((b: any) => <option key={b.slug} value={b.name}>{b.name}</option>)}</select></Field>
          <Field label="Tags (comma separated)"><input value={Array.isArray(f.tags) ? f.tags.join(", ") : f.tags || ""} onChange={(e) => set("tags", e.target.value)} className={inp} /></Field>
        </div></Card>
        <Card><h3 className="font-extrabold mb-2">Pricing & stock</h3><div className="grid sm:grid-cols-3 gap-3">
          <Field label="Regular price ₹"><input type="number" value={f.mrp ?? ""} onChange={(e) => set("mrp", Number(e.target.value))} className={inp} /></Field>
          <Field label="Sale price ₹"><input type="number" value={f.price ?? ""} onChange={(e) => set("price", Number(e.target.value))} className={inp} /></Field>
          <Field label="Cost ₹ (optional)"><input type="number" value={f.cost ?? ""} onChange={(e) => set("cost", Number(e.target.value))} className={inp} /></Field>
          <Field label="Stock"><input type="number" value={f.stock ?? ""} onChange={(e) => set("stock", Number(e.target.value))} className={inp} /></Field>
          <Field label="Low-stock at"><input type="number" value={f.threshold ?? 3} onChange={(e) => set("threshold", Number(e.target.value))} className={inp} /></Field>
          <Field label="Stock status"><select value={f.stockStatus || "In Stock"} onChange={(e) => set("stockStatus", e.target.value)} className={inp}>{["In Stock", "Low Stock", "Out of Stock", "Backorder", "Pre-order"].map((o) => <option key={o}>{o}</option>)}</select></Field>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">{BADGES.map((b) => <button type="button" key={b} onClick={() => set("badges", (f.badges || []).includes(b) ? f.badges.filter((x: string) => x !== b) : [...(f.badges || []), b])} aria-pressed={(f.badges || []).includes(b)} className={`border rounded-full px-3 py-1.5 text-xs font-bold ${(f.badges || []).includes(b) ? "bg-black text-white" : ""}`}>{b}</button>)}</div></Card>
        <Card><h3 className="font-extrabold mb-2">Images — first is the main image</h3>
          <MediaPicker onPick={(u) => set("images", [...(f.images || []), u])} label="Add image" />
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">{(f.images || []).map((im: string, i: number) => (
            <div key={i} className="border rounded-xl p-1 text-xs"><Thumb src={im} /><p className="truncate">{i === 0 ? "★ Main" : `#${i + 1}`}</p>
              <div className="flex gap-1"><button type="button" onClick={() => moveImg(i, -1)} className="underline">←</button><button type="button" onClick={() => moveImg(i, 1)} className="underline">→</button><button type="button" onClick={() => set("images", f.images.filter((_: any, k: number) => k !== i))} className="underline text-red-600 ml-auto">Remove</button></div></div>
          ))}</div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <Field label="Product video (MP4 upload)"><div className="flex gap-2"><input value={f.videoFile || ""} readOnly className={inp} placeholder="Upload…" /><MediaPicker onPick={(u) => set("videoFile", u)} label="Video" accept=".mp4,.webm" /></div></Field>
            <Field label="Video URL (YouTube / Vimeo)"><input value={f.videoUrl || ""} onChange={(e) => set("videoUrl", e.target.value)} className={inp} placeholder="https://youtube.com/…" /></Field>
          </div>
        </Card>
        <Card><h3 className="font-extrabold mb-2">Details</h3><div className="grid sm:grid-cols-2 gap-3">
          <Field label="Colours (comma separated)"><input value={Array.isArray(f.colours) ? f.colours.join(", ") : f.colours || ""} onChange={(e) => set("colours", e.target.value)} className={inp} /></Field>
          <Field label="Material"><input value={f.material || ""} onChange={(e) => set("material", e.target.value)} className={inp} /></Field>
          <Field label="Dimensions (W×H×D)"><input value={f.dims || ""} onChange={(e) => set("dims", e.target.value)} className={inp} /></Field>
          <Field label="Weight"><input value={f.weight || ""} onChange={(e) => set("weight", e.target.value)} className={inp} /></Field>
          <Field label="Warranty"><input value={f.warranty || ""} onChange={(e) => set("warranty", e.target.value)} className={inp} /></Field>
          <Field label="Delivery notes"><input value={f.deliveryNotes || ""} onChange={(e) => set("deliveryNotes", e.target.value)} className={inp} /></Field>
          <Field label="Meta title"><input value={f.seoTitle || ""} onChange={(e) => set("seoTitle", e.target.value)} className={inp} /></Field>
          <Field label="Meta description"><input value={f.seoDesc || ""} onChange={(e) => set("seoDesc", e.target.value)} className={inp} /></Field>
        </div></Card>
        <div className="flex gap-2 sticky bottom-0 bg-[#F7F5F0] py-3">
          <button onClick={() => save(false)} disabled={saving} className="flex-1 bg-[#D21F26] text-white font-extrabold rounded-full py-3">{saving ? "Saving…" : "Save & Publish"}</button>
          <button onClick={() => save(true)} disabled={saving} className="border rounded-full px-6 font-bold">Save Draft</button>
          <a href={f.slug ? `/product/${f.slug}` : "/"} target="_blank" rel="noopener" className="border rounded-full px-6 py-3 font-bold">Preview</a>
        </div>
      </div>
    </div>
  );
}

function CsvImport({ onClose, onDone }: any) {
  const [rows, setRows] = useState<any[]>([]);
  const parse = (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const out: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.replace(/^"|"$/g, "").replace(/""/g, '"'));
      const [sku, name, category, price, stock, desc, imgs] = cols;
      const errs: string[] = [];
      if (!sku) errs.push("missing SKU"); if (!name) errs.push("missing name");
      if (price && isNaN(Number(price))) errs.push("bad price");
      out.push({ sku, name, category: category || "living", price: Number(price) || 0, mrp: Number(price) || 0, stock: Number(stock) || 0, desc: desc || "", images: (imgs || "").split("|").filter(Boolean), errs });
    }
    setRows(out);
  };
  const commit = async () => {
    for (const r of rows.filter((r) => !r.errs.length)) {
      await cmsPost("customProducts", { name: r.name, sku: r.sku, category: r.category, price: r.price, mrp: r.mrp, stock: r.stock, desc: r.desc, images: r.images, brand: "Planet Interio", sub: "", colours: [], tags: [], badges: [], rating: 4.5, reviews: 0, onSale: false, material: "", dims: "" });
    }
    onDone();
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-label="Import CSV">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-5 max-w-2xl w-full max-h-[85vh] overflow-auto text-sm">
        <h3 className="font-extrabold text-lg">Import products (CSV: SKU,Name,Category,Price,Stock,Description,ImageURLs)</h3>
        <input type="file" accept=".csv" className="mt-3" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => parse(String(r.result)); r.readAsText(f); } }} aria-label="Choose CSV" />
        {rows.length > 0 && <table className="w-full mt-3"><tbody>{rows.map((r, i) => <tr key={i} className="border-t"><td className="py-1 font-bold">{r.sku} — {r.name}</td><td className={r.errs.length ? "text-red-600" : "text-green-700"}>{r.errs.length ? r.errs.join(", ") : "OK"}</td></tr>)}</tbody></table>}
        <div className="flex gap-2 mt-4"><button onClick={onClose} className="border rounded-full px-5 py-2 font-bold">Cancel</button><button onClick={commit} disabled={!rows.some((r) => !r.errs.length)} className="bg-black text-white rounded-full px-5 py-2 font-bold">Import valid rows</button></div>
      </div>
    </div>
  );
}

// ============================== CATEGORIES ==============================
export function Categories() {
  const [site, setSite] = useState<any>(null);
  const [over, setOver] = useState<any>({});
  const [custom, setCustom] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [confirm, setConfirm] = useState<any>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<any>({ name: "", blurb: "", room: "Living" });
  const load = async () => {
    const s = await api("/api/site").catch(() => null); setSite(s);
    setOver(await cmsGet("catOverrides")); setCustom(await cmsGet("customCats"));
    const p = await api("/api/products?admin=1").catch(() => null);
    const c: Record<string, number> = {};
    (p?.products || []).forEach((x: any) => { c[x.category] = (c[x.category] || 0) + 1; });
    setCounts(c);
  };
  useEffect(() => { load(); }, []);
  const saveOver = async (o: any) => { await cmsPut("catOverrides", o); setOver(o); };
  const move = async (slug: string, d: number, isCustom: boolean) => {
    if (isCustom) { const n = [...custom].sort((a, b) => (a.sort || 0) - (b.sort || 0)); const i = n.findIndex((x) => x.slug === slug); const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; n.forEach((x, k) => (x.sort = 100 + k)); for (const x of n) await cmsPut("customCats", x, x.id); load(); }
    else { const order = (site?.categories || []).map((c: any) => c.slug); const i = order.indexOf(slug); const j = i + d; if (j < 0 || j >= order.length) return; [order[i], order[j]] = [order[j], order[i]]; const o = { ...over }; order.forEach((s: string, k: number) => { o[s] = { ...(o[s] || {}), sort: k }; }); await saveOver(o); load(); }
  };
  if (!site) return <Card><p>Loading…</p></Card>;
  return (
    <div>
      <button onClick={() => setAdding(true)} className="bg-[#D21F26] text-white font-extrabold rounded-full px-5 py-2 text-sm mb-3">+ Add Category</button>
      {adding && <Card className="mb-3"><h3 className="font-extrabold">New category</h3><div className="grid sm:grid-cols-3 gap-2 mt-2 text-sm">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className={inp} aria-label="Name" />
        <input value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} placeholder="Description" className={inp} aria-label="Description" />
        <input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Room" className={inp} aria-label="Room" />
      </div><div className="flex gap-2 mt-2"><button onClick={async () => { if (!form.name) return; await cmsPost("customCats", { slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: form.name, blurb: form.blurb, room: form.room, visible: true }); setAdding(false); setForm({ name: "", blurb: "", room: "Living" }); load(); }} className="bg-black text-white rounded-full px-5 py-2 text-sm font-bold">Create</button><button onClick={() => setAdding(false)} className="underline text-sm">Cancel</button></div></Card>}
      <div className="space-y-2">
        {(site.categories || []).map((c: any) => {
          const isCustom = custom.some((x: any) => x.slug === c.slug);
          const o = over[c.slug] || {};
          const name = o.name || c.name;
          return (
            <Card key={c.slug}>
              <div className="flex items-center gap-2 text-sm">
                <Thumb src={c.image} />
                <input value={name} onChange={async (e) => { const v = e.target.value; if (isCustom) { const it = custom.find((x: any) => x.slug === c.slug); await cmsPut("customCats", { ...it, name: v }, it.id); } else { const n = { ...over, [c.slug]: { ...(over[c.slug] || {}), name: v } }; await saveOver(n); } load(); }} className="border rounded-lg px-2 py-1.5 font-bold flex-1" aria-label="Category name" />
                <span className="text-xs text-gray-500">/{c.slug} · {counts[c.slug] || 0} products</span>
                <Toggle value={(o.visible ?? true)} onChange={async (v) => { if (isCustom) { const it = custom.find((x: any) => x.slug === c.slug); await cmsPut("customCats", { ...it, visible: v }, it.id); } else { const n = { ...over, [c.slug]: { ...(over[c.slug] || {}), visible: v } }; await saveOver(n); } load(); }} label={`Show ${name}`} />
                <button onClick={() => move(c.slug, -1, isCustom)} className="border rounded-lg px-2" aria-label="Move up">↑</button>
                <button onClick={() => move(c.slug, 1, isCustom)} className="border rounded-lg px-2" aria-label="Move down">↓</button>
                <a href={c.slug === "sale" ? "/sale" : c.slug === "new" ? "/new" : `/category/${c.slug}`} target="_blank" rel="noopener" className="underline text-xs">Preview</a>
                <button onClick={() => setConfirm(c)} className="underline text-xs text-red-600">Delete</button>
              </div>
            </Card>
          );
        })}
      </div>
      {confirm && <Confirm title={`Delete “${confirm.name}”?${(counts[confirm.slug] || 0) > 0 ? ` It has ${counts[confirm.slug]} products — it will be hidden instead.` : ""}`} onCancel={() => setConfirm(null)} onDelete={async () => {
        const isCustom = custom.some((x: any) => x.slug === confirm.slug);
        if (isCustom && !(counts[confirm.slug] > 0)) await cmsDel("customCats", confirm.slug);
        else { const n = { ...over, [confirm.slug]: { ...(over[confirm.slug] || {}), visible: false } }; await saveOver(n); }
        setConfirm(null); load();
      }} />}
    </div>
  );
}

// ============================== BRANDS ==============================
export function Brands() {
  const [site, setSite] = useState<any>(null);
  const [over, setOver] = useState<any>({});
  const [custom, setCustom] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<any>({ name: "", desc: "", url: "", logo: "" });
  const load = async () => { setSite(await api("/api/site").catch(() => null)); setOver(await cmsGet("brandOverrides")); setCustom(await cmsGet("customBrands")); };
  useEffect(() => { load(); }, []);
  if (!site) return <Card><p>Loading…</p></Card>;
  return (
    <div>
      <button onClick={() => setAdding(true)} className="bg-[#D21F26] text-white font-extrabold rounded-full px-5 py-2 text-sm mb-3">+ Add Brand</button>
      {adding && <Card className="mb-3"><div className="grid sm:grid-cols-2 gap-2 text-sm">
        <Field label="Brand name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} /></Field>
        <Field label="Website URL"><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inp} /></Field>
        <Field label="Description"><input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className={inp} /></Field>
        <MediaPicker value={form.logo} onPick={(u) => setForm({ ...form, logo: u })} label="Logo" />
      </div><button onClick={async () => { if (!form.name) return; await cmsPost("customBrands", { slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: form.name, desc: form.desc, url: form.url, logo: form.logo, visible: true }); setAdding(false); setForm({ name: "", desc: "", url: "", logo: "" }); load(); }} className="bg-black text-white rounded-full px-5 py-2 text-sm font-bold mt-2">Create brand</button></Card>}
      <div className="grid sm:grid-cols-2 gap-3">
        {(site.brands || []).map((b: any) => {
          const isCustom = custom.some((x: any) => x.slug === b.slug);
          const o = over[b.slug] || {};
          return (
            <Card key={b.slug}>
              <div className="flex items-center gap-2 text-sm">
                <Thumb src={b.logo || o.logo} alt={b.name} />
                <input value={o.name || b.name} onChange={async (e) => { if (isCustom) { const it = custom.find((x: any) => x.slug === b.slug); await cmsPut("customBrands", { ...it, name: e.target.value }, it.id); } else await cmsPut("brandOverrides", { ...over, [b.slug]: { ...(over[b.slug] || {}), name: e.target.value } }); load(); }} className="border rounded-lg px-2 py-1.5 font-bold flex-1" aria-label="Brand name" />
                <Toggle value={o.visible ?? true} onChange={async (v) => { if (isCustom) { const it = custom.find((x: any) => x.slug === b.slug); await cmsPut("customBrands", { ...it, visible: v }, it.id); } else await cmsPut("brandOverrides", { ...over, [b.slug]: { ...(over[b.slug] || {}), visible: v } }); load(); }} label="Show brand" />
                <button className="underline text-xs text-red-600" onClick={async () => { if (!confirm(`Delete brand “${b.name}”?`)) return; if (isCustom) await cmsDel("customBrands", b.slug); else await cmsPut("brandOverrides", { ...over, [b.slug]: { ...(over[b.slug] || {}), visible: false } }); load(); }}>Delete</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============================== COLLECTIONS ==============================
export function Collections() {
  const [list, setList] = useState<any[]>([]);
  const [all, setAll] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const load = async () => { setList(await cmsGet("collections")); const p = await api("/api/products?admin=1").catch(() => null); setAll(p?.products || []); };
  useEffect(() => { load(); }, []);
  return (
    <div>
      <button onClick={() => setEditing({ name: "", slug: "", desc: "", image: "", productSlugs: [] })} className="bg-[#D21F26] text-white font-extrabold rounded-full px-5 py-2 text-sm mb-3">+ New Collection</button>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((c) => (
          <Card key={c.id}><div className="flex items-center gap-2"><Thumb src={c.image} /><div><p className="font-extrabold">{c.name}</p><p className="text-xs text-gray-500">/{c.slug} · {(c.productSlugs || []).length} products</p></div>
            <div className="ml-auto flex gap-2 text-xs"><button className="underline" onClick={() => setEditing(c)}>Edit</button><button className="underline text-red-600" onClick={async () => { if (confirm(`Delete “${c.name}”?`)) { await cmsDel("collections", c.id); load(); } }}>Delete</button></div></div></Card>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-label="Collection editor">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl p-5 max-w-2xl mx-auto my-8 text-sm">
            <h3 className="font-extrabold text-lg">Collection</h3>
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              <Field label="Name"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} className={inp} /></Field>
              <Field label="Slug"><input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inp} /></Field>
            </div>
            <Field label="Description"><textarea value={editing.desc || ""} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} className={inp} rows={2} /></Field>
            <MediaPicker value={editing.image} onPick={(u) => setEditing({ ...editing, image: u })} label="Cover" />
            <Field label="Products in collection"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to find products…" className={inp} /></Field>
            {q && <div className="border rounded-xl max-h-40 overflow-auto">{all.filter((p: any) => `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())).slice(0, 8).map((p: any) => <button key={p.slug} type="button" onClick={() => { if (!(editing.productSlugs || []).includes(p.slug)) setEditing({ ...editing, productSlugs: [...(editing.productSlugs || []), p.slug] }); setQ(""); }} className="block w-full text-left px-3 py-2 hover:bg-gray-50">+ {p.name}</button>)}</div>}
            <div className="flex flex-wrap gap-1 mt-2">{(editing.productSlugs || []).map((s: string) => <span key={s} className="bg-gray-100 rounded-full px-2 py-1 text-xs">{s} <button type="button" onClick={() => setEditing({ ...editing, productSlugs: editing.productSlugs.filter((x: string) => x !== s) })} aria-label="Remove">✕</button></span>)}</div>
            <div className="flex gap-2 mt-4"><button onClick={async () => { if (editing.id) await cmsPut("collections", editing, editing.id); else await cmsPost("collections", editing); setEditing(null); load(); }} className="bg-black text-white rounded-full px-6 py-2.5 font-bold">Save</button><button onClick={() => setEditing(null)} className="underline">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
