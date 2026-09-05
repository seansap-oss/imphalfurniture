"use client";
import { useState } from "react";

export type FloatingCfg = {
  whatsapp: { enabled: boolean; number: string; message: string };
  call: { enabled: boolean; number: string };
  color: string;
};
// Phone numbers come from CMS — never hard-coded here.
export default function FloatingButtons({ cfg, extra }: { cfg: FloatingCfg; extra?: string }) {
  const [open, setOpen] = useState(false);
  if (!cfg.whatsapp.enabled && !cfg.call.enabled) return null;
  const digits = (n: string) => n.replace(/\D/g, "");
  const waMsg = encodeURIComponent(cfg.whatsapp.message + (extra ? `\n\n${extra}` : ""));
  const waHref = `https://wa.me/${digits(cfg.whatsapp.number)}?text=${waMsg}`;
  const telHref = `tel:+${digits(cfg.call.number)}`;
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2" aria-label="Contact us">
      {open && (
        <div className="bg-white rounded-2xl shadow-xl border p-2 w-56 text-sm">
          {cfg.whatsapp.enabled && <a href={waHref} target="_blank" rel="noopener" className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-green-50 font-bold">💬 WhatsApp Message</a>}
          {cfg.call.enabled && <a href={telHref} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 font-bold">📞 Call Store</a>}
        </div>
      )}
      <div className="flex gap-2">
        {cfg.call.enabled && <a href={telHref} aria-label="Call store" className="w-12 h-12 rounded-full bg-[#111] text-white grid place-items-center text-xl shadow-lg">📞</a>}
        {cfg.whatsapp.enabled && (
          <button onClick={() => setOpen((v) => !v)} aria-label="Chat on WhatsApp" aria-expanded={open} className="w-14 h-14 rounded-full text-white grid place-items-center text-2xl shadow-lg" style={{ background: cfg.color || "#25D366" }}>💬</button>
        )}
      </div>
    </div>
  );
}
