"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { createProductFromForm, deleteProductFromForm } from "@/actions/products";
import { EditProductButton } from "@/components/dashboard/edit-buttons";
import { FormInput, FormTextarea } from "@/components/ui/form-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileUpload } from "@/components/ui/file-upload";

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
  whatsappClicks?: number;
};

type Toast = { message: string; type: "success" | "error" } | null;

function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-lg transition-all ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
      )}
      <span className="text-sm font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-2 text-current opacity-50 hover:opacity-100">
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ProductSection({
  products,
  activeStores,
  availableCategories = [],
}: {
  products: ProductWithStore[];
  activeStores: { id: string; name: string }[];
  availableCategories?: { id: string; name: string }[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductWithStore | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("id", deleteTarget.id);
      await deleteProductFromForm(formData);
      showToast(`Produk "${deleteTarget.name}" berhasil dihapus.`, "success");
    } catch {
      showToast("Gagal menghapus produk. Coba lagi.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
    <ToastNotification toast={toast} onClose={() => setToast(null)} />
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Produk Saya</h2>
            <p className="mt-1 text-sm text-slate-500">
              {products.length} produk terdaftar
            </p>
          </div>
        </div>

        {activeStores.length > 0 ? (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> Tambah Produk
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
            <AlertCircle className="h-4 w-4" /> Butuh toko active
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="mt-6 overflow-x-auto">
        {products.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              Belum ada produk. Klik &ldquo;Tambah Produk&rdquo; untuk mulai.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Produk</TableHead>
                <TableHead>Toko</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Klik WA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="group transition hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="40px"
                          />
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
                  <TableCell className="font-medium text-emerald-700">
                    {product.whatsappClicks ?? 0}
                  </TableCell>
                  <TableCell>
                    <ProductStatusBadge value={product.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/toko/${product.storeSlug}/produk/${product.slug}`}
                        className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        <Eye className="h-3.5 w-3.5" /> Lihat
                      </Link>
                      <EditProductButton product={product} />
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create Product Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Produk Baru">
        <CreateProductForm
          stores={activeStores}
          availableCategories={availableCategories}
          onSuccess={(name) => {
            setModalOpen(false);
            showToast(`Produk "${name}" berhasil ditambahkan.`, "success");
          }}
          onError={() => showToast("Gagal menambahkan produk. Coba lagi.", "error")}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Hapus Produk"
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
            <AlertTriangle className="h-7 w-7 text-rose-600" />
          </div>
          <p className="text-sm text-slate-600">
            Yakin ingin menghapus produk{" "}
            <span className="font-semibold text-slate-900">&ldquo;{deleteTarget?.name}&rdquo;</span>?
            <br />
            <span className="text-xs text-slate-400">Tindakan ini tidak dapat dibatalkan.</span>
          </p>
          <div className="flex w-full gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="flex-1 rounded-2xl border px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </button>
          </div>
        </div>
      </Modal>
    </section>
    </>
  );
}

function CreateProductForm({
  stores: activeStores,
  availableCategories,
  onSuccess,
  onError,
}: {
  stores: { id: string; name: string }[];
  availableCategories: { id: string; name: string }[];
  onSuccess?: (name: string) => void;
  onError?: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles.slice(0, 5));
  };

  return (
    <form
      action={async (formData: FormData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
          files.forEach((file) => {
            formData.append("images", file);
          });
          await createProductFromForm(formData);
          onSuccess?.(formData.get("name") as string);
        } catch {
          onError?.();
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      {/* Toko */}
      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Toko</span>
        <select name="storeId" className="w-full rounded-2xl border px-4 py-3 bg-white" required>
          {activeStores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </label>

      <FormInput
        label="Nama produk"
        name="name"
        required
        placeholder="Contoh: Kopi Arabika"
        inputClassName="bg-white focus:bg-white"
      />

      {/* Kategori */}
      <div className="space-y-2 text-sm font-medium text-slate-700">
        <span>Kategori</span>
        {availableCategories.length > 0 ? (
          <select
            name="category"
            required
            defaultValue=""
            className="w-full rounded-2xl border px-4 py-3 bg-white text-slate-900 focus:border-slate-400 focus:outline-none"
          >
            <option value="" disabled>Pilih kategori...</option>
            {availableCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        ) : (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Belum ada kategori. Minta admin tambahkan kategori terlebih dahulu.
          </p>
        )}
      </div>

      <FormInput
        label="Harga"
        name="price"
        type="number"
        step="100"
        required
        placeholder="10000"
        inputClassName="bg-white focus:bg-white"
      />

      <FormTextarea
        label="Deskripsi produk"
        name="description"
        placeholder="Jelaskan detail produk Anda..."
        className="md:col-span-2"
        textareaClassName="bg-white focus:bg-white"
      />

      {/* Photo Upload - Aceternity FileUpload */}
      <div className="space-y-3 md:col-span-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Foto produk</span>
          <span className="text-xs text-slate-400">{files.length}/5 foto</span>
        </div>
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
          <FileUpload
            maxFiles={5}
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-2 md:col-span-2">
        <button 
          disabled={files.length === 0 || isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="h-4 w-4" /> 
          {isSubmitting ? "Menyimpan..." : `Tambah Produk (${files.length} foto)`}
        </button>
      </div>
    </form>
  );
}

function ProductStatusBadge({ value }: { value: string }) {
  const config: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    removed: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  };

  const c = config[value] ?? { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text} ${c.border}`}>
      {value}
    </span>
  );
}
