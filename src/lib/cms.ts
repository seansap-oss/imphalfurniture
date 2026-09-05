import { PRODUCTS, CATEGORIES, BRANDS, HEROES, type Product } from "./catalog";
import { storeLoad, storeSave } from "./cms-store";

// Single-file CMS store. Local dev persists to data/cms.json.

export type HeroSlide = {
  id: string; title: string; sub: string; desc?: string;
  cta?: string; href?: string; cta2?: string; href2?: string;
  mediaType: "image" | "video" | "youtube" | "vimeo" | "url";
  image: string; tabletImage?: string; mobileImage?: string; videoUrl?: string;
  overlay?: number; align?: string; textColor?: string; bg?: string;
  enabled: boolean; sort: number; start?: string; end?: string; anim?: string;
};
export type HomeSection = {
  id: string; type: string; title: string; subtitle?: string;
  visible: boolean; sort: number; background?: string;
  config: { source?: "auto" | "manual"; category?: string; slugs?: string[]; link?: string; limit?: number };
};
export type Pkg = {
  id: string; slug: string; name: string; category: string;
  cover: string; gallery: string[]; video?: string;
  mrp: number; price: number; desc: string; included: { title: string; qty: number; productSlug?: string; image?: string; note?: string }[];
  features: string[]; status: "active" | "inactive" | "draft" | "soldout" | "coming"; featured?: boolean; updated?: string;
};
export type CMSPage = { id: string; slug: string; title: string; body: string; image?: string; seoTitle?: string; seoDesc?: string; status: "published" | "draft"; updated?: string };
export type Post = { id: string; slug: string; title: string; body: string; image?: string; status: "published" | "draft"; date?: string };
export type Coupon = { id: string; code: string; desc?: string; kind: "percent" | "fixed"; amount: number; minOrder?: number; maxOff?: number; start?: string; end?: string; limit?: number; used?: number; active: boolean };

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function defaultCMS() {
  const heroes: HeroSlide[] = HEROES.map((h, i) => ({
    id: `hero-${i + 1}`, title: h.title, sub: h.sub, cta: h.cta, href: h.href,
    mediaType: "image" as const, image: h.image, overlay: 20, align: "center",
    textColor: "#ffffff", enabled: true, sort: i, anim: "fade"
  }));
  const S = (id: string, type: string, title: string, sort: number, config: HomeSection["config"] = {}, extra: Partial<HomeSection> = {}): HomeSection =>
    ({ id, type, title, subtitle: "", visible: true, sort, config, ...extra });
  return {
    v: 1,
    settings: { siteName: "Planet Interio", tagline: "Furniture for good living", logo: "/brand/pi-mark.svg", mobileLogo: "/brand/pi-mark.svg", favicon: "/icons/icon-192.png", currency: "INR ₹" },
    contact: { call: "+91 9429691445", whatsapp: "+91 8974499282", email: "care@planetinterio.in", secondaryPhone: "", address: "Planet Interio, Canchipur, Near Iland Nissan, Imphal, India 795003", workshop: "Langthabal Kunja, near Standard Robarth Higher Secondary School, Canchipur, Manipur, India", hours: "Mon–Sat 10am–8pm · Sun 11am–6pm", mapsUrl: "" },
    social: {
      facebook: { url: "", enabled: false, newTab: true }, instagram: { url: "", enabled: false, newTab: true },
      youtube: { url: "", enabled: false, newTab: true }, pinterest: { url: "", enabled: false, newTab: true },
      twitter: { url: "", enabled: false, newTab: true }, linkedin: { url: "", enabled: false, newTab: true }, tiktok: { url: "", enabled: false, newTab: true }
    },
    announcement: { enabled: true, mode: "static", messages: [{ text: "Free local delivery on selected Imphal orders", url: "" }, { text: "Furniture for every room", url: "" }, { text: "Special weekend savings", url: "/sale" }] },
    navigation: { items: [] as { label: string; href: string }[] },
    header: { showSearch: true, showAccount: true, showWishlist: true, showCart: true },
    heroes,
    sections: [
      S("hero", "hero", "Hero", 0), S("rooms", "rooms", "Shop by Room", 1),
      S("deals", "products", "Deals of the Week", 2, { source: "auto", category: "__sale", link: "/sale" }),
      S("new", "products", "New Arrivals", 3, { source: "auto", category: "__new", link: "/new" }),
      S("sofas", "products", "Shop Sofas", 4, { source: "auto", category: "sofas", link: "/category/sofas" }),
      S("bedroom", "products", "Shop Bedroom", 5, { source: "auto", category: "bedroom", link: "/category/bedroom" }),
      S("dining", "products", "Shop Dining", 6, { source: "auto", category: "dining", link: "/category/dining" }),
      S("storage", "products", "Shop Storage", 7, { source: "auto", category: "storage", link: "/category/storage" }),
      S("packages", "packages", "Furniture Packages", 8, { source: "auto" }),
      S("inspo", "inspiration", "Room Inspiration", 9), S("brands", "brands", "Our Brands", 10),
      S("why", "why", "Why shop Planet Interio", 11), S("news", "newsletter", "Newsletter", 12),
    ],
    catOverrides: {} as Record<string, { name?: string; visible?: boolean; sort?: number }>,
    customCats: [] as { slug: string; name: string; blurb?: string; room?: string; visible?: boolean; sort?: number }[],
    brandOverrides: {} as Record<string, { name?: string; visible?: boolean; sort?: number }>,
    customBrands: [] as { slug: string; name: string; desc?: string; logo?: string; url?: string; visible?: boolean }[],
    productOverrides: {} as Record<string, Partial<Product> & { hidden?: boolean }>,
    customProducts: [] as Product[],
    collections: [{ id: "col-wedding", name: "Wedding Collection", slug: "wedding", desc: "Complete wedding furniture sets", image: "", productSlugs: [] as string[] }],
    packages: [
      { id: "pkg-silver", slug: "silver-wedding-package", name: "Silver Wedding Package", category: "Wedding", cover: HEROES[1].image, gallery: [] as string[], mrp: 149999, price: 119999, desc: "Essential wedding furniture set with bed, wardrobe and dining.", included: [{ title: "Queen Bed with Storage", qty: 1 }, { title: "3-Door Wardrobe", qty: 1 }, { title: "4-Seater Dining Table", qty: 1 }, { title: "Queen Mattress", qty: 1 }], features: ["Delivery Included", "Assembly Included", "12-Month Warranty"], status: "active" as const, featured: true },
      { id: "pkg-home", slug: "complete-home-package", name: "Complete Home Package", category: "Home", cover: HEROES[0].image, gallery: [] as string[], mrp: 299999, price: 249999, desc: "Furnish the full home — living, bedroom and dining in one package.", included: [{ title: "3-Seater Sofa", qty: 1 }, { title: "King Bed", qty: 1 }, { title: "6-Seater Dining Set", qty: 1 }, { title: "TV Unit", qty: 1 }], features: ["Delivery Included", "Assembly Included", "Customisation Available"], status: "active" as const, featured: true }
    ] as Pkg[],
    enquiries: [] as { id: string; date: string; type: string; name: string; phone: string; email?: string; budget?: string; notes?: string; items?: string[]; status?: string }[],
    pages: [{ id: "page-about", slug: "about-us", title: "About Us – Planet Interio", body: "Manufacturer and importer of affordable modern quality Home & Office Furniture. Your Style, Our Design.", status: "published" as const }] as CMSPage[],
    posts: [] as Post[],
    coupons: [{ id: "cpn1", code: "WELCOME500", desc: "₹500 off first order above ₹9,999", kind: "fixed" as const, amount: 500, minOrder: 9999, active: true }] as Coupon[],
    delivery: [
      { id: "imphal-core", label: "Imphal Core", pins: "795001,795002,795003,795004", charge: 0, freeAbove: 0, days: "Same-day / Next-day" },
      { id: "imphal-ext", label: "Greater Imphal", pins: "795005,795006,795008,795010,795011", charge: 499, freeAbove: 19999, days: "1–2 days" },
      { id: "manipur", label: "Manipur State", pins: "795101–795150", charge: 999, freeAbove: 49999, days: "2–5 days" }
    ],
    payments: { upi: { enabled: true, label: "UPI (GPay / PhonePe / Paytm)" }, card: { enabled: true, label: "Credit / Debit Card" }, cod: { enabled: true, label: "Cash on Delivery (Imphal & Manipur)" }, emi: { enabled: false, label: "EMI (cards)" }, bank: { enabled: false, label: "Bank Transfer", details: "" } },
    floating: { whatsapp: { enabled: true, number: "+91 8974499282", message: "Hello Planet Interio, I would like more information about your furniture." }, call: { enabled: true, number: "+91 9429691445" }, position: "bottom-right", color: "#25D366" },
    footer: { tagline: "Furniture for good living", about: "Manufacturer and importer of affordable modern home & office furniture in Imphal.", copyright: "© 2026 Planet Interio", credit: { enabled: true, name: "AviT Solutions", phone: "9856575064", url: "https://www.avitsolutions.tech" }, columns: [] as { title: string; links: { label: string; href: string }[] }[] },
    appearance: { primary: "#D21F26", secondary: "#171717", accent: "#FF6B6B", text: "#171717", header: "#FFFFFF", footer: "#111111", radius: "16" },
    seo: { title: "Planet Interio | Furniture for good living in Imphal", description: "Planet Interio, Canchipur Imphal — affordable modern home & office furniture.", keywords: "furniture imphal, sofa, bed, dining, wardrobe, planet interio", ogImage: "/brand/planet-interior-wordmark.svg" },
    history: [] as { t: string; by: string; action: string; detail?: string; prev?: any; collection?: string }[]
  };
}
export type CMS = ReturnType<typeof defaultCMS>;

