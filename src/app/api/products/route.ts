import { NextResponse } from "next/server";
import { PRODUCTS, searchProducts, CATEGORIES, BRANDS } from "@/lib/catalog";
import { mergedProducts } from "@/lib/cms";
import { adminSession } from "@/lib/admin-auth";
export async function GET(req: Request) {
  const u = new URL(req.url);
  const q = u.searchParams.get("q") ?? "";
  const cat = u.searchParams.get("category");
  const adminView = u.searchParams.get("admin") === "1" && (await adminSession());
  const base = adminView ? await mergedProducts() : PRODUCTS;
  let list = q ? (adminView ? base.filter((p) => [p.name, p.sku, p.brand, p.category].join(" ").toLowerCase().includes(q.toLowerCase())) : searchProducts(q)) : base;
  if (cat) list = list.filter((p) => p.category === cat);
  if (!adminView) return NextResponse.json({ products: list.slice(0, 60), total: list.length, categories: CATEGORIES, brands: BRANDS });
  const { getCMS } = await import("@/lib/cms");
  const cms = await getCMS();
  const hidden = new Set([...Object.keys(cms.productOverrides).filter((k) => (cms.productOverrides as any)[k]?.hidden), ...cms.customProducts.filter((p: any) => p.hidden).map((p: any) => p.slug)]);
  return NextResponse.json({ products: list, total: list.length, hidden: [...hidden], customs: cms.customProducts.map((p: any) => p.slug) });
}
