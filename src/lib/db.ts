import { promises as fs } from "fs";
import path from "path";
// Vercel serverless filesystem is read-only except /tmp — use it in production.
// NOTE: /tmp is ephemeral per region/instance. Production persistence needs
// PostgreSQL (prisma/schema.prisma) + object storage. File layer is best-effort.
const DIR = process.env.VERCEL
  ? path.join("/tmp", "if-data")
  : path.join(process.cwd(), "data");
async function ensure() { try { await fs.mkdir(DIR, { recursive: true }); } catch {} }
export async function readJSON<T>(name: string, fallback: T): Promise<T> {
  await ensure();
  try { return JSON.parse(await fs.readFile(path.join(DIR, name), "utf8")); } catch { return fallback; }
}
export async function writeJSON(name: string, data: unknown) {
  await ensure();
  try { await fs.writeFile(path.join(DIR, name), JSON.stringify(data, null, 2)); }
  catch (e) { console.warn(`[db] persistence unavailable for ${name}:`, (e as Error).message); }
}
