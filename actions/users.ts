"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";

export async function updateUserRoleFromForm(formData: FormData) {
  const session = await safeAuth();
  if (session?.user?.role !== "admin") return;

  const id = formData.get("id") as string;
  const role = formData.get("role") as "admin" | "customer" | "pengusaha";

  if (!id || !["admin", "customer", "pengusaha"].includes(role)) return;

  await db.update(users).set({ role }).where(eq(users.id, id));
  revalidatePath("/dashboard");
}
