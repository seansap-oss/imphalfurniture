import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { readJSON, writeJSON } from "@/lib/db";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me-32-chars!!");
async function audit(action: string, resource: string) {
  const log = await readJSON<any[]>("audit.json", []);
  log.unshift({ t: new Date().toISOString(), action, resource });
  await writeJSON("audit.json", log.slice(0, 500));
}
export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const adminEmail = process.env.ADMIN_EMAIL || "admin@imphalfurniture.com";
  const adminPass = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const admins = await readJSON<any[]>("admins.json", []);
  const found = admins.find((a) => a.email === email);
  let ok = false;
  if (found) ok = await bcrypt.compare(password || "", found.hash);
  else if (email === adminEmail) {
    ok = password === adminPass;
    if (ok) { admins.push({ email, hash: await bcrypt.hash(password, 10), role: "SUPER_ADMIN" }); await writeJSON("admins.json", admins); }
  }
  if (!ok) return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
  const token = await new SignJWT({ email, role: "SUPER_ADMIN" }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("12h").sign(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("if_admin", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 12 * 3600, path: "/" });
  await audit("Admin login", email);
  return res;
}
export async function GET() {
  const c = cookies().get("if_admin")?.value;
  if (!c) return NextResponse.json({ ok: false });
  try { await jwtVerify(c, secret); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ ok: false }); }
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("if_admin");
  return res;
}
