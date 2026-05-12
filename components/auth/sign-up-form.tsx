"use client";

import { CircleAlert, CircleCheckBig } from "lucide-react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { register } from "@/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { defaultAuthState } from "@/lib/auth/default-auth-state";

export function SignUpForm() {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState(
    register,
    defaultAuthState,
  );
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nama
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Nama lengkap"
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
        />
        {state.errors?.name ? (
          <p className="mt-2 text-sm text-rose-600">{state.errors.name[0]}</p>
        ) : null}
      </div>

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
          defaultValue="customer"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
        >
          <option value="customer">Customer</option>
          <option value="pengusaha">Pengusaha / pemilik UMKM</option>
        </select>
        {state.errors?.role ? (
          <p className="mt-2 text-sm text-rose-600">{state.errors.role[0]}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="nama@email.com"
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
        />
        {state.errors?.email ? (
          <p className="mt-2 text-sm text-rose-600">{state.errors.email[0]}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Minimal 8 karakter"
          required
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
        />
        {state.errors?.password ? (
          <p className="mt-2 text-sm text-rose-600">
            {state.errors.password[0]}
          </p>
        ) : null}
      </div>

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
