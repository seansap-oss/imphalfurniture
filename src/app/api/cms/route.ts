import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCMS, patchCMS, newId, slugify, type CMS } from "@/lib/cms";
import { syncStatus } from "@/lib/cms-store";
import { adminSession } from "@/lib/admin-auth";

const REVALIDATE: Record<string, string[]> = {
  settings: ["/"], contact: ["/"], social: ["/"], announcement: ["/"], navigation: ["/"],
  header: ["/"], heroes: ["/"], sections: ["/"], footer: ["/"], floating: ["/"],
  appearance: ["/"], seo: ["/"], categories: ["/"], brands: ["/"], products: ["/"],
  packages: ["/"], pages: ["/"], posts: ["/"], coupons: ["/checkout"], delivery: ["/checkout"], payments: ["/checkout"]
};
async function touch(collections: string[]) {
  const paths = new Set<string>();
  for (const c of collections) (REVALIDATE[c] || ["/"]).forEach((p) => paths.add(p));
  paths.forEach((p) => { try { revalidatePath(p, "page"); } catch {} });
  try { revalidatePath("/", "layout"); } catch {}
}

// Item collections support add/update/delete/duplicate
const ITEM_COLS = ["heroes", "sections", "packages", "pages", "posts", "coupons", "customCats", "customBrands", "customProducts", "collections", "delivery"];

export async function GET(req: Request) {
  const u = new URL(req.url);
  const collection = u.searchParams.get("collection");
  const pub = u.searchParams.get("public");
  const cms = await getCMS();
  if (collection) {
    // public-safe collections readable without login
    if (pub && ["settings", "contact", "social", "announcement", "navigation", "header", "heroes", "sections", "footer", "floating", "appearance", "seo", "delivery", "payments"].includes(collection)) {
      return NextResponse.json({ ok: true, data: (cms as any)[collection] });
    }
    const s = await adminSession();
    if (!s) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ ok: true, data: (cms as any)[collection] });
  }
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, data: cms, sync: syncStatus() });
}

export async function PUT(req: Request) {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { collection, data, id } = body;
  if (!collection) return NextResponse.json({ ok: false, error: "Missing collection" }, { status: 400 });
  if (ITEM_COLS.includes(collection)) {
    // replace single item by id
    await patchCMS(s.email, `Updated ${collection}`, (c) => {
      const arr = (c as any)[collection] as any[];
      const i = arr.findIndex((x) => x.id === id || x.slug === id);
      if (i >= 0) arr[i] = { ...arr[i], ...data, updated: new Date().toISOString() };
    }, String(id));
  } else if (collection === "productOverride") {
    await patchCMS(s.email, "Updated product", (c) => { c.productOverrides[body.slug] = { ...(c.productOverrides[body.slug] || {}), ...data }; }, body.slug);
  } else {
    const cms = await getCMS();
    const prev = JSON.parse(JSON.stringify((cms as any)[collection] ?? null));
    await patchCMS(s.email, `Updated ${collection}`, (c) => { (c as any)[collection] = data; }, collection, { prev, collection });
  }
  await touch([collection]);
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { collection, item } = body;
  if (!collection || !item) return NextResponse.json({ ok: false, error: "Missing data" }, { status: 400 });
  const cms = await getCMS();
  let created: any = null;
  await patchCMS(s.email, `Created ${collection}`, (c) => {
    if (collection === "customProducts") {
      const slug = item.slug || slugify(item.name) + "-custom";
      created = { id: 9000 + c.customProducts.length, reviews: 0, rating: 4.5, badges: [], onSale: false, stock: 0, images: [], colours: [], tags: [], ...item, slug, updated: new Date().toISOString() };
      c.customProducts.unshift(created);
    } else if (collection === "packages") {
      created = { id: newId("pkg"), slug: item.slug || slugify(item.name), gallery: [], included: [], features: [], status: "draft", ...item, updated: new Date().toISOString() };
      (c.packages as any[]).unshift(created);
    } else if (collection === "enquiries") {
      created = { id: newId("enq"), date: new Date().toISOString(), status: "new", ...item };
      c.enquiries.unshift(created);
    } else if (ITEM_COLS.includes(collection)) {
      created = { id: newId(collection.slice(0, 3)), sort: ((c as any)[collection]?.length || 0), ...item };
      if ((collection === "pages" || collection === "posts") && !created.slug) created.slug = slugify(created.title || "untitled");
      (c as any)[collection].unshift(created);
    }
  }, (item as any).name || (item as any).title || (item as any).code || collection);
  void cms;
  await touch([collection]);
  return NextResponse.json({ ok: true, item: created });
}

export async function DELETE(req: Request) {
  const s = await adminSession();
  if (!s) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const u = new URL(req.url);
  const collection = u.searchParams.get("collection") || "";
  const id = u.searchParams.get("id") || "";
  await patchCMS(s.email, `Deleted ${collection}`, (c) => {
    if (collection === "productOverride") { delete c.productOverrides[id]; return; }
    if (collection === "customProducts") { c.customProducts = c.customProducts.filter((p) => p.slug !== id && String(p.id) !== id); return; }
    const arr = (c as unknown as Record<string, any[]>)[collection];
    if (Array.isArray(arr)) (c as any)[collection] = arr.filter((x) => x.id !== id && x.slug !== id);
  }, id);
  await touch([collection]);
  return NextResponse.json({ ok: true });
}
