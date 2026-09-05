import Link from "next/link";
import { getCMS, mergedProducts } from "@/lib/cms";
import { INR } from "@/lib/store";
import PackageBuy from "./buy";

export default async function PackagePage({ params }: { params: { slug: string } }) {
  const cms = await getCMS().catch(() => null);
  const pkg = (cms?.packages || []).find((p: any) => p.slug === params.slug);
  if (!pkg) return <div className="max-w-3xl mx-auto p-8"><h1 className="text-2xl font-extrabold">Package not found</h1><Link className="underline" href="/packages">All packages</Link></div>;
  const wa = (cms?.contact?.whatsapp || "+91 8974499282").replace(/\D/g, "");
  const products = await mergedProducts().catch(() => []);
  const pmap = new Map(products.map((p) => [p.slug, p]));
  const save = pkg.mrp > pkg.price ? pkg.mrp - pkg.price : 0;
  const msg = encodeURIComponent(`Hello Planet Interio, I am interested in:\n${pkg.name} — ₹${pkg.price.toLocaleString("en-IN")}\nhttps://imphalfurniture.vercel.app/package/${pkg.slug}`);
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
      <nav className="text-xs text-gray-500" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/packages">Packages</Link> / {pkg.name}</nav>
      <div className="grid md:grid-cols-2 gap-6 mt-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pkg.cover} alt={pkg.name} className="w-full aspect-[4/3] object-cover rounded-2xl border" />
          {(pkg.gallery || []).length > 0 && <div className="flex gap-2 mt-2 overflow-x-auto">{pkg.gallery.map((g: string, k: number) => <img key={k} src={g} alt="" loading="lazy" className="w-24 h-20 object-cover rounded-xl border" />)}</div>}
          {pkg.video && <video src={pkg.video} controls className="w-full rounded-2xl mt-2" />}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">{pkg.category} Package</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{pkg.name}</h1>
          <p className="text-2xl mt-3"><strong>{INR(pkg.price)}</strong> {save > 0 && <><s className="text-gray-400 text-base">{INR(pkg.mrp)}</s> <span className="text-green-700 text-sm font-bold">Save {INR(save)}</span></>}</p>
          <p className="text-sm text-gray-600 mt-2">{pkg.desc}</p>
          <div className="flex flex-wrap gap-2 mt-3">{(pkg.features || []).map((f: string) => <span key={f} className="bg-green-50 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full">✓ {f}</span>)}</div>
          <PackageBuy pkg={{ slug: pkg.slug, name: pkg.name, price: pkg.price, cover: pkg.cover }} disabled={pkg.status === "soldout" || pkg.status === "coming"} status={pkg.status} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Link href={`/build-package?pkg=${pkg.slug}`} className="border text-center font-bold rounded-full py-3">Request Quote</Link>
            <a href={`https://wa.me/${wa}?text=${msg}`} target="_blank" rel="noopener" className="bg-[#25D366] text-white text-center font-bold rounded-full py-3">💬 WhatsApp Us</a>
          </div>
        </div>
      </div>
      <section className="mt-8" aria-label="What's included">
        <h2 className="text-xl font-extrabold mb-3">What&apos;s Included ({pkg.included?.length || 0})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(pkg.included || []).map((it: any, k: number) => {
            const prod = it.productSlug ? pmap.get(it.productSlug) : null;
            return (
              <div key={k} className="bg-white border rounded-2xl p-3 flex gap-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image || prod?.images?.[0] || pkg.cover} alt="" loading="lazy" className="w-20 h-16 object-cover rounded-xl" />
                <div><p className="font-bold">{it.qty} × {it.title}</p>{it.note && <p className="text-gray-500 text-xs">{it.note}</p>}{prod && <Link href={`/product/${prod.slug}`} className="underline text-xs">View product</Link>}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
