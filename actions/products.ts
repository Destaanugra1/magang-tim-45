"use server";
import { Buffer } from "node:buffer";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { safeAuth } from "@/lib/auth/safe-auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type ProductActionState = {
  success: boolean;
  message: string;
};

const PRODUCT_BUCKET = "vinix";
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 2 * 1024 * 1024;
type ValidatedProductFields =
  | ProductActionState
  | {
      name: string;
      description: string;
      price: string;
    };

function validateProductFields(formData: FormData): ValidatedProductFields {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = String(formData.get("price") || "").trim();

  if (!name) {
    return {
      success: false as const,
      message: "Nama produk wajib diisi.",
    };
  }

  if (!price) {
    return {
      success: false as const,
      message: "Harga produk wajib diisi.",
    };
  }

  if (Number(price) <= 0) {
    return {
      success: false as const,
      message: "Harga produk harus lebih dari 0.",
    };
  }

  return {
    name,
    description,
    price,
  };
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

  const payload = validateProductFields(formData);
  if ("success" in payload) {
    return payload;
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return {
      success: false,
      message: "Gambar produk wajib diupload.",
    };
  }

  if (!allowedTypes.includes(image.type)) {
    return {
      success: false,
      message: "Format gambar harus JPG, PNG, atau WEBP.",
    };
  }

  if (image.size > maxSize) {
    return {
      success: false,
      message: "Ukuran gambar maksimal 2MB.",
    };
  }

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

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/product");

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

  const productId = String(formData.get("id") || "").trim();
  if (!productId) {
    return {
      success: false,
      message: "Produk tidak ditemukan.",
    };
  }

  const payload = validateProductFields(formData);
  if ("success" in payload) {
    return payload;
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

  await db
    .update(products)
    .set({
      name: payload.name,
      description: payload.description,
      price: payload.price,
    })
    .where(eq(products.id, productId));

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/product");

  return {
    success: true,
    message: "Produk berhasil diperbarui.",
  };
}

export async function deleteProduct(productId: string) {
  const session = await safeAuth();

  if (!session?.user || session.user.role !== "admin") {
    return;
  }

  if (!productId) {
    return;
  }

  const existingProduct = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!existingProduct) {
    return;
  }

  const { error: storageError } = await supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .remove([existingProduct.imagePath]);

  if (storageError) {
    console.error("[deleteProduct] Failed to remove product image.", storageError);
  }

  await db.delete(products).where(eq(products.id, productId));

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/product");
}
