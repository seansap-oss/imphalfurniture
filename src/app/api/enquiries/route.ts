import { NextResponse } from "next/server";
import { patchCMS } from "@/lib/cms";

// Public endpoint: package / custom-package enquiries.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b.name || !b.phone) return NextResponse.json({ ok: false, error: "Name and phone are required." }, { status: 400 });
  await patchCMS("website", "New package enquiry", (c) => {
    c.enquiries.unshift({ id: `enq-${Date.now().toString(36)}`, date: new Date().toISOString(), status: "new", type: String(b.type || "package"), name: String(b.name).slice(0, 80), phone: String(b.phone).slice(0, 20), email: String(b.email || "").slice(0, 80), budget: String(b.budget || ""), notes: String(b.notes || b.message || "").slice(0, 1000), items: Array.isArray(b.items) ? b.items : [] });
  }, String(b.name));
  return NextResponse.json({ ok: true });
}
