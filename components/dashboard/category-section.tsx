"use client";

import { useState, useCallback } from "react";
import {
  Tag,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { FormInput } from "@/components/ui/form-field";
import { createCategoryFromForm, deleteCategoryFromForm } from "@/actions/categories";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
};

type Toast = { message: string; type: "success" | "error" } | null;

function ToastNotif({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-lg ${
        ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"
      }`}
    >
      {ok ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
      <span className="text-sm font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100">
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CategorySection({ categories }: { categories: CategoryRow[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      const fd = new FormData();
      fd.append("id", deleteTarget.id);
      await deleteCategoryFromForm(fd);
      showToast(`Kategori "${deleteTarget.name}" dihapus.`, "success");
    } catch {
      showToast("Gagal menghapus kategori.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <ToastNotif toast={toast} onClose={() => setToast(null)} />

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-50 p-2.5 text-violet-600">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Kategori Produk</h2>
              <p className="mt-1 text-sm text-slate-500">{categories.length} kategori</p>
            </div>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> Tambah Kategori
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          {categories.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <Tag className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">Belum ada kategori. Klik &ldquo;Tambah Kategori&rdquo;.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Nama</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-violet-100 text-xs font-bold text-violet-700">
                          {cat.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="font-medium text-slate-900">{cat.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">{cat.slug}</TableCell>
                    <TableCell className="text-slate-500">{cat.description ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => !isCreating && setCreateOpen(false)} title="Tambah Kategori">
        <form
          action={async (fd: FormData) => {
            if (isCreating) return;
            setIsCreating(true);
            try {
              await createCategoryFromForm(fd);
              showToast(`Kategori "${fd.get("name")}" berhasil ditambahkan.`, "success");
              setCreateOpen(false);
            } catch {
              showToast("Gagal menambahkan kategori.", "error");
            } finally {
              setIsCreating(false);
            }
          }}
          className="flex flex-col gap-4"
        >
          <FormInput
            label="Nama Kategori"
            name="name"
            required
            placeholder="Contoh: Kuliner"
            inputClassName="bg-white focus:bg-white"
          />
          <FormInput
            label="Deskripsi"
            name="description"
            placeholder="Opsional"
            inputClassName="bg-white focus:bg-white"
          />
          <button
            disabled={isCreating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Menyimpan..." : "Tambah Kategori"}
          </button>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteTarget} onClose={() => !isDeleting && setDeleteTarget(null)} title="Hapus Kategori">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
            <AlertTriangle className="h-7 w-7 text-rose-600" />
          </div>
          <p className="text-sm text-slate-600">
            Yakin ingin menghapus kategori{" "}
            <span className="font-semibold text-slate-900">&ldquo;{deleteTarget?.name}&rdquo;</span>?
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
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
