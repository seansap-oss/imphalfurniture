import { NextResponse } from "next/server";
import { getCMS, mergedCategories, mergedBrands, mergedProducts, activeHeroes, visibleSections } from "@/lib/cms";

// Public bundle for storefront + floating buttons + checkout. No secrets.
export async function GET() {
  const cms = await getCMS();
  const [cats, brands, heroes, sections] = await Promise.all([mergedCategories(), mergedBrands(), activeHeroes(), visibleSections()]);
  const social: Record<string, any> = {};
  for (const [k, v] of Object.entries(cms.social as Record<string, any>)) if (v.enabled && v.url) social[k] = v;
  return NextResponse.json({
    ok: true,
    settings: cms.settings, contact: cms.contact, social,
    announcement: cms.announcement, header: cms.header, footer: cms.footer,
    floating: cms.floating, appearance: cms.appearance, seo: cms.seo,
    delivery: cms.delivery, payments: cms.payments,
    heroes, sections, categories: cats, brands,
    packages: cms.packages.filter((p) => p.status === "active")
  });
}
