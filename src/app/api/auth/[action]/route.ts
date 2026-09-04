import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { readJSON, writeJSON } from "@/lib/db";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me-32-chars!!");

export async function POST(req: Request, { params }: { params: { action: string } }) {
  const body = await req.json().catch(() => ({}));
  const users = await readJSON<any[]>("users.json", []);
  if (params.action === "register") {
    if (!body.email || !body.password || body.password !== body.confirm) return NextResponse.json({ ok: false, error: "Check email / matching passwords." }, { status: 400 });
    if (users.find((u) => u.email === body.email)) return NextResponse.json({ ok: false, error: "Account exists — please sign in." }, { status: 400 });
    const hash = await bcrypt.hash(body.password, 10);
    users.push({ email: body.email, hash, first: body.first, last: body.last, mobile: body.mobile, created: new Date().toISOString() });
    await writeJSON("users.json", users);
    return NextResponse.json({ ok: true });
  }
  if (params.action === "login") {
    const u = users.find((x) => x.email === body.email);
    if (!u || !(await bcrypt.compare(body.password || "", u.hash))) return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    const token = await new SignJWT({ email: u.email }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(secret);
    const res = NextResponse.json({ ok: true });
    res.cookies.set("if_user", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 30 * 86400, path: "/" });
    return res;
  }
  if (params.action === "forgot") return NextResponse.json({ ok: true });
  if (params.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("if_user");
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 404 });
}
