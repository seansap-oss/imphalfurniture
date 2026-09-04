"use client";
export default function Filters({ brands }: { brands: string[] }) {
  return (
    <aside className="hidden lg:block" aria-label="Filters">
      <form method="get" className="bg-white border rounded-2xl p-4 text-sm space-y-4 sticky top-32">
        <div><h3 className="font-extrabold mb-2">Brand</h3>{brands.slice(0, 14).map((b) => <label key={b} className="flex gap-2 py-1"><input type="checkbox" name="brand" value={b} /> {b}</label>)}</div>
        <div><h3 className="font-extrabold mb-2">Max price (₹)</h3><input name="max" type="number" min={1000} step={1000} placeholder="e.g. 30000" className="border rounded-lg px-3 py-2 w-full" /></div>
        <div><h3 className="font-extrabold mb-2">Offers</h3><label className="flex gap-2 py-1"><input type="checkbox" name="sale" value="1" /> On Sale</label></div>
        <button className="w-full bg-black text-white rounded-full py-2.5 font-bold">Apply filters</button>
      </form>
    </aside>
  );
}
