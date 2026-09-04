// Deterministic catalogue generator: 300 realistic products, 14 brands,
// full category taxonomy, room groupings, Unsplash imagery.
export type Product = {
  id: number; slug: string; name: string; sku: string; brand: string;
  category: string; sub: string; room: string; price: number; mrp: number;
  rating: number; reviews: number; colours: string[]; material: string;
  style: string; seats?: number; badges: string[]; isNew?: boolean; onSale: boolean;
  exclusive?: boolean; stock: number; images: string[]; desc: string; dims: string;
  tags: string[];
};

export const BRANDS = [
  { slug: "imphal-living", name: "Imphal Living", desc: "Everyday value furniture designed for Manipuri homes." },
  { slug: "kangla-home", name: "Kangla Home", desc: "Warm timber classics with a contemporary finish." },
  { slug: "loktak-living", name: "Loktak Living", desc: "Calm, lake-inspired living and bedroom ranges." },
  { slug: "sana-furniture", name: "Sana Furniture", desc: " solid wood staples built to last." },
  { slug: "ima-home", name: "Ima Home", desc: "Family-first comfort at honest prices." },
  { slug: "classic-nest", name: "Classic Nest", desc: "Timeless silhouettes for cosy rooms." },
  { slug: "urban-oak", name: "Urban Oak", desc: "City-smart storage and dining." },
  { slug: "homecraft", name: "HomeCraft", desc: "Workshop-quality beds and wardrobes." },
  { slug: "nova-living", name: "Nova Living", desc: "Compact modern pieces for apartments." },
  { slug: "casa-forma", name: "Casa Forma", desc: "Sculpted sofas and lounge chairs." },
  { slug: "woodline", name: "Woodline", desc: "Engineered-timber workhorses." },
  { slug: "hearth-home", name: "Hearth & Home", desc: "Soft furnishings, rugs and decor." },
  { slug: "hillview", name: "Hillview", desc: "Outdoor and balcony living." },
  { slug: "northeast-living", name: "NorthEast Living", desc: "Bamboo accents and cane craft." }
];

export type Cat = { slug: string; name: string; parent?: string; blurb: string; room: string };
export const CATEGORIES: Cat[] = [
  { slug: "sale", name: "SALE", blurb: "Clearance and weekend savings.", room: "All" },
  { slug: "new", name: "NEW", blurb: "Fresh arrivals this season.", room: "All" },
  { slug: "sofas", name: "SOFAS", blurb: "Sofas, recliners, sofa beds and armchairs.", room: "Living" },
  { slug: "living", name: "LIVING", blurb: "TV units, coffee tables, shelves and packages.", room: "Living" },
  { slug: "dining", name: "DINING", blurb: "Tables, chairs, benches and complete sets.", room: "Dining" },
  { slug: "bedroom", name: "BEDROOM", blurb: "Beds, wardrobes, drawers and packages.", room: "Bedroom" },
  { slug: "mattresses", name: "MATTRESSES", blurb: "Foam, spring and hybrid comfort.", room: "Bedroom" },
  { slug: "kitchen", name: "KITCHEN", blurb: "Cabinets, trolleys, islands and racks.", room: "Kitchen" },
  { slug: "storage", name: "STORAGE", blurb: "Cabinets, cupboards and shoe storage.", room: "All" },
  { slug: "office", name: "OFFICE", blurb: "Desks, ergonomic chairs and storage.", room: "Office" },
  { slug: "kids", name: "KIDS", blurb: "Bunk beds, desks and toy storage.", room: "Kids" },
  { slug: "outdoor", name: "OUTDOOR", blurb: "Balcony, patio and garden sets.", room: "Outdoor" },
  { slug: "rugs", name: "RUGS", blurb: "Runners, round and patterned rugs.", room: "Living" },
  { slug: "lighting", name: "LIGHTING", blurb: "Floor, table and pendant lights.", room: "Living" },
  { slug: "decor", name: "DECOR", blurb: "Mirrors, clocks, cushions and wall art.", room: "Living" }
];

