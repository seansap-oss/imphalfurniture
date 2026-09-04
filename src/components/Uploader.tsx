"use client";
import { useState } from "react";
export default function Uploader({ onUrls }: { onUrls: (u: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState<string[]>([]);
  async function send(files: FileList | File[]) {
    setBusy(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    const j = await res.json();
    setBusy(false);
    if (j.ok) { setList((l) => [...j.urls, ...l]); onUrls(j.urls); }
    else alert(j.error || "Upload failed");
  }
  return (
    <div className="border-2 border-dashed rounded-2xl p-4 text-sm" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) send(e.dataTransfer.files); }}>
      <p className="font-bold">Drag & drop images / MP4 here, or</p>
      <label className="inline-block mt-2 bg-black text-white px-4 py-2 rounded-full cursor-pointer">Choose files<input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.avif,.svg,.mp4,.webm" className="hidden" onChange={(e) => e.target.files && send(e.target.files)} /></label>
      {busy && <p>Uploading & optimising…</p>}
      {list.length > 0 && <div className="flex gap-2 mt-3 flex-wrap">{list.map((u) => <span key={u} className="text-xs bg-gray-100 rounded px-2 py-1 break-all">{u} <button aria-label="Delete this image?" onClick={() => { if (confirm("Delete this image?")) setList((l) => l.filter((x) => x !== u)); }} className="underline ml-1">delete</button></span>)}</div>}
      <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP, AVIF, SVG + MP4/WebM. Auto-compressed; set alt text after insert. Warns before delete.</p>
    </div>
  );
}
