"use server";

import { Buffer } from "node:buffer";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signIn } from "@/auth";
import { hashPassword } from "@/lib/auth/password";
import { safeAuth } from "@/lib/auth/safe-auth";
import {
  getLoginInput,
  getRegisterInput,
  loginSchema,
  registerSchema,
  type AuthActionState,
} from "@/lib/auth/validation";
import { defaultAuthState } from "@/lib/auth/default-auth-state";
import { createValidationErrorState } from "@/lib/validation/action-state";
import { getFormDataFile } from "@/lib/validation/form-data";
import { supabaseAdmin } from "@/lib/supabase-admin";

const USER_BUCKET = "vinix";

async function uploadUserPhoto(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split(".").pop() ?? "jpg";
  const imagePath = `users/${userId}/profile.${fileExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(USER_BUCKET)
    .upload(imagePath, buffer, { contentType: file.type, upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage.from(USER_BUCKET).getPublicUrl(imagePath);
  return data.publicUrl;
}

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
  const validatedFields = loginSchema.safeParse(getLoginInput(formData));

  if (!validatedFields.success) {
    return createValidationErrorState(
      "Periksa kembali email dan password.",
      validatedFields.error,
    );
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
  const validatedFields = registerSchema.safeParse(getRegisterInput(formData));

  if (!validatedFields.success) {
    return createValidationErrorState(
      "Periksa kembali data pendaftaran.",
      validatedFields.error,
    );
  }

  const photo = getFormDataFile(formData, "photo");
  const role = validatedFields.data.role;

  if (role === "pengusaha" && (!photo || photo.size === 0)) {
    return {
      success: false,
      message: "Foto profil toko wajib diupload untuk akun pengusaha.",
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
  const userId = crypto.randomUUID();

  let photoUrl: string | null = null;
  if (photo && photo.size > 0) {
    try {
      photoUrl = await uploadUserPhoto(photo, userId);
    } catch {
      return { success: false, message: "Gagal upload foto profil. Coba lagi." };
    }
  }

  await db.insert(users).values({
    id: userId,
    name: validatedFields.data.name,
    email,
    passwordHash,
    role: existingAdmin ? validatedFields.data.role : "admin",
    photoUrl,
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

export async function updateUserPhoto(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const session = await safeAuth();

  if (!session?.user) {
    return { success: false, message: "Silakan login terlebih dahulu." };
  }

  const photo = getFormDataFile(formData, "photo");
  if (!photo || photo.size === 0) {
    return { success: false, message: "Pilih foto terlebih dahulu." };
  }

  try {
    const photoUrl = await uploadUserPhoto(photo, session.user.id);
    await db.update(users).set({ photoUrl }).where(eq(users.id, session.user.id));
    revalidatePath("/dashboard");
    revalidatePath("/produk");
    return { success: true, message: "Foto profil berhasil diperbarui." };
  } catch {
    return { success: false, message: "Gagal upload foto. Coba lagi." };
  }
}
