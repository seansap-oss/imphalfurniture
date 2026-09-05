"use client";
import { useEffect, useState } from "react";
import { Card, Field, inp, Toggle, SaveBar, useAutosave, cmsGet, cmsPut, MediaPicker } from "./ui";

function get(o: any, p: string) { return p.split(".").reduce((a, k) => (a == null ? a : a[k]), o); }
function setP(o: any, p: string, v: any) {
  const ks = p.split("."); const c = Array.isArray(o) ? [...o] : { ...o };
  let t: any = c;
  for (let i = 0; i < ks.length - 1; i++) { t[ks[i]] = Array.isArray(t[ks[i]]) ? [...t[ks[i]]] : { ...(t[ks[i]] || {}) }; t = t[ks[i]]; }
  t[ks[ks.length - 1]] = v;
  return c;
}

export function SimpleForm({ collection, title, desc, fields }: { collection: string; title: string; desc?: string; fields: { key: string; label: string; type?: string; options?: string[]; hint?: string }[] }) {
  const [loaded, setLoaded] = useState<any>(null);
  const { val, edit, status, setStatus } = useAutosave<any>(loaded);
  useEffect(() => { cmsGet(collection).then((d) => { setLoaded(d); }); }, [collection]);
  if (!val) return <Card><p>Loading…</p></Card>;
  const save = async () => { setStatus("saving"); const j = await cmsPut(collection, val); setStatus(j.ok ? "saved" : "error"); };
  return (
    <Card>
      <h2 className="font-extrabold text-lg">{title}</h2>
      {desc && <p className="text-sm text-gray-500 mb-3">{desc}</p>}
      <div className="grid sm:grid-cols-2 gap-3 mt-2">
        {fields.map((f) => (
          <Field key={f.key} label={f.label} hint={f.hint}>
            {f.type === "textarea" ? <textarea value={get(val, f.key) || ""} onChange={(e) => edit(setP(val, f.key, e.target.value))} className={inp} rows={3} />
              : f.type === "number" ? <input type="number" value={get(val, f.key) ?? ""} onChange={(e) => edit(setP(val, f.key, Number(e.target.value)))} className={inp} />
              : f.type === "color" ? <input type="color" value={get(val, f.key) || "#000000"} onChange={(e) => edit(setP(val, f.key, e.target.value))} className="h-11 w-20 border rounded-lg" />
              : f.type === "toggle" ? <Toggle value={!!get(val, f.key)} onChange={(v) => edit(setP(val, f.key, v))} label={f.label} />
              : f.type === "select" ? <select value={get(val, f.key) || ""} onChange={(e) => edit(setP(val, f.key, e.target.value))} className={inp}>{(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}</select>
              : f.type === "media" ? <MediaPicker value={get(val, f.key) || ""} onPick={(u) => edit(setP(val, f.key, u))} label={f.label} />
              : <input value={get(val, f.key) || ""} onChange={(e) => edit(setP(val, f.key, e.target.value))} className={inp} />}
          </Field>
        ))}
      </div>
      <SaveBar status={status} onSave={save} />
    </Card>
  );
}

export function Branding() {
  return <SimpleForm collection="settings" title="Branding — logo, name, tagline" desc="Changes appear in the header, footer, PWA icon screen and invoices." fields={[
    { key: "siteName", label: "Website name" }, { key: "tagline", label: "Tagline" },
    { key: "logo", label: "Logo (header)", type: "media" }, { key: "mobileLogo", label: "Mobile logo", type: "media" },
    { key: "favicon", label: "Favicon / app icon", type: "media" }, { key: "currency", label: "Currency label" }
  ]} />;
}
export function ContactDetails() {
  return <SimpleForm collection="contact" title="Contact details" desc="Phone numbers feed the footer, contact page and floating buttons automatically." fields={[
    { key: "call", label: "Call phone" }, { key: "whatsapp", label: "WhatsApp number" },
    { key: "email", label: "Email" }, { key: "secondaryPhone", label: "Secondary phone" },
    { key: "address", label: "Main address", type: "textarea" }, { key: "workshop", label: "Workshop address", type: "textarea" },
    { key: "hours", label: "Opening hours" }, { key: "mapsUrl", label: "Google Maps URL", hint: "Full https link" }
  ]} />;
}
const CHANNELS = ["facebook", "instagram", "youtube", "pinterest", "twitter", "linkedin", "tiktok"];
export function SocialMedia() {
  const [loaded, setLoaded] = useState<any>(null);
  const { val, edit, status, setStatus } = useAutosave<any>(loaded);
  useEffect(() => { cmsGet("social").then(setLoaded); }, []);
  if (!val) return <Card><p>Loading…</p></Card>;
  const save = async () => { setStatus("saving"); const j = await cmsPut("social", val); setStatus(j.ok ? "saved" : "error"); };
  return (
    <Card>
      <h2 className="font-extrabold text-lg">Social media</h2>
      <p className="text-sm text-gray-500 mb-3">Paste full URLs. Empty or disabled channels are hidden on the website.</p>
      <div className="space-y-3">
        {CHANNELS.map((c) => (
          <div key={c} className="border rounded-xl p-3 grid sm:grid-cols-[140px_1fr_auto] gap-2 items-center text-sm">
            <strong className="capitalize">{c === "twitter" ? "X / Twitter" : c}</strong>
            <input value={val[c]?.url || ""} onChange={(e) => edit(setP(val, `${c}.url`, e.target.value))} placeholder="https://…" className={inp} aria-label={`${c} URL`} />
            <label className="flex items-center gap-2"><Toggle value={!!val[c]?.enabled} onChange={(v) => edit(setP(val, `${c}.enabled`, v))} label={`${c} enabled`} /> Show</label>
          </div>
        ))}
      </div>
      <SaveBar status={status} onSave={save} />
    </Card>
  );
}
export function AnnouncementBar() {
  const [loaded, setLoaded] = useState<any>(null);
  const { val, setVal, edit, status, setStatus } = useAutosave<any>(loaded);
  useEffect(() => { cmsGet("announcement").then(setLoaded); }, []);
  if (!val) return <Card><p>Loading…</p></Card>;
  const save = async () => { setStatus("saving"); const j = await cmsPut("announcement", val); setStatus(j.ok ? "saved" : "error"); };
  const msgs = val.messages || [];
  return (
    <Card>
      <h2 className="font-extrabold text-lg">Announcement bar</h2>
      <div className="flex gap-3 items-center mt-2 text-sm">
        <label className="flex items-center gap-2 font-bold">Enabled <Toggle value={!!val.enabled} onChange={(v) => edit({ enabled: v })} label="Announcement enabled" /></label>
        <label>Style <select value={val.mode || "static"} onChange={(e) => edit({ mode: e.target.value })} className="border rounded-lg px-2 py-1.5"><option value="static">Static</option><option value="ticker">Scrolling ticker</option></select></label>
      </div>
      <div className="space-y-2 mt-3">
        {msgs.map((m: any, i: number) => (
          <div key={i} className="flex gap-2">
            <input value={m.text} onChange={(e) => { const n = [...msgs]; n[i] = { ...n[i], text: e.target.value }; setVal({ ...val, messages: n }); setStatus("dirty"); }} className={inp} aria-label={`Message ${i + 1}`} />
            <input value={m.url || ""} onChange={(e) => { const n = [...msgs]; n[i] = { ...n[i], url: e.target.value }; setVal({ ...val, messages: n }); setStatus("dirty"); }} placeholder="Link (optional)" className={`${inp} max-w-[180px]`} aria-label="Link" />
            <button type="button" onClick={() => { setVal({ ...val, messages: msgs.filter((_: any, k: number) => k !== i) }); setStatus("dirty"); }} className="border rounded-lg px-3" aria-label="Remove">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => { setVal({ ...val, messages: [...msgs, { text: "", url: "" }] }); setStatus("dirty"); }} className="mt-2 border rounded-full px-4 py-2 text-sm font-bold">+ Add message</button>
      <SaveBar status={status} onSave={save} />
    </Card>
  );
}
export function HeaderEditor() {
  return <SimpleForm collection="header" title="Header" desc="Show or hide header icons. Menu items come from Categories + Menus." fields={[
    { key: "showSearch", label: "Search", type: "toggle" }, { key: "showAccount", label: "Account icon", type: "toggle" },
    { key: "showWishlist", label: "Wishlist icon", type: "toggle" }, { key: "showCart", label: "Cart icon", type: "toggle" }
  ]} />;
}
export function FooterEditor() {
  return <SimpleForm collection="footer" title="Footer" desc="Contact block and social icons update automatically from their own settings." fields={[
    { key: "tagline", label: "Tagline" }, { key: "about", label: "About blurb", type: "textarea" },
    { key: "copyright", label: "Copyright line" }, { key: "credit.enabled", label: "Show designer credit", type: "toggle" },
    { key: "credit.name", label: "Designer name" }, { key: "credit.phone", label: "Designer phone" }, { key: "credit.url", label: "Designer URL" }
  ]} />;
}
export function FloatingEditor() {
  return <SimpleForm collection="floating" title="WhatsApp / floating buttons" desc="Numbers here drive every WhatsApp and Call button on the website." fields={[
    { key: "whatsapp.enabled", label: "Enable WhatsApp", type: "toggle" }, { key: "whatsapp.number", label: "WhatsApp number" },
    { key: "whatsapp.message", label: "Default message", type: "textarea" }, { key: "call.enabled", label: "Enable Call", type: "toggle" },
    { key: "call.number", label: "Call number" }, { key: "position", label: "Position", type: "select", options: ["bottom-right", "bottom-left"] },
    { key: "color", label: "Button colour", type: "color" }
  ]} />;
}
export function SeoEditor() {
  return <SimpleForm collection="seo" title="SEO" fields={[
    { key: "title", label: "Site title" }, { key: "description", label: "Description", type: "textarea" },
    { key: "keywords", label: "Keywords" }, { key: "ogImage", label: "Social share image", type: "media" }
  ]} />;
}
export function AppearanceEditor() {
  const [loaded, setLoaded] = useState<any>(null);
  const { val, edit, status, setStatus } = useAutosave<any>(loaded);
  useEffect(() => { cmsGet("appearance").then(setLoaded); }, []);
  if (!val) return <Card><p>Loading…</p></Card>;
  const save = async () => { setStatus("saving"); const j = await cmsPut("appearance", val); setStatus(j.ok ? "saved" : "error"); };
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <h2 className="font-extrabold text-lg">Appearance</h2>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[["primary", "Primary"], ["secondary", "Secondary"], ["accent", "Accent"], ["text", "Text"], ["header", "Header"], ["footer", "Footer"]].map(([k, l]) => (
            <Field key={k} label={l}><div className="flex gap-2 items-center"><input type="color" value={val[k] || "#000000"} onChange={(e) => edit({ [k]: e.target.value })} className="h-11 w-16 border rounded-lg" /><input value={val[k] || ""} onChange={(e) => edit({ [k]: e.target.value })} className={inp} aria-label={l} /></div></Field>
          ))}
        </div>
        <Field label="Corner roundness (px)"><input type="number" value={val.radius || 16} onChange={(e) => edit({ radius: e.target.value })} className={inp} /></Field>
        <SaveBar status={status} onSave={save} />
      </Card>
      <Card>
        <h2 className="font-extrabold text-lg">Live preview</h2>
        <div className="rounded-2xl overflow-hidden border mt-2" style={{ borderRadius: `${val.radius || 16}px` }}>
          <div className="px-4 py-3 font-extrabold text-white" style={{ background: val.header === "#FFFFFF" ? val.secondary : val.header }}>Planet Interio</div>
          <div className="p-4" style={{ color: val.text }}>
            <p className="font-bold">Sofa of the week</p>
            <button style={{ background: val.primary }} className="text-white font-bold px-5 py-2 mt-2 rounded-full">Add to Cart</button>
            <span className="ml-2 text-sm font-bold" style={{ color: val.accent }}>SALE</span>
          </div>
          <div className="px-4 py-3 text-white text-sm" style={{ background: val.footer }}>Footer preview</div>
        </div>
      </Card>
    </div>
  );
}
export function MenusEditor() {
  const [loaded, setLoaded] = useState<any>(null);
  const { val, setVal, status, setStatus } = useAutosave<any>(loaded);
  useEffect(() => { cmsGet("navigation").then(setLoaded); }, []);
  if (!val) return <Card><p>Loading…</p></Card>;
  const items = val.items || [];
  const save = async () => { setStatus("saving"); const j = await cmsPut("navigation", val); setStatus(j.ok ? "saved" : "error"); };
  const move = (i: number, d: number) => { const n = [...items]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; setVal({ ...val, items: n }); setStatus("dirty"); };
  return (
    <Card>
      <h2 className="font-extrabold text-lg">Menus — custom links</h2>
      <p className="text-sm text-gray-500 mb-3">Category links come from Categories automatically. Add extra links (e.g. Packages, Blog, Sale) here.</p>
      {items.map((it: any, i: number) => (
        <div key={i} className="flex gap-2 mb-2 text-sm">
          <input value={it.label} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], label: e.target.value }; setVal({ ...val, items: n }); setStatus("dirty"); }} placeholder="Label" className={inp} aria-label="Label" />
          <input value={it.href} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], href: e.target.value }; setVal({ ...val, items: n }); setStatus("dirty"); }} placeholder="/packages" className={inp} aria-label="Link" />
          <button type="button" onClick={() => move(i, -1)} className="border rounded-lg px-2" aria-label="Move up">↑</button>
          <button type="button" onClick={() => move(i, 1)} className="border rounded-lg px-2" aria-label="Move down">↓</button>
          <button type="button" onClick={() => { setVal({ ...val, items: items.filter((_: any, k: number) => k !== i) }); setStatus("dirty"); }} className="border rounded-lg px-2" aria-label="Remove">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => { setVal({ ...val, items: [...items, { label: "", href: "/" }] }); setStatus("dirty"); }} className="border rounded-full px-4 py-2 text-sm font-bold">+ Add link</button>
      <SaveBar status={status} onSave={save} />
    </Card>
  );
}
export function DeliveryEditor() {
  const [loaded, setLoaded] = useState<any>(null);
  const { val, setVal, status, setStatus } = useAutosave<any>(loaded);
  useEffect(() => { cmsGet("delivery").then((d) => setLoaded({ zones: d })); }, []);
  if (!val) return <Card><p>Loading…</p></Card>;
  const save = async () => { setStatus("saving"); const j = await cmsPut("delivery", val.zones); setStatus(j.ok ? "saved" : "error"); };
  return (
    <Card>
      <h2 className="font-extrabold text-lg">Delivery zones</h2>
      <div className="space-y-3 mt-2">
        {(val.zones || []).map((z: any, i: number) => (
          <div key={z.id || i} className="border rounded-xl p-3 grid sm:grid-cols-2 gap-2 text-sm">
            <Field label="Area"><input value={z.label} onChange={(e) => { const n = [...val.zones]; n[i] = { ...n[i], label: e.target.value }; setVal({ ...val, zones: n }); setStatus("dirty"); }} className={inp} /></Field>
            <Field label="PIN codes (comma separated, ranges with –)"><input value={z.pins} onChange={(e) => { const n = [...val.zones]; n[i] = { ...n[i], pins: e.target.value }; setVal({ ...val, zones: n }); setStatus("dirty"); }} className={inp} /></Field>
            <Field label="Fee ₹"><input type="number" value={z.charge} onChange={(e) => { const n = [...val.zones]; n[i] = { ...n[i], charge: Number(e.target.value) }; setVal({ ...val, zones: n }); setStatus("dirty"); }} className={inp} /></Field>
            <Field label="Free above ₹"><input type="number" value={z.freeAbove} onChange={(e) => { const n = [...val.zones]; n[i] = { ...n[i], freeAbove: Number(e.target.value) }; setVal({ ...val, zones: n }); setStatus("dirty"); }} className={inp} /></Field>
            <Field label="Estimate"><input value={z.days} onChange={(e) => { const n = [...val.zones]; n[i] = { ...n[i], days: e.target.value }; setVal({ ...val, zones: n }); setStatus("dirty"); }} className={inp} /></Field>
            <div><button type="button" className="underline text-xs mt-6" onClick={() => { setVal({ ...val, zones: val.zones.filter((_: any, k: number) => k !== i) }); setStatus("dirty"); }}>Remove zone</button></div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => { setVal({ ...val, zones: [...(val.zones || []), { id: `z-${Date.now()}`, label: "", pins: "", charge: 0, freeAbove: 0, days: "" }] }); setStatus("dirty"); }} className="mt-2 border rounded-full px-4 py-2 text-sm font-bold">+ Add zone</button>
      <SaveBar status={status} onSave={save} />
    </Card>
  );
}
export function PaymentsEditor() {
  const [loaded, setLoaded] = useState<any>(null);
  const { val, edit, status, setStatus } = useAutosave<any>(loaded);
  useEffect(() => { cmsGet("payments").then(setLoaded); }, []);
  if (!val) return <Card><p>Loading…</p></Card>;
  const save = async () => { setStatus("saving"); const j = await cmsPut("payments", val); setStatus(j.ok ? "saved" : "error"); };
  return (
    <Card>
      <h2 className="font-extrabold text-lg">Payment methods</h2>
      <p className="text-sm text-gray-500 mb-3">Only enabled methods appear at checkout. Keys stay on the server.</p>
      {Object.keys(val).map((k) => (
        <div key={k} className="border rounded-xl p-3 mb-2 grid sm:grid-cols-[120px_1fr_auto] gap-2 items-center text-sm">
          <strong className="uppercase">{k}</strong>
          <input value={val[k]?.label || ""} onChange={(e) => edit(setP(val, `${k}.label`, e.target.value))} className={inp} aria-label={`${k} label`} />
          <label className="flex items-center gap-2"><Toggle value={!!val[k]?.enabled} onChange={(v) => edit(setP(val, `${k}.enabled`, v))} label={`${k} enabled`} /> On</label>
          {k === "bank" && <input value={val[k]?.details || ""} onChange={(e) => edit(setP(val, `${k}.details`, e.target.value))} placeholder="Account details shown at checkout" className={`${inp} sm:col-span-3`} aria-label="Bank details" />}
        </div>
      ))}
      <SaveBar status={status} onSave={save} />
    </Card>
  );
}
export function GeneralSettings() {
  const refresh = async () => { const j = await cmsPut("settings", (await cmsGet("settings")) || {}); alert(j.ok ? "Website cache refreshed — changes are live." : "Failed"); };
  return (
    <Card>
      <h2 className="font-extrabold text-lg">Settings</h2>
      <p className="text-sm text-gray-500">Publishing in any editor refreshes the live website automatically.</p>
      <button onClick={refresh} className="mt-3 bg-black text-white rounded-full px-6 py-2.5 text-sm font-bold">Refresh live website now</button>
    </Card>
  );
}
