import ButtonBack from "@/components/ui/Buttonback";
import { FadeIn } from "@/components/ui/motion";
import anggota from "@/data/biodata.json";
import Image from "next/image";

type DetailAnggotaProps = {
    params: {
        id: string;
    }
}

export default async function DetailAnggota({ params }: DetailAnggotaProps) {
    const resolveprams = await params;
  const user = anggota.find(
    (item) => item.id === Number(resolveprams.id)
  );

  if (!user) {
    return <h1>User tidak ditemukan</h1>;
  }

  return (
    <section className="min-h-screen bg-white px-6 py-16">
      <FadeIn className="max-w-4xl mx-auto bg-white border rounded-3xl shadow p-8">
        <ButtonBack title="Kembali" />
        <div className="relative w-60 h-60 mx-auto">
          <Image
            src={user.foto}
            alt={user.namaLengkap}
            fill
            className="rounded-3xl object-cover"
          />
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-4xl font-bold">
            {user.namaLengkap}
          </h1>

          <p className="mt-4 text-gray-600">
            {user.alamat}
          </p>

          <p className="text-gray-600">
            {user.kampus}
          </p>

          <p className="mt-3 text-sm text-gray-400">
            ID: {user.id}
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
