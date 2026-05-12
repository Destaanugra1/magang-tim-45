import { and, desc, eq, ilike, or } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { productImages, products, stores } from "@/db/schema";
import { db } from "@/db";
import { createSlug } from "@/lib/slug";

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lokasi?: string; kategori?: string }>;
}) {
  const { q, lokasi, kategori } = await searchParams;
  const query = q?.trim() ?? "";
  const location = lokasi?.trim() ?? "";
  const category = kategori?.trim() ?? "";

  const productList = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.description,
      category: products.category,
      price: products.price,
      storeName: stores.name,
      storeSlug: stores.slug,
      regency: stores.regency,
      district: stores.district,
      imageUrl: productImages.imageUrl,
    })
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .leftJoin(
      productImages,
      and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)),
    )
    .where(
      and(
        eq(stores.status, "active"),
        eq(products.status, "approved"),
        query
          ? or(
              ilike(products.name, `%${query}%`),
              ilike(products.description, `%${query}%`),
              ilike(stores.name, `%${query}%`),
            )
          : undefined,
        location ? ilike(stores.regency, `%${location}%`) : undefined,
        category ? ilike(products.category, `%${category}%`) : undefined,
      ),
    )
    .orderBy(desc(products.createdAt));

  const locations = Array.from(new Set(productList.map((product) => product.regency)));

  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-28 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium text-slate-600">
            marketplace UMKM
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Cari produk UMKM berdasarkan lokasi
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Produk yang tampil sudah disetujui admin dan bisa dipesan langsung
            ke WhatsApp toko tanpa checkout di website.
          </p>
        </div>

        <form className="mb-8 grid gap-3 rounded-3xl border bg-slate-50 p-4 md:grid-cols-4">
          <input
            name="q"
            defaultValue={query}
            placeholder="Cari produk atau toko"
            className="rounded-2xl border bg-white px-4 py-3"
          />
          <input
            name="lokasi"
            defaultValue={location}
            placeholder="Contoh: Lampung Utara"
            className="rounded-2xl border bg-white px-4 py-3"
          />
          <input
            name="kategori"
            defaultValue={category}
            placeholder="Kategori"
            className="rounded-2xl border bg-white px-4 py-3"
          />
          <button className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
            Cari
          </button>
        </form>

        {locations.length > 0 ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {locations.map((item) => (
              <Link
                key={item}
                href={`/kategori/${createSlug(item)}`}
                className="rounded-full border px-4 py-2 text-sm text-slate-600 hover:border-slate-900 hover:text-slate-900"
              >
                {item}
              </Link>
            ))}
          </div>
        ) : null}

        {productList.length === 0 ? (
          <div className="rounded-3xl border bg-slate-50 p-8 text-slate-500 shadow-sm">
            Produk belum tersedia untuk pencarian ini.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productList.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href={`/toko/${product.storeSlug}/produk/${product.slug}`}>
                  <div className="relative h-56 bg-slate-100">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover"
                        unoptimized
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : null}
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">{product.category}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {product.regency}
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {product.storeName} | {product.district}
                  </p>
                  <p className="mt-3 font-semibold text-slate-900">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>
                  <Link
                    href={`/toko/${product.storeSlug}/produk/${product.slug}`}
                    className="mt-5 inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
