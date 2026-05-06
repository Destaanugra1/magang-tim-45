export const dynamic = "force-dynamic";
import { Suspense } from "react";
import NavbarClient from "@/components/ui/navbar-client";
import { safeAuth } from "@/lib/auth/safe-auth";

export default async function Navbar() {
  const session = await safeAuth();

  return (
    <Suspense fallback={null}>
      <NavbarClient
        session={
          session?.user
            ? {
                name: session.user.name ?? "User",
                role: session.user.role,
              }
            : null
        }
      />
    </Suspense>
  );
}