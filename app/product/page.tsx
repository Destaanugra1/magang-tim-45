import { desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";
import Image from "next/image";
import { ProductForm } from "@/components/productForm";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import Link from "next/link";

export default async function HomePage() {
  const session = await safeAuth();
  const isAdmin = session?.user?.role === "admin";
  const productList = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-28 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <FadeIn className="mb-12 max-w-3xl">
          <p className="mb-4 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium text-slate-600">
            product makanan
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Kelola Produk dengan Supabase
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Tambahkan produk baru dengan mudah menggunakan form di bawah, dan
            lihat daftar produk yang sudah tersimpan ORM.
          </p>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:items-start">
          <FadeIn>
            {isAdmin ? (
              <ProductForm />
            ) : (
              <div className="space-y-4 rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">
                  Area Admin
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Form tambah produk hanya bisa dipakai akun admin.
                </p>
                {session?.user ? (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Kamu login sebagai <strong>{session.user.role}</strong>.
                  </p>
                ) : (
                  <Link
                    href="/dashboard/login"
                    className="inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Login untuk lanjut
                  </Link>
                )}
              </div>
            )}
          </FadeIn>

          <div>
            <FadeIn className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Daftar Produk</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Produk yang sudah tersimpan akan muncul di sini.
                </p>
              </div>

              <div className="rounded-full border px-4 py-2 text-sm text-slate-600">
                {productList.length} produk
              </div>
            </FadeIn>

            {productList.length === 0 ? (
              <FadeIn className="rounded-3xl border bg-slate-50 p-8 text-slate-500 shadow-sm">
                Belum ada produk.
              </FadeIn>
            ) : (
              <Stagger className="grid gap-4 sm:grid-cols-2">
                {productList.map((product) => (
                  <StaggerItem
                    key={product.id}
                    className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-48 w-full object-cover"
                      width={400}
                      height={400}
                    />

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {product.description || "Tidak ada deskripsi."}
                      </p>

                      <p className="mt-4 font-semibold text-slate-900">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
