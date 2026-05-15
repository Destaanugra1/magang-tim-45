"use client";

import { CircleAlert, CircleCheckBig } from "lucide-react";
import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { register } from "@/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormInput } from "@/components/ui/form-field";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { defaultAuthState } from "@/lib/auth/default-auth-state";

export function SignUpForm() {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState(
    register,
    defaultAuthState,
  );
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [role, setRole] = useState("customer");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <FormInput
        label="Nama"
        name="name"
        type="text"
        placeholder="Nama lengkap"
        required
        errors={state.errors?.name}
      />

      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Daftar sebagai
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
        >
          <option value="customer">Customer</option>
          <option value="pengusaha">Pengusaha / pemilik UMKM</option>
        </select>
        {state.errors?.role ? (
          <p className="mt-2 text-sm text-rose-600">{state.errors.role[0]}</p>
        ) : null}
      </div>

      {role === "pengusaha" ? (
        <ImageUploadField
          id="photo"
          name="photo"
          label="Foto Profil Toko"
          preview={photoPreview}
          onChange={handlePhotoChange}
          required
          emptyText="Upload foto profil toko"
          filledText="Ganti foto"
          previewAlt="Preview foto profil"
          helperText="Foto ini akan ditampilkan sebagai profil toko Anda di halaman produk."
        />
      ) : null}

      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="nama@email.com"
        required
        errors={state.errors?.email}
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        placeholder="Minimal 8 karakter"
        required
        errors={state.errors?.password}
      />

      {state.message ? (
        <Alert variant={state.success ? "default" : "destructive"}>
          {state.success ? (
            <CircleCheckBig className="h-4 w-4" />
          ) : (
            <CircleAlert className="h-4 w-4" />
          )}
          <AlertTitle>{state.success ? "Berhasil" : "Pendaftaran gagal"}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Membuat akun..." : "Daftar"}
      </button>
    </form>
  );
}
