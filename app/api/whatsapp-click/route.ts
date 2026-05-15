import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, stores, whatsappClicks } from "@/db/schema";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  const storeId = request.nextUrl.searchParams.get("storeId");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (productId) {
    const [product] = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        price: products.price,
        storeId: stores.id,
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
          eq(products.id, productId),
          eq(products.status, "approved"),
          eq(stores.status, "active"),
        ),
      );

    if (!product) {
      return NextResponse.redirect(new URL("/produk", request.url));
    }

    await db.insert(whatsappClicks).values({
      productId: product.id,
      storeId: product.storeId,
    });

    const productUrl = `${appUrl}/toko/${product.storeSlug}/produk/${product.slug}`;
    const location = [product.village, product.district, product.regency, product.province]
      .filter(Boolean)
      .join(", ");
    const fullAddress = [product.storeAddress, location].filter(Boolean).join(", ");
    const whatsappUrl = createWhatsAppUrl(
      product.whatsappNumber,
      [
        "Halo, saya tertarik dengan produk ini:",
        `Produk: ${product.name}`,
        `Harga: Rp ${Number(product.price).toLocaleString("id-ID")}`,
        `Toko: ${product.storeName}`,
        fullAddress ? `Alamat: ${fullAddress}` : "",
        `Link: ${productUrl}`,
      ].filter(Boolean).join("\n"),
    );

    return NextResponse.redirect(whatsappUrl);
  }

  if (storeId) {
    const store = await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.status, "active")),
    });

    if (!store) {
      return NextResponse.redirect(new URL("/produk", request.url));
    }

    await db.insert(whatsappClicks).values({ storeId: store.id });

    return NextResponse.redirect(
      createWhatsAppUrl(
        store.whatsappNumber,
        `Halo, saya ingin bertanya tentang toko ${store.name}.`,
      ),
    );
  }

  return NextResponse.redirect(new URL("/produk", request.url));
}
