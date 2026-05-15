# Repo Notes

## Next 16
- This app uses Next `16.2.4`; check `node_modules/next/dist/docs/` before changing framework APIs.
- App Router `params` and `searchParams` are Promises in pages/layouts; `await` them.
- `proxy.ts` is the request gate. Do not add `middleware.ts`.
- `next dev` and `next build` use Turbopack by default.

## Commands
- Install deps with `npm install`.
- Dev server: `npm run dev`.
- Production build: `npm run build`.
- Lint: `npm run lint`.
- Typecheck: `npx tsc --noEmit`.
- Drizzle migrations: `npx drizzle-kit migrate`.

## Runtime / Data
- Required envs: `DATABASE_URL`, one auth secret (`AUTH_SECRET`, `NEXTAUTH_SECRET`, or `BETTER_AUTH_SECRET`), `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- `drizzle.config.ts` loads `.env`.
- Supabase uploads use bucket `vinix`.
- `next.config.ts` caps Server Action bodies at `3mb`.
- `next/image` only allows the hosts listed in `next.config.ts`.

## App Wiring
- `app/` is the App Router root; `@/*` maps to the repo root.
- `auth.ts` is the NextAuth v5 credentials setup; `app/api/auth/[...nextauth]/route.ts` only re-exports handlers.
- `db/schema.ts` is the Drizzle source of truth; migrations live in `drizzle/`.
- Use `safeAuth()` in server code that should treat auth failures as signed out.

## Marketplace Rules
- Roles are `admin`, `customer`, and `pengusaha`; the first registered account becomes `admin`.
- `pengusaha` can own at most 5 stores.
- Stores start `pending` and need admin approval before public visibility.
- Products belong to a store, use slug routes, can have multiple images, and start `pending` until approved.
- Public catalog shows only `active` stores and `approved` products.
- Product details live at `/toko/[storeSlug]/produk/[productSlug]`; legacy `/product/*` routes redirect to `/produk`.
- The dashboard is role-aware: pengusaha manages stores/products, admin moderates stores/products and writes mentoring notes, customer only browses.

## Location Form
- Store creation uses the external wilayah API in `components/dashboard/store-location-form.tsx`; it needs network access in the browser.
- The stored location is `province`, `regency`, `district`, `village`, plus freeform `address`.
