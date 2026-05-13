"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function createCategoryFromForm(formData: FormData) {
  const session = await safeAuth();
  const userId = session?.user?.id;
  const role = session?.user?.role;
  if (!userId || (role !== "admin" && role !== "pengusaha")) throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  if (!name) throw new Error("Nama kategori wajib diisi");

  const slug = toSlug(name);

  await db.insert(categories).values({ ownerId: userId, name, slug, description });
  revalidatePath("/dashboard");
}

export async function deleteCategoryFromForm(formData: FormData) {
  const session = await safeAuth();
  const userId = session?.user?.id;
  const role = session?.user?.role;
  if (!userId || (role !== "admin" && role !== "pengusaha")) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) throw new Error("ID kategori tidak valid");

  await db
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.ownerId, userId)));
  revalidatePath("/dashboard");
}

export async function getCategoriesByOwner(ownerId: string) {
  return db
    .select()
    .from(categories)
    .where(eq(categories.ownerId, ownerId))
    .orderBy(categories.name);
}
