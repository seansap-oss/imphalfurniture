import Simple from "@/components/Simple";
import { SITE } from "@/lib/store";
export default function Stores() { return <Simple title="Store Locations"><p><strong>Planet Interio — Main Store</strong> — {SITE.address}. Open {SITE.hours}. Click & Collect + Furniture Delivery.</p><p><strong>Workshop</strong> — {SITE.workshop} (customised furniture & onsite installation).</p><p>📱 {SITE.phone} · 💬 WhatsApp {SITE.whatsapp}</p></Simple>; }
