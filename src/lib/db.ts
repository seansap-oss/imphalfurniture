import { promises as fs } from "fs";
import path from "path";
const DIR = path.join(process.cwd(), "data");
async function ensure() { try { await fs.mkdir(DIR, { recursive: true }); } catch {} }
export async function readJSON<T>(name: string, fallback: T): Promise<T> {
  await ensure();
  try { return JSON.parse(await fs.readFile(path.join(DIR, name), "utf8")); } catch { return fallback; }
}
export async function writeJSON(name: string, data: unknown) {
  await ensure();
  await fs.writeFile(path.join(DIR, name), JSON.stringify(data, null, 2));
}
