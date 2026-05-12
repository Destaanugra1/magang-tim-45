import Link from "next/link";
import { redirect } from "next/navigation";
import { safeAuth } from "@/lib/auth/safe-auth";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default async function RegisterPage() {
  const session = await safeAuth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-28 text-slate-900">
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <p className="mb-3 inline-flex rounded-full border px-3 py-1 text-sm text-slate-600">
          Register
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Buat akun baru
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Pilih customer untuk belanja, atau pengusaha untuk membuat toko UMKM.
          Akun pertama tetap otomatis menjadi <strong>admin</strong>.
        </p>

        <div className="mt-8">
          <SignUpForm />
        </div>

        <p className="mt-6 text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/dashboard/login" className="font-semibold text-slate-900">
            Login di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
