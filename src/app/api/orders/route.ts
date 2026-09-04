import { NextResponse } from "next/server";
import { readJSON } from "@/lib/db";
export async function GET() {
  const orders = await readJSON<any[]>("orders.json", []);
  return NextResponse.json({ orders });
}
