import { and, desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { productImages, products, stores } from "@/db/schema";

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await db.query.stores.findFirst({
    where: and(eq(stores.slug, storeSlug), eq(stores.status, "active")),
  });

  if (!store) {
    notFound();
  }

  const productList = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.description,
      category: products.category,
      price: products.price,
      imageUrl: productImages.imageUrl,
    })
    .from(products)
    .leftJoin(
      productImages,
      and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)),
    )
    .where(and(eq(products.storeId, store.id), eq(products.status, "approved")))
    .orderBy(desc(products.createdAt));

  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-28 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border bg-slate-50 p-8 shadow-sm">
          <p className="inline-flex rounded-full border bg-white px-4 py-2 text-sm text-slate-600">
            {[store.village, store.district, store.regency, store.province]
              .filter(Boolean)
              .join(", ")}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">{store.name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            {store.description}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Alamat: {[store.address, store.village, store.district, store.regency, store.province]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-semibold">Produk toko</h2>
        {productList.length === 0 ? (
          <p className="mt-5 rounded-3xl border bg-slate-50 p-8 text-slate-500">
            Belum ada produk approved.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productList.map((product) => (
              <Link
                key={product.id}
                href={`/toko/${store.slug}/produk/${product.slug}`}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-52 bg-slate-100">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill quality={90} className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  ) : null}
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-500">{product.category}</p>
                  <h3 className="mt-2 font-semibold">{product.name}</h3>
                  <p className="mt-3 font-semibold">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
