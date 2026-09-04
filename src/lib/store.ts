export const INR = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export const SITE = {
  name: "Planet Interio",
  display: "PLANET INTERIO",
  tagline: "Furniture for good living",
  phone: "+91 9429691445",
  whatsapp: "+91 8974499282",
  email: "care@planetinterio.in",
  address: "Planet Interio, Canchipur, Near Iland Nissan, Imphal, India 795003",
  workshop: "Langthabal Kunja, near Standard Robarth Higher Secondary School, Canchipur, Manipur, India",
  hours: "Mon–Sat 10am–8pm · Sun 11am–6pm",
};

// Imphal-first delivery zones (PIN based, location-aware).
export type DeliveryZone = {
  id: string;
  label: string;
  pins: string[];
  charge: number;
  freeAbove: number;
  days: string;
  cod: boolean;
  pickup: boolean;
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: "imphal-core", label: "Imphal Core", pins: ["795001", "795002", "795003", "795004"], charge: 0, freeAbove: 0, days: "Same-day / Next-day", cod: true, pickup: true },
  { id: "imphal-extended", label: "Greater Imphal", pins: ["795005", "795006", "795008", "795010", "795011"], charge: 499, freeAbove: 19999, days: "1–2 days", cod: true, pickup: true },
  { id: "manipur", label: "Manipur State", pins: ["795101", "795102", "795103", "795104", "795105", "795109", "795110", "795128", "795129", "795130", "795131", "795132", "795133", "795134", "795135", "795136", "795137", "795138", "795139", "795140", "795141", "795142", "795143", "795144", "795145", "795146", "795147", "795148", "795149", "795150"], charge: 999, freeAbove: 49999, days: "2–5 days", cod: true, pickup: false },
  { id: "northeast", label: "North-East India", pins: [], charge: 1999, freeAbove: 99999, days: "4–8 days", cod: false, pickup: false },
  { id: "national", label: "Rest of India", pins: [], charge: 2499, freeAbove: 149999, days: "5–10 days", cod: false, pickup: false }
];

export function zoneForPin(pin: string): DeliveryZone {
  const p = (pin || "").trim();
  for (const z of DELIVERY_ZONES) if (z.pins.includes(p)) return z;
  if (/^(79[0-9]{4})$/.test(p)) return DELIVERY_ZONES[3];
  if (/^[1-9][0-9]{5}$/.test(p)) return DELIVERY_ZONES[4];
  return DELIVERY_ZONES[1];
}

export function deliveryFee(pin: string, subtotal: number, bulky = true): number {
  const z = zoneForPin(pin);
  if (subtotal >= z.freeAbove) return 0;
  return bulky ? z.charge : Math.round(z.charge / 2);
}

// Location-aware stock: core Imphal store holds most stock; warehouse is backup.
export function stockFor(pin: string, baseStock: number): { available: string; eta: string; pickup: boolean } {
  const z = zoneForPin(pin);
  if (z.id === "imphal-core") return { available: baseStock > 0 ? `In stock at Planet Interio, Canchipur` : "Backorder — 7 days", eta: "Delivery tomorrow", pickup: true };
  if (z.id === "imphal-extended") return { available: baseStock > 5 ? "In stock — Imphal dispatch" : "Ships from warehouse in 2 days", eta: "1–2 days", pickup: true };
  return { available: baseStock > 10 ? "Ships from Planet Interio workshop" : "Made-to-order / 7–10 days", eta: z.days, pickup: false };
}
