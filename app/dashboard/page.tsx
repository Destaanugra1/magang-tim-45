import { and, desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Store,
  Package,
  UserCircle,
  ArrowRight,
  Trash2,
  Plus,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Eye,
  Edit3,
} from "lucide-react";
import {
  createMentoringNote,
  updateStoreStatusFromForm,
} from "@/actions/stores";
import {
  deleteProductFromForm,
  updateProductStatusFromForm,
} from "@/actions/products";
import { db } from "@/db";
import { categories, productImages, products, stores, users } from "@/db/schema";
import { StoreSection } from "@/components/dashboard/store-section";
import { PhotoUploadForm } from "@/components/dashboard/photo-upload-form";
import { safeAuth } from "@/lib/auth/safe-auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SidebarDashboardClient } from "@/components/dashboard/sidebar-dashboard-client";
import { EditStoreButton, EditProductButton } from "@/components/dashboard/edit-buttons";
import { ProductSection } from "@/components/dashboard/product-section";
import { CategorySection } from "@/components/dashboard/category-section";

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: <Clock className="h-3.5 w-3.5" /> },
  active: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  suspended: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: <AlertCircle className="h-3.5 w-3.5" /> },
  closed: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: <Ban className="h-3.5 w-3.5" /> },
  rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: <XCircle className="h-3.5 w-3.5" /> },
  removed: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: <XCircle className="h-3.5 w-3.5" /> },
};

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

  if (session.user.role === "admin") {
    return (
      <AdminDashboard
        userName={session.user.name ?? "Admin"}
        activeTab={activeTab}
      />
    );
  }

  if (session.user.role === "pengusaha") {
    return (
      <EntrepreneurDashboard
        userId={session.user.id}
        userName={session.user.name ?? "Pengusaha"}
        activeTab={activeTab}
      />
    );
  }

  return (
    <CustomerDashboard
      userName={session.user.name ?? "Customer"}
      activeTab={activeTab}
    />
  );
}

async function EntrepreneurDashboard({
  userId,
  userName,
  activeTab,
}: {
  userId: string;
  userName: string;
  activeTab: string;
}) {
  const [ownerUser] = await db
    .select({ photoUrl: users.photoUrl })
    .from(users)
    .where(eq(users.id, userId));

  const ownerStores = await db
    .select()
    .from(stores)
    .where(eq(stores.ownerId, userId))
    .orderBy(desc(stores.createdAt));

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
    .leftJoin(
      productImages,
      and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)),
    )
    .where(eq(stores.ownerId, userId))
    .orderBy(desc(products.createdAt));

  const activeStores = ownerStores.filter((store) => store.status === "active");
  const totalProducts = ownerProducts.length;
  const approvedProducts = ownerProducts.filter((p) => p.status === "approved").length;

  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.ownerId, userId))
    .orderBy(categories.name);

  return (
    <SidebarDashboardClient
      userName={userName}
      userRole="pengusaha"
      activeTab={activeTab}
      overviewContent={
        <>
          {!ownerUser?.photoUrl && <PhotoUploadForm />}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Store className="h-5 w-5" />} label="Total Toko" value={ownerStores.length} color="primary" />
            <StatCard icon={<Package className="h-5 w-5" />} label="Total Produk" value={totalProducts} color="sky" />
            <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Toko Active" value={activeStores.length} color="emerald" />
            <StatCard icon={<Clock className="h-5 w-5" />} label="Produk Approved" value={approvedProducts} color="amber" />
          </section>
          <StoreSection stores={ownerStores} />
        </>
      }
      storesContent={<StoresTable stores={ownerStores} canEdit />}
      productsContent={
        <ProductSection
          products={ownerProducts}
          activeStores={activeStores.map((s) => ({ id: s.id, name: s.name }))}
          availableCategories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
        />
      }
      categoriesContent={<CategorySection categories={allCategories} />}
    />
  );
}

