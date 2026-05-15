import { and, count, desc, eq, isNull } from "drizzle-orm";
import { ArrowRight, AlertCircle, Clock, MessageCircle, Package, ShieldCheck, Store, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CategorySection } from "@/components/dashboard/category-section";
import { PhotoUploadForm } from "@/components/dashboard/photo-upload-form";
import { ProductSection } from "@/components/dashboard/product-section";
import { SidebarDashboardClient } from "@/components/dashboard/sidebar-dashboard-client";
import { StoreSection } from "@/components/dashboard/store-section";
import { AdminProductsTable, AdminStoresTable, AdminUsersTable, StoresTable } from "@/components/dashboard/dashboard-tables";
import { StatCard } from "@/components/dashboard/dashboard-stat-card";
import { db } from "@/db";
import { categories, notifications, productImages, products, stores, users, whatsappClicks } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await safeAuth();

  if (!session?.user) {
    redirect("/dashboard/login");
  }

  const params = await searchParams;
  const activeTab = params.tab ?? "overview";
  const [notificationRows, unreadNotificationCount] = await Promise.all([
    getDashboardNotifications(session.user.id),
    getUnreadNotificationCount(session.user.id),
  ]);

  const notificationProps = {
    notifications: notificationRows.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      read: Boolean(notification.readAt),
      createdAt: notification.createdAt.toISOString(),
    })),
    unreadNotificationCount,
  };

  if (session.user.role === "admin") {
    return (
      <AdminDashboard userName={session.user.name ?? "Admin"} activeTab={activeTab} {...notificationProps} />
    );
  }

  if (session.user.role === "pengusaha") {
    return (
      <EntrepreneurDashboard
        userId={session.user.id}
        userName={session.user.name ?? "Pengusaha"}
        activeTab={activeTab}
        {...notificationProps}
      />
    );
  }

  return <CustomerDashboard userName={session.user.name ?? "Customer"} activeTab={activeTab} {...notificationProps} />;
}

async function EntrepreneurDashboard({
  userId,
  userName,
  activeTab,
  notifications: dashboardNotifications,
  unreadNotificationCount,
}: {
  userId: string;
  userName: string;
  activeTab: string;
  notifications: { id: string; title: string; message: string; read: boolean; createdAt: string }[];
  unreadNotificationCount: number;
}) {
  const [ownerUser] = await db.select({ photoUrl: users.photoUrl }).from(users).where(eq(users.id, userId));

  const ownerStores = await db.select().from(stores).where(eq(stores.ownerId, userId)).orderBy(desc(stores.createdAt));

  const ownerProducts = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.description,
      category: products.category,
      price: products.price,
      status: products.status,
      adminNote: products.adminNote,
      createdAt: products.createdAt,
      storeName: stores.name,
      storeSlug: stores.slug,
      imageUrl: productImages.imageUrl,
    })
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .leftJoin(productImages, and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)))
    .where(eq(stores.ownerId, userId))
    .orderBy(desc(products.createdAt));

  const productClickRows = await db
    .select({ productId: products.id, value: count(whatsappClicks.id) })
    .from(whatsappClicks)
    .innerJoin(products, eq(whatsappClicks.productId, products.id))
    .innerJoin(stores, eq(products.storeId, stores.id))
    .where(eq(stores.ownerId, userId))
    .groupBy(products.id);

  const [{ value: totalWhatsappClicks }] = await db
    .select({ value: count(whatsappClicks.id) })
    .from(whatsappClicks)
    .innerJoin(stores, eq(whatsappClicks.storeId, stores.id))
    .where(eq(stores.ownerId, userId));

  const clickCountByProduct = new Map(productClickRows.map((row) => [row.productId, row.value]));
  const productsWithClicks = ownerProducts.map((product) => ({
    ...product,
    whatsappClicks: clickCountByProduct.get(product.id) ?? 0,
  }));

  const activeStores = ownerStores.filter((store) => store.status === "active");
  const totalProducts = productsWithClicks.length;
  const approvedProducts = productsWithClicks.filter((p) => p.status === "approved").length;
  const allCategories = await db.select().from(categories).where(eq(categories.ownerId, userId)).orderBy(categories.name);

  return (
    <SidebarDashboardClient
      userName={userName}
      userRole="pengusaha"
      activeTab={activeTab}
      notifications={dashboardNotifications}
      unreadNotificationCount={unreadNotificationCount}
      overviewContent={
        <>
          {!ownerUser?.photoUrl && <PhotoUploadForm />}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard icon={<Store className="h-5 w-5" />} label="Total Toko" value={ownerStores.length} color="primary" />
            <StatCard icon={<Package className="h-5 w-5" />} label="Total Produk" value={totalProducts} color="sky" />
            <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Toko Active" value={activeStores.length} color="emerald" />
            <StatCard icon={<Clock className="h-5 w-5" />} label="Produk Approved" value={approvedProducts} color="amber" />
            <StatCard icon={<MessageCircle className="h-5 w-5" />} label="Klik WhatsApp" value={totalWhatsappClicks} color="emerald" />
          </section>
          <StoreSection stores={ownerStores} />
        </>
      }
      storesContent={<StoresTable stores={ownerStores} canEdit />}
      productsContent={
        <ProductSection
          products={productsWithClicks}
          activeStores={activeStores.map((s) => ({ id: s.id, name: s.name }))}
          availableCategories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
        />
      }
      categoriesContent={<CategorySection categories={allCategories} />}
    />
  );
}

