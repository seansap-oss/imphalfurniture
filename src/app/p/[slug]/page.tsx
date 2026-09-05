import Link from "next/link";
import { getCMS } from "@/lib/cms";

export default async function CMSPage({ params }: { params: { slug: string } }) {
  const cms = await getCMS().catch(() => null);
  const p = (cms?.pages || []).find((x: any) => x.slug === params.slug && x.status === "published");
  if (!p) return <div className="max-w-3xl mx-auto p-8"><h1 className="text-2xl font-extrabold">Page not found</h1><Link className="underline" href="/">Back home</Link></div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold">{p.title}</h1>
      {p.image && <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.image} alt={p.title} className="w-full rounded-2xl mt-4" /></>}
      <div className="prose-sm mt-4 text-gray-700 text-sm leading-relaxed whitespace-pre-line">{p.body}</div>
    </div>
  );
}
