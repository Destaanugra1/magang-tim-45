# Gemini Project Context: E-Commerce Platform (UMKM Lampung)

This project is a Next.js-based e-commerce platform designed for local businesses (UMKM), specifically targeting the Lampung province. It features a robust multi-role system (admin, customer, entrepreneur) and handles store/product management with moderation workflows.

## 🛠 Tech Stack

- **Framework:** [Next.js 16.2.4](https://nextjs.org/) (App Router, React 19)
- **Authentication:** [Auth.js v5](https://authjs.dev/) (NextAuth.js)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Storage:** [Supabase Storage](https://supabase.com/storage) (Bucket: `vinix`)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **3D/Visuals:** [Three.js](https://threejs.org/) (@react-three/fiber, @react-three/drei)
- **Validation:** [Zod](https://zod.dev/)

## 📁 Project Structure

- `actions/`: Server Actions for all data mutations (products, stores, users, etc.).
- `app/`: Next.js App Router pages and layouts.
- `components/`: UI components, organized by domain (auth, dashboard, ui).
- `db/`: Database schema (`schema.ts`) and connection initialization.
- `lib/`: Shared utilities, Zod validation schemas, and core logic.
  - `lib/auth/`: Auth-specific logic including `safe-auth.ts`.
  - `lib/validation/`: Generic action state and form data helpers.
- `public/`: Static assets and 3D models.
- `scripts/`: Maintenance and migration scripts.
- `proxy.ts`: The request gate (replaces `middleware.ts`).

## 🚀 Key Commands

- **Development:** `npm run dev` (uses Turbopack by default)
- **Build:** `npm run build`
- **Linting:** `npm run lint`
- **Typecheck:** `npx tsc --noEmit`
- **Database Migrations:** `npx drizzle-kit push` or `npx drizzle-kit migrate`.

## ⚖️ Development Conventions

### Next.js 16 Specifics
- `params` and `searchParams` in pages and layouts are **Promises**; they must be `await`-ed.
- Turbopack is used for dev and build.
- Server Action bodies are capped at `3mb` (configured in `next.config.ts`).

### Authentication & Authorization
- Use `safeAuth()` from `@/lib/auth/safe-auth` in Server Actions to retrieve the session securely.
- Roles: `admin`, `customer`, `pengusaha` (entrepreneur).
- The first registered account automatically becomes an `admin`.
- Always verify ownership before allowing updates/deletions.

### Marketplace & Business Rules
- **Store Ownership:** A `pengusaha` can own at most 5 stores.
- **Moderation:** Stores and products start in `pending` status. They require `admin` approval to be publicly visible.
- **Visibility:** The public catalog only displays `active` stores and `approved` products.
- **Routing:** 
  - Product details: `/toko/[storeSlug]/produk/[productSlug]`.
  - Legacy `/product/*` routes redirect to `/produk`.
- **Location:** Store creation uses an external wilayah API for `province`, `regency`, `district`, and `village`.

### Data Mutations (Server Actions)
- All mutations must live in the `actions/` directory.
- Use Zod schemas for input validation.
- Return an action state containing `success` and `message`.
- Call `revalidatePath()` after successful mutations.

### Media Handling
- Images are stored in the `vinix` bucket on Supabase.
- Max image size: 2MB. Allowed types: JPG, PNG, WEBP.
- Use `supabaseAdmin` for server-side operations.

## 🗺 Data Model Highlights
- **Users:** Role-based access.
- **Stores:** Linked to `ownerId`, includes moderation fields (`status`, `adminNote`).
- **Products:** Linked to `storeId`, includes price (numeric), category, and moderation status.
- **Product Images:** Supports multiple images with `sortOrder` and `isPrimary`.
- **Mentoring Notes:** Admin feedback to entrepreneurs.
- **WhatsApp Clicks:** Analytics for "Contact via WhatsApp" engagement.

## 🌐 Localization & Context
- Default context: **Lampung**, Indonesia.
- UI uses Indonesian terminology (e.g., *Pengusaha*, *Toko*, *Produk*).
