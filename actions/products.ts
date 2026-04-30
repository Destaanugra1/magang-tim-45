'use server'
import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products } from "@/db/schema";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type ProductActionState = {
  success: boolean;
  message: string;
};

const PRODUCT_BUCKET = "vinix";

export async function createProduct( 
    _prevState: ProductActionState, 
    formDate: FormData
): Promise<ProductActionState> {
    const name = String(formDate.get('name') || '').trim();
    const description = String(formDate.get("description") || "").trim();
    const price = String(formDate.get("price") || "").trim();
    const image = formDate.get("image");

    if (!name) {
    return {
      success: false,
      message: "Nama produk wajib diisi.",
    };
  }

  if (!price) {
    return {
      success: false,
      message: "Harga produk wajib diisi.",
    };
  }

  if (Number(price) <= 0) {
    return {
      success: false,
      message: "Harga produk harus lebih dari 0.",
    };
  }

  if (!(image instanceof File) || image.size === 0) {
    return {
      success: false,
      message: "Gambar produk wajib diupload.",
    };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(image.type)) {
    return {
      success: false,
      message: "Format gambar harus JPG, PNG, atau WEBP.",
    };
  }

  const maxSize = 2 * 1024 * 1024;

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
    name,
    description,
    price,
    imageUrl: data.publicUrl,
    imagePath,
  });

  revalidatePath("/");
  revalidatePath("/product");

  return {
    success: true,
    message: "Produk berhasil ditambahkan.",
  };
}
