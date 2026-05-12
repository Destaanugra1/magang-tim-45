import { and, desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/actions/logout";
import {
  createMentoringNote,
  createStoreFromForm,
  updateStoreStatusFromForm,
} from "@/actions/stores";
import {
  createProductFromForm,
  deleteProductFromForm,
  updateProductStatusFromForm,
} from "@/actions/products";
import { db } from "@/db";
import { productImages, products, stores, users } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";
import { MAX_STORES_PER_OWNER } from "@/lib/stores/constants";

const statusClassName: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  approved: "bg-emerald-100 text-emerald-800",
  suspended: "bg-orange-100 text-orange-800",
  closed: "bg-slate-200 text-slate-700",
  rejected: "bg-rose-100 text-rose-800",
  removed: "bg-rose-100 text-rose-800",
};

export default async function DashboardPage() {
  const session = await safeAuth();

  if (!session?.user) {
    redirect("/dashboard/login");
  }

  if (session.user.role === "admin") {
    return <AdminDashboard userName={session.user.name ?? "Admin"} />;
  }

  if (session.user.role === "pengusaha") {
    return (
      <EntrepreneurDashboard
        userId={session.user.id}
        userName={session.user.name ?? "Pengusaha"}
      />
    );
  }

  return (
    <DashboardShell title="Dashboard Customer" userName={session.user.name ?? "Customer"}>
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-slate-600">
          Akun customer tidak perlu dashboard. Silakan cari produk UMKM dan pesan
          langsung lewat WhatsApp.
        </p>
        <Link
          href="/produk"
          className="mt-5 inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Cari Produk
        </Link>
      </section>
    </DashboardShell>
  );
}

