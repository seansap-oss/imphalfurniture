# Planet Interio — Furniture for good living

Production furniture e-commerce + hidden `/admin` CMS + installable PWA + Android TWA wrapper. INR (₹) throughout, Imphal-first delivery zones, upload-based media (no image-URL typing), location-aware stock, wishlist/cart, filters, room groupings, and help journeys (delivery/Click & Collect, cancellation/returns/warranty, online payments).

**Store:** Planet Interio, Canchipur, Near Iland Nissan, Imphal, India 795003
**Call:** +91 9429691445 · **WhatsApp:** +91 8974499282
**Workshop:** Langthabal Kunja, near Standard Robarth Higher Secondary School, Canchipur, Manipur, India

Brand assets live in `public/brand/` (`pi-mark.svg` square logo, `planet-interior-wordmark.svg` wordmark). Header lockup follows the golden ratio: 40px mark in a ~65px header (65 ÷ φ ≈ 40).

## Quick start
```bash
npm install
cp .env.example .env.local   # set AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev                   # http://localhost:3000
```
Admin: http://localhost:3000/admin (no public link to it — by design).

## Scripts
- `npm run dev|build|start|lint|typecheck|test`

## Data & storage
- Catalogue (300 products, 14 brands, taxonomy) is generated in `src/lib/catalog.ts`.
- Orders/users/audit persist as JSON in `data/` locally (ephemeral `/tmp` on Vercel — production needs PostgreSQL via `prisma/schema.prisma`).
- Uploads go to `public/uploads/` via drag/drop in admin (`/api/admin/media`).

## Android app
Trusted-Web-Activity wrapper in `android/` (`twa-manifest.json`, package `com.imphalfurniture.twa`). Release keystore is **not** in git — back up `android/android.keystore`. Rebuild after web changes:
```bash
# passwords via BUBBLEWRAP_KEYSTORE_PASSWORD / BUBBLEWRAP_KEY_PASSWORD
node <driver> # or: bubblewrap build --manifest ./twa-manifest.json (needs TTY)
```
Signed outputs: `android/app-release-signed.apk`, `android/app-release-bundle.aab` (Play upload).

## Production
Vercel + PostgreSQL + S3-compatible storage. Set env from `.env.example`. Never commit secrets.
