"use server";

import { Buffer } from "node:buffer";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { notifications, productImages, products, stores } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";
import { withSlugFallback } from "@/lib/slug";
import {
  createProductSchema,
  getCreateProductInput,
  getProductModerationInput,
  getUpdateProductInput,
  productImageMaxSize,
  productImageTypes,
  productModerationSchema,
  type ProductActionState,
  updateProductSchema,
} from "@/lib/products/validation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createValidationErrorState } from "@/lib/validation/action-state";
import { getFormDataFiles } from "@/lib/validation/form-data";

const PRODUCT_BUCKET = "vinix";

function revalidateProductPages() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/product");
  revalidatePath("/produk");
  revalidatePath("/toko");
}

async function createUniqueProductSlug(storeId: string, name: string) {
  const baseSlug = withSlugFallback(name, "produk");

  for (let index = 0; index < 20; index += 1) {
    const candidate = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`;
    const existingProduct = await db.query.products.findFirst({
      where: and(eq(products.storeId, storeId), eq(products.slug, candidate)),
    });

    if (!existingProduct) {
      return candidate;
    }
  }

  return `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
}

async function uploadProductImage(image: File, productId: string, sortOrder: number) {
  const fileExtension = image.name.split(".").pop() || "webp";
  const imagePath = `products/${productId}/${crypto.randomUUID()}.${fileExtension}`;
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .upload(imagePath, buffer, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .getPublicUrl(imagePath);

  return {
    productId,
    imagePath,
    imageUrl: data.publicUrl,
    sortOrder,
    isPrimary: sortOrder === 0,
  };
}

async function getOwnedStore(storeId: string, ownerId: string) {
  return db.query.stores.findFirst({
    where: and(eq(stores.id, storeId), eq(stores.ownerId, ownerId)),
  });
}

function validateProductImages(images: File[]) {
  if (images.length > 5) {
    return "Maksimal 5 gambar produk.";
  }

  for (const image of images) {
    if (!productImageTypes.includes(image.type as (typeof productImageTypes)[number])) {
      return "Format gambar harus JPG, PNG, atau WEBP.";
    }

    if (image.size > productImageMaxSize) {
      return "Ukuran gambar maksimal 2MB.";
    }
  }

  return null;
}

async function replaceProductImages(productId: string, images: File[]) {
  const uploadedImages = await Promise.all(
    images.map((image, index) => uploadProductImage(image, productId, index)),
  );

  const oldImages = await db
    .select({ imagePath: productImages.imagePath })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  await db.delete(productImages).where(eq(productImages.productId, productId));
  await db.insert(productImages).values(uploadedImages);

  if (oldImages.length > 0) {
    const { error } = await supabaseAdmin.storage
      .from(PRODUCT_BUCKET)
      .remove(oldImages.map((image) => image.imagePath));

    if (error) {
      console.error("[replaceProductImages] Failed to remove old images.", error);
    }
  }
}

export async function createProduct(
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await safeAuth();

  if (!session?.user || session.user.role !== "pengusaha") {
    return {
      success: false,
      message: "Hanya pengusaha yang bisa menambah produk.",
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

  const { images, storeId, ...payload } = validatedFields.data;
  const store = await getOwnedStore(storeId, session.user.id);

  if (!store) {
    return {
      success: false,
      message: "Toko tidak ditemukan atau bukan milik akun ini.",
    };
  }

  if (store.status !== "active") {
    return {
      success: false,
      message: "Toko harus aktif dulu sebelum menambah produk.",
    };
  }

  const [createdProduct] = await db
    .insert(products)
    .values({
      ...payload,
      storeId: store.id,
      slug: await createUniqueProductSlug(store.id, payload.name),
      status: "approved",
    })
    .returning({ id: products.id });

  try {
    const uploadedImages = await Promise.all(
      images.map((image, index) => uploadProductImage(image, createdProduct.id, index)),
    );

    await db.insert(productImages).values(uploadedImages);
  } catch (error) {
    await db.delete(products).where(eq(products.id, createdProduct.id));

    return {
      success: false,
      message: `Gagal upload gambar: ${
        error instanceof Error ? error.message : "coba lagi"
      }`,
    };
  }

  revalidateProductPages();

  return {
    success: true,
    message: "Produk berhasil ditambahkan dan langsung aktif.",
  };
}

export async function createProductFromForm(formData: FormData) {
  await createProduct({ success: false, message: "" }, formData);
}

export async function updateProduct(
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await safeAuth();

  if (!session?.user || session.user.role !== "pengusaha") {
    return {
      success: false,
      message: "Hanya pengusaha yang bisa mengubah produk.",
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
  const replacementImages = getFormDataFiles(formData, "images").filter(
    (image) => image.size > 0,
  );
  const imageError = validateProductImages(replacementImages);

  if (imageError) {
    return {
      success: false,
      message: imageError,
    };
  }

  const [existingProduct] = await db
    .select({ id: products.id, ownerId: stores.ownerId })
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .where(eq(products.id, productId));

  if (!existingProduct) {
    return {
      success: false,
      message: "Produk tidak ditemukan.",
    };
  }

  if (existingProduct.ownerId !== session.user.id) {
    return {
      success: false,
      message: "Produk ini bukan milik akun kamu.",
    };
  }

  await db
    .update(products)
    .set({
      ...payload,
      status: "pending",
    })
    .where(eq(products.id, productId));

  if (replacementImages.length > 0) {
    try {
      await replaceProductImages(productId, replacementImages);
    } catch (error) {
      return {
        success: false,
        message: `Gagal update gambar: ${
          error instanceof Error ? error.message : "coba lagi"
        }`,
      };
    }
  }

  revalidateProductPages();

  return {
    success: true,
    message: "Produk berhasil diperbarui dan perlu approval ulang.",
  };
}

export async function deleteProduct(productId: string): Promise<ProductActionState> {
  const session = await safeAuth();

  if (!session?.user) {
    return {
      success: false,
      message: "Silakan login terlebih dahulu.",
    };
  }

  if (!productId) {
    return {
      success: false,
      message: "Produk tidak ditemukan.",
    };
  }

  const [existingProduct] = await db
    .select({ id: products.id, ownerId: stores.ownerId })
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .where(eq(products.id, productId));

  if (!existingProduct) {
    return {
      success: false,
      message: "Produk tidak ditemukan.",
    };
  }

  if (session.user.role !== "admin" && existingProduct.ownerId !== session.user.id) {
    return {
      success: false,
      message: "Produk ini bukan milik akun kamu.",
    };
  }

  const images = await db
    .select({ imagePath: productImages.imagePath })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  if (images.length > 0) {
    const { error: storageError } = await supabaseAdmin.storage
      .from(PRODUCT_BUCKET)
      .remove(images.map((image) => image.imagePath));

    if (storageError) {
      console.error("[deleteProduct] Failed to remove product images.", storageError);
    }
  }

  await db.delete(products).where(eq(products.id, productId));

  revalidateProductPages();

  return {
    success: true,
    message: "Produk berhasil dihapus.",
  };
}

export async function deleteProductFromForm(formData: FormData) {
  const productId = formData.get("id");

  if (typeof productId === "string") {
    await deleteProduct(productId);
  }
}

export async function updateProductStatus(
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await safeAuth();

  if (!session?.user || session.user.role !== "admin") {
    return {
      success: false,
      message: "Hanya admin yang bisa mengubah status produk.",
    };
  }

  const validatedFields = productModerationSchema.safeParse(
    getProductModerationInput(formData),
  );

  if (!validatedFields.success) {
    return createValidationErrorState(
      "Periksa kembali status produk.",
      validatedFields.error,
    );
  }

  const [existingProduct] = await db
    .select({
      name: products.name,
      ownerId: stores.ownerId,
    })
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .where(eq(products.id, validatedFields.data.id));

  if (!existingProduct) {
    return {
      success: false,
      message: "Produk tidak ditemukan.",
    };
  }

  await db
    .update(products)
    .set({
      status: validatedFields.data.status,
      adminNote: validatedFields.data.adminNote || null,
    })
    .where(eq(products.id, validatedFields.data.id));

  await db.insert(notifications).values({
    userId: existingProduct.ownerId,
    type: "product_status",
    title: "Status produk diperbarui",
    message: `Produk ${existingProduct.name} sekarang ${validatedFields.data.status}.${
      validatedFields.data.adminNote ? ` Catatan: ${validatedFields.data.adminNote}` : ""
    }`,
  });

  revalidateProductPages();

  return {
    success: true,
    message: "Status produk berhasil diperbarui.",
  };
}

export async function updateProductStatusFromForm(formData: FormData) {
  await updateProductStatus({ success: false, message: "" }, formData);
}

export async function updateProductFromForm(formData: FormData) {
  return updateProduct({ success: false, message: "" }, formData);
}
