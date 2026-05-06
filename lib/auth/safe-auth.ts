import "server-only";

import { auth } from "@/auth";

export async function safeAuth() {
  try {
    return await auth();
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      error.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }

    console.error("[safeAuth] Failed to read session. Treating as signed out.", error);
    return null;
  }
}