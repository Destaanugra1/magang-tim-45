import { z } from "zod";
import type { ActionState } from "@/lib/validation/action-state";
import { getFormDataString } from "@/lib/validation/form-data";

export const loginSchema = z.object({
  email: z.email("Email tidak valid.").trim(),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .max(100, "Password terlalu panjang."),
});

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter.")
    .max(50, "Nama maksimal 50 karakter.")
    .trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthActionState = ActionState<RegisterInput>;

export function getLoginInput(formData: FormData): LoginInput {
  return {
    email: getFormDataString(formData, "email"),
    password: getFormDataString(formData, "password"),
  };
}

export function getRegisterInput(formData: FormData): RegisterInput {
  return {
    name: getFormDataString(formData, "name"),
    email: getFormDataString(formData, "email"),
    password: getFormDataString(formData, "password"),
  };
}
