"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { ImagePlus, CircleCheckBig, CircleAlert } from "lucide-react";
import { updateUserPhoto } from "@/actions/auth";
import { defaultAuthState } from "@/lib/auth/default-auth-state";

export function PhotoUploadForm() {
  const [state, formAction, isPending] = useActionState(updateUserPhoto, defaultAuthState);
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-amber-100 p-2.5 text-amber-600">
          <ImagePlus className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-amber-900">Lengkapi Profil Toko</h2>
          <p className="mt-1 text-sm text-amber-700">
            Upload foto profil toko agar toko Anda tampil lebih menarik di halaman produk.
          </p>
        </div>
      </div>

      <form action={formAction} className="mt-5 flex flex-col gap-4" encType="multipart/form-data">
        <label
          htmlFor="dashboard-photo"
          className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-amber-200 bg-white p-4 transition hover:border-amber-400"
        >
          {preview ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
              <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-400">
              <ImagePlus className="h-7 w-7" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-700">
              {preview ? "Ganti foto profil" : "Pilih foto profil toko"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">JPG, PNG, WEBP — maks 3 MB</p>
          </div>
        </label>
        <input
          id="dashboard-photo"
          name="photo"
          type="file"
          accept="image/*"
          required
          onChange={handleChange}
          className="sr-only"
        />

        {state.message ? (
          <div className={`flex items-center gap-2 rounded-2xl p-3 text-sm ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {state.success ? <CircleCheckBig className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
            {state.message}
          </div>
        ) : null}

        <div>
          <button
            type="submit"
            disabled={isPending || !preview}
            className="rounded-2xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Mengupload..." : "Simpan Foto Profil"}
          </button>
        </div>
      </form>
    </section>
  );
}
