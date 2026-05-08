import { z } from "zod";
import type { ActionState } from "@/lib/validation/action-state";
import { getFormDataFile, getFormDataString } from "@/lib/validation/form-data";

export const productImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const productImageMaxSize = 2 * 1024 * 1024;

const productDetailsSchema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi."),
  description: z.string().trim(),
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
  image: productImageSchema,
});

export const updateProductSchema = productDetailsSchema.extend({
  id: z.string().trim().min(1, "Produk tidak ditemukan."),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFormFields = CreateProductInput & Pick<UpdateProductInput, "id">;
export type ProductActionState = ActionState<ProductFormFields>;

export function getCreateProductInput(formData: FormData) {
  return {
    name: getFormDataString(formData, "name"),
    description: getFormDataString(formData, "description"),
    price: getFormDataString(formData, "price"),
    image: getFormDataFile(formData, "image"),
  };
}

export function getUpdateProductInput(formData: FormData): UpdateProductInput {
  return {
    id: getFormDataString(formData, "id"),
    name: getFormDataString(formData, "name"),
    description: getFormDataString(formData, "description"),
    price: getFormDataString(formData, "price"),
  };
}
