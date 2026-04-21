import Image from "next/image";
import anggota from "@/data/biodata.json";
import Link from "next/link";

export default function AnggotaCard() {
  return (
    <section className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-3">
          Tim Magang
        </h1>
        <p className="text-center text-gray-500 mb-12">
          Data anggota dibuat dinamis dari JSON
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {anggota.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="relative h-72 w-full">
                <Image
                  src={item.foto}
                  alt={item.namaLengkap}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {item.namaLengkap}
                </h2>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {/* <p>
                    <span className="font-medium text-gray-800">Alamat:</span>{" "}
                    {item.alamat}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">Kampus:</span>{" "}
                    {item.kampus}
                  </p> */}
                </div>

                <Link href={`/team/${item.id}`} className="mt-6 w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition">
                  Lihat Profil
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}