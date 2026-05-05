import Link from "next/link";
import { redirect } from "next/navigation";
import { safeAuth } from "@/lib/auth/safe-auth";
import { SignInForm } from "@/components/auth/sign-in-form";

export default async function LoginPage() {
  const session = await safeAuth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-28 text-slate-900">
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <p className="mb-3 inline-flex rounded-full border px-3 py-1 text-sm text-slate-600">
          Login
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Masuk ke akun kamu
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Gunakan email dan password yang sudah terdaftar.
        </p>

        <div className="mt-8">
          <SignInForm />
        </div>

        <p className="mt-6 text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-slate-900">
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
