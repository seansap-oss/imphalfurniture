"use client";
import { useEffect, useState } from "react";
export default function AdminGate() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => { fetch("/api/admin/session").then((r) => r.json()).then((j) => setAuthed(j.ok)).catch(() => setAuthed(false)); }, []);
  if (authed === null) return <div className="min-h-screen grid place-items-center"><p>Loading…</p></div>;
  if (authed) { window.location.href = "/admin/dashboard"; return <div className="min-h-screen grid place-items-center"><p>Redirecting…</p></div>; }
  return (
    <div className="min-h-screen grid place-items-center bg-[#111] p-4">
      <form className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const res = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }) });
        const j = await res.json();
        if (j.ok) window.location.href = "/admin/dashboard"; else setErr(j.error || "Login failed");
      }}>
        <p className="font-extrabold text-xl">Admin Login</p>
        <p className="text-xs text-gray-500">Restricted area. Credentials from environment bootstrap.</p>
        <input name="email" type="email" required placeholder="Email" className="border rounded-lg px-3 py-2.5 w-full" aria-label="Email" />
        <input name="password" type="password" required placeholder="Password" className="border rounded-lg px-3 py-2.5 w-full" aria-label="Password" />
        <button className="w-full bg-[#D21F26] text-white font-extrabold rounded-full py-3">Sign In</button>
        {err && <p role="alert" className="text-red-600 text-sm">{err}</p>}
      </form>
    </div>
  );
}
