import { getCMS, mergedProducts, mergedBrands, activeHeroes, visibleSections } from "@/lib/cms";
import { Rail, RoomsGrid, PackagesRail, Inspiration, BrandsRow, WhyGrid, HeroCarousel, NewsletterForm } from "@/components/home-sections";

function railItems(all: Awaited<ReturnType<typeof mergedProducts>>, cfg: { source?: string; category?: string; slugs?: string[]; limit?: number }) {
  if (cfg.source === "manual" && cfg.slugs?.length) {
    const map = new Map(all.map((p) => [p.slug, p]));
    return cfg.slugs.map((s) => map.get(s)).filter(Boolean).slice(0, cfg.limit || 10) as typeof all;
  }
  if (cfg.category === "__sale") return all.filter((p) => p.onSale);
  if (cfg.category === "__new") return all.filter((p) => p.isNew);
  if (cfg.category) return all.filter((p) => p.category === cfg.category);
  return all;
}

export default async function Home() {
  let cms: any = null;
  try { cms = await getCMS(); } catch {}
  const [products, brands, heroes, sections] = await Promise.all([
    mergedProducts().catch(() => [] as any[]),
    mergedBrands().catch(() => []),
    activeHeroes().catch(() => []),
    visibleSections().catch(() => [])
  ]);
  const wa = (cms?.contact?.whatsapp || "+91 8974499282").replace(/\D/g, "");
  const pkgs = (cms?.packages || []).filter((p: any) => p.status === "active");
  const featFirst = [...pkgs].sort((a: any, b: any) => Number(b.featured || false) - Number(a.featured || false));
  return (
    <div>
      {sections.filter((s) => s.type === "hero").map((s) => <HeroCarousel key={s.id} slides={heroes.map((h) => ({ title: h.title, sub: h.sub, cta: h.cta, href: h.href, cta2: h.cta2, href2: h.href2, image: h.image, videoUrl: h.videoUrl, mediaType: h.mediaType }))} />)}
      {sections.filter((s) => s.type !== "hero").map((s) => {
        if (s.type === "rooms") return <RoomsGrid key={s.id} title={s.title} subtitle={s.subtitle} heroes={heroes.length ? heroes : [{ image: "" }]} />;
        if (s.type === "products") return <Rail key={s.id} title={s.title} subtitle={s.subtitle} href={s.config.link} items={railItems(products, s.config)} />;
        if (s.type === "packages") return <PackagesRail key={s.id} title={s.title} subtitle={s.subtitle} pkgs={featFirst} wa={wa} />;
        if (s.type === "inspiration") return <Inspiration key={s.id} title={s.title} subtitle={s.subtitle} heroes={heroes} />;
        if (s.type === "brands") return <BrandsRow key={s.id} title={s.title} subtitle={s.subtitle} brands={brands} />;
        if (s.type === "why") return <WhyGrid key={s.id} title={s.title} subtitle={s.subtitle} />;
        if (s.type === "newsletter") return <section key={s.id} className="max-w-7xl mx-auto px-3 sm:px-4 mt-8" aria-label={s.title || "Newsletter"}><NewsletterForm /></section>;
        return null;
      })}
    </div>
  );
}
