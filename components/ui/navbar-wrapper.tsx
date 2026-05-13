"use client";

import { usePathname } from "next/navigation";

export function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;
  return <>{children}</>;
}
