"use client";
export default function Err({ reset }: { reset: () => void }) {
  return <div className="max-w-xl mx-auto p-10 text-center"><h1 className="text-2xl font-extrabold">Something went wrong</h1><button onClick={reset} className="mt-4 bg-black text-white px-6 py-2.5 rounded-full">Try again</button></div>;
}
