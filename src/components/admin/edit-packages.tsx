"use client";
import { useEffect, useState } from "react";
import { Card, Field, inp, Toggle, SaveBar, StatusPill, Confirm, Empty, Thumb, MediaPicker, api, cmsGet, cmsPut, cmsPost, cmsDel } from "./ui";

const PKG_CATS = ["Wedding", "Home", "Bedroom", "Living", "Office", "Custom"];
const PKG_FEATS = ["Delivery Included", "Assembly Included", "Warranty", "Room Coverage", "Customisation Available"];
const PKG_STATUS: any = { active: "Active", inactive: "Inactive", draft: "Draft", soldout: "Sold Out", coming: "Coming Soon" };

export function Packages() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const load = async () => setList(await cmsGet("packages"));
  useEffect(() => { load(); }, []);
  return (
    <div>
      <button onClick={() => setEditing({ name: "", category: "Wedding", cover: "", gallery: [], mrp: 99999, price: 79999, desc: "", included: [], features: ["Delivery Included"], status: "draft", featured: false })} className="bg-[#D21F26] text-white font-extrabold rounded-full px-5 py-2 text-sm mb-3">+ Create Package</button>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((p) => (
          <Card key={p.id}>
            <div className="flex gap-3">
              <Thumb src={p.cover} />
              <div className="flex-1 text-sm">
                <p className="font-extrabold">{p.name}</p>
                <p className="text-gray-500">₹{p.price?.toLocaleString("en-IN")} · {(p.included || []).length} items · {p.category}</p>
                <div className="flex items-center gap-2 mt-1"><StatusPill s={p.status} />{p.featured && <span className="text-xs font-bold text-green-700">★ Homepage</span>}</div>
              </div>
            </div>
            <div className="flex gap-3 mt-2 text-xs">
              <button className="underline" onClick={() => setEditing(p)}>Edit</button>
              <button className="underline" onClick={async () => { const { id, ...rest } = p; await cmsPost("packages", { ...rest, name: `${p.name} (Copy)`, slug: `${p.slug}-copy`, status: "draft" }); load(); }}>Duplicate</button>
              <button className="underline" onClick={async () => { await cmsPut("packages", { ...p, status: p.status === "active" ? "inactive" : "active" }, p.id); load(); }}>{p.status === "active" ? "Disable" : "Enable"}</button>
              <a className="underline" href={`/package/${p.slug}`} target="_blank" rel="noopener">Preview</a>
              <button className="underline text-red-600" onClick={() => setConfirm(p)}>Delete</button>
            </div>
          </Card>
        ))}
      </div>
      {list.length === 0 && <Empty title="No packages yet" />}
      {editing && <PackageForm initial={editing} onClose={() => setEditing(null)} onSaved={load} />}
      {confirm && <Confirm title={`Delete “${confirm.name}”?`} onCancel={() => setConfirm(null)} onDelete={async () => { await cmsDel("packages", confirm.id); setConfirm(null); load(); }} />}
    </div>
  );
}

