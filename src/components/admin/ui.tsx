"use client";
import { useEffect, useState } from "react";

// ---------- data helpers ----------
export async function api(path: string, opts: any = {}) {
  const r = await fetch(path, { ...opts, headers: { "Content-Type": "application/json", ...(opts.headers || {}) } });
  return r.json();
}
export const cmsGet = (collection: string) => api(`/api/cms?collection=${collection}`).then((j) => j.data);
export const cmsPut = (collection: string, data: any, id?: string, slug?: string) =>
  api(`/api/cms`, { method: "PUT", body: JSON.stringify({ collection, data, id, slug }) });
export const cmsPost = (collection: string, item: any) =>
  api(`/api/cms`, { method: "POST", body: JSON.stringify({ collection, item }) });
export const cmsDel = (collection: string, id: string) =>
  api(`/api/cms?collection=${collection}&id=${encodeURIComponent(id)}`, { method: "DELETE" });

// ---------- primitives ----------
export function Card({ children, className }: any) {
  return <div className={`bg-white border rounded-2xl p-4 ${className || ""}`}>{children}</div>;
}
export function Field({ label, children, hint }: any) {
  return <label className="block text-sm"><span className="font-bold">{label}</span><div className="mt-1">{children}</div>{hint && <span className="text-xs text-gray-500">{hint}</span>}</label>;
}
export const inp = "border rounded-lg px-3 py-2.5 w-full text-sm";
export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  return <button type="button" role="switch" aria-checked={value} aria-label={label || "Toggle"} onClick={() => onChange(!value)} className={`w-12 h-7 rounded-full p-1 transition ${value ? "bg-green-600" : "bg-gray-300"}`}><span className={`block w-5 h-5 bg-white rounded-full shadow transition ${value ? "ml-auto" : ""}`} /></button>;
}
export function StatusPill({ s }: { s: string }) {
  const c: any = { active: "bg-green-100 text-green-800", published: "bg-green-100 text-green-800", draft: "bg-gray-200 text-gray-700", inactive: "bg-gray-200 text-gray-700", hidden: "bg-gray-200 text-gray-700", soldout: "bg-red-100 text-red-700", coming: "bg-blue-100 text-blue-800", new: "bg-blue-100 text-blue-800", Pending: "bg-yellow-100 text-yellow-800", Delivered: "bg-green-100 text-green-800", Cancelled: "bg-red-100 text-red-700" };
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c[s] || "bg-gray-100 text-gray-700"}`}>{s}</span>;
}
export function SaveBar({ status, onSave, extra }: { status: "saved" | "saving" | "dirty" | "error"; onSave: () => void; extra?: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 bg-white/95 border-t -mx-4 -mb-4 px-4 py-3 mt-4 flex items-center gap-3 rounded-b-2xl">
      <button onClick={onSave} className="bg-[#D21F26] text-white font-extrabold rounded-full px-8 py-2.5 min-h-[44px]">Save & Publish</button>
      {extra}
      <span className="ml-auto text-xs text-gray-500" role="status">{status === "saved" ? "✓ Saved" : status === "saving" ? "Saving…" : status === "error" ? "⚠ Save failed" : "• Unsaved changes"}</span>
    </div>
  );
}
export function useAutosave<T>(initial: T | null) {
  const [val, setVal] = useState<T | null>(initial);
  const [status, setStatus] = useState<"saved" | "saving" | "dirty" | "error">("saved");
  useEffect(() => { setVal(initial); setStatus("saved"); }, [JSON.stringify(initial)]);
  const edit = (patch: Partial<T>) => { setVal((v: any) => ({ ...v, ...patch })); setStatus("dirty"); };
  return { val, setVal, edit, status, setStatus };
}
export function Confirm({ title, onCancel, onDelete }: { title: string; onCancel: () => void; onDelete: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="alertdialog" aria-label={title}>
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full">
        <h3 className="font-extrabold text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">This can affect the live website.</p>
        <div className="flex gap-2 mt-4">
          <button onClick={onCancel} className="flex-1 border rounded-full py-2.5 font-bold">Cancel</button>
          <button onClick={onDelete} className="flex-1 bg-red-600 text-white rounded-full py-2.5 font-bold">Delete</button>
        </div>
      </div>
    </div>
  );
}
export function Thumb({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return <div className="w-16 h-12 bg-gray-100 rounded-lg grid place-items-center text-gray-300">🖼</div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt || ""} className="w-16 h-12 object-cover rounded-lg border" loading="lazy" />;
}
export function Empty({ title, action }: { title: string; action?: React.ReactNode }) {
  return <div className="bg-white border rounded-2xl p-10 text-center"><p className="font-extrabold">{title}</p><div className="mt-3">{action}</div></div>;
}

// ---------- media picker: Upload / URL / Library ----------
export function MediaPicker({ value, onPick, label, accept }: { value?: string; onPick: (url: string) => void; label?: string; accept?: string }) {
  const [tab, setTab] = useState<"upload" | "url" | "library">("upload");
  const [url, setUrl] = useState(value || "");
  const [files, setFiles] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (tab !== "library") return;
    fetch(`/api/admin/media?q=${encodeURIComponent(q)}`).then((r) => r.json()).then((j) => setFiles(j.files || [])).catch(() => {});
  }, [tab, q]);
  const upload = async (fl: FileList | null) => {
    if (!fl?.length) return;
    setBusy(true);
    const fd = new FormData();
    Array.from(fl).slice(0, 10).forEach((f) => fd.append("files", f));
    const r = await fetch("/api/admin/media", { method: "POST", body: fd });
    const j = await r.json();
    setBusy(false);
    if (j.ok && j.urls?.length) onPick(j.urls[0]); else alert(j.error || "Upload failed");
  };
  return (
    <div className="border rounded-xl p-3 text-sm">
      <div className="flex items-center gap-3">
        <Thumb src={value} />
        <div>
          <p className="font-bold">{label || "Image"}</p>
          <p className="text-xs text-gray-500 break-all">{value || "No file chosen"}</p>
        </div>
        {value && <button type="button" className="ml-auto underline text-xs" onClick={() => onPick("")}>Remove</button>}
      </div>
      <div className="flex gap-1 mt-2 text-xs font-bold">
        {(["upload", "url", "library"] as const).map((t) => <button type="button" key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-full ${tab === t ? "bg-black text-white" : "bg-gray-100"}`}>{t === "url" ? "IMAGE URL" : t === "library" ? "MEDIA LIBRARY" : "UPLOAD FILE"}</button>)}
      </div>
      {tab === "upload" && <label className="block mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer">Drop file or click to browse<input type="file" accept={accept || ".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm"} className="hidden" onChange={(e) => upload(e.target.files)} />{busy && <p>Uploading…</p>}</label>}
      {tab === "url" && <div className="flex gap-2 mt-2"><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={inp} /><button type="button" onClick={() => onPick(url)} className="bg-black text-white rounded-lg px-4 font-bold">Use</button></div>}
      {tab === "library" && (
        <div className="mt-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search media…" className={inp} aria-label="Search media" />
          <div className="grid grid-cols-4 gap-2 mt-2 max-h-48 overflow-auto">
            {files.map((f) => <button type="button" key={f.url} onClick={() => onPick(f.url)} title={f.name} className="border rounded-lg overflow-hidden">{f.kind === "video" ? <span className="block aspect-square grid place-items-center bg-black text-white">▶</span> : <><Thumb src={f.url} /></>}</button>)}
          </div>
        </div>
      )}
    </div>
  );
}
