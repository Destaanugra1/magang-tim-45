"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";

export async function markNotificationsRead() {
  const session = await safeAuth();

  if (!session?.user) {
    return;
  }

  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.userId, session.user.id),
        isNull(notifications.readAt),
      ),
    );

  revalidatePath("/dashboard");
}
