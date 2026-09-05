import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { adminSession } from "@/lib/admin-auth";
import { readJSON, writeJSON } from "@/lib/db";

const UP = path.join(process.cwd(), "public", "uploads");

export async function GET(req: Request) {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const u = new URL(req.url);
  const q = (u.searchParams.get("q") || "").toLowerCase();
  const kind = u.searchParams.get("kind") || "all";
  let files: { url: string; name: string; size: number; mtime: string; kind: string; folder: string }[] = [];
  try {
    const names = await fs.readdir(UP);
    for (const n of names) {
      if (n === ".gitkeep") continue;
      const st = await fs.stat(path.join(UP, n));
      if (!st.isFile()) continue;
      const ext = n.split(".").pop()!.toLowerCase();
      const k = ["mp4", "webm"].includes(ext) ? "video" : "image";
      files.push({ url: `/uploads/${n}`, name: n, size: st.size, mtime: st.mtime.toISOString(), kind: k, folder: "Uploads" });
    }
  } catch {}
  // brand assets always available
  try {
    const brand = await fs.readdir(path.join(process.cwd(), "public", "brand"));
    for (const n of brand) files.push({ url: `/brand/${n}`, name: n, size: 0, mtime: "", kind: "image", folder: "Website" });
  } catch {}
  const meta = await readJSON<Record<string, { folder?: string; alt?: string; caption?: string }>>("media-meta.json", {});
  files = files.map((f) => ({ ...f, folder: meta[f.url]?.folder || f.folder }));
  if (q) files = files.filter((f) => f.name.toLowerCase().includes(q));
  if (kind !== "all") files = files.filter((f) => f.kind === kind);
  return NextResponse.json({ ok: true, files: files.reverse() });
}

export async function DELETE(req: Request) {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const url = new URL(req.url).searchParams.get("url") || "";
  if (!url.startsWith("/uploads/")) return NextResponse.json({ ok: false, error: "Only uploads can be deleted" }, { status: 400 });
  try { await fs.unlink(path.join(process.cwd(), "public", url)); } catch {}
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const { url, folder } = await req.json().catch(() => ({}));
  const meta = await readJSON<Record<string, any>>("media-meta.json", {});
  meta[url] = { ...(meta[url] || {}), folder };
  await writeJSON("media-meta.json", meta);
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const folder = String(fd.get("folder") || "Uploads");
  const files = fd.getAll("files") as File[];
  if (!files.length) return NextResponse.json({ ok: false, error: "No files." }, { status: 400 });
  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Upload storage not configured on this host (needs object storage)." }, { status: 500 });
  }
  const saved: string[] = [];
  for (const f of files.slice(0, 10)) {
    if (f.size > 8 * 1024 * 1024) continue;
    const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    if (!["jpg", "jpeg", "png", "webp", "avif", "svg", "mp4", "webm"].includes(ext)) continue;
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buf = Buffer.from(await f.arrayBuffer());
    await fs.writeFile(path.join(dir, name), buf);
    saved.push(`/uploads/${name}`);
    const meta = await readJSON<Record<string, any>>("media-meta.json", {});
    meta[`/uploads/${name}`] = { folder };
    await writeJSON("media-meta.json", meta);
  }
  return NextResponse.json({ ok: true, urls: saved });
}
