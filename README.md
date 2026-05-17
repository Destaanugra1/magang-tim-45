# UMKM Marketplace

Next.js 16 app untuk katalog UMKM berbasis lokasi, dashboard per role, dan order lewat WhatsApp.

## Fungsi Utama
- Customer cari produk/toko berdasarkan lokasi.
- Pengusaha buat maksimal 5 toko, lalu kelola produk miliknya sendiri.
- Admin approve/tolak toko, approve/tolak produk, menutup toko, menghapus produk, dan memberi mentoring.
- Detail produk memakai slug dan menampilkan banyak foto.
- Tombol beli membuka WhatsApp dengan pesan otomatis berisi detail produk dan link gambar.

## Role Dan Flow

### 1. Customer
- Daftar sebagai `customer`.
- Buka `/produk` untuk mencari produk.
- Filter dengan kata kunci, lokasi, dan kategori.
- Buka detail di `/toko/[storeSlug]/produk/[productSlug]`.
- Klik `Beli via WhatsApp` untuk lanjut pesan ke nomor toko.

### 2. Pengusaha
- Daftar sebagai `pengusaha`.
- Masuk ke `/dashboard`.
- Buat toko di form dashboard.
- Isi wilayah memakai dropdown API wilayah Indonesia.
- Simpan `province`, `regency`, `district`, `village`, dan alamat detail.
- Setelah toko `active`, pengusaha bisa tambah produk.
- Produk punya banyak foto, slug sendiri, dan terhubung ke 1 toko.
- Edit produk mengikuti flow server action yang aktif di kode, lalu status tampilannya dikelola lewat dashboard admin.

### 3. Admin
- Akun pertama yang registrasi menjadi `admin`.
- Admin melihat dashboard moderasi.
- Admin bisa:
  - approve/tolak toko
  - suspend/close toko
  - approve/tolak/remove produk
  - tulis catatan mentoring
  - lihat statistik user/toko/produk

## Route Penting
- `/` homepage
- `/produk` katalog publik
- `/toko/[storeSlug]` detail toko
- `/toko/[storeSlug]/produk/[productSlug]` detail produk
- `/kategori/[locationSlug]` pintasan lokasi
- `/dashboard` dashboard role-aware
- `/dashboard/login` login
- `/register` registrasi
- `/team` dan `/team/[id]` halaman tim
- `/books` dan `/books/[id]` halaman buku demo

## Alur Data
- `users` menyimpan role: `admin`, `customer`, `pengusaha`.
- `stores` milik `pengusaha`.
- `products` milik `stores`.
- `product_images` menyimpan banyak foto per produk.
- `categories` dipakai di dashboard pengusaha.
- `notifications` dipakai dashboard.
- `whatsapp_clicks` menyimpan klik CTA WhatsApp.

## Auth Dan Proteksi
- NextAuth v5 credentials ada di `auth.ts`.
- Request gating ada di `proxy.ts`.
- `proxy.ts` menjaga `/dashboard`, `/dashboard/login`, dan `/register`.
- `safeAuth()` dipakai di server code yang harus menganggap gagal auth sebagai signed out.

## Location Form
- Form toko memakai API wilayah Indonesia di browser.
- Urutan input: provinsi -> kabupaten/kota -> kecamatan -> desa/kelurahan -> alamat detail.
- Data lokasi disimpan sebagai teks, bukan relasi tabel wilayah.

## Image Dan Upload
- Foto produk disimpan ke Supabase bucket `vinix`.
- Halaman buku dan beberapa gambar eksternal memakai `next/image` `unoptimized` agar tidak memicu upstream fetch error.
- Host gambar eksternal yang boleh dipakai harus ada di `next.config.ts`.

## Migrations Dan Database
- Schema sumber utama ada di `db/schema.ts`.
- Migration SQL ada di `drizzle/`.
- `drizzle.config.ts` membaca `.env`.
- Jalankan migrasi dengan `npx drizzle-kit migrate`.

## Commands
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npx tsc --noEmit`
- `npx drizzle-kit migrate`

## Env Yang Dibutuhkan
- `DATABASE_URL`
- Salah satu auth secret: `AUTH_SECRET`, `NEXTAUTH_SECRET`, atau `BETTER_AUTH_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Catatan Praktis
- App Router props `params` dan `searchParams` di Next 16 adalah Promise, jadi harus `await`.
- `next dev` dan `next build` memakai Turbopack.
- Jangan buat `middleware.ts`; gunakan `proxy.ts`.