export const SUBS: Record<string, string[]> = {
  sofas: ["2 Seater Sofas", "3 Seater Sofas", "Modular Sofas", "Corner Sofas", "Chaise Sofas", "Sofa Beds", "Recliners", "Armchairs", "Ottomans", "Sofa Sets"],
  bedroom: ["Single Beds", "Double Beds", "Queen Beds", "King Beds", "Storage Beds", "Bunk Beds", "Bedside Tables", "Wardrobes", "Dressers", "Bedroom Packages"],
  mattresses: ["Single", "Double", "Queen", "King", "Foam", "Spring", "Hybrid", "Mattress Protectors"],
  living: ["TV Units", "Coffee Tables", "Side Tables", "Consoles", "Bookshelves", "Living Packages"],
  dining: ["Dining Tables", "Chairs", "Dining Sets", "Benches", "Bar Tables", "Bar Stools", "Sideboards"],
  kitchen: ["Kitchen Cabinets", "Pantry Storage", "Kitchen Trolleys", "Kitchen Islands", "Shelving", "Crockery Storage", "Counter Stools"],
  storage: ["Cabinets", "Cupboards", "Bookshelves", "Shoe Storage", "Clothes Racks", "Display Cabinets"],
  office: ["Desks", "Standing Desks", "Office Chairs", "Gaming Desks", "Office Storage"],
  kids: ["Kids Beds", "Bunk Beds", "Desks", "Chairs", "Storage", "Bookshelves"],
  outdoor: ["Outdoor Sofas", "Outdoor Dining", "Chairs", "Tables", "Benches", "Sun Loungers", "Umbrellas", "Accessories"],
  lighting: ["Floor Lamps", "Table Lamps", "Desk Lamps", "Pendant Lights"],
  rugs: ["Rectangle", "Round", "Runner", "Outdoor", "Kids"],
  decor: ["Mirrors", "Cushions", "Plants", "Pots", "Clocks", "Vases", "Wall Decor", "Baskets"]
};

const IMGS = [
  "photo-1555041469-a586c61ea9bc", "photo-1493663284031-b7e3aefcae8e",
  "photo-1592078615290-033e45e267e9", "photo-1538688525198-9b88f6f53126",
  "photo-1505693416388-ac5ce068fe85", "photo-1524758631624-e2822e304c36",
  "photo-1586023492125-27b2c045efd7", "photo-1567016432779-094069958ea5",
  "photo-1519710164239-da123dc03ef4", "photo-1595428774223-ef52624120d2",
  "photo-1506439773649-6e0eb8cfb237", "photo-1513506003901-1e6a229e2d15",
  "photo-1567538096630-e0c55bd6374c", "photo-1595515106969-1ce29566ff1c",
  "photo-1616486338812-3dadae4b4ace", "photo-1616594039964-ae9021a400a0",
  "photo-1617806118233-18e1de247200", "photo-1618220179428-22790b461013",
  "photo-1615873968403-89e068629265", "photo-1583847268964-b28dc8f51f92",
  "photo-1598300042247-d088f8ab3a91", "photo-1533090481720-856c6e3c1fdc",
  "photo-1540574163026-643ea20ade25", "photo-1560448204-e02f11c3d0e2"
];
const img = (id: string, w = 900) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const FINISH = ["Natural Oak", "Walnut", "Charcoal", "Stone Grey", "Forest Green", "Beige", "Honey Teak", "Matte Black", "Cream", "Indigo"];
const MATS: Record<string, string[]> = {
  sofas: ["Woven polyester", "Linen-blend", "Velvet", "Leatherette", "Cotton canvas"],
  bedroom: ["Sheesham wood", "Engineered timber", "Pine + MDF", "Metal frame + wood"],
  mattresses: ["HR foam", "Pocket spring + foam", "Latex + coir", "Memory foam hybrid"],
  living: ["Engineered timber", "Mango wood", "Metal + glass"],
  dining: ["Rubberwood", "Engineered timber + steel", "Acacia wood"],
  kitchen: ["Stainless steel", "Engineered timber", "Metal + wood"],
  storage: ["Engineered timber", "Particle board + laminate"],
  office: ["Mesh + nylon", "Engineered timber + steel"],
  kids: ["Pine wood", "MDF + laminate"],
  outdoor: ["Eucalyptus + rope", "Powder-coated steel", "Wicker + aluminium"],
  rugs: ["Polypropylene", "Cotton flat-weave", "Jute blend"],
  lighting: ["Metal + linen shade", "Bamboo + fabric"],
  decor: ["Glass + metal", "Ceramic", "Cotton", "Jute"]
};

