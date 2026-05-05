import { z } from "zod";

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

export type AuthActionState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};
