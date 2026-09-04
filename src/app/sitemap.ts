import { PRODUCTS, CATEGORIES } from "@/lib/catalog";
export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://imphalfurniture.vercel.app";
  return [
    { url: `${base}/`, lastModified: new Date() },
    ...CATEGORIES.map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: new Date() })),
    ...PRODUCTS.slice(0, 100).map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: new Date() }))
  ];
}
