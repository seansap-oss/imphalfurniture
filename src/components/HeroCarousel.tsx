"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HEROES } from "@/lib/catalog";

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HEROES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const h = HEROES[i];
  return (
    <section aria-label="Featured" className="relative bg-black text-white overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={h.image} alt="" className="w-full h-[320px] sm:h-[440px] object-cover opacity-80" />
      <div className="absolute inset-0 grid place-items-center text-center px-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow">{h.title}</h1>
          <p className="mt-2 text-white/90">{h.sub}</p>
          <Link href={h.href} className="inline-block mt-4 bg-[#FFD400] text-black font-extrabold px-8 py-3 rounded-full min-h-[44px]">{h.cta}</Link>
        </div>
      </div>
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {HEROES.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-2.5 rounded-full ${k === i ? "w-8 bg-[#FFD400]" : "w-2.5 bg-white/60"}`} />)}
      </div>
    </section>
  );
}