type Template = { cat: string; sub: string; base: string; lo: number; hi: number; seats?: number };
const T: Template[] = [
  { cat: "sofas", sub: "3 Seater Sofas", base: "3-Seater Sofa", lo: 24999, hi: 59999, seats: 3 },
  { cat: "sofas", sub: "2 Seater Sofas", base: "2-Seater Sofa", lo: 18999, hi: 42999, seats: 2 },
  { cat: "sofas", sub: "Corner Sofas", base: "Corner Sofa", lo: 44999, hi: 99999, seats: 5 },
  { cat: "sofas", sub: "Modular Sofas", base: "Modular Sofa", lo: 54999, hi: 129999, seats: 5 },
  { cat: "sofas", sub: "Recliners", base: "Recliner Chair", lo: 16999, hi: 44999, seats: 1 },
  { cat: "sofas", sub: "Sofa Beds", base: "Sofa Bed", lo: 21999, hi: 54999, seats: 3 },
  { cat: "sofas", sub: "Armchairs", base: "Armchair", lo: 8999, hi: 24999, seats: 1 },
  { cat: "sofas", sub: "Ottomans", base: "Ottoman", lo: 3999, hi: 12999, seats: 1 },
  { cat: "bedroom", sub: "Queen Beds", base: "Queen Bed with Storage", lo: 22999, hi: 64999 },
  { cat: "bedroom", sub: "King Beds", base: "King Bed", lo: 29999, hi: 79999 },
  { cat: "bedroom", sub: "Single Beds", base: "Single Bed", lo: 11999, hi: 29999 },
  { cat: "bedroom", sub: "Wardrobes", base: "3-Door Wardrobe", lo: 18999, hi: 54999 },
  { cat: "bedroom", sub: "Bedside Tables", base: "Bedside Table", lo: 3999, hi: 11999 },
  { cat: "bedroom", sub: "Dressers", base: "Dresser with Mirror", lo: 12999, hi: 32999 },
  { cat: "mattresses", sub: "Queen", base: "Queen Mattress", lo: 8999, hi: 34999 },
  { cat: "mattresses", sub: "King", base: "King Hybrid Mattress", lo: 12999, hi: 44999 },
  { cat: "mattresses", sub: "Single", base: "Single Foam Mattress", lo: 4999, hi: 16999 },
  { cat: "living", sub: "TV Units", base: "TV Entertainment Unit", lo: 9999, hi: 34999 },
  { cat: "living", sub: "Coffee Tables", base: "Coffee Table", lo: 4999, hi: 18999 },
  { cat: "living", sub: "Bookshelves", base: "5-Tier Bookshelf", lo: 6999, hi: 22999 },
  { cat: "dining", sub: "Dining Sets", base: "6-Seater Dining Set", lo: 29999, hi: 79999, seats: 6 },
  { cat: "dining", sub: "Dining Tables", base: "4-Seater Dining Table", lo: 12999, hi: 39999, seats: 4 },
  { cat: "dining", sub: "Chairs", base: "Upholstered Dining Chair (Set of 2)", lo: 4999, hi: 15999, seats: 2 },
  { cat: "dining", sub: "Sideboards", base: "Sideboard Cabinet", lo: 14999, hi: 42999 },
  { cat: "kitchen", sub: "Kitchen Cabinets", base: "Pantry Cabinet", lo: 8999, hi: 29999 },
  { cat: "kitchen", sub: "Kitchen Trolleys", base: "3-Tier Kitchen Trolley", lo: 3999, hi: 12999 },
  { cat: "kitchen", sub: "Kitchen Islands", base: "Kitchen Island Cart", lo: 11999, hi: 34999 },
  { cat: "storage", sub: "Shoe Storage", base: "Shoe Cabinet", lo: 5999, hi: 18999 },
  { cat: "storage", sub: "Cabinets", base: "2-Door Storage Cabinet", lo: 7999, hi: 24999 },
  { cat: "office", sub: "Desks", base: "Study & Work Desk", lo: 6999, hi: 22999 },
  { cat: "office", sub: "Office Chairs", base: "Ergonomic Office Chair", lo: 7999, hi: 27999 },
  { cat: "kids", sub: "Bunk Beds", base: "Kids Bunk Bed", lo: 17999, hi: 44999 },
  { cat: "outdoor", sub: "Outdoor Dining", base: "4-Seater Patio Set", lo: 19999, hi: 59999, seats: 4 },
  { cat: "rugs", sub: "Rectangle", base: "Contemporary Area Rug", lo: 2999, hi: 14999 },
  { cat: "lighting", sub: "Floor Lamps", base: "Arc Floor Lamp", lo: 3499, hi: 12999 },
  { cat: "decor", sub: "Mirrors", base: "Round Wall Mirror", lo: 1999, hi: 8999 },
  { cat: "decor", sub: "Cushions", base: "Cushion Covers (Set of 5)", lo: 999, hi: 3999 }
];

const NAMES = ["Loktak", "Kangla", "Sana", "Ima", "Ningthou", "Tampha", "Kanglei", "Moirang", "Uningthou", "Heikru", "Yenning", "Thangjing", "Panthoibi", "Nongpok", "Chingda", "Leimarel", "Pakhangba", "Khuman", "Luwang", "Moirangcha"];

function mulberry(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const PRODUCTS: Product[] = (() => {
  const rnd = mulberry(20260904);
  const list: Product[] = [];
  const perTemplate = Math.ceil(300 / T.length);
  let id = 1;
  for (const t of T) {
    for (let k = 0; k < perTemplate && list.length < 300; k++) {
      const brand = BRANDS[Math.floor(rnd() * BRANDS.length)];
      const place = NAMES[Math.floor(rnd() * NAMES.length)];
      const name = `${place} ${t.base}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${id}`;
      const price = Math.round((t.lo + rnd() * (t.hi - t.lo)) / 100) * 100 - 1;
      const onSale = rnd() < 0.45;
      const mrp = onSale ? Math.round(price * (1.15 + rnd() * 0.4)) : price;
      const rating = Math.round((3.8 + rnd() * 1.2) * 10) / 10;
      const badges: string[] = [];
      if (onSale) badges.push("SALE");
      const isNew = rnd() < 0.18;
      if (isNew) badges.push("NEW");
      if (rnd() < 0.12) badges.push("BEST SELLER");
      if (rnd() < 0.08) badges.push("ONLINE EXCLUSIVE");
      const stock = Math.floor(rnd() * 40);
      if (stock <= 3 && stock > 0) badges.push("LOW STOCK");
      const mats = MATS[t.cat] ?? ["Engineered timber"];
      const c1 = FINISH[Math.floor(rnd() * FINISH.length)];
      let c2 = FINISH[Math.floor(rnd() * FINISH.length)];
      if (c2 === c1) c2 = "Charcoal";
      const off = (id * 7) % IMGS.length;
      const images = [0, 1, 2, 3].map((j) => img(IMGS[(off + j * 5) % IMGS.length]));
      list.push({
        id, slug, name, sku: `IF-${t.cat.slice(0, 3).toUpperCase()}-${String(id).padStart(4, "0")}`,
        brand: brand.name, category: t.cat, sub: t.sub,
        room: CATEGORIES.find((c) => c.slug === t.cat)?.room ?? "Living",
        price, mrp, rating, reviews: Math.floor(rnd() * 400),
        colours: [c1, c2], material: mats[Math.floor(rnd() * mats.length)],
        style: ["Modern", "Contemporary", "Scandinavian", "Mid-Century", "Rustic"][Math.floor(rnd() * 5)],
        seats: t.seats, badges, isNew, onSale, exclusive: badges.includes("ONLINE EXCLUSIVE"),
        stock, images,
        desc: `${name} by ${brand.name} — a ${t.sub.toLowerCase()} crafted for everyday family life in Imphal. Sturdy joinery, easy-clean finishes and compact proportions suit apartments and family homes alike.`,
        dims: "W 180 × D 85 × H 90 cm (approx, varies by configuration)",
        tags: [t.cat, t.sub.toLowerCase(), brand.name.toLowerCase(), "imphal", "furniture"]
      });
      id++;
    }
  }
  return list;
})();

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const searchProducts = (q: string) => {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return PRODUCTS.filter((p) =>
    [p.name, p.sku, p.brand, p.category, p.sub, p.room, p.material, ...p.colours, ...p.tags].join(" ").toLowerCase().includes(s)
  ).slice(0, 24);
};
export const HEROES = [
  { title: "Refresh Your Home", sub: "Living-room comfort from ₹9,999 · Imphal delivery", cta: "SHOP LIVING", href: "/category/living", image: img(IMGS[6], 1600) },
  { title: "Bedroom Comfort Starts Here", sub: "Beds, wardrobes & mattresses for restful nights", cta: "SHOP BEDROOM", href: "/category/bedroom", image: img(IMGS[7], 1600) },
  { title: "Dining Made Better", sub: "4, 6 & 8-seat packages the family will love", cta: "SHOP DINING", href: "/category/dining", image: img(IMGS[8], 1600) },
  { title: "Storage Without Compromise", sub: "Cabinets & wardrobes that swallow the clutter", cta: "SHOP STORAGE", href: "/category/storage", image: img(IMGS[15], 1600) }
];
