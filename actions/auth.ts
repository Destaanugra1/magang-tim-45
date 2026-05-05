"use server";

import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signIn } from "@/auth";
import { hashPassword } from "@/lib/auth/password";
import {
  loginSchema,
  registerSchema,
  type AuthActionState,
} from "@/lib/auth/validation";
import { defaultAuthState } from "@/lib/auth/default-auth-state";

function resolveCallbackUrl(formData: FormData) {
  const callbackUrl = formData.get("callbackUrl");

  if (
    typeof callbackUrl === "string" &&
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//")
  ) {
    return callbackUrl;
  }

  return "/dashboard";
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const callbackUrl = resolveCallbackUrl(formData);
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Periksa kembali email dan password.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: validatedFields.data.email.toLowerCase(),
      password: validatedFields.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message:
          error.type === "CredentialsSignin"
            ? "Email atau password salah."
            : "Gagal login. Coba lagi.",
      };
    }

    throw error;
  }

  return defaultAuthState;
}

export async function register(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const callbackUrl = resolveCallbackUrl(formData);
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Periksa kembali data pendaftaran.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const email = validatedFields.data.email.toLowerCase();
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return {
      success: false,
      message: "Email sudah terdaftar.",
      errors: {
        email: ["Gunakan email lain."],
      },
    };
  }

  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.role, "admin"),
  });

  const passwordHash = await hashPassword(validatedFields.data.password);

  await db.insert(users).values({
    name: validatedFields.data.name,
    email,
    passwordHash,
    role: existingAdmin ? "user" : "admin",
  });

  try {
    await signIn("credentials", {
      email,
      password: validatedFields.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: true,
        message: "Akun berhasil dibuat. Silakan login.",
      };
    }

    throw error;
  }

  return {
    success: true,
    message: "Akun berhasil dibuat.",
  };
}
