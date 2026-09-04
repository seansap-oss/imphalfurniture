import { NextResponse } from "next/server";
import { productBySlug } from "@/lib/catalog";
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") || "";
  const p = productBySlug(slug);
  return NextResponse.json({ reviews: [{ rating: p?.rating ?? 4.5, headline: "Solid and comfortable", body: "Delivery from Imphal was quick and assembly was neat.", verified: true }] });
}
export async function POST() { return NextResponse.json({ ok: true, status: "pending-moderation" }); }
