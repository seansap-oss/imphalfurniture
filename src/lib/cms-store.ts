import { promises as fs } from "fs";
import path from "path";

// Durable CMS persistence.
// - If DATABASE_URL is a real postgres URL -> shared Postgres (all serverless
//   instances + admin + storefront read/write the same row). THIS is live sync.
// - Otherwise -> local JSON file (dev machine only; on Vercel /tmp is
//   per-instance and ephemeral, so edits do NOT propagate).
// The admin UI shows which mode is active via syncStatus().

const FILE = process.env.VERCEL ? path.join("/tmp", "if-data", "cms.json") : path.join(process.cwd(), "data", "cms.json");
const ROW_ID = "cms";

export function databaseUrl(): string {
  const v = (process.env.DATABASE_URL || "").trim().replace(/^"|"$/g, "");
  if (!v || v === "[SENSITIVE]") return "";
  if (!/^postgres(ql)?:\/\//i.test(v)) return "";
  return v;
}
export function isDurable() { return databaseUrl() !== ""; }
export function syncStatus() {
  return isDurable()
    ? { durable: true as const, mode: "postgres" as const, hint: "Live sync on — edits publish to the website." }
    : { durable: false as const, mode: "file" as const, hint: "Local file only — connect a database for live sync." };
}

type PoolLike = { query: (text: string, params?: any[]) => Promise<{ rows: any[] }> };
let pool: PoolLike | null = null;
let warned = false;
let tableReady = false;

async function getPool(): Promise<PoolLike> {
  if (pool) return pool;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Pool } = require("pg");
  const p: PoolLike = new Pool({ connectionString: databaseUrl(), max: 2, idleTimeoutMillis: 10000, connectionTimeoutMillis: 8000, ssl: { rejectUnauthorized: false } });
  (p as any).on?.("error", () => { pool = null; });
  pool = p;
  return p;
}
// Test hook (pg-mem).
export function __setPool(p: PoolLike | null) { pool = p; tableReady = false; }

async function ensureTable(p: PoolLike) {
  if (tableReady) return;
  await p.query(`CREATE TABLE IF NOT EXISTS cms_store (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
  tableReady = true;
}

export async function dbLoad(rowId = ROW_ID): Promise<any | null> {
  const p = await getPool();
  try {
    await ensureTable(p);
    const r = await p.query(`SELECT data FROM cms_store WHERE id = $1`, [rowId]);
    return r.rows.length ? r.rows[0].data : null;
  } catch (e) {
    if (!warned) { console.warn("[cms] postgres unavailable, edits will NOT sync:", (e as Error).message); warned = true; }
    return null;
  }
}

export async function dbSave(rowId: string, data: any): Promise<boolean> {
  const p = await getPool();
  try {
    await ensureTable(p);
    await p.query(
      `INSERT INTO cms_store (id, data, updated_at) VALUES ($1, $2::jsonb, now())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [rowId, JSON.stringify(data)]
    );
    return true;
  } catch (e) {
    console.warn("[cms] postgres save failed:", (e as Error).message);
    return false;
  }
}

async function fileLoad(): Promise<any | null> {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch { return null; }
}
async function fileSave(data: any): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) { console.warn("[cms] file persist unavailable:", (e as Error).message); return false; }
}

// Unified load/save used by the CMS layer. No in-memory cache: every read
// hits the shared store so admin edits are visible to the storefront.
export async function storeLoad(defaults: () => any): Promise<any> {
  if (isDurable()) {
    const data = await dbLoad();
    if (data && typeof data === "object") return { ...defaults(), ...data };
    return defaults();
  }
  const data = await fileLoad();
  if (data && typeof data === "object") return { ...defaults(), ...data };
  return defaults();
}
export async function storeSave(data: any): Promise<{ ok: boolean; durable: boolean }> {
  if (isDurable()) return { ok: await dbSave(ROW_ID, data), durable: true };
  return { ok: await fileSave(data), durable: false };
}
