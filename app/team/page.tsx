import anggota from "@/data/biodata.json";
import Link from "next/link";
import TiltedCard from "@/components/TiltedCard";

export default function AnggotaCard() {
  return (
    <section className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-3">
          Tim Magang 45
        </h1>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {anggota.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="w-full h-96">
                <TiltedCard
                  imageSrc={item.foto}
                  altText={item.namaLengkap}
                  captionText={item.namaLengkap}
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={12}
                  scaleOnHover={1.07}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="h-full w-full flex items-end p-4">
                      <p className="text-white text-sm font-semibold drop-shadow">
                        {item.namaLengkap}
                      </p>
                    </div>
                  }
                />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {item.namaLengkap}
                </h2>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
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