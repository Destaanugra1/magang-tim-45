"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createProduct,
  deleteProduct,
  type ProductActionState,
  updateProduct,
} from "@/actions/products";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DashboardProductItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  createdAt: string;
};

const initialState: ProductActionState = {
  success: false,
  message: "",
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

type ProductDashboardTableProps = {
  products: DashboardProductItem[];
};

export function ProductDashboardTable({
  products,
}: ProductDashboardTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableCaption className="px-4 pb-4 text-left">
          Dashboard produk admin. Tambah, ubah, atau hapus data langsung dari
          tabel ini.
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Produk</TableHead>
            <TableHead className="`w-35">Harga</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="`w-35">Gambar</TableHead>
            <TableHead className="w-45">Dibuat</TableHead>
            <TableHead className="w-55">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <CreateProductRow />
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                Belum ada produk.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={6}>
              Total produk: <strong>{products.length}</strong>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

function CreateProductRow() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createProduct, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
      <TableCell colSpan={6}>
        <form
          ref={formRef}
          action={formAction}
          // encType="multipart/form-data"
          className="grid gap-3 xl:grid-cols-[1.1fr_180px_1.3fr_220px_auto]"
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nama Produk
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Contoh: Kopi Arabica"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Harga
            </label>
            <input
              name="price"
              type="number"
              min="1"
              step="100"
              required
              placeholder="25000"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Deskripsi
            </label>
            <textarea
              name="description"
              placeholder="Deskripsi singkat produk"
              className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Gambar
            </label>
            <input
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <CreateSubmitButton />
            {state.message ? (
              <p
                className={
                  state.success
                    ? "text-xs text-emerald-600"
                    : "text-xs text-rose-600"
                }
              >
                {state.message}
              </p>
            ) : null}
          </div>
        </form>
      </TableCell>
    </TableRow>
  );
}

function ProductRow({ product }: { product: DashboardProductItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction] = useActionState(updateProduct, initialState);

  useEffect(() => {
    if (state.success) {
      const timeoutId = window.setTimeout(() => {
        setIsEditing(false);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [state.success]);

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">{product.name}</p>
            <p className="text-xs text-slate-500">{product.id}</p>
          </div>
        </TableCell>
        <TableCell className="font-medium text-slate-900">
          Rp {Number(product.price).toLocaleString("id-ID")}
        </TableCell>
        <TableCell className="max-w-sm">
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">
            {product.description || "Tidak ada deskripsi."}
          </p>
        </TableCell>
        <TableCell>
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-200">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        </TableCell>
        <TableCell className="text-sm text-slate-500">
          {dateFormatter.format(new Date(product.createdAt))}
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsEditing((current) => !current)}
              className="inline-flex rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {isEditing ? "Tutup" : "Edit"}
            </button>
            <DeleteProductButton productId={product.id} productName={product.name} />
          </div>
        </TableCell>
      </TableRow>

      {isEditing ? (
        <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
          <TableCell colSpan={6}>
            <form
              action={formAction}
              className="grid gap-3 xl:grid-cols-[1fr_180px_1.4fr_220px_auto]"
            >
              <input type="hidden" name="id" value={product.id} />

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nama Produk
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={product.name}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Harga
                </label>
                <input
                  name="price"
                  type="number"
                  min="1"
                  step="100"
                  required
                  defaultValue={String(product.price)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              <div className="flex items-end gap-3">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <p className="text-xs leading-5 text-slate-500">
                  Update saat ini hanya mengubah nama, harga, dan deskripsi.
                </p>
              </div>

              <div className="flex flex-col justify-end gap-2">
                <UpdateSubmitButton />
                {state.message ? (
                  <p
                    className={
                      state.success
                        ? "text-xs text-emerald-600"
                        : "text-xs text-rose-600"
                    }
                  >
                    {state.message}
                  </p>
                ) : null}
              </div>
            </form>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}

function CreateSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Menyimpan..." : "Tambah Produk"}
    </button>
  );
}

function UpdateSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </button>
  );
}

function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const deleteAction = deleteProduct.bind(null, productId);

  return (
    <form
      action={deleteAction}
      onSubmit={(event) => {
        if (!window.confirm(`Hapus produk "${productName}"?`)) {
          event.preventDefault();
        }
      }}
    >
      <DeleteSubmitButton />
    </form>
  );
}

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Menghapus..." : "Delete"}
    </button>
  );
}
