import Link from "next/link";
import { getCMS } from "@/lib/cms";
import { INR } from "@/lib/store";

export default async function PackagesPage() {
  const cms = await getCMS().catch(() => null);
  const pkgs = (cms?.packages || []).filter((p: any) => p.status === "active");
  const wa = (cms?.contact?.whatsapp || "+91 8974499282").replace(/\D/g, "");
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Furniture Packages</h1>
      <p className="text-sm text-gray-600 mt-1">Wedding, home & room packages with delivery + assembly in Imphal. Or <Link className="underline font-bold" href="/build-package">build your custom package</Link>.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {pkgs.map((p: any) => {
          const save = p.mrp > p.price ? p.mrp - p.price : 0;
          const msg = encodeURIComponent(`Hello Planet Interio, I am interested in:\n${p.name} — ₹${p.price.toLocaleString("en-IN")}`);
          return (
            <article key={p.slug} className="bg-white rounded-2xl overflow-hidden border flex flex-col">
              <Link href={`/package/${p.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.name} loading="lazy" className="w-full aspect-[16/10] object-cover" />
              </Link>
              <div className="p-4 flex flex-col gap-1.5 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">{p.category} Package {p.status === "soldout" ? "· Sold Out" : ""}</p>
                <Link href={`/package/${p.slug}`} className="font-extrabold text-lg">{p.name}</Link>
                <p><strong className="text-xl">{INR(p.price)}</strong> {save > 0 && <><s className="text-gray-400 text-sm">{INR(p.mrp)}</s> <span className="text-green-700 text-sm font-bold">Save {INR(save)}</span></>}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{p.desc}</p>
                <p className="text-xs text-gray-500">{p.included?.length || 0} items included · {(p.features || []).slice(0, 3).join(" · ")}</p>
                <div className="flex gap-2 mt-2">
                  <Link href={`/package/${p.slug}`} className="flex-1 text-center bg-[#D21F26] text-white font-bold rounded-full py-2.5">View Package</Link>
                  <a href={`https://wa.me/${wa}?text=${msg}`} target="_blank" rel="noopener" className="border rounded-full px-4 py-2 grid place-items-center" aria-label="WhatsApp enquiry">💬</a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {pkgs.length === 0 && <div className="bg-white border rounded-2xl p-10 text-center mt-4"><p className="font-extrabold">No packages right now — check back soon.</p></div>}
    </div>
  );
}
