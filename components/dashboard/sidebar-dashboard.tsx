"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Store,
  Package,
  Settings,
  LogOut,
  User,
  Shield,
  Tag,
  Users,
} from "lucide-react";
import { logout } from "@/actions/logout";

interface SidebarDashboardProps {
  children: React.ReactNode;
  userName: string;
  userRole: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SidebarDashboard({
  children,
  userName,
  userRole,
  activeTab,
  onTabChange,
}: SidebarDashboardProps) {
  const [open, setOpen] = useState(false);

  const getMenuItems = () => {
    const baseItems = [
      {
        label: "Overview",
        href: "#",
        icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        onClick: () => onTabChange("overview"),
        active: activeTab === "overview",
      },
      {
        label: "Toko",
        href: "#",
        icon: <Store className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        onClick: () => onTabChange("stores"),
        active: activeTab === "stores",
      },
      {
        label: "Produk",
        href: "#",
        icon: <Package className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        onClick: () => onTabChange("products"),
        active: activeTab === "products",
      },
      {
        label: "Kategori",
        href: "#",
        icon: <Tag className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        onClick: () => onTabChange("categories"),
        active: activeTab === "categories",
      },
      {
        label: "Pengguna",
        href: "#",
        icon: <Users className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        onClick: () => onTabChange("users"),
        active: activeTab === "users",
      },
      {
        label: "Pengaturan",
        href: "#",
        icon: <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        onClick: () => onTabChange("settings"),
        active: activeTab === "settings",
      },
    ];

    // Filter items based on role
    if (userRole === "customer") {
      return baseItems.filter((item) => item.label === "Overview" || item.label === "Pengaturan");
    }
    if (userRole === "admin") {
      return baseItems.filter((item) => item.label !== "Kategori");
    }

    return baseItems;
  };

  const links = getMenuItems();

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden bg-gray-100 dark:bg-neutral-800",
        "h-screen md:flex-row"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={link.onClick} className="cursor-pointer">
                  <SidebarLink
                    link={link}
                    className={cn(
                      link.active && "bg-neutral-200 dark:bg-neutral-700 rounded-lg"
                    )}
                  />
                </div>
              ))}
              <form action={logout} className="mt-4">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  {open && <span>Logout</span>}
                </button>
              </form>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: userName,
                href: "#",
                icon: (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-300 dark:bg-neutral-600">
                    <User className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <DashboardContent>{children}</DashboardContent>
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white">
        <Shield className="h-4 w-4 text-white dark:text-black" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium text-black dark:text-white"
      >
        UMKM Digital
      </motion.span>
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white">
        <Shield className="h-4 w-4 text-white dark:text-black" />
      </div>
    </a>
  );
};

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-6 overflow-y-auto rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        {children}
      </div>
    </div>
  );
};
