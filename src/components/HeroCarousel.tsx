"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HEROES } from "@/lib/catalog";

export type HeroSlideUI = { title: string; sub: string; cta?: string; href?: string; cta2?: string; href2?: string; image: string; videoUrl?: string; mediaType?: string };

function ytId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : "";
}
function vimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : "";
}

export default function HeroCarousel({ slides }: { slides?: HeroSlideUI[] }) {
  const [list, setList] = useState<HeroSlideUI[]>(slides || []);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides && slides.length) return;
    fetch("/api/site").then((r) => r.json()).then((j) => {
      if (j.heroes?.length) setList(j.heroes.map((h: any) => ({ title: h.title, sub: h.sub, cta: h.cta, href: h.href, cta2: h.cta2, href2: h.href2, image: h.image, videoUrl: h.videoUrl, mediaType: h.mediaType })));
    }).catch(() => {});
  }, [slides]);
  const data = list.length ? list : HEROES;
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % data.length), 6000);
    return () => clearInterval(t);
  }, [data.length]);
  const h = data[i % data.length] as HeroSlideUI;
  const yt = h.videoUrl && h.mediaType === "youtube" ? ytId(h.videoUrl) : "";
  const vm = h.videoUrl && h.mediaType === "vimeo" ? vimeoId(h.videoUrl) : "";
  const mp4 = h.videoUrl && (h.mediaType === "video" || h.mediaType === "url") ? h.videoUrl : "";
  return (
    <section aria-label="Featured" className="relative bg-black text-white overflow-hidden">
      {yt ? (
        <iframe src={`https://www.youtube.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0`} title={h.title} className="w-full h-[320px] sm:h-[440px] pointer-events-none" allow="autoplay; encrypted-media" />
      ) : vm ? (
        <iframe src={`https://player.vimeo.com/video/${vm}?autoplay=1&muted=1&loop=1`} title={h.title} className="w-full h-[320px] sm:h-[440px] pointer-events-none" allow="autoplay" />
      ) : mp4 ? (
        <video src={mp4} poster={h.image} autoPlay muted loop playsInline className="w-full h-[320px] sm:h-[440px] object-cover opacity-90" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={h.image} alt="" className="w-full h-[320px] sm:h-[440px] object-cover opacity-80" />
      )}
      <div className="absolute inset-0 grid place-items-center text-center px-4 pointer-events-none">
        <div className="pointer-events-auto">
          {h.sub && <p className="text-xs uppercase tracking-widest text-white/70">{h.sub}</p>}
          <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow mt-1">{h.title}</h1>
          <div className="flex gap-2 justify-center">
            {h.cta && h.href && <Link href={h.href!} className="inline-block mt-4 bg-[#D21F26] text-white font-extrabold px-8 py-3 rounded-full min-h-[44px]">{h.cta}</Link>}
            {(h as any).cta2 && (h as any).href2 && <Link href={(h as any).href2} className="inline-block mt-4 bg-white text-black font-extrabold px-8 py-3 rounded-full min-h-[44px]">{(h as any).cta2}</Link>}
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {data.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-2.5 rounded-full ${k === (i % data.length) ? "w-8 bg-[#D21F26] text-white" : "w-2.5 bg-white/60"}`} />)}
      </div>
    </section>
  );
}
