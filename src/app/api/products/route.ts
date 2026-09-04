import { NextResponse } from "next/server";
import { PRODUCTS, searchProducts, CATEGORIES, BRANDS } from "@/lib/catalog";
export async function GET(req: Request) {
  const u = new URL(req.url);
  const q = u.searchParams.get("q") ?? "";
  const cat = u.searchParams.get("category");
  let list = q ? searchProducts(q) : PRODUCTS;
  if (cat) list = list.filter((p) => p.category === cat);
  return NextResponse.json({ products: list.slice(0, 60), total: list.length, categories: CATEGORIES, brands: BRANDS });
}
