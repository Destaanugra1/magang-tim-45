import { z } from "zod";
import type { ActionState } from "@/lib/validation/action-state";
import { getFormDataFiles, getFormDataString } from "@/lib/validation/form-data";

export const productImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const productImageMaxSize = 2 * 1024 * 1024;

const productDetailsSchema = z.object({
  storeId: z.string().trim().min(1, "Pilih toko terlebih dahulu."),
  name: z.string().trim().min(1, "Nama produk wajib diisi."),
  description: z.string().trim(),
  category: z.string().trim().min(2, "Kategori wajib diisi."),
  price: z
    .string()
    .trim()
    .min(1, "Harga produk wajib diisi.")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Harga produk harus berupa angka.",
    })
    .refine((value) => Number(value) > 0, {
      message: "Harga produk harus lebih dari 0.",
    }),
});

const productImageSchema = z
  .custom<File>((value) => value instanceof File, {
    message: "Gambar produk wajib diupload.",
  })
  .refine((image) => image.size > 0, {
    message: "Gambar produk wajib diupload.",
  })
  .refine(
    (image) =>
      productImageTypes.includes(
        image.type as (typeof productImageTypes)[number],
      ),
    {
      message: "Format gambar harus JPG, PNG, atau WEBP.",
    },
  )
  .refine((image) => image.size <= productImageMaxSize, {
    message: "Ukuran gambar maksimal 2MB.",
  });

export const createProductSchema = productDetailsSchema.extend({
  images: z
    .array(productImageSchema)
    .min(1, "Minimal upload 1 gambar produk.")
    .max(5, "Maksimal 5 gambar produk."),
});

export const updateProductSchema = productDetailsSchema.omit({ storeId: true }).extend({
  id: z.string().trim().min(1, "Produk tidak ditemukan."),
});

export const productModerationSchema = z.object({
  id: z.string().trim().min(1, "Produk tidak ditemukan."),
  status: z.enum(["pending", "approved", "rejected", "removed"]),
  adminNote: z.string().trim(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductModerationInput = z.infer<typeof productModerationSchema>;
export type ProductFormFields = CreateProductInput &
  UpdateProductInput &
  ProductModerationInput & {
    image: File;
  };
export type ProductActionState = ActionState<ProductFormFields>;

export function getCreateProductInput(formData: FormData) {
  return {
    name: getFormDataString(formData, "name"),
    description: getFormDataString(formData, "description"),
    category: getFormDataString(formData, "category"),
    price: getFormDataString(formData, "price"),
    storeId: getFormDataString(formData, "storeId"),
    images: getFormDataFiles(formData, "images"),
  };
}

export function getUpdateProductInput(formData: FormData): UpdateProductInput {
  return {
    id: getFormDataString(formData, "id"),
    name: getFormDataString(formData, "name"),
    description: getFormDataString(formData, "description"),
    category: getFormDataString(formData, "category"),
    price: getFormDataString(formData, "price"),
  };
}

export function getProductModerationInput(
  formData: FormData,
): ProductModerationInput {
  return {
    id: getFormDataString(formData, "id"),
    status: getFormDataString(formData, "status") as ProductModerationInput["status"],
    adminNote: getFormDataString(formData, "adminNote"),
  };
}