async function AdminDashboard({
  userName,
  activeTab,
}: {
  userName: string;
  activeTab: string;
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
    .leftJoin(
      productImages,
      and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)),
    )
    .orderBy(desc(products.createdAt));

  const totalStores = storeRows.length;
  const pendingStores = storeRows.filter((s) => s.status === "pending").length;
  const totalProducts = productRows.length;
  const pendingProducts = productRows.filter((p) => p.status === "pending").length;

  return (
    <SidebarDashboardClient
      userName={userName}
      userRole="admin"
      activeTab={activeTab}
      overviewContent={
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Store className="h-5 w-5" />} label="Total Toko" value={totalStores} color="primary" />
          <StatCard icon={<Clock className="h-5 w-5" />} label="Toko Pending" value={pendingStores} color="amber" />
          <StatCard icon={<Package className="h-5 w-5" />} label="Total Produk" value={totalProducts} color="sky" />
          <StatCard icon={<AlertCircle className="h-5 w-5" />} label="Produk Pending" value={pendingProducts} color="rose" />
        </section>
      }
      storesContent={<AdminStoresTable stores={storeRows} />}
      productsContent={<AdminProductsTable products={productRows} />}
    />
  );
}

async function CustomerDashboard({
  userName,
  activeTab,
}: {
  userName: string;
  activeTab: string;
}) {
  return (
    <SidebarDashboardClient
      userName={userName}
      userRole="customer"
      activeTab={activeTab}
      overviewContent={
        <section className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Selamat Datang</h2>
              <p className="mt-2 max-w-xl leading-relaxed text-slate-600">
                Akun customer tidak perlu dashboard. Silakan cari produk UMKM dan pesan
                langsung lewat WhatsApp.
              </p>
              <Link
                href="/produk"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 hover:shadow-lg"
              >
                Cari Produk <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      }
    />
  );
}

// ==================== Table Components ====================

