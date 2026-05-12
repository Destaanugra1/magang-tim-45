"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/db/schema";
import PillNav from "@/components/ui/pill-nav";
import ProductNavbarSearch from "@/components/ui/product-navbar-search";
import { logout } from "@/actions/logout";

type NavbarClientProps = {
  session: {
    name: string;
    role: UserRole;
  } | null;
};

type NavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export default function NavbarClient({ session }: NavbarClientProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
  
      if (currentScrollY < 12) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
  
      setLastScrollY(currentScrollY);
    };
  
    window.addEventListener("scroll", handleScroll, { passive: true });
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const canOpenDashboard = session?.role === "admin" || session?.role === "pengusaha";

  const items: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/service" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" },
    { label: "Books", href: "/books" },
    { label: "Produk", href: "/produk" },

    ...(canOpenDashboard && session
      ? [
          {
            label: "Dashboard",
            href: "/dashboard",
            ariaLabel: `${session.name} dashboard`,
          },
        ]
      : []),

    ...(!session ? [{ label: "Login", href: "/dashboard/login" }] : []),
  ];

  const normalizePath = (value: string) =>
    value.length > 1 && value.endsWith("/") ? value.slice(0, -1) : value;

  const currentPath = normalizePath(pathname);
  const isProductListingPage = currentPath === "/produk";
  const hasDesktopActions = isProductListingPage || Boolean(session);

  const activeHref = items.find((item) => {
    const href = normalizePath(item.href);

    if (href === "/") {
      return currentPath === "/";
    }

    return currentPath === href || currentPath.startsWith(`${href}/`);
  })?.href;

  const desktopActions = hasDesktopActions ? (
    <>
      {isProductListingPage ? <ProductNavbarSearch /> : null}
      {session ? (
        <>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
            {session.name}
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </form>
        </>
      ) : null}
    </>
  ) : null;
  const mobileActions = isProductListingPage ? (
    <ProductNavbarSearch mobile />
  ) : null;

  const mobileFooter = session ? (
    <div className="space-y-3">
      <div className="rounded-[22px] bg-white/8 px-4 py-3 text-white">
        <p className="text-xs uppercase tracking-[0.18em] text-white/60">
          Masuk sebagai
        </p>
        <p className="mt-1 text-sm font-semibold">{session.name}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="w-full rounded-[22px] bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </form>
    </div>
  ) : (
    <p className="px-2 text-sm text-white/65">
      Gunakan menu di atas untuk berpindah halaman.
    </p>
  );

  return (
    <PillNav
      logo="/tim45-mark.svg"
      logoAlt="Tim 45"
      items={items}
      activeHref={activeHref}
      containerClassName={
        isVisible
           ? "translate-y-0 opacity-100 pointer-events-auto"
           : "-translate-y-8 opacity-0 pointer-events-none"
       }
      desktopActions={desktopActions}
      mobileActions={mobileActions}
      mobileFooter={mobileFooter}
      ease="power2.easeOut"
      baseColor="rgba(15, 23, 42, 0.72)"
      pillColor="#f8fafc"
      hoveredPillTextColor="#f8fafc"
      pillTextColor="#0f172a"
      initialLoadAnimation
    />
  );
}
