import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { adminSession } from "@/lib/admin-auth";

export async function GET() {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const users = await readJSON<any[]>("users.json", []);
  const orders = await readJSON<any[]>("orders.json", []);
  const customers = users.map((u) => {
    const mine = orders.filter((o) => o.email === u.email);
    return { name: `${u.first || ""} ${u.last || ""}`.trim() || u.email, email: u.email, phone: u.mobile || mine[0]?.phone || "", orders: mine.length, spent: mine.reduce((t, o) => t + (o.total || 0), 0), last: mine[0]?.date || u.created, notes: u.notes || "" };
  });
  return NextResponse.json({ ok: true, customers });
}
export async function PATCH(req: Request) {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const { email, notes } = await req.json().catch(() => ({}));
  const users = await readJSON<any[]>("users.json", []);
  const u = users.find((x) => x.email === email);
  if (!u) return NextResponse.json({ ok: false }, { status: 404 });
  u.notes = notes;
  await writeJSON("users.json", users);
  return NextResponse.json({ ok: true });
}