async function StoresTable({
  stores,
  canEdit = false,
}: {
  stores: typeof import("@/db/schema").stores.$inferSelect[];
  canEdit?: boolean;
}) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daftar Toko</h2>
        <span className="text-sm text-slate-500">{stores.length} toko</span>
      </div>
      <div className="mt-5 overflow-x-auto">
        {stores.length === 0 ? (
          <EmptyState text="Belum ada toko." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nama Toko</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id} className="group border-b transition hover:bg-slate-50">
                  <TableCell className="font-medium">
                    <Link href={`/toko/${store.slug}`} className="transition hover:text-primary">
                      {store.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {[store.regency, store.province].filter(Boolean).join(", ")}
                  </TableCell>
                  <TableCell className="text-slate-500">{store.whatsappNumber}</TableCell>
                  <TableCell>
                    <StatusBadge value={store.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/toko/${store.slug}`}
                        className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        <Eye className="h-3.5 w-3.5" /> Lihat
                      </Link>
                      {canEdit && <EditStoreButton store={store} />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}

type ProductWithStore = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: string;
  status: string;
  adminNote: string | null;
  createdAt: Date;
  storeName: string;
  storeSlug: string;
  imageUrl: string | null;
};

async function ProductsTable({
  products,
  canEdit = false,
  canDelete = false,
}: {
  products: ProductWithStore[];
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daftar Produk</h2>
        <span className="text-sm text-slate-500">{products.length} produk</span>
      </div>
      <div className="mt-5 overflow-x-auto">
        {products.length === 0 ? (
          <EmptyState text="Belum ada produk." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Produk</TableHead>
                <TableHead>Toko</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="group border-b transition hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill unoptimized className="object-cover" sizes="40px" />
                        ) : (
                          <Package className="absolute inset-0 m-auto h-5 w-5 text-slate-300" />
                        )}
                      </div>
                      <span className="font-medium text-slate-900">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500">{product.storeName}</TableCell>
                  <TableCell className="text-slate-500">{product.category}</TableCell>
                  <TableCell className="font-medium text-slate-900">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={product.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/toko/${product.storeSlug}/produk/${product.slug}`}
                        className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        <Eye className="h-3.5 w-3.5" /> Lihat
                      </Link>
                      {canEdit && <EditProductButton product={product} />}
                      {canDelete && (
                        <form action={deleteProductFromForm}>
                          <input type="hidden" name="id" value={product.id} />
                          <button className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}

async function AdminStoresTable({
  stores,
}: {
  stores: {
    id: string;
    slug: string;
    name: string;
    description: string;
    address: string;
    regency: string;
    district: string;
    province: string;
    village: string;
    whatsappNumber: string;
    status: string;
    adminNote: string | null;
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
  }[];
}) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">Moderasi Toko</h2>
      </div>
      <div className="mt-5 overflow-x-auto">
        {stores.length === 0 ? (
          <EmptyState text="Belum ada toko." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nama Toko</TableHead>
                <TableHead>Pemilik</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id} className="group border-b transition hover:bg-slate-50">
                  <TableCell className="font-medium">
                    <Link href={`/toko/${store.slug}`} className="transition hover:text-primary">
                      {store.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {store.ownerName} ({store.ownerEmail})
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {[store.regency, store.province].filter(Boolean).join(", ")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={store.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ModerateStoreForm id={store.id} status={store.status} adminNote={store.adminNote ?? ""} />
                      <MentoringForm ownerId={store.ownerId} storeId={store.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}

async function AdminProductsTable({
  products,
}: {
  products: ProductWithStore[];
}) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
          <Package className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">Moderasi Produk</h2>
      </div>
      <div className="mt-5">
        {products.length === 0 ? (
          <EmptyState text="Belum ada produk." />
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <article key={product.id} className="group rounded-2xl border p-4 transition hover:border-primary/30 hover:shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-slate-100 md:w-28">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill unoptimized className="object-cover" sizes="112px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/toko/${product.storeSlug}/produk/${product.slug}`} className="font-semibold transition hover:text-primary">
                        {product.name}
                      </Link>
                      <StatusBadge value={product.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {product.storeName} | {product.category} | Rp {Number(product.price).toLocaleString("id-ID")}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {product.description || "Tidak ada deskripsi."}
                    </p>
                    {product.adminNote ? (
                      <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                        Catatan admin: {product.adminNote}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex min-w-52 flex-col gap-2">
                    <ModerateProductForm id={product.id} status={product.status} adminNote={product.adminNote ?? ""} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ==================== Helper Components ====================

function ModerateStoreForm({
  id,
  status,
  adminNote,
}: {
  id: string;
  status: string;
  adminNote: string;
}) {
  return (
    <form action={updateStoreStatusFromForm} className="grid gap-2 sm:min-w-80">
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} className="rounded-2xl border px-4 py-2 text-sm">
        <option value="pending">pending</option>
        <option value="active">active</option>
        <option value="suspended">suspended</option>
        <option value="closed">closed</option>
        <option value="rejected">rejected</option>
      </select>
      <textarea
        name="adminNote"
        defaultValue={adminNote}
        placeholder="Catatan admin"
        className="min-h-20 rounded-2xl border px-4 py-2 text-sm"
      />
      <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
        Simpan Status
      </button>
    </form>
  );
}

function ModerateProductForm({
  id,
  status,
  adminNote,
}: {
  id: string;
  status: string;
  adminNote: string;
}) {
  return (
    <form action={updateProductStatusFromForm} className="grid gap-2">
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} className="rounded-2xl border px-4 py-2 text-sm">
        <option value="pending">pending</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
        <option value="removed">removed</option>
      </select>
      <textarea
        name="adminNote"
        defaultValue={adminNote}
        placeholder="Catatan produk"
        className="min-h-16 rounded-2xl border px-4 py-2 text-sm"
      />
      <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
        Simpan
      </button>
    </form>
  );
}

function MentoringForm({ ownerId, storeId }: { ownerId: string; storeId: string }) {
  return (
    <form action={createMentoringNote} className="mt-4 flex flex-col gap-2 md:flex-row">
      <input type="hidden" name="entrepreneurId" value={ownerId} />
      <input type="hidden" name="storeId" value={storeId} />
      <input
        name="note"
        placeholder="Tulis catatan mentoring untuk pengusaha..."
        className="min-w-0 flex-1 rounded-2xl border px-4 py-2 text-sm"
      />
      <button className="rounded-2xl border px-4 py-2 text-sm font-semibold hover:bg-slate-100">
        Kirim Mentoring
      </button>
    </form>
  );
}

function StatusBadge({ value }: { value: string }) {
  const config = statusConfig[value] ?? {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    icon: null,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}>
      {config.icon} {value}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-5 flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-6 text-center">
      <Package className="h-8 w-8 text-slate-300" />
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "sky" | "emerald" | "amber" | "rose";
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    sky: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`rounded-2xl p-2.5 ${colorMap[color]}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
