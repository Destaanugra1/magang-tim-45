"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { mentoringNotes, stores } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";
import { withSlugFallback } from "@/lib/slug";
import { MAX_STORES_PER_OWNER } from "@/lib/stores/constants";
import {
  getStoreInput,
  getStoreModerationInput,
  storeModerationSchema,
  storeSchema,
  type StoreActionState,
} from "@/lib/stores/validation";
import { createValidationErrorState } from "@/lib/validation/action-state";
import { getFormDataString } from "@/lib/validation/form-data";

async function createUniqueStoreSlug(name: string) {
  const baseSlug = withSlugFallback(name, "toko");

  for (let index = 0; index < 20; index += 1) {
    const candidate = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`;
    const existingStore = await db.query.stores.findFirst({
      where: eq(stores.slug, candidate),
    });

    if (!existingStore) {
      return candidate;
    }
  }

  return `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function createStore(
  _prevState: StoreActionState,
  formData: FormData,
): Promise<StoreActionState> {
  const session = await safeAuth();

  if (!session?.user || session.user.role !== "pengusaha") {
    return {
      success: false,
      message: "Hanya akun pengusaha yang bisa membuat toko.",
    };
  }

  const validatedFields = storeSchema.safeParse(getStoreInput(formData));

  if (!validatedFields.success) {
    return createValidationErrorState(
      "Periksa kembali data toko.",
      validatedFields.error,
    );
  }

  const [{ value: storeCount }] = await db
    .select({ value: count() })
    .from(stores)
    .where(eq(stores.ownerId, session.user.id));

  if (storeCount >= MAX_STORES_PER_OWNER) {
    return {
      success: false,
      message: "Maksimal 5 toko untuk satu akun pengusaha.",
    };
  }

  await db.insert(stores).values({
    ...validatedFields.data,
    ownerId: session.user.id,
    slug: await createUniqueStoreSlug(validatedFields.data.name),
    status: "pending",
  });

  revalidatePath("/dashboard");
  revalidatePath("/produk");
  revalidatePath("/toko");

  return {
    success: true,
    message: "Toko berhasil dibuat dan menunggu approval admin.",
  };
}

export async function createStoreFromForm(formData: FormData) {
  return createStore({ success: false, message: "" }, formData);
}

export async function updateStoreStatus(
  _prevState: StoreActionState,
  formData: FormData,
): Promise<StoreActionState> {
  const session = await safeAuth();

  if (!session?.user || session.user.role !== "admin") {
    return {
      success: false,
      message: "Hanya admin yang bisa mengubah status toko.",
    };
  }

  const validatedFields = storeModerationSchema.safeParse(
    getStoreModerationInput(formData),
  );

  if (!validatedFields.success) {
    return createValidationErrorState(
      "Periksa kembali status toko.",
      validatedFields.error,
    );
  }

  await db
    .update(stores)
    .set({
      status: validatedFields.data.status,
      adminNote: validatedFields.data.adminNote || null,
    })
    .where(eq(stores.id, validatedFields.data.id));

  revalidatePath("/dashboard");
  revalidatePath("/produk");
  revalidatePath("/toko");

  return {
    success: true,
    message: "Status toko berhasil diperbarui.",
  };
}

export async function updateStoreStatusFromForm(formData: FormData) {
  await updateStoreStatus({ success: false, message: "" }, formData);
}

export async function createMentoringNote(formData: FormData) {
  const session = await safeAuth();

  if (!session?.user || session.user.role !== "admin") {
    return;
  }

  const entrepreneurId = getFormDataString(formData, "entrepreneurId");
  const storeId = getFormDataString(formData, "storeId");
  const note = getFormDataString(formData, "note").trim();

  if (!entrepreneurId || !note) {
    return;
  }

  await db.insert(mentoringNotes).values({
    adminId: session.user.id,
    entrepreneurId,
    storeId: storeId || null,
    note,
  });

  revalidatePath("/dashboard");
}

export async function updateStore(
  _prevState: StoreActionState,
  formData: FormData,
): Promise<StoreActionState> {
  const session = await safeAuth();

  if (!session?.user) {
    return { success: false, message: "Silakan login terlebih dahulu." };
  }

  const storeId = getFormDataString(formData, "id");
  const validatedFields = storeSchema.safeParse(getStoreInput(formData));

  if (!validatedFields.success) {
    return createValidationErrorState(
      "Periksa kembali data toko.",
      validatedFields.error,
    );
  }

  // Verify ownership
  const existingStore = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  if (!existingStore) {
    return { success: false, message: "Toko tidak ditemukan." };
  }

  if (existingStore.ownerId !== session.user.id && session.user.role !== "admin") {
    return { success: false, message: "Anda tidak memiliki akses untuk mengubah toko ini." };
  }

  await db
    .update(stores)
    .set({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      address: validatedFields.data.address,
      province: validatedFields.data.province,
      regency: validatedFields.data.regency,
      district: validatedFields.data.district,
      village: validatedFields.data.village,
      whatsappNumber: validatedFields.data.whatsappNumber,
    })
    .where(eq(stores.id, storeId));

  revalidatePath("/dashboard");
  revalidatePath("/produk");
  revalidatePath("/toko");
  revalidatePath(`/toko/${existingStore.slug}`);

  return {
    success: true,
    message: "Toko berhasil diperbarui.",
  };
}

export async function updateStoreFromForm(formData: FormData) {
  return updateStore({ success: false, message: "" }, formData);
}