async function EntrepreneurDashboard({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
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

  return (
    <DashboardShell title="Dashboard Pengusaha" userName={userName}>
      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Toko Saya</h2>
              <p className="mt-2 text-sm text-slate-500">
                {ownerStores.length}/{MAX_STORES_PER_OWNER} toko terpakai.
              </p>
            </div>
            <StatusBadge value={ownerStores.length >= MAX_STORES_PER_OWNER ? "penuh" : "tersedia"} />
          </div>

          <div className="mt-5 space-y-3">
            {ownerStores.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Belum ada toko. Buat toko dulu, lalu tunggu approval admin.
              </p>
            ) : (
              ownerStores.map((store) => (
                <div key={store.id} className="rounded-2xl border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/toko/${store.slug}`} className="font-semibold">
                      {store.name}
                    </Link>
                    <StatusBadge value={store.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {store.district}, {store.regency}
                  </p>
                  {store.adminNote ? (
                    <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                      Catatan admin: {store.adminNote}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        {ownerStores.length < MAX_STORES_PER_OWNER ? <CreateStoreCard /> : null}
      </section>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Tambah Produk</h2>
        <p className="mt-2 text-sm text-slate-500">
          Produk baru masuk status pending dan tampil setelah disetujui admin.
        </p>
        {activeStores.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
            Kamu perlu minimal satu toko active sebelum menambah produk.
          </p>
        ) : (
          <CreateProductForm stores={activeStores} />
        )}
      </section>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Produk Saya</h2>
        <ProductList products={ownerProducts} canDelete />
      </section>
    </DashboardShell>
  );
}

async function AdminDashboard({ userName }: { userName: string }) {
  const storeRows = await db
    .select({
      id: stores.id,
      slug: stores.slug,
      name: stores.name,
      description: stores.description,
      address: stores.address,
      regency: stores.regency,
      district: stores.district,
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

  return (
    <DashboardShell title="Dashboard Admin" userName={userName}>
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Moderasi Toko</h2>
        <div className="mt-5 grid gap-4">
          {storeRows.length === 0 ? (
            <EmptyState text="Belum ada toko." />
          ) : (
            storeRows.map((store) => (
              <article key={store.id} className="rounded-2xl border p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/toko/${store.slug}`} className="font-semibold">
                        {store.name}
                      </Link>
                      <StatusBadge value={store.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      Pemilik: {store.ownerName} ({store.ownerEmail})
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {store.address}, {store.district}, {store.regency} | WA: {store.whatsappNumber}
                    </p>
                  </div>
                  <ModerateStoreForm id={store.id} status={store.status} adminNote={store.adminNote ?? ""} />
                </div>
                <MentoringForm ownerId={store.ownerId} storeId={store.id} />
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Moderasi Produk</h2>
        <ProductList products={productRows} canDelete admin />
      </section>
    </DashboardShell>
  );
}

function DashboardShell({
  title,
  userName,
  children,
}: {
  title: string;
  userName: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-28 text-slate-900">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex rounded-full border px-3 py-1 text-sm text-slate-600">
                {title}
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                Halo, {userName}
              </h1>
            </div>
            <form action={logout}>
              <button className="rounded-2xl border px-4 py-3 text-sm font-semibold hover:bg-slate-100">
                Logout
              </button>
            </form>
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}

function CreateStoreCard() {
  return (
    <form action={createStoreFromForm} className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Buat Toko</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Input name="name" label="Nama toko" required />
        <Input name="whatsappNumber" label="Nomor WhatsApp" placeholder="62812..." required />
        <Input name="regency" label="Kabupaten/kota" placeholder="Lampung Utara" required />
        <Input name="district" label="Kecamatan" placeholder="Kotabumi" required />
        <TextArea name="address" label="Alamat lengkap" required />
        <TextArea name="description" label="Deskripsi toko" required />
      </div>
      <SubmitButton label="Ajukan Toko" />
    </form>
  );
}

function CreateProductForm({
  stores: activeStores,
}: {
  stores: { id: string; name: string }[];
}) {
  return (
    <form action={createProductFromForm} className="mt-5 grid gap-3 md:grid-cols-2">
      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Toko</span>
        <select name="storeId" className="w-full rounded-2xl border px-4 py-3" required>
          {activeStores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </label>
      <Input name="name" label="Nama produk" required />
      <Input name="category" label="Kategori" placeholder="Kuliner, fashion, jasa..." required />
      <Input name="price" label="Harga" type="number" min="1" step="100" required />
      <TextArea name="description" label="Deskripsi produk" />
      <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
        <span>Foto produk, maksimal 5</span>
        <input
          name="images"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          required
          className="w-full rounded-2xl border px-4 py-3 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white"
        />
      </label>
      <SubmitButton label="Tambah Produk" />
    </form>
  );
}

function ProductList({
  products: productRows,
  canDelete = false,
  admin = false,
}: {
  products: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    price: string;
    status: string;
    adminNote: string | null;
    storeName: string;
    storeSlug: string;
    imageUrl: string | null;
  }[];
  canDelete?: boolean;
  admin?: boolean;
}) {
  if (productRows.length === 0) {
    return <EmptyState text="Belum ada produk." />;
  }

  return (
    <div className="mt-5 grid gap-4">
      {productRows.map((product) => (
        <article key={product.id} className="rounded-2xl border p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-slate-100 md:w-28">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill unoptimized className="object-cover" sizes="112px" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/toko/${product.storeSlug}/produk/${product.slug}`}
                  className="font-semibold"
                >
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
              {admin ? (
                <ModerateProductForm id={product.id} status={product.status} adminNote={product.adminNote ?? ""} />
              ) : null}
              {canDelete ? (
                <form action={deleteProductFromForm}>
                  <input type="hidden" name="id" value={product.id} />
                  <button className="w-full rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                    Hapus Produk
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

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

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input {...props} className="w-full rounded-2xl border px-4 py-3 text-slate-900" />
    </label>
  );
}

function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700 sm:col-span-2">
      <span>{label}</span>
      <textarea {...props} className="min-h-24 w-full rounded-2xl border px-4 py-3 text-slate-900" />
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <div className="mt-4 md:col-span-2">
      <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
        {label}
      </button>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName[value] ?? "bg-slate-100 text-slate-700"}`}>
      {value}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">{text}</p>;
}
