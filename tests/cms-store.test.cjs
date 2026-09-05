// Adapter test: cms-store SQL against pg-mem (in-memory Postgres).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { execSync } = require("child_process");

const OUT = path.join(__dirname, "cms-store-compiled");
execSync(`npx tsc "${path.join(__dirname, "..", "src", "lib", "cms-store.ts")}" --outDir "${OUT}" --module commonjs --target es2020 --esModuleInterop --skipLibCheck --declaration false`, { stdio: "pipe" });
const store = require(path.join(OUT, "cms-store.js"));
const { newDb } = require("pg-mem");

test("postgres adapter: empty load, save, reload, upsert", async () => {
  const db = newDb();
  const { Pool } = db.adapters.createPg();
  store.__setPool(new Pool());
  const first = await store.dbLoad("cms");
  assert.equal(first, null);
  const doc = { settings: { siteName: "Test" }, n: 1, arr: [1, 2] };
  assert.equal(await store.dbSave("cms", doc), true);
  const back = await store.dbLoad("cms");
  assert.deepEqual(back.settings, { siteName: "Test" });
  assert.deepEqual(back.arr, [1, 2]);
  await store.dbSave("cms", { settings: { siteName: "Changed" } });
  const back2 = await store.dbLoad("cms");
  assert.equal(back2.settings.siteName, "Changed");
  assert.equal(back2.n, undefined);
  store.__setPool(null);
});

test("syncStatus file mode without DATABASE_URL", () => {
  delete process.env.DATABASE_URL;
  const s = store.syncStatus();
  assert.equal(s.durable, false);
  assert.equal(s.mode, "file");
});

test("placeholder DATABASE_URL is rejected", () => {
  process.env.DATABASE_URL = "[SENSITIVE]";
  assert.equal(store.isDurable(), false);
  process.env.DATABASE_URL = "sqlite://local";
  assert.equal(store.isDurable(), false);
  delete process.env.DATABASE_URL;
});
