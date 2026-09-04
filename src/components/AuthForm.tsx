"use client";
import { useState } from "react";
export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" }) {
  const [msg, setMsg] = useState("");
  return (
    <form className="bg-white border rounded-2xl p-6 space-y-3 text-sm max-w-md w-full" onSubmit={async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const body = Object.fromEntries(fd.entries());
      const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await res.json();
      if (j.ok) { setMsg(mode === "forgot" ? "If that email exists, a reset link was sent." : "Success — redirecting…"); setTimeout(() => (window.location.href = mode === "login" ? "/account" : "/login"), 700); }
      else setMsg(j.error || "Something went wrong");
    }}>
      <h1 className="text-2xl font-extrabold capitalize">{mode === "forgot" ? "Reset password" : mode}</h1>
      {mode === "register" && <div className="grid grid-cols-2 gap-2"><input name="first" required placeholder="First name" className="border rounded-lg px-3 py-2.5" /><input name="last" required placeholder="Last name" className="border rounded-lg px-3 py-2.5" /></div>}
      {mode === "register" && <input name="mobile" required placeholder="Mobile" className="border rounded-lg px-3 py-2.5 w-full" />}
      <input name="email" required type="email" placeholder="Email" className="border rounded-lg px-3 py-2.5 w-full" />
      {mode !== "forgot" && <input name="password" required type="password" minLength={8} placeholder="Password (8+ chars)" className="border rounded-lg px-3 py-2.5 w-full" />}
      {mode === "register" && <input name="confirm" required type="password" placeholder="Confirm password" className="border rounded-lg px-3 py-2.5 w-full" />}
      <button className="w-full bg-[#D21F26] text-white font-extrabold rounded-full py-3 min-h-[48px]">{mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Link"}</button>
      {msg && <p role="status" className="text-center text-gray-600">{msg}</p>}
      {mode === "login" && <p className="text-center"><a className="underline" href="/forgot-password">Forgot password?</a> · <a className="underline" href="/register">Create account</a></p>}
    </form>
  );
}