let cache: CMS | null = null;
export async function getCMS(): Promise<CMS> {
  // No stale in-memory cache: always read the shared store so admin edits
  // are immediately visible to the storefront on every instance.
  cache = await storeLoad(defaultCMS);
  return cache!;
}
export async function saveCMS(cms: CMS) {
  cache = cms;
  await storeSave(cms);
}
export async function patchCMS(by: string, action: string, fn: (c: CMS) => void, detail?: string, snap?: { prev?: any; collection?: string }) {
  const c = await getCMS();
  fn(c);
  c.history.unshift({ t: new Date().toISOString(), by, action, detail, prev: snap?.prev, collection: snap?.collection });
  c.history = c.history.slice(0, 300);
  await saveCMS(c);
  return c;
}

// ---- merged reads (seed + CMS overrides) ----
export async function mergedCategories() {
  const c = await getCMS();
  const base = CATEGORIES.map((x, i) => ({ ...x, ...(c.catOverrides[x.slug] || {}), sort: c.catOverrides[x.slug]?.sort ?? i }));
  const custom = c.customCats.map((x, i) => ({ slug: x.slug, name: x.name, blurb: x.blurb || "", room: x.room || "Living", sort: 100 + i, visible: x.visible !== false }));
  return [...base, ...custom].filter((x: any) => x.visible !== false).sort((a: any, b: any) => a.sort - b.sort);
}
export async function mergedBrands() {
  const c = await getCMS();
  const base = BRANDS.map((b) => ({ ...b, ...(c.brandOverrides[b.slug] || {}) }));
  const custom = c.customBrands.filter((b) => b.visible !== false);
  return [...base, ...custom].filter((b: any) => b.visible !== false);
}
export async function mergedProducts(): Promise<Product[]> {
  const c = await getCMS();
  const list = PRODUCTS.map((p) => {
    const o = c.productOverrides[p.slug];
    if (!o) return p;
    if (o.hidden) return null;
    return { ...p, ...o } as Product;
  }).filter(Boolean) as Product[];
  const customs = c.customProducts.filter((p) => !(p as any).hidden);
  return [...customs, ...list];
}
export async function activeHeroes(now = new Date()): Promise<HeroSlide[]> {
  const c = await getCMS();
  return c.heroes.filter((h) => h.enabled && (!h.start || new Date(h.start) <= now) && (!h.end || new Date(h.end) >= now)).sort((a, b) => a.sort - b.sort);
}
export async function visibleSections(): Promise<HomeSection[]> {
  const c = await getCMS();
  return c.sections.filter((s) => s.visible).sort((a, b) => a.sort - b.sort);
}
export function newId(prefix: string) { return `${prefix}-${uid()}`; }
export function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || uid(); }
