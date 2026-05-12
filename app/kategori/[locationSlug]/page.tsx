import { redirect } from "next/navigation";

export default async function LocationCategoryPage({
  params,
}: {
  params: Promise<{ locationSlug: string }>;
}) {
  const { locationSlug } = await params;
  redirect(`/produk?lokasi=${encodeURIComponent(locationSlug.replace(/-/g, " "))}`);
}