async function getDashboardNotifications(userId: string) {
  try {
    return await db
      .select({
        id: notifications.id,
        title: notifications.title,
        message: notifications.message,
        readAt: notifications.readAt,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(10);
  } catch {
    return [];
  }
}

async function getUnreadNotificationCount(userId: string) {
  try {
    const [{ value }] = await db
      .select({ value: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));

    return value;
  } catch {
    return 0;
  }
}

async function AdminDashboard({
  userName,
  activeTab,
  notifications: dashboardNotifications,
  unreadNotificationCount,
}: {
  userName: string;
  activeTab: string;
  notifications: { id: string; title: string; message: string; read: boolean; createdAt: string }[];
  unreadNotificationCount: number;
}) {
  const storeRows = await db
    .select({
      id: stores.id,
      slug: stores.slug,
      name: stores.name,
      description: stores.description,
      address: stores.address,
      regency: stores.regency,
      district: stores.district,
      province: stores.province,
      village: stores.village,
      whatsappNumber: stores.whatsappNumber,
      status: stores.status,
      adminNote: stores.adminNote,
      ownerId: stores.ownerId,
      ownerName: users.name,
      ownerEmail: users.email,
    })
    .from(stores)
    .innerJoin(users, eq(stores.ownerId, users.id))
    .orderBy(desc(stores.createdAt));

  const productRows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.description,
      category: products.category,
      price: products.price,
      status: products.status,
      adminNote: products.adminNote,
      createdAt: products.createdAt,
      storeName: stores.name,
      storeSlug: stores.slug,
      imageUrl: productImages.imageUrl,
    })
    .from(products)
    .innerJoin(stores, eq(products.storeId, stores.id))
    .leftJoin(productImages, and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)))
    .orderBy(desc(products.createdAt));

  const userRows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  const totalStores = storeRows.length;
  const pendingStores = storeRows.filter((s) => s.status === "pending").length;
  const totalProducts = productRows.length;
  const pendingProducts = productRows.filter((p) => p.status === "pending").length;
  const totalUsers = userRows.length;

  return (
    <SidebarDashboardClient
      userName={userName}
      userRole="admin"
      activeTab={activeTab}
      notifications={dashboardNotifications}
      unreadNotificationCount={unreadNotificationCount}
      overviewContent={
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={<Store className="h-5 w-5" />} label="Total Toko" value={totalStores} color="primary" />
          <StatCard icon={<Clock className="h-5 w-5" />} label="Toko Pending" value={pendingStores} color="amber" />
          <StatCard icon={<Package className="h-5 w-5" />} label="Total Produk" value={totalProducts} color="sky" />
          <StatCard icon={<AlertCircle className="h-5 w-5" />} label="Produk Pending" value={pendingProducts} color="rose" />
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Pengguna" value={totalUsers} color="emerald" />
        </section>
      }
      storesContent={<AdminStoresTable stores={storeRows} />}
      productsContent={<AdminProductsTable products={productRows} />}
      usersContent={<AdminUsersTable userRows={userRows} />}
    />
  );
}

async function CustomerDashboard({
  userName,
  activeTab,
  notifications: dashboardNotifications,
  unreadNotificationCount,
}: {
  userName: string;
  activeTab: string;
  notifications: { id: string; title: string; message: string; read: boolean; createdAt: string }[];
  unreadNotificationCount: number;
}) {
  return (
    <SidebarDashboardClient
      userName={userName}
      userRole="customer"
      activeTab={activeTab}
      notifications={dashboardNotifications}
      unreadNotificationCount={unreadNotificationCount}
      overviewContent={
        <section className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Selamat Datang</h2>
              <p className="mt-2 max-w-xl leading-relaxed text-slate-600">
                Akun customer tidak perlu dashboard. Silakan cari produk UMKM dan pesan langsung lewat WhatsApp.
              </p>
              <Link href="/produk" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 hover:shadow-lg">
                Cari Produk <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      }
    />
  );
}
