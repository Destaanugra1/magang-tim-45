import anggota from "@/db/data/biodata.json";
import Link from "next/link";
import Image from "next/image";
import { MapPin, GraduationCap } from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";

export default function AnggotaCard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-24 pb-14 px-6 text-center border-b border-gray-100">
        <FadeIn>
          <span className="inline-block rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
            Tim Kami
          </span>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Tim Magang 45</h1>
          <p className="mt-3 text-gray-500 text-base max-w-md mx-auto">
            Kenali anggota tim yang berdedikasi di balik platform ini.
          </p>
        </FadeIn>
      </div>

      {/* Cards */}
      <div className="px-6 py-14 max-w-5xl mx-auto">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {anggota.map((item) => (
            <StaggerItem key={item.id}>
              <div className="group flex flex-col rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {/* Photo */}
                <div className="relative h-72 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={item.foto}
                    alt={item.namaLengkap}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-3 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                    {item.namaLengkap}
                  </h2>

                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>{item.kampus}</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>{item.alamat}</span>
                  </div>

                  <Link
                    href={`/team/${item.id}`}
                    className="mt-2 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.98]"
                  >
                    Lihat Profil
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
