import { and, desc, eq, ilike, or } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, Package, Store } from "lucide-react";
import { productImages, products, stores, users } from "@/db/schema";
import { db } from "@/db";
import { FormInput } from "@/components/ui/form-field";

type StoreCard = {
  id: string;
  slug: string;
  name: string;
  description: string;
  regency: string;
  province: string;
  district: string;
  village: string;
  whatsappNumber: string;
  ownerPhotoUrl: string | null;
  products: {
    id: string;
    slug: string;
    name: string;
    category: string;
    price: string;
    imageUrl: string | null;
  }[];
};

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lokasi?: string; kategori?: string }>;
}) {
  const { q, lokasi, kategori } = await searchParams;
  const query = q?.trim() ?? "";
  const location = lokasi?.trim() ?? "";
  const category = kategori?.trim() ?? "";

  const rows = await db
    .select({
      storeId: stores.id,
      storeSlug: stores.slug,
      storeName: stores.name,
      storeDescription: stores.description,
      storeRegency: stores.regency,
      storeProvince: stores.province,
      storeDistrict: stores.district,
      storeVillage: stores.village,
      storeWhatsapp: stores.whatsappNumber,
      ownerPhotoUrl: users.photoUrl,
      productId: products.id,
      productSlug: products.slug,
      productName: products.name,
      productCategory: products.category,
      productPrice: products.price,
      productImageUrl: productImages.imageUrl,
    })
    .from(stores)
    .innerJoin(users, eq(stores.ownerId, users.id))
    .leftJoin(
      products,
      and(eq(products.storeId, stores.id), eq(products.status, "approved")),
    )
    .leftJoin(
      productImages,
      and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)),
    )
    .where(
      and(
        eq(stores.status, "active"),
        query
          ? or(
              ilike(stores.name, `%${query}%`),
              ilike(stores.description, `%${query}%`),
              ilike(products.name, `%${query}%`),
            )
          : undefined,
        location
          ? or(
              ilike(stores.province, `%${location}%`),
              ilike(stores.regency, `%${location}%`),
              ilike(stores.district, `%${location}%`),
              ilike(stores.village, `%${location}%`),
            )
          : undefined,
        category ? ilike(products.category, `%${category}%`) : undefined,
      ),
    )
    .orderBy(desc(stores.createdAt));

  const storeMap = new Map<string, StoreCard>();
  for (const row of rows) {
    if (!storeMap.has(row.storeId)) {
      storeMap.set(row.storeId, {
        id: row.storeId,
        slug: row.storeSlug,
        name: row.storeName,
        description: row.storeDescription,
        regency: row.storeRegency,
        province: row.storeProvince,
        district: row.storeDistrict,
        village: row.storeVillage,
        whatsappNumber: row.storeWhatsapp,
        ownerPhotoUrl: row.ownerPhotoUrl,
        products: [],
      });
    }
    if (row.productId) {
      const store = storeMap.get(row.storeId)!;
      const alreadyAdded = store.products.some((p) => p.id === row.productId);
      if (!alreadyAdded) {
        store.products.push({
          id: row.productId,
          slug: row.productSlug!,
          name: row.productName!,
          category: row.productCategory!,
          price: row.productPrice!,
          imageUrl: row.productImageUrl ?? null,
        });
      }
    }
  }
  const storeList = Array.from(storeMap.values());
  const locations = Array.from(new Set(storeList.map((s) => s.regency)));

  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-28 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium text-slate-600">
            marketplace UMKM
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Temukan toko UMKM terpercaya
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Toko yang tampil sudah diverifikasi admin. Pesan produk langsung
            ke WhatsApp tanpa checkout di website.
          </p>
        </div>

        <form className="mb-8 grid gap-3 rounded-3xl border bg-slate-50 p-4 md:grid-cols-4">
          <FormInput
            label="Cari toko atau produk"
            hideLabel
            name="q"
            defaultValue={query}
            placeholder="Cari nama toko atau produk"
            inputClassName="bg-white focus:bg-white"
          />
          <FormInput
            label="Lokasi"
            hideLabel
            name="lokasi"
            defaultValue={location}
            placeholder="Contoh: Lampung Utara"
            inputClassName="bg-white focus:bg-white"
          />
          <FormInput
            label="Kategori produk"
            hideLabel
            name="kategori"
            defaultValue={category}
            placeholder="Kategori produk"
            inputClassName="bg-white focus:bg-white"
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
                href={`/produk?lokasi=${encodeURIComponent(item)}`}
                className="rounded-full border px-4 py-2 text-sm text-slate-600 hover:border-slate-900 hover:text-slate-900"
              >
                {item}
              </Link>
            ))}
          </div>
        ) : null}

        {storeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border bg-slate-50 p-12 text-center shadow-sm">
            <Store className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-700">Toko belum tersedia</p>
            <p className="mt-2 text-sm text-slate-500">Coba kata kunci atau lokasi yang berbeda.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {storeList.map((store) => (
              <article
                key={store.id}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Store Profile Banner */}
                <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200">
                  {store.ownerPhotoUrl ? (
                    <Image
                      src={store.ownerPhotoUrl}
                      alt={store.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Store className="h-14 w-14 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="truncate text-lg font-bold text-white drop-shadow">
                      {store.name}
                    </h2>
                    <p className="flex items-center gap-1 text-xs text-white/80">
                      <MapPin className="h-3 w-3" />
                      {[store.regency, store.province].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>

                {/* Store Info */}
                <div className="px-4 pt-3 pb-1">
                  <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                    {store.description}
                  </p>
                </div>

                {/* Products inside card */}
                {store.products.length > 0 ? (
                  <div className="px-4 pt-2">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Produk toko
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {store.products.slice(0, 4).map((product) => (
                        <Link
                          key={product.id}
                          href={`/toko/${store.slug}/produk/${product.slug}`}
                          className="group overflow-hidden rounded-2xl border bg-slate-50 transition hover:border-slate-300 hover:bg-white"
                        >
                          <div className="relative h-20 bg-slate-100">
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                quality={85}
                                className="object-cover"
                                sizes="(min-width: 640px) 150px, 50vw"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package className="h-6 w-6 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="truncate text-xs font-medium text-slate-800 group-hover:text-primary">
                              {product.name}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold text-slate-900">
                              Rp {Number(product.price).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {store.products.length > 4 ? (
                      <p className="mt-2 text-center text-xs text-slate-400">
                        +{store.products.length - 4} produk lainnya
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="mx-4 mt-2 rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-400">Belum ada produk tersedia.</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 p-4">
                  <Link
                    href={`/toko/${store.slug}`}
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Lihat Toko
                  </Link>
                  <a
                    href={`/api/whatsapp-click?storeId=${store.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WA
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