function PackageForm({ initial, onClose, onSaved }: any) {
  const [f, setF] = useState<any>({ included: [], gallery: [], features: [], ...initial });
  const [saving, setSaving] = useState(false);
  const [pq, setPq] = useState("");
  const [found, setFound] = useState<any[]>([]);
  const set = (k: string, v: any) => setF((s: any) => ({ ...s, [k]: v }));
  useEffect(() => {
    if (!pq) { setFound([]); return; }
    const t = setTimeout(async () => { const j = await api(`/api/products?admin=1&q=${encodeURIComponent(pq)}`).catch(() => null); setFound((j?.products || []).slice(0, 6)); }, 300);
    return () => clearTimeout(t);
  }, [pq]);
  const off = f.mrp > f.price ? Math.round(((f.mrp - f.price) / f.mrp) * 100) : 0;
  const save = async () => {
    setSaving(true);
    const slug = (f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");
    if (f.id) await cmsPut("packages", { ...f, slug }, f.id);
    else await cmsPost("packages", { ...f, slug });
    setSaving(false); onSaved(); onClose();
  };
  const moveItem = (i: number, d: number) => { const n = [...f.included]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; set("included", n); };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-label="Package editor">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#F7F5F0] min-h-full lg:ml-auto lg:max-w-4xl p-4 space-y-4">
        <div className="flex items-center gap-3"><h2 className="font-extrabold text-xl">{f.id ? "Edit package" : "New package"}</h2><button className="ml-auto border rounded-full px-4 py-2 text-sm font-bold" onClick={onClose}>Close</button></div>
        <Card><div className="grid sm:grid-cols-2 gap-3">
          <Field label="Package name"><input value={f.name || ""} onChange={(e) => set("name", e.target.value)} className={inp} /></Field>
          <Field label="URL slug"><input value={f.slug || ""} onChange={(e) => set("slug", e.target.value)} className={inp} /></Field>
          <Field label="Category"><select value={f.category || "Wedding"} onChange={(e) => set("category", e.target.value)} className={inp}>{PKG_CATS.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Status"><select value={f.status || "draft"} onChange={(e) => set("status", e.target.value)} className={inp}>{Object.keys(PKG_STATUS).map((k) => <option key={k} value={k}>{PKG_STATUS[k]}</option>)}</select></Field>
          <Field label="Regular price ₹"><input type="number" value={f.mrp ?? ""} onChange={(e) => set("mrp", Number(e.target.value))} className={inp} /></Field>
          <Field label="Package price ₹"><input type="number" value={f.price ?? ""} onChange={(e) => set("price", Number(e.target.value))} className={inp} /></Field>
          <p className="text-sm self-end">Discount: <strong className="text-green-700">{off}% (save ₹{((f.mrp || 0) - (f.price || 0)).toLocaleString("en-IN")})</strong></p>
          <label className="flex items-center gap-2 text-sm font-bold">Feature on homepage <Toggle value={!!f.featured} onChange={(v) => set("featured", v)} label="Featured" /></label>
        </div>
        <Field label="Short + full description"><textarea value={f.desc || ""} onChange={(e) => set("desc", e.target.value)} className={inp} rows={3} /></Field></Card>
        <Card><h3 className="font-extrabold mb-2">Cover + gallery + video</h3>
          <MediaPicker value={f.cover} onPick={(u) => set("cover", u)} label="Cover image" />
          <MediaPicker onPick={(u) => set("gallery", [...(f.gallery || []), u])} label="Add gallery image" />
          <div className="flex gap-2 mt-2 flex-wrap">{(f.gallery || []).map((g: string, i: number) => <span key={i} className="relative"><Thumb src={g} /><button type="button" onClick={() => set("gallery", f.gallery.filter((_: any, k: number) => k !== i))} className="absolute -top-1 -right-1 bg-black text-white rounded-full w-5 h-5 text-xs" aria-label="Remove">✕</button></span>)}</div>
          <Field label="Package video URL (MP4 / YouTube)"><input value={f.video || ""} onChange={(e) => set("video", e.target.value)} className={inp} /></Field>
        </Card>
        <Card><h3 className="font-extrabold mb-2">What&apos;s included ({f.included?.length || 0})</h3>
          <input value={pq} onChange={(e) => setPq(e.target.value)} placeholder="Type product name to add from catalogue…" className={inp} aria-label="Find catalogue product" />
          {found.length > 0 && <div className="border rounded-xl mt-1 max-h-44 overflow-auto">{found.map((p: any) => <button type="button" key={p.slug} onClick={() => { set("included", [...(f.included || []), { title: p.name, qty: 1, productSlug: p.slug, image: p.images?.[0] }]); setPq(""); setFound([]); }} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">+ {p.name} — ₹{p.price?.toLocaleString("en-IN")}</button>)}</div>}
          <button type="button" onClick={() => set("included", [...(f.included || []), { title: "", qty: 1 }])} className="mt-2 border rounded-full px-4 py-1.5 text-sm font-bold">+ Custom item (not in catalogue)</button>
          <div className="space-y-2 mt-2">{(f.included || []).map((it: any, i: number) => (
            <div key={i} className="border rounded-xl p-2 grid grid-cols-[1fr_64px_auto] gap-2 items-center text-sm">
              <input value={it.title} onChange={(e) => { const n = [...f.included]; n[i] = { ...n[i], title: e.target.value }; set("included", n); }} placeholder="Item name" className={inp} aria-label="Item name" />
              <input type="number" min={1} value={it.qty} onChange={(e) => { const n = [...f.included]; n[i] = { ...n[i], qty: Number(e.target.value) }; set("included", n); }} className={inp} aria-label="Quantity" />
              <div className="flex gap-1"><button type="button" onClick={() => moveItem(i, -1)} className="border rounded px-1.5" aria-label="Move up">↑</button><button type="button" onClick={() => moveItem(i, 1)} className="border rounded px-1.5" aria-label="Move down">↓</button><button type="button" onClick={() => set("included", f.included.filter((_: any, k: number) => k !== i))} className="underline text-red-600">Remove</button></div>
              <input value={it.note || ""} onChange={(e) => { const n = [...f.included]; n[i] = { ...n[i], note: e.target.value }; set("included", n); }} placeholder="Variation / note (optional)" className={`${inp} col-span-3`} aria-label="Note" />
            </div>
          ))}</div>
        </Card>
        <Card><h3 className="font-extrabold mb-2">Features</h3><div className="flex flex-wrap gap-2">{PKG_FEATS.map((t) => <button type="button" key={t} onClick={() => set("features", (f.features || []).includes(t) ? f.features.filter((x: string) => x !== t) : [...(f.features || []), t])} aria-pressed={(f.features || []).includes(t)} className={`border rounded-full px-3 py-1.5 text-xs font-bold ${(f.features || []).includes(t) ? "bg-black text-white" : ""}`}>{t}</button>)}</div></Card>
        <div className="flex gap-2 sticky bottom-0 bg-[#F7F5F0] py-3">
          <button onClick={save} disabled={saving} className="flex-1 bg-[#D21F26] text-white font-extrabold rounded-full py-3">{saving ? "Saving…" : "Save & Publish"}</button>
          <a href={f.slug ? `/package/${f.slug}` : "/packages"} target="_blank" rel="noopener" className="border rounded-full px-6 py-3 font-bold">Preview</a>
        </div>
      </div>
    </div>
  );
}

export function Enquiries() {
  const [list, setList] = useState<any[]>([]);
  const load = async () => setList(await cmsGet("enquiries"));
  useEffect(() => { load(); }, []);
  const setStatus = async (it: any, status: string) => { await cmsPut("enquiries", { ...it, status }, it.id); load(); };
  return (
    <div className="space-y-2">
      {list.map((e) => (
        <Card key={e.id}>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex-1 min-w-[200px]"><p className="font-extrabold">{e.name} · {e.phone}</p><p className="text-gray-500 text-xs">{new Date(e.date).toLocaleString("en-IN")} · {e.type} · Budget: {e.budget || "—"}</p><p className="mt-1">{e.notes}</p><p className="text-xs text-gray-500">{(e.items || []).join(", ")}</p></div>
            <StatusPill s={e.status || "new"} />
            <select value={e.status || "new"} onChange={(ev) => setStatus(e, ev.target.value)} className="border rounded-full px-2 py-1.5 text-xs" aria-label="Status">{["new", "contacted", "closed"].map((o) => <option key={o}>{o}</option>)}</select>
            <a href={`tel:+${String(e.phone).replace(/\D/g, "")}`} className="border rounded-full px-3 py-1.5 font-bold">📞 Call</a>
            <a href={`https://wa.me/${String(e.phone).replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${e.name}, this is Planet Interio regarding your package enquiry.`)}`} target="_blank" rel="noopener" className="border rounded-full px-3 py-1.5 font-bold">💬 WhatsApp</a>
            <button className="underline text-xs text-red-600" onClick={async () => { if (confirm("Delete enquiry?")) { await cmsDel("enquiries", e.id); load(); } }}>Delete</button>
          </div>
        </Card>
      ))}
      {list.length === 0 && <Empty title="No enquiries yet — share /build-package with customers" />}
    </div>
  );
}

export function Discounts() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const load = async () => setList(await cmsGet("coupons"));
  useEffect(() => { load(); }, []);
  return (
    <div>
      <button onClick={() => setEditing({ code: "", kind: "fixed", amount: 500, active: true })} className="bg-[#D21F26] text-white font-extrabold rounded-full px-5 py-2 text-sm mb-3">+ Create Discount</button>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center gap-2 text-sm"><p className="font-extrabold text-lg">{c.code}</p><StatusPill s={c.active ? "active" : "inactive"} /><span className="ml-auto text-gray-500">used {c.used || 0}{c.limit ? `/${c.limit}` : ""}</span></div>
            <p className="text-sm text-gray-600">{c.kind === "percent" ? `${c.amount}% off` : `₹${c.amount} off`} · min ₹{c.minOrder || 0}{c.maxOff ? ` · cap ₹${c.maxOff}` : ""} · {c.start || "…"} → {c.end || "…"}</p>
            <div className="flex gap-3 mt-2 text-xs"><button className="underline" onClick={() => setEditing(c)}>Edit</button><button className="underline" onClick={async () => { await cmsPut("coupons", { ...c, active: !c.active }, c.id); load(); }}>{c.active ? "Disable" : "Enable"}</button><button className="underline text-red-600" onClick={async () => { if (confirm(`Delete ${c.code}?`)) { await cmsDel("coupons", c.id); load(); } }}>Delete</button></div>
          </Card>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-label="Discount editor">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl p-5 max-w-lg w-full text-sm">
            <h3 className="font-extrabold text-lg">Discount</h3>
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              <Field label="Code"><input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} className={`${inp} uppercase`} /></Field>
              <Field label="Type"><select value={editing.kind} onChange={(e) => setEditing({ ...editing, kind: e.target.value })} className={inp}><option value="fixed">Fixed ₹</option><option value="percent">Percent %</option></select></Field>
              <Field label="Amount"><input type="number" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} className={inp} /></Field>
              <Field label="Min order ₹"><input type="number" value={editing.minOrder || 0} onChange={(e) => setEditing({ ...editing, minOrder: Number(e.target.value) })} className={inp} /></Field>
              <Field label="Max discount ₹"><input type="number" value={editing.maxOff || 0} onChange={(e) => setEditing({ ...editing, maxOff: Number(e.target.value) })} className={inp} /></Field>
              <Field label="Usage limit"><input type="number" value={editing.limit || 0} onChange={(e) => setEditing({ ...editing, limit: Number(e.target.value) })} className={inp} /></Field>
              <Field label="Start"><input type="date" value={editing.start || ""} onChange={(e) => setEditing({ ...editing, start: e.target.value })} className={inp} /></Field>
              <Field label="End"><input type="date" value={editing.end || ""} onChange={(e) => setEditing({ ...editing, end: e.target.value })} className={inp} /></Field>
            </div>
            <Field label="Description"><input value={editing.desc || ""} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} className={inp} /></Field>
            <div className="flex gap-2 mt-4"><button onClick={async () => { if (editing.id) await cmsPut("coupons", editing, editing.id); else await cmsPost("coupons", editing); setEditing(null); load(); }} className="bg-black text-white rounded-full px-6 py-2.5 font-bold">Save</button><button onClick={() => setEditing(null)} className="underline">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

const FOLDERS = ["Uploads", "Products", "Hero", "Categories", "Packages", "Brands", "Blog", "Website", "Other"];
export function Media() {
  const [files, setFiles] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [folder, setFolder] = useState("all");
  const [preview, setPreview] = useState<any>(null);
  const [dims, setDims] = useState("");
  const load = async () => { const j = await api(`/api/admin/media?q=${encodeURIComponent(q)}&kind=${kind}`).catch(() => null); setFiles(j?.files || []); };
  useEffect(() => { load(); }, [q, kind]);
  const shown = folder === "all" ? files : files.filter((f) => f.folder === folder);
  const upload = async (fl: FileList | null, f: string) => {
    if (!fl?.length) return;
    const fd = new FormData();
    Array.from(fl).slice(0, 10).forEach((x) => fd.append("files", x));
    fd.append("folder", f);
    await fetch("/api/admin/media", { method: "POST", body: fd });
    load();
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 text-sm">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search media…" className="border rounded-full px-4 py-2 flex-1 min-w-[160px]" aria-label="Search media" />
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="border rounded-full px-3 py-2" aria-label="Type"><option value="all">Images + Videos</option><option value="image">Images</option><option value="video">Videos</option></select>
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="border rounded-full px-3 py-2" aria-label="Folder"><option value="all">All folders</option>{FOLDERS.map((f) => <option key={f}>{f}</option>)}</select>
        <label className="bg-[#D21F26] text-white font-bold rounded-full px-5 py-2 cursor-pointer">+ Upload<input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm" className="hidden" onChange={(e) => upload(e.target.files, folder === "all" ? "Uploads" : folder)} /></label>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {shown.map((f) => (
          <button key={f.url} onClick={() => { setPreview(f); setDims(""); }} className="border rounded-xl overflow-hidden bg-white text-left">
            {f.kind === "video" ? <span className="block aspect-square grid place-items-center bg-black text-white text-2xl">▶</span> : <Thumb src={f.url} />}
            <p className="text-[11px] p-1 truncate">{f.name}</p>
          </button>
        ))}
      </div>
      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-label="Media preview">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPreview(null)} />
          <div className="relative bg-white rounded-2xl p-4 max-w-lg w-full text-sm">
            {preview.kind === "video" ? <video src={preview.url} controls className="w-full rounded-xl" /> : <><img src={preview.url} alt={preview.name} className="w-full rounded-xl" onLoad={(e) => setDims(`${(e.target as HTMLImageElement).naturalWidth} × ${(e.target as HTMLImageElement).naturalHeight}px`)} /></>}
            <p className="font-bold mt-2 break-all">{preview.name}</p>
            <p className="text-xs text-gray-500">{preview.size ? `${(preview.size / 1024).toFixed(0)} KB · ` : ""}{dims}{preview.mtime ? ` · ${new Date(preview.mtime).toLocaleDateString("en-IN")}` : ""}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => { navigator.clipboard.writeText(preview.url); alert("URL copied"); }} className="border rounded-full px-4 py-2 font-bold">Copy URL</button>
              <select value={preview.folder} onChange={async (e) => { await api("/api/admin/media", { method: "PATCH", body: JSON.stringify({ url: preview.url, folder: e.target.value }) }); setPreview({ ...preview, folder: e.target.value }); load(); }} className="border rounded-full px-3 py-2" aria-label="Folder">{FOLDERS.map((f) => <option key={f}>{f}</option>)}</select>
              {preview.url.startsWith("/uploads/") && <button onClick={async () => { if (confirm("Delete this file?")) { await api(`/api/admin/media?url=${encodeURIComponent(preview.url)}`, { method: "DELETE" }); setPreview(null); load(); } }} className="text-red-600 underline ml-auto">Delete</button>}
              <button onClick={() => setPreview(null)} className="underline ml-auto">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
