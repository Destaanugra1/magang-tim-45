import { desc, ilike, or } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const productList = await db
    .select()
    .from(products)
    .where(
      query
        ? or(
            ilike(products.name, `%${query}%`),
            ilike(products.description, `%${query}%`),
          )
        : undefined,
    )
    .orderBy(desc(products.createdAt));

  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-28 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <FadeIn className="mb-12 max-w-3xl">
          <p className="mb-4 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium text-slate-600">
            katalog produk
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Daftar Produk
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Halaman ini hanya menampilkan daftar produk. Untuk membuka detail
            produk, pengguna wajib login terlebih dahulu.
          </p>
        </FadeIn>

        <FadeIn className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Produk Tersedia</h2>
            <p className="mt-1 text-sm text-slate-500">
              {query
                ? `Menampilkan hasil pencarian untuk "${query}".`
                : "Pilih produk untuk melihat detail lengkapnya."}
            </p>
          </div>

          <div className="rounded-full border px-4 py-2 text-sm text-slate-600">
            {productList.length} produk
          </div>
        </FadeIn>

        {productList.length === 0 ? (
          <FadeIn className="rounded-3xl border bg-slate-50 p-8 text-slate-500 shadow-sm">
            {query ? "Produk yang dicari tidak ditemukan." : "Belum ada produk."}
          </FadeIn>
        ) : (
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  unoptimized
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {product.name}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                    {product.description || "Tidak ada deskripsi."}
                  </p>

                  <p className="mt-4 font-semibold text-slate-900">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>

                  <Link
                    href={`/produk/${product.id}`}
                    className="mt-5 inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Lihat detail
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </main>
  );
}
