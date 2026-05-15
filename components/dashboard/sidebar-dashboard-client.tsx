"use client";

import { useRouter } from "next/navigation";
import {
  NotificationBell,
  type DashboardNotification,
} from "@/components/dashboard/notification-bell";
import { SidebarDashboard } from "./sidebar-dashboard";

export function SidebarDashboardClient({
  userName,
  userRole,
  activeTab,
  overviewContent,
  storesContent,
  productsContent,
  categoriesContent,
  usersContent,
  notifications = [],
  unreadNotificationCount = 0,
}: {
  userName: string;
  userRole: string;
  activeTab: string;
  overviewContent?: React.ReactNode;
  storesContent?: React.ReactNode;
  productsContent?: React.ReactNode;
  categoriesContent?: React.ReactNode;
  usersContent?: React.ReactNode;
  notifications?: DashboardNotification[];
  unreadNotificationCount?: number;
}) {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return overviewContent ?? <div className="text-slate-500">Overview tidak tersedia</div>;
      case "stores":
        return storesContent ?? <div className="text-slate-500">Toko tidak tersedia</div>;
      case "products":
        return productsContent ?? <div className="text-slate-500">Produk tidak tersedia</div>;
      case "categories":
        return categoriesContent ?? <div className="text-slate-500">Kategori tidak tersedia</div>;
      case "users":
        return usersContent ?? <div className="text-slate-500">Pengguna tidak tersedia</div>;
      default:
        return overviewContent ?? <div className="text-slate-500">Pilih menu</div>;
    }
  };

  const tabTitle: Record<string, string> = {
    overview: "Overview",
    stores: "Manajemen Toko",
    products: "Manajemen Produk",
    categories: "Manajemen Kategori",
    users: "Manajemen Pengguna",
    settings: "Pengaturan",
  };

  return (
    <SidebarDashboard
      userName={userName}
      userRole={userRole}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
            {tabTitle[activeTab] ?? "Dashboard"}
          </h1>
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadNotificationCount}
          />
        </div>
        {renderContent()}
      </div>
    </SidebarDashboard>
  );
}
