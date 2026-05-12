import { and, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { productImages, products, stores } from "@/db/schema";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export default async function ProductSlugDetailPage({
  params,
}: {
  params: Promise<{ storeSlug: string; productSlug: string }>;
}) {
  const { storeSlug, productSlug } = await params;
  const [product] = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.description,
      category: products.category,
      price: products.price,
      storeName: stores.name,
      storeSlug: stores.slug,
      storeAddress: stores.address,
      regency: stores.regency,
      district: stores.district,
      whatsappNumber: stores.whatsappNumber,
    })
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .where(
      and(
        eq(stores.slug, storeSlug),
        eq(stores.status, "active"),
        eq(products.slug, productSlug),
        eq(products.status, "approved"),
      ),
    );

  if (!product) {
    notFound();
  }

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.sortOrder);
  const primaryImage = images[0]?.imageUrl ?? "";
  const productPath = `/toko/${product.storeSlug}/produk/${product.slug}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const productUrl = `${appUrl}${productPath}`;
  const whatsappUrl = createWhatsAppUrl(
    product.whatsappNumber,
    [
      "Halo, saya mau pesan produk ini:",
      `Produk: ${product.name}`,
      `Harga: Rp ${Number(product.price).toLocaleString("id-ID")}`,
      `Toko: ${product.storeName}`,
      `Alamat: ${product.storeAddress}, ${product.district}, ${product.regency}`,
      `Link produk: ${productUrl}`,
      primaryImage ? `Foto utama: ${primaryImage}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-28 text-slate-900">
      <section className="mx-auto max-w-6xl">
        <Link
          href={`/toko/${product.storeSlug}`}
          className="mb-8 inline-flex rounded-full border px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
        >
          Kembali ke toko
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-slate-100">
              {primaryImage ? (
                <Image src={primaryImage} alt={product.name} fill priority unoptimized className="object-cover" sizes="(min-width: 1024px) 55vw, 100vw" />
              ) : null}
            </div>
            {images.length > 1 ? (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {images.map((image) => (
                  <div key={image.id} className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                    <Image src={image.imageUrl} alt={product.name} fill unoptimized className="object-cover" sizes="120px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-center rounded-[2rem] border bg-slate-50 p-8">
            <p className="inline-flex w-fit rounded-full border bg-white px-4 py-2 text-sm text-slate-600">
              {product.category}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight">{product.name}</h1>
            <p className="mt-3 text-sm text-slate-500">
              {product.storeName} | {product.district}, {product.regency}
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {product.description || "Tidak ada deskripsi."}
            </p>
            <p className="mt-8 text-3xl font-semibold">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex justify-center rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Beli via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
