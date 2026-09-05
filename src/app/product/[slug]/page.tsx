import { productBySlug, PRODUCTS } from "@/lib/catalog";
import { mergedProducts } from "@/lib/cms";
import { getCMS } from "@/lib/cms";
import { INR, stockFor } from "@/lib/store";
import PDPClient from "./pdp-client";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const all = await mergedProducts().catch(() => PRODUCTS);
  const p = all.find((x) => x.slug === params.slug) || productBySlug(params.slug);
  return { title: p ? `${p.name} — ${INR(p.price)}` : "Product" };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const all = await mergedProducts().catch(() => PRODUCTS);
  const p = all.find((x) => x.slug === params.slug) || productBySlug(params.slug);
  if (!p) return <div className="max-w-7xl mx-auto p-8"><h1 className="text-2xl font-extrabold">Product not found</h1><a className="underline" href="/">Back home</a></div>;
  const cms = await getCMS().catch(() => null);
  const waNum = ((cms as any)?.floating?.whatsapp?.number || (cms as any)?.contact?.whatsapp || "+91 8974499282").replace(/\D/g, "");
  const waMsg = encodeURIComponent(`Hello Planet Interio, I am interested in:\n${p.name}\nSKU: ${p.sku}\nPrice: ₹${p.price.toLocaleString("en-IN")}\nhttps://imphalfurniture.vercel.app/product/${p.slug}`);
  const waHref = `https://wa.me/${waNum}?text=${waMsg}`;
  const related = all.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 5);
  const avail = stockFor("795001", p.stock);
  const jsonld = { "@context": "https://schema.org", "@type": "Product", name: p.name, brand: p.brand, sku: p.sku, offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/BackOrder" } };
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <nav className="text-xs text-gray-500" aria-label="Breadcrumb"><a href="/">Home</a> / <a href={`/category/${p.category}`}>{p.category}</a> / {p.name}</nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <PDPClient slug={p.slug} name={p.name} brand={p.brand} sku={p.sku} price={p.price} mrp={p.mrp} rating={p.rating} reviews={p.reviews} colours={p.colours} images={p.images} stock={p.stock} avail={avail.available} eta={avail.eta} material={p.material} desc={p.desc} dims={p.dims} related={related.map((r) => ({ slug: r.slug, name: r.name, price: r.price, image: r.images[0] }))} waHref={waHref} />
    </div>
  );
}
