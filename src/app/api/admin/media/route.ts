import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const fd = await req.formData();
  const files = fd.getAll("files") as File[];
  if (!files.length) return NextResponse.json({ ok: false, error: "No files." }, { status: 400 });
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const saved: string[] = [];
  for (const f of files.slice(0, 10)) {
    if (f.size > 8 * 1024 * 1024) continue;
    const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    if (!["jpg", "jpeg", "png", "webp", "avif", "svg", "mp4", "webm"].includes(ext)) continue;
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buf = Buffer.from(await f.arrayBuffer());
    await fs.writeFile(path.join(dir, name), buf);
    saved.push(`/uploads/${name}`);
  }
  return NextResponse.json({ ok: true, urls: saved });
}
