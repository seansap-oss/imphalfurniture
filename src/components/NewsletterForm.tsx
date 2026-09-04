"use client";
export default function NewsletterForm() {
  return (
    <form
      className="bg-black text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-3 items-center"
      onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}
    >
      <div className="flex-1"><h2 className="font-extrabold text-lg">Get ₹500 off your first order over ₹9,999</h2><p className="text-sm text-white/70">Join the list for weekend deals. No spam.</p></div>
      <input required type="email" placeholder="Email address" aria-label="Email address" className="rounded-full px-5 py-3 text-black w-full sm:w-72" />
      <button className="bg-[#D21F26] text-white font-extrabold rounded-full px-6 py-3 min-h-[44px]">Subscribe</button>
    </form>
  );
}
