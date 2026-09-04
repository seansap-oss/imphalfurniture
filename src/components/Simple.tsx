export default function Simple({ title, children }: any) {
  return <div className="max-w-4xl mx-auto px-4 py-8"><h1 className="text-3xl font-extrabold">{title}</h1><div className="prose-sm mt-4 space-y-3 text-gray-700 text-sm leading-relaxed">{children}</div></div>;
}
