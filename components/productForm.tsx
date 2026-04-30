"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createProduct,
  type ProductActionState,
} from "@/actions/products";

const initialState: ProductActionState = {
  success: false,
  message: "",
};

export function ProductForm() {
  const [state, formAction] = useActionState(createProduct, initialState);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-3xl border bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Nama Produk
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="Contoh: Kopi Arabica"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Harga
        </label>
        <input
          name="price"
          type="number"
          step="100"
          required
          placeholder="Contoh: 25000"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Deskripsi
        </label>
        <textarea
          name="description"
          placeholder="Deskripsi singkat produk"
          className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Gambar Produk
        </label>
        <input
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-slate-800"
        />
      </div>

      <SubmitButton />

      {state.message ? (
        <p
          className={
            state.success ? "text-sm text-emerald-600" : "text-sm text-rose-600"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Menyimpan..." : "Tambah Produk"}
    </button>
  );
}
