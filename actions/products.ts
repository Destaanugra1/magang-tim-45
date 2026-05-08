"use server";

import { Buffer } from "node:buffer";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";
import {
  createProductSchema,
  getCreateProductInput,
  getUpdateProductInput,
  type ProductActionState,
  updateProductSchema,
} from "@/lib/products/validation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createValidationErrorState } from "@/lib/validation/action-state";

const PRODUCT_BUCKET = "vinix";

function revalidateProductPages(productId?: string) {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/product");
  revalidatePath("/produk");

  if (productId) {
    revalidatePath(`/produk/${productId}`);
  }
}

export async function createProduct(
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await safeAuth();

  if (!session?.user) {
    return {
      success: false,
      message: "Silakan login terlebih dahulu.",
    };
  }

  if (session.user.role !== "admin") {
    return {
      success: false,
      message: "Hanya admin yang bisa menambah produk.",
    };
  }

  const validatedFields = createProductSchema.safeParse(
    getCreateProductInput(formData),
  );

  if (!validatedFields.success) {
    return createValidationErrorState(
      "Periksa kembali data produk.",
      validatedFields.error,
    );
  }

  const { image, ...payload } = validatedFields.data;
  const fileExtension = image.name.split(".").pop();
  const imagePath = `products/${crypto.randomUUID()}.${fileExtension}`;

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .upload(imagePath, buffer, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    return {
      success: false,
      message: `Gagal upload gambar: ${uploadError.message}`,
    };
  }

  const { data } = supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .getPublicUrl(imagePath);

  await db.insert(products).values({
    name: payload.name,
    description: payload.description,
    price: payload.price,
    imageUrl: data.publicUrl,
    imagePath,
  });

  revalidateProductPages();

  return {
    success: true,
    message: "Produk berhasil ditambahkan.",
  };
}

export async function updateProduct(
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await safeAuth();

  if (!session?.user) {
    return {
      success: false,
      message: "Silakan login terlebih dahulu.",
    };
  }

  if (session.user.role !== "admin") {
    return {
      success: false,
      message: "Hanya admin yang bisa mengubah produk.",
    };
  }

  const validatedFields = updateProductSchema.safeParse(
    getUpdateProductInput(formData),
  );

  if (!validatedFields.success) {
    return createValidationErrorState(
      "Periksa kembali data produk.",
      validatedFields.error,
    );
  }

  const { id: productId, ...payload } = validatedFields.data;
  const existingProduct = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!existingProduct) {
    return {
      success: false,
      message: "Produk tidak ditemukan.",
    };
  }

  await db
    .update(products)
    .set({
      name: payload.name,
      description: payload.description,
      price: payload.price,
    })
    .where(eq(products.id, productId));

  revalidateProductPages(productId);

  return {
    success: true,
    message: "Produk berhasil diperbarui.",
  };
}

export async function deleteProduct(productId: string): Promise<ProductActionState> {
  const session = await safeAuth();

  if (!session?.user || session.user.role !== "admin") {
    return {
      success: false,
      message: "Hanya admin yang bisa menghapus produk.",
    };
  }

  if (!productId) {
    return {
      success: false,
      message: "Produk tidak ditemukan.",
    };
  }

  const existingProduct = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!existingProduct) {
    return {
      success: false,
      message: "Produk tidak ditemukan.",
    };
  }

  const { error: storageError } = await supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .remove([existingProduct.imagePath]);

  if (storageError) {
    console.error("[deleteProduct] Failed to remove product image.", storageError);
  }

  await db.delete(products).where(eq(products.id, productId));

  revalidateProductPages(productId);

  return {
    success: true,
    message: "Produk berhasil dihapus.",
  };
}
