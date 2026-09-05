"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { Products, Categories, Brands, Collections } from "@/components/admin/edit-catalog";
import { Packages, Enquiries, Discounts, Media } from "@/components/admin/edit-packages";
import { Dashboard, WebsiteEditor, HomepageSections, HeroManager, Orders, Customers, Pages, Blog, UsersRoles, Analytics, History } from "@/components/admin/edit-ops";
import { Branding, ContactDetails, SocialMedia, AnnouncementBar, HeaderEditor, FooterEditor, FloatingEditor, SeoEditor, AppearanceEditor, MenusEditor, DeliveryEditor, PaymentsEditor, GeneralSettings } from "@/components/admin/edit-site";
import { Empty } from "@/components/admin/ui";

const REGISTRY: Record<string, { title: string; perm: string; el: () => JSX.Element }> = {
  dashboard: { title: "Dashboard", perm: "view", el: Dashboard },
  website: { title: "Website Editor", perm: "content", el: WebsiteEditor },
  homepage: { title: "Homepage", perm: "content", el: HomepageSections },
  hero: { title: "Hero / Banners", perm: "content", el: HeroManager },
  products: { title: "Products", perm: "products", el: Products },
  categories: { title: "Categories", perm: "categories", el: Categories },
  packages: { title: "Packages", perm: "packages", el: Packages },
  enquiries: { title: "Package Enquiries", perm: "enquiries", el: Enquiries },
  collections: { title: "Collections", perm: "collections", el: Collections },
  brands: { title: "Brands", perm: "brands", el: Brands },
  orders: { title: "Orders", perm: "orders", el: Orders },
  customers: { title: "Customers", perm: "orders", el: Customers },
  discounts: { title: "Discounts", perm: "discounts", el: Discounts },
  pages: { title: "Pages", perm: "content", el: Pages },
  blog: { title: "Blog / News", perm: "content", el: Blog },
  media: { title: "Media Library", perm: "media", el: Media },
  menus: { title: "Menus", perm: "content", el: MenusEditor },
  header: { title: "Header", perm: "content", el: HeaderEditor },
  footer: { title: "Footer", perm: "content", el: FooterEditor },
  contact: { title: "Contact Details", perm: "content", el: ContactDetails },
  social: { title: "Social Media", perm: "content", el: SocialMedia },
  floating: { title: "WhatsApp Buttons", perm: "content", el: FloatingEditor },
  announcement: { title: "Announcement", perm: "content", el: AnnouncementBar },
  seo: { title: "SEO", perm: "content", el: SeoEditor },
  appearance: { title: "Appearance", perm: "content", el: AppearanceEditor },
  branding: { title: "Branding", perm: "content", el: Branding },
  delivery: { title: "Delivery", perm: "settings", el: DeliveryEditor },
  payments: { title: "Payments", perm: "settings", el: PaymentsEditor },
  users: { title: "Users & Roles", perm: "users", el: UsersRoles },
  analytics: { title: "Analytics", perm: "view", el: Analytics },
  history: { title: "History", perm: "view", el: History },
  settings: { title: "Settings", perm: "settings", el: GeneralSettings }
};

const ROLE_PERMS: Record<string, string[]> = {
  SUPER_ADMIN: ["*"], MANAGER: ["view", "products", "packages", "categories", "collections", "brands", "orders", "discounts", "content", "media", "settings"],
  CATALOG_EDITOR: ["view", "products", "packages", "categories", "collections", "brands", "media"],
  ORDER_STAFF: ["view", "orders"], CONTENT_EDITOR: ["view", "content", "media"], READ_ONLY: ["view"]
};

export default function Section({ params }: { params: { section: string } }) {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => { fetch("/api/admin/session").then((r) => r.json()).then((j) => setRole(j.ok ? j.role || "SUPER_ADMIN" : null)); }, []);
  const reg = REGISTRY[params.section];
  if (!reg) return <AdminShell title="Not found"><Empty title="Unknown admin section" /></AdminShell>;
  if (role === null) return <AdminShell title={reg.title}><p className="text-sm text-gray-500">Checking access…</p></AdminShell>;
  const allowed = (ROLE_PERMS[role] || []).includes("*") || (ROLE_PERMS[role] || []).includes(reg.perm);
  if (!allowed) return <AdminShell title={reg.title}><Empty title={`Your role (${role}) cannot access ${reg.title}`} /></AdminShell>;
  const El = reg.el;
  return <AdminShell title={reg.title}><El /></AdminShell>;
}
