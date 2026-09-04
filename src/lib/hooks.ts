import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = { slug: string; variant?: string; qty: number; price: number; title: string; image: string };
type CartState = {
  lines: CartLine[];
  pin: string;
  add: (l: CartLine) => void;
  remove: (slug: string, variant?: string) => void;
  setQty: (slug: string, variant: string | undefined, qty: number) => void;
  clear: () => void;
  setPin: (pin: string) => void;
  subtotal: () => number;
};
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      pin: "795001",
      add: (l) => {
        const lines = [...get().lines];
        const i = lines.findIndex((x) => x.slug === l.slug && x.variant === l.variant);
        if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + l.qty };
        else lines.push(l);
        set({ lines });
      },
      remove: (slug, variant) => set({ lines: get().lines.filter((x) => !(x.slug === slug && x.variant === variant)) }),
      setQty: (slug, variant, qty) =>
        set({ lines: qty <= 0 ? get().lines.filter((x) => !(x.slug === slug && x.variant === variant)) : get().lines.map((x) => (x.slug === slug && x.variant === variant ? { ...x, qty } : x)) }),
      clear: () => set({ lines: [] }),
      setPin: (pin) => set({ pin }),
      subtotal: () => get().lines.reduce((s, l) => s + l.price * l.qty, 0)
    }),
    { name: "if-cart" }
  )
);

type WishState = { slugs: string[]; toggle: (s: string) => void; has: (s: string) => boolean };
export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (s) => set({ slugs: get().slugs.includes(s) ? get().slugs.filter((x) => x !== s) : [...get().slugs, s] }),
      has: (s) => get().slugs.includes(s)
    }),
    { name: "if-wishlist" }
  )
);
