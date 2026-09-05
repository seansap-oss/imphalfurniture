import Link from "next/link";
import { getCMS } from "@/lib/cms";

export default async function BlogPage() {
  const cms = await getCMS().catch(() => null);
  const posts = (cms?.posts || []).filter((p: any) => p.status === "published");
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-extrabold">News & Ideas</h1>
      <p className="text-sm text-gray-500 mt-1">Stories from Planet Interio, Canchipur.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        {posts.map((p: any) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="bg-white border rounded-2xl overflow-hidden">
            {p.image && <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.image} alt="" loading="lazy" className="w-full aspect-video object-cover" /></>}
            <div className="p-4"><p className="font-extrabold">{p.title}</p><p className="text-xs text-gray-500 mt-1">{p.date || ""}</p></div>
          </Link>
        ))}
      </div>
      {posts.length === 0 && <div className="bg-white border rounded-2xl p-10 text-center mt-4"><p className="font-extrabold">Stories coming soon.</p></div>}
    </div>
  );
}
