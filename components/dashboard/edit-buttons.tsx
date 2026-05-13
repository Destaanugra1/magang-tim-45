"use client";

import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { updateStoreFromForm } from "@/actions/stores";
import { updateProductFromForm, deleteProductFromForm } from "@/actions/products";
import Link from "next/link";
import Image from "next/image";

type StoreType = {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  whatsappNumber: string;
  status: string;
};

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

export function EditStoreButton({ store }: { store: StoreType }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
      >
        <Edit3 className="h-3.5 w-3.5" /> Edit
      </button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Edit Toko">
        <form
          action={async (formData: FormData) => {
            formData.append("id", store.id);
            await updateStoreFromForm(formData);
            setModalOpen(false);
          }}
          className="grid gap-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nama Toko</label>
            <input
              name="name"
              defaultValue={store.name}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Deskripsi</label>
            <textarea
              name="description"
              defaultValue={store.description}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Provinsi</label>
              <input
                name="province"
                defaultValue={store.province}
                required
                className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Kabupaten/Kota</label>
              <input
                name="regency"
                defaultValue={store.regency}
                required
                className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Kecamatan</label>
              <input
                name="district"
                defaultValue={store.district}
                required
                className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Desa/Kelurahan</label>
              <input
                name="village"
                defaultValue={store.village}
                className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Alamat Detail</label>
            <textarea
              name="address"
              defaultValue={store.address}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">WhatsApp</label>
            <input
              name="whatsappNumber"
              defaultValue={store.whatsappNumber}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function EditProductButton({ product }: { product: ProductWithStore }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
      >
        <Edit3 className="h-3.5 w-3.5" /> Edit
      </button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Edit Produk">
        <form
          action={async (formData: FormData) => {
            formData.append("id", product.id);
            await updateProductFromForm(formData);
            setModalOpen(false);
          }}
          className="grid gap-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nama Produk</label>
            <input
              name="name"
              defaultValue={product.name}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Kategori</label>
              <input
                name="category"
                defaultValue={product.category}
                required
                className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Harga</label>
              <input
                name="price"
                type="number"
                defaultValue={product.price}
                required
                className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Deskripsi</label>
            <textarea
              name="description"
              defaultValue={product.description}
              className="w-full rounded-xl border px-4 py-2.5 text-slate-900"
              rows={4}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
