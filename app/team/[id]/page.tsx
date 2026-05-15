import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, GraduationCap } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import anggota from "@/db/data/biodata.json";

type DetailAnggotaProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailAnggota({ params }: DetailAnggotaProps) {
  const { id } = await params;
  const user = anggota.find((item) => item.id === Number(id));

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">Anggota tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back */}
      <div className="pt-20 pb-4 px-6 max-w-3xl mx-auto">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Tim
        </Link>
      </div>

      {/* Card */}
      <FadeIn className="max-w-3xl mx-auto px-6 pb-20">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Cover photo */}
          <div className="relative h-64 w-full bg-slate-100">
            <Image
              src={user.foto}
              alt={user.namaLengkap}
              fill
              className="object-cover object-center"
              sizes="(min-width: 768px) 768px, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Avatar + info */}
          <div className="px-8 pb-8">
            {/* Avatar overlapping cover */}
            <div className="relative -mt-14 mb-5 flex justify-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-white shadow-md bg-slate-100">
                <Image
                  src={user.foto}
                  alt={user.namaLengkap}
                  fill
                  className="object-cover object-center"
                  sizes="112px"
                />
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">{user.namaLengkap}</h1>

              <div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  <span>{user.kampus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{user.alamat}</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.98]"
                >
                  <ArrowLeft className="h-4 w-4" /> Kembali
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
