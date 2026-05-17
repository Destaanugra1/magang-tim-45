"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit3 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { FileUpload } from "@/components/ui/file-upload";
import { FormInput, FormTextarea } from "@/components/ui/form-field";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { updateStoreFromForm } from "@/actions/stores";
import { updateProductFromForm } from "@/actions/products";

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
          <FormInput
            label="Nama Toko"
            name="name"
            defaultValue={store.name}
            required
            inputClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
          />
          <RichTextEditor
            label="Deskripsi"
            name="description"
            value={store.description}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Provinsi"
              name="province"
              defaultValue={store.province}
              required
              inputClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
            />
            <FormInput
              label="Kabupaten/Kota"
              name="regency"
              defaultValue={store.regency}
              required
              inputClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Kecamatan"
              name="district"
              defaultValue={store.district}
              required
              inputClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
            />
            <FormInput
              label="Desa/Kelurahan"
              name="village"
              defaultValue={store.village}
              inputClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
            />
          </div>
          <FormTextarea
            label="Alamat Detail"
            name="address"
            defaultValue={store.address}
            required
            rows={2}
            textareaClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
          />
          <FormInput
            label="WhatsApp"
            name="whatsappNumber"
            defaultValue={store.whatsappNumber}
            required
            inputClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
          />
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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
            imageFiles.forEach((file) => {
              formData.append("images", file);
            });
            await updateProductFromForm(formData);
            setImageFiles([]);
            setModalOpen(false);
          }}
          className="grid gap-4"
        >
          <FormInput
            label="Nama Produk"
            name="name"
            defaultValue={product.name}
            required
            inputClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Kategori"
              name="category"
              defaultValue={product.category}
              required
              inputClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
            />
            <FormInput
              label="Harga"
              name="price"
              type="number"
              defaultValue={product.price}
              required
              inputClassName="rounded-xl bg-white px-4 py-2.5 focus:bg-white"
            />
          </div>
          <RichTextEditor
            label="Deskripsi"
            name="description"
            value={product.description}
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Foto Produk</p>
                <p className="mt-1 text-xs text-slate-500">
                  Upload foto baru untuk mengganti semua foto produk saat ini.
                </p>
              </div>
              {product.imageUrl ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              ) : null}
            </div>
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
              <FileUpload
                maxFiles={5}
                accept="image/png,image/jpeg,image/webp"
                onChange={setImageFiles}
              />
            </div>
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
