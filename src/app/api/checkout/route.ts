import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { deliveryFee } from "@/lib/store";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b.lines?.length) return NextResponse.json({ ok: false, error: "Cart is empty." }, { status: 400 });
  if (!b.name || !b.phone || !b.pin) return NextResponse.json({ ok: false, error: "Name, phone and PIN are required." }, { status: 400 });
  const sub = b.lines.reduce((s: number, l: any) => s + l.price * l.qty, 0);
  const off = Math.max(0, Math.min(Number(b.discount || 0), sub));
  const fee = b.mode === "pickup" ? 0 : deliveryFee(b.pin, sub - off);
  const orders = await readJSON<any[]>("orders.json", []);
  const id = `IF-${Date.now().toString().slice(-8)}`;
  const order = { id, date: new Date().toISOString(), status: "Pending", pay: b.pay, mode: b.mode, name: b.name, phone: b.phone, email: b.email, pin: b.pin, city: b.city, items: b.lines, subtotal: sub, discount: off, coupon: b.coupon || "", delivery: fee, total: sub - off + fee, notes: "", history: [{ s: "Pending", t: new Date().toISOString() }] };
  orders.unshift(order);
  await writeJSON("orders.json", orders);
  const res = NextResponse.json({ ok: true, order: id });
  res.cookies.set("if_last_order", id, { maxAge: 86400 * 30, path: "/" });
  return res;
}
export async function GET() {
  const orders = await readJSON<any[]>("orders.json", []);
  return NextResponse.json({ ok: true, note: "guest-safe demo feed" });
}
