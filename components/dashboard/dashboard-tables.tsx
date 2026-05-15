"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Trash2, Eye, ShieldCheck, Users } from "lucide-react";
import { createMentoringNote, updateStoreStatusFromForm } from "@/actions/stores";
import { updateUserRoleFromForm } from "@/actions/users";
import { deleteProductFromForm, updateProductStatusFromForm } from "@/actions/products";
import { EditProductButton, EditStoreButton } from "@/components/dashboard/edit-buttons";
import { FormInput, FormTextarea } from "@/components/ui/form-field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, EmptyState } from "@/components/dashboard/dashboard-status";
import type { Store } from "@/db/schema";

export type ProductWithStore = {
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
  whatsappClicks?: number;
};

export function StoresTable({
  stores,
  canEdit = false,
}: {
  stores: Store[];
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

export function ProductsTable({
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
                  <TableCell className="font-medium text-slate-900">Rp {Number(product.price).toLocaleString("id-ID")}</TableCell>
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

export function AdminStoresTable({ stores }: { stores: {
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
}[] }) {
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
                  <TableCell className="text-slate-500">{store.ownerName} ({store.ownerEmail})</TableCell>
                  <TableCell className="text-slate-500">{[store.regency, store.province].filter(Boolean).join(", ")}</TableCell>
                  <TableCell><StatusBadge value={store.status} /></TableCell>
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

export function AdminProductsTable({ products }: { products: ProductWithStore[] }) {
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
                    <p className="mt-1 text-sm text-slate-500">{product.storeName} | {product.category} | Rp {Number(product.price).toLocaleString("id-ID")}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description || "Tidak ada deskripsi."}</p>
                    {product.adminNote ? (
                      <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Catatan admin: {product.adminNote}</p>
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

function ModerateStoreForm({ id, status, adminNote }: { id: string; status: string; adminNote: string }) {
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
      <FormTextarea label="Catatan admin" hideLabel name="adminNote" defaultValue={adminNote} placeholder="Catatan admin" textareaClassName="min-h-20 bg-white px-4 py-2 text-sm focus:bg-white" />
      <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Simpan Status</button>
    </form>
  );
}

function ModerateProductForm({ id, status, adminNote }: { id: string; status: string; adminNote: string }) {
  return (
    <form action={updateProductStatusFromForm} className="grid gap-2">
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} className="rounded-2xl border px-4 py-2 text-sm">
        <option value="pending">pending</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
        <option value="removed">removed</option>
      </select>
      <FormTextarea label="Catatan produk" hideLabel name="adminNote" defaultValue={adminNote} placeholder="Catatan produk" textareaClassName="min-h-16 bg-white px-4 py-2 text-sm focus:bg-white" />
      <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Simpan</button>
    </form>
  );
}

function MentoringForm({ ownerId, storeId }: { ownerId: string; storeId: string }) {
  return (
    <form action={createMentoringNote} className="mt-4 flex flex-col gap-2 md:flex-row">
      <input type="hidden" name="entrepreneurId" value={ownerId} />
      <input type="hidden" name="storeId" value={storeId} />
      <FormInput label="Catatan mentoring" hideLabel name="note" placeholder="Tulis catatan mentoring untuk pengusaha..." className="min-w-0 flex-1" inputClassName="bg-white px-4 py-2 text-sm focus:bg-white" />
      <button className="rounded-2xl border px-4 py-2 text-sm font-semibold hover:bg-slate-100">Kirim Mentoring</button>
    </form>
  );
}

export function AdminUsersTable({ userRows }: {
  userRows: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  }[];
}) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-sky-50 p-2.5 text-sky-600">
          <Users className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">Manajemen Pengguna</h2>
        <span className="ml-auto text-sm text-slate-500">{userRows.length} pengguna</span>
      </div>
      <div className="mt-5 overflow-x-auto">
        {userRows.length === 0 ? (
          <EmptyState text="Belum ada pengguna." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Bergabung</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRows.map((user) => (
                <TableRow key={user.id} className="group border-b transition hover:bg-slate-50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-slate-500">{user.email}</TableCell>
                  <TableCell>
                    <StatusBadge value={user.role} />
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <EditUserRoleForm id={user.id} currentRole={user.role} />
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

function EditUserRoleForm({ id, currentRole }: { id: string; currentRole: string }) {
  return (
    <form action={updateUserRoleFromForm} className="inline-flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="role"
        defaultValue={currentRole}
        className="rounded-xl border px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="admin">admin</option>
        <option value="pengusaha">pengusaha</option>
        <option value="customer">customer</option>
      </select>
      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Simpan
      </button>
    </form>
  );
}
