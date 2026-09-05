import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { adminSession } from "@/lib/admin-auth";

export async function GET() {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const orders = await readJSON<any[]>("orders.json", []);
  return NextResponse.json({ ok: true, orders });
}
export async function PATCH(req: Request) {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const { id, status, notes } = await req.json().catch(() => ({}));
  const orders = await readJSON<any[]>("orders.json", []);
  const o = orders.find((x) => x.id === id);
  if (!o) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  if (status) { o.status = status; o.history = [...(o.history || []), { s: status, t: new Date().toISOString(), by: s.email }]; }
  if (notes !== undefined) o.notes = notes;
  await writeJSON("orders.json", orders);
  const log = await readJSON<any[]>("audit.json", []);
  log.unshift({ t: new Date().toISOString(), action: `Order ${id} → ${status || "note"}`, resource: s.email });
  await writeJSON("audit.json", log.slice(0, 500));
  return NextResponse.json({ ok: true, order: o });
}
