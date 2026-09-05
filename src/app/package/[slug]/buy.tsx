"use client";
import { useCart } from "@/lib/hooks";
export default function PackageBuy({ pkg, disabled, status }: { pkg: { slug: string; name: string; price: number; cover: string }; disabled?: boolean; status?: string }) {
  const cart = useCart();
  if (disabled) return <p className="mt-4 bg-gray-100 text-center font-bold rounded-full py-3 capitalize">{status === "coming" ? "Coming Soon" : "Sold Out"}</p>;
  return (
    <button onClick={() => { cart.add({ slug: `pkg:${pkg.slug}`, qty: 1, price: pkg.price, title: `${pkg.name} (Package)`, image: pkg.cover }); window.location.href = "/checkout"; }} className="w-full mt-4 bg-[#D21F26] text-white font-extrabold rounded-full py-3 min-h-[48px]">
      Buy Package
    </button>
  );
}
