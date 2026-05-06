import { redirect } from "next/navigation";

export default async function ProductDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  redirect(`/produk/${id}`);
}
