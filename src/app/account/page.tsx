"use client";
import Link from "next/link";
export default function AccountHome() {
  const links = [["Profile", "/account/profile"], ["Addresses", "/account/addresses"], ["Orders", "/account/orders"], ["Saved Items", "/account/wishlist"], ["Recently Viewed", "/account/recent"]];
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <h1 className="text-2xl font-extrabold">My Account</h1>
      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        {links.map(([t, h]) => <Link key={h} href={h} className="bg-white border rounded-2xl p-5 font-bold hover:shadow">{t}</Link>)}
      </div>
      <form action="/api/auth/logout" method="post" onSubmit={(e) => { e.preventDefault(); fetch("/api/auth/logout", { method: "POST" }).then(() => (window.location.href = "/")); }}>
        <button className="mt-6 underline text-sm">Logout</button>
      </form>
    </div>
  );
}
