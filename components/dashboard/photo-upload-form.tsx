"use client";

import { useActionState, useState } from "react";
import { ImagePlus, CircleCheckBig, CircleAlert } from "lucide-react";
import { updateUserPhoto } from "@/actions/auth";
import { ImageUploadField } from "@/components/ui/image-upload-field";
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
        <ImageUploadField
          id="dashboard-photo"
          name="photo"
          label="Foto profil toko"
          preview={preview}
          onChange={handleChange}
          required
          emptyText="Pilih foto profil toko"
          filledText="Ganti foto profil"
          previewAlt="Preview foto profil"
          layout="inline"
          tone="amber"
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
