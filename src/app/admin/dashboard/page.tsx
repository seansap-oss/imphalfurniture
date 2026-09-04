import AdminShell from "@/components/AdminShell";
import { PRODUCTS } from "@/lib/catalog";
export default function Dashboard() {
  const low = PRODUCTS.filter((p) => p.stock <= 3).length;
  const cards = [["Today's Revenue", "₹1,84,500"], ["Orders Today", "23"], ["Monthly Revenue", "₹42,10,000"], ["Pending Orders", "7"], ["Low Stock", String(low)], ["Out of Stock", "4"], ["Customers", "8,412"], ["Avg. Order", "₹24,800"], ["Returns Pending", "3"]];
  return (
    <AdminShell title="Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map(([t, v]) => <div key={t} className="bg-white border rounded-2xl p-4"><p className="text-xs text-gray-500">{t}</p><p className="text-xl font-extrabold">{v}</p></div>)}
      </div>
      <div className="bg-white border rounded-2xl p-4 mt-4 text-sm">
        <h2 className="font-extrabold mb-2">Recent orders</h2>
        <p className="text-gray-500">Live order feed appears here once checkout runs. Use Orders → print invoice / picking list, update status, refund.</p>
      </div>
    </AdminShell>
  );
}
