import Link from "next/link";
import { getCMS } from "@/lib/cms";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const cms = await getCMS().catch(() => null);
  const p = (cms?.posts || []).find((x: any) => x.slug === params.slug && x.status === "published");
  if (!p) return <div className="max-w-3xl mx-auto p-8"><h1 className="text-2xl font-extrabold">Not found</h1><Link className="underline" href="/blog">All stories</Link></div>;
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <nav className="text-xs text-gray-500"><Link href="/">Home</Link> / <Link href="/blog">News</Link> / {p.title}</nav>
      <h1 className="text-3xl font-extrabold mt-2">{p.title}</h1>
      <p className="text-xs text-gray-500 mt-1">{p.date || ""}</p>
      {p.image && <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.image} alt={p.title} className="w-full rounded-2xl mt-4" /></>}
      <div className="prose-sm mt-4 text-gray-700 text-sm leading-relaxed whitespace-pre-line">{p.body}</div>
    </div>
  );
}
