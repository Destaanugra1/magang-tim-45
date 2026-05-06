import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await safeAuth();

  if (!session?.user) {
    redirect(`/dashboard/login?callbackUrl=${encodeURIComponent(`/produk/${id}`)}`);
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-28 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/produk"
          className="mb-8 inline-flex rounded-full border px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
        >
          Kembali ke daftar produk
        </Link>

        <div className="grid gap-10 rounded-[2rem] border bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div className="overflow-hidden rounded-[1.5rem] bg-slate-100">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit rounded-full border px-4 py-2 text-sm text-slate-600">
              Detail produk
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight">
              {product.name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {product.description || "Tidak ada deskripsi."}
            </p>

            <p className="mt-8 text-3xl font-semibold text-slate-900">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
