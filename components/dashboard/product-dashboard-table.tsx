"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheckBig, Plus, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  createProduct,
  deleteProduct,
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
import { defaultProductState } from "@/lib/products/default-product-state";
import type { ProductActionState } from "@/lib/products/validation";

export type DashboardProductItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  createdAt: string;
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

type ProductDashboardTableProps = {
  products: DashboardProductItem[];
};

type ActionStatus = {
  success: boolean;
  title: string;
  message: string;
} | null;

type DeleteTarget = {
  id: string;
  name: string;
} | null;

function hasProductFieldErrors(state: ProductActionState) {
  return Boolean(
    state.errors?.name ||
      state.errors?.price ||
      state.errors?.description ||
      state.errors?.image ||
      state.errors?.id,
  );
}

export function ProductDashboardTable({
  products,
}: ProductDashboardTableProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [status, setStatus] = useState<ActionStatus>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [isDeletePending, startDeleteTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Daftar Produk</p>
          <p className="mt-1 text-sm text-slate-500">
            Tambah produk lewat modal, lalu edit atau hapus langsung dari tabel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Create Product
        </button>
      </div>

      <CreateProductDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onStatusChange={setStatus}
      />

      <ActionStatusModal
        status={status}
        onClose={() => setStatus(null)}
      />

      <DeleteProductModal
        productName={deleteTarget?.name ?? null}
        pending={isDeletePending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) {
            return;
          }

          startDeleteTransition(async () => {
            const result = await deleteProduct(deleteTarget.id);

            if (result.success) {
              router.refresh();
            }

            setDeleteTarget(null);
            setStatus({
              success: result.success,
              title: result.success ? "Produk Dihapus" : "Hapus Produk Gagal",
              message: result.message,
            });
          });
        }}
      />

      <Table>
        <TableCaption className="px-4 pb-4 text-left">
          Dashboard produk admin. Data create dibuka lewat popup, sedangkan edit
          dan hapus tetap dari tabel ini.
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Produk</TableHead>
            <TableHead className="w-35">Harga</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="w-35">Gambar</TableHead>
            <TableHead className="w-45">Dibuat</TableHead>
            <TableHead className="w-55">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                Belum ada produk.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onDeleteRequest={(selectedProduct) =>
                  setDeleteTarget({
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                  })
                }
                onStatusChange={setStatus}
              />
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

function CreateProductDialog({
  open,
  onOpenChange,
  onStatusChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: ActionStatus) => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createProduct, defaultProductState);
  const lastHandledState = useRef<string | null>(null);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    const currentStateKey = `${state.success}:${state.message}`;
    if (lastHandledState.current === currentStateKey) {
      return;
    }

    lastHandledState.current = currentStateKey;

    if (state.success) {
      formRef.current?.reset();
      onOpenChange(false);
      router.refresh();
      onStatusChange({
        success: true,
        title: "Produk Berhasil Dibuat",
        message: state.message,
      });
      return;
    }

    if (!hasProductFieldErrors(state)) {
      onStatusChange({
        success: false,
        title: "Create Product Gagal",
        message: state.message,
      });
    }
  }, [onOpenChange, onStatusChange, router, state]);

  useEffect(() => {
    if (!open) {
      lastHandledState.current = null;
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Create Product</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Isi data produk baru, lalu simpan. Validasi tetap diproses dari
              Server Action.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Tutup modal create product"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          ref={formRef}
          action={formAction}
          className="mt-6 grid gap-4 md:grid-cols-2"
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
            {state.errors?.name ? (
              <p className="text-xs text-rose-600">{state.errors.name[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Harga
            </label>
            <input
              name="price"
              type="number"
              step="100"
              required
              placeholder="25000"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            {state.errors?.price ? (
              <p className="text-xs text-rose-600">{state.errors.price[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Deskripsi
            </label>
            <textarea
              name="description"
              placeholder="Deskripsi singkat produk"
              className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            {state.errors?.description ? (
              <p className="text-xs text-rose-600">
                {state.errors.description[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
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
            {state.errors?.image ? (
              <p className="text-xs text-rose-600">{state.errors.image[0]}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 md:col-span-2">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Batal
              </button>
              <CreateSubmitButton />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onDeleteRequest,
  onStatusChange,
}: {
  product: DashboardProductItem;
  onDeleteRequest: (product: DashboardProductItem) => void;
  onStatusChange: (status: ActionStatus) => void;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction] = useActionState(updateProduct, defaultProductState);
  const lastHandledState = useRef<string | null>(null);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    const currentStateKey = `${state.success}:${state.message}`;
    if (lastHandledState.current === currentStateKey) {
      return;
    }

    lastHandledState.current = currentStateKey;

    if (state.success) {
      router.refresh();
      const timeoutId = window.setTimeout(() => {
        setIsEditing(false);
      }, 0);

      onStatusChange({
        success: true,
        title: "Produk Berhasil Diperbarui",
        message: state.message,
      });

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    if (!hasProductFieldErrors(state)) {
      onStatusChange({
        success: false,
        title: "Update Product Gagal",
        message: state.message,
      });
    }
  }, [onStatusChange, router, state]);

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
              unoptimized
              className="object-cover"
              sizes="64px"
              fill
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
            <DeleteProductButton
              onClick={() => onDeleteRequest(product)}
            />
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
                {state.errors?.name ? (
                  <p className="text-xs text-rose-600">{state.errors.name[0]}</p>
                ) : null}
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
                {state.errors?.price ? (
                  <p className="text-xs text-rose-600">{state.errors.price[0]}</p>
                ) : null}
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
                {state.errors?.description ? (
                  <p className="text-xs text-rose-600">
                    {state.errors.description[0]}
                  </p>
                ) : null}
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
      className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Delete
    </button>
  );
}

function DeleteProductModal({
  productName,
  pending,
  onClose,
  onConfirm,
}: {
  productName: string | null;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!productName) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Hapus Produk</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Produk <strong>{productName}</strong> akan dihapus permanen.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Tutup modal hapus produk"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionStatusModal({
  status,
  onClose,
}: {
  status: ActionStatus;
  onClose: () => void;
}) {
  if (!status) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start gap-4">
          <div
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              status.success
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {status.success ? (
              <CircleCheckBig className="h-5 w-5" />
            ) : (
              <CircleAlert className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-slate-900">{status.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{status.message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
