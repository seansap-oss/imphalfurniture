# imphalfurniture

Production furniture e-commerce + hidden `/admin` CMS + installable PWA. INR (₹) throughout, Imphal-first delivery zones, upload-based media (no image-URL typing), location-aware stock, wishlist/cart, filters, room groupings, and help journeys (delivery/Click & Collect, cancellation/returns/warranty, online payments).

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
- Orders/users/audit persist as JSON in `data/` (swap for PostgreSQL via `prisma/schema.prisma` in production).
- Uploads go to `public/uploads/` via drag/drop in admin (`/api/admin/media`).

## PWA / mobile path
- `manifest.webmanifest`, `sw.js` (offline fallback at `/offline`), maskable icons in `public/icons/`.
- API-first services in `src/lib/` are reusable for future Capacitor / Android / iOS shells.

## Production
Vercel + PostgreSQL + S3-compatible storage. Set env from `.env.example`. Never commit secrets.
