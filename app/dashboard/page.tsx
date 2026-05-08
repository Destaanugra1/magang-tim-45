import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ProductDashboardTable } from "@/components/dashboard/product-dashboard-table";
import { db } from "@/db";
import { products } from "@/db/schema";
import { safeAuth } from "@/lib/auth/safe-auth";
import { logout } from "@/actions/logout";

export default async function DashboardPage() {
  const session = await safeAuth();

  if (!session?.user) {
    redirect("/dashboard/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const productList = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  const dashboardProducts = productList.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: String(product.price),
    imageUrl: product.imageUrl,
    createdAt: product.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-white px-6 py-28 text-slate-900">
      <section className="mx-auto max-w-7xl rounded-3xl border bg-slate-50 p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="inline-flex rounded-full border bg-white px-3 py-1 text-sm text-slate-600">
              Dashboard Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Kelola Produk
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Halo, <strong>{session.user.name}</strong>. Di sini kamu bisa
              menambah, mengubah, dan menghapus data produk.
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-[22px] bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </form>
        </div>
        

        <div className="mt-8">
          <ProductDashboardTable products={dashboardProducts} />
        </div>
      </section>
    </main>
  );
}
