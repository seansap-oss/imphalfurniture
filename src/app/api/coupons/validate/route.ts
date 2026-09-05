import { NextResponse } from "next/server";
import { getCMS } from "@/lib/cms";

// Public coupon validation for checkout promo codes.
export async function POST(req: Request) {
  const { code, subtotal } = await req.json().catch(() => ({}));
  const cms = await getCMS();
  const c = cms.coupons.find((x) => x.code.toLowerCase() === String(code || "").toLowerCase());
  if (!c || !c.active) return NextResponse.json({ ok: false, error: "Invalid coupon." }, { status: 400 });
  const now = new Date();
  if (c.start && new Date(c.start) > now) return NextResponse.json({ ok: false, error: "Not started yet." }, { status: 400 });
  if (c.end && new Date(c.end) < now) return NextResponse.json({ ok: false, error: "Expired." }, { status: 400 });
  if ((c.limit || 0) > 0 && (c.used || 0) >= (c.limit || 0)) return NextResponse.json({ ok: false, error: "Usage limit reached." }, { status: 400 });
  if ((c.minOrder || 0) > (subtotal || 0)) return NextResponse.json({ ok: false, error: `Needs minimum ₹${c.minOrder}.` }, { status: 400 });
  let off = c.kind === "percent" ? Math.round((subtotal * c.amount) / 100) : c.amount;
  if (c.maxOff) off = Math.min(off, c.maxOff);
  return NextResponse.json({ ok: true, code: c.code, off });
}
