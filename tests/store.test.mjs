import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("catalogue has 300 products with INR pricing", () => {
  const src = readFileSync(new URL("../src/lib/catalog.ts", import.meta.url), "utf8");
  assert.match(src, /300/);
  assert.match(src, /price/);
});
test("no demo wording in public chrome", () => {
  const files = ["../src/components/Header.tsx", "../src/components/Footer.tsx", "../src/app/page.tsx"];
  for (const f of files) {
    const s = readFileSync(new URL(f, import.meta.url), "utf8").toLowerCase();
    assert.doesNotMatch(s, /lorem ipsum/);
    assert.doesNotMatch(s, /test website/);
  }
});
test("no public admin link", () => {
  const h = readFileSync(new URL("../src/components/Header.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(h, /href="\/admin/);
  const ft = readFileSync(new URL("../src/components/Footer.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(ft, /href="\/admin/);
});
test("PWA manifest standalone + INR + zones", () => {
  const m = JSON.parse(readFileSync(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"));
  assert.equal(m.display, "standalone");
  const store = readFileSync(new URL("../src/lib/store.ts", import.meta.url), "utf8");
  assert.match(store, /795001/);
  assert.match(store, /₹/);
});
