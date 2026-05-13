import { z } from "zod";
import type { ActionState } from "@/lib/validation/action-state";
import { getFormDataString } from "@/lib/validation/form-data";

export const storeSchema = z.object({
  name: z.string().trim().min(3, "Nama toko minimal 3 karakter."),
  description: z.string().trim().min(10, "Deskripsi toko minimal 10 karakter."),
  address: z.string().trim().min(8, "Alamat toko wajib lengkap."),
  province: z.string().trim().min(3, "Provinsi wajib dipilih."),
  regency: z.string().trim().min(3, "Kabupaten/kota wajib diisi."),
  district: z.string().trim().min(3, "Kecamatan wajib diisi."),
  village: z.string().trim(),
  whatsappNumber: z
    .string()
    .trim()
    .min(10, "Nomor WhatsApp wajib diisi.")
    .regex(/^[0-9+\-\s()]+$/, "Nomor WhatsApp tidak valid."),
});

export const storeIdSchema = z.object({
  id: z.string().trim().min(1, "Toko tidak ditemukan."),
});

export const storeModerationSchema = storeIdSchema.extend({
  status: z.enum(["pending", "active", "suspended", "closed", "rejected"]),
  adminNote: z.string().trim(),
});

export type StoreInput = z.infer<typeof storeSchema>;
export type StoreModerationInput = z.infer<typeof storeModerationSchema>;
export type StoreFormFields = StoreInput & StoreModerationInput;
export type StoreActionState = ActionState<StoreFormFields>;

export function getStoreInput(formData: FormData): StoreInput {
  return {
    name: getFormDataString(formData, "name"),
    description: getFormDataString(formData, "description"),
    address: getFormDataString(formData, "address"),
    province: getFormDataString(formData, "province"),
    regency: getFormDataString(formData, "regency"),
    district: getFormDataString(formData, "district"),
    village: getFormDataString(formData, "village"),
    whatsappNumber: getFormDataString(formData, "whatsappNumber"),
  };
}

export function getStoreModerationInput(
  formData: FormData,
): StoreModerationInput {
  return {
    id: getFormDataString(formData, "id"),
    status: getFormDataString(formData, "status") as StoreModerationInput["status"],
    adminNote: getFormDataString(formData, "adminNote"),
  };
}
