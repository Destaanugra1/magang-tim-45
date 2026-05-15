import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Store, Tag, MessageCircle } from "lucide-react";
import { db } from "@/db";
import { productImages, products, stores } from "@/db/schema";
import { ProductGallery } from "@/components/ui/product-gallery";

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
      province: stores.province,
      regency: stores.regency,
      district: stores.district,
      village: stores.village,
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

  if (!product) notFound();

  const images = await db
    .select({ id: productImages.id, imageUrl: productImages.imageUrl })
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.sortOrder);

  const locationParts = [product.village, product.district, product.regency, product.province].filter(Boolean);
  const fullAddress = [product.storeAddress, ...locationParts].filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-[#f8f8f6] pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Back */}
        <Link
          href={`/toko/${product.storeSlug}`}
          className="mb-10 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke toko
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14 items-start">

          {/* ── Gallery ── */}
          <ProductGallery images={images} productName={product.name} />

          {/* ── Info ── */}
          <div className="flex flex-col">

            {/* Category + Store */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1">
                <Tag className="h-3 w-3" /> {product.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1">
                <Store className="h-3 w-3" /> {product.storeName}
              </span>
            </div>

            {/* Name */}
            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-slate-900 lg:text-4xl">
              {product.name}
            </h1>

            {/* Location */}
            {locationParts.length > 0 && (
              <p className="mt-3 flex items-start gap-1.5 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {locationParts.join(", ")}
              </p>
            )}

            {/* Divider */}
            <div className="my-6 h-px bg-slate-200" />

            {/* Price */}
            <p className="text-4xl font-bold tracking-tight text-slate-900">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>

            {/* Description */}
            <p className="mt-6 text-[15px] leading-relaxed text-slate-600">
              {product.description || "Tidak ada deskripsi produk."}
            </p>

            {/* Divider */}
            <div className="my-8 h-px bg-slate-200" />

            {/* CTA */}
            <a
              href={`/api/whatsapp-click?productId=${product.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              Hubungi via WhatsApp
            </a>

            {/* Store detail strip */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Toko</p>
              <p className="mt-1 font-medium text-slate-800">{product.storeName}</p>
              {fullAddress && (
                <p className="mt-0.5 text-sm text-slate-500">{fullAddress}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
