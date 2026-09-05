import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readJSON, writeJSON } from "@/lib/db";
import { adminSession, ROLES, type Role } from "@/lib/admin-auth";

export async function GET() {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const admins = await readJSON<any[]>("admins.json", []);
  return NextResponse.json({ ok: true, users: admins.map((a) => ({ email: a.email, role: a.role || "SUPER_ADMIN", created: a.created })), roles: ROLES, me: s.email });
}
export async function POST(req: Request) {
  const s = await adminSession();
  if (!s || s.role !== "SUPER_ADMIN") return NextResponse.json({ ok: false, error: "Super Admin only" }, { status: 403 });
  const { email, password, role } = await req.json().catch(() => ({}));
  if (!email || !password) return NextResponse.json({ ok: false, error: "Email + password required" }, { status: 400 });
  const admins = await readJSON<any[]>("admins.json", []);
  if (admins.find((a) => a.email === email)) return NextResponse.json({ ok: false, error: "User exists" }, { status: 400 });
  admins.push({ email, hash: await bcrypt.hash(password, 10), role: (role as Role) || "READ_ONLY", created: new Date().toISOString() });
  await writeJSON("admins.json", admins);
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  const s = await adminSession();
  if (!s || s.role !== "SUPER_ADMIN") return NextResponse.json({ ok: false, error: "Super Admin only" }, { status: 403 });
  const email = new URL(req.url).searchParams.get("email");
  const admins = await readJSON<any[]>("admins.json", []);
  await writeJSON("admins.json", admins.filter((a) => a.email !== email));
  return NextResponse.json({ ok: true });
}
