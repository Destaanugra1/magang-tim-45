import "server-only";

import { auth } from "@/auth";

export async function safeAuth() {
  try {
    return await auth();
  } catch (error) {
    // Most commonly caused by rotating/missing AUTH_SECRET while an old session cookie still exists.
    console.error("[safeAuth] Failed to read session. Treating as signed out.", error);
    return null;
  }
}
