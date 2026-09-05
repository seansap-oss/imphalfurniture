import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me-32-chars!!");

export type Role = "SUPER_ADMIN" | "MANAGER" | "CATALOG_EDITOR" | "ORDER_STAFF" | "CONTENT_EDITOR" | "READ_ONLY";
export const ROLES: Role[] = ["SUPER_ADMIN", "MANAGER", "CATALOG_EDITOR", "ORDER_STAFF", "CONTENT_EDITOR", "READ_ONLY"];

// section perm keys
const PERMS: Record<string, Role[]> = {
  all: ["SUPER_ADMIN"],
  products: ["SUPER_ADMIN", "MANAGER", "CATALOG_EDITOR"],
  packages: ["SUPER_ADMIN", "MANAGER", "CATALOG_EDITOR"],
  categories: ["SUPER_ADMIN", "MANAGER", "CATALOG_EDITOR"],
  brands: ["SUPER_ADMIN", "MANAGER", "CATALOG_EDITOR"],
  collections: ["SUPER_ADMIN", "MANAGER", "CATALOG_EDITOR"],
  orders: ["SUPER_ADMIN", "MANAGER", "ORDER_STAFF"],
  customers: ["SUPER_ADMIN", "MANAGER", "ORDER_STAFF"],
  enquiries: ["SUPER_ADMIN", "MANAGER", "ORDER_STAFF"],
  discounts: ["SUPER_ADMIN", "MANAGER"],
  content: ["SUPER_ADMIN", "MANAGER", "CONTENT_EDITOR"],
  media: ["SUPER_ADMIN", "MANAGER", "CATALOG_EDITOR", "CONTENT_EDITOR"],
  settings: ["SUPER_ADMIN", "MANAGER"],
  users: ["SUPER_ADMIN"],
  view: ["SUPER_ADMIN", "MANAGER", "CATALOG_EDITOR", "ORDER_STAFF", "CONTENT_EDITOR", "READ_ONLY"]
};
export function can(role: Role, perm: string) {
  if (role === "SUPER_ADMIN") return true;
  const allowed = PERMS[perm] || PERMS.view;
  return allowed.includes(role);
}

export async function adminSession(): Promise<{ email: string; role: Role } | null> {
  const c = cookies().get("if_admin")?.value;
  if (!c) return null;
  try {
    const { payload } = await jwtVerify(c, secret);
    return { email: String(payload.email || ""), role: (payload.role as Role) || "SUPER_ADMIN" };
  } catch { return null; }
}
