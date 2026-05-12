import Image from "next/image";
import Link from "next/link";
import Home from "@/public/home.jpeg"
import OptimizedWavyBackground from "./optimized-wavy-background";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white px-6 pb-12 pt-24 text-slate-900 md:pb-16 md:pt-28">
          <div className="absolute inset-x-0 top-0 z-0 h-130 overflow-hidden">
            <OptimizedWavyBackground />
          </div>
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0.75)_45%,rgba(255,255,255,0.92)_100%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 lg:gap-12">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
          <div className="max-w-3xl">
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-[#0B1120] sm:text-6xl lg:text-7xl">
              Tim Kami
              <span className="block text-slate-500">Membangun kerja sama</span>
              <span className="block">menjadi hasil nyata.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">
              Kami mengerjakan proyek dengan semangat kolaborasi, inovasi, dan
              dedikasi untuk mencapai hasil terbaik. Bergabunglah dengan kami
              untuk menciptakan solusi yang berdampak dan membangun masa depan
              yang lebih baik bersama-sama.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/team"
                className="inline-flex items-center justify-center rounded-full bg-[#0B1120] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-black"
              >
                Lihat Tim
              </Link>
              <Link
                href="/produk"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/85 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-400"
              >
                Jelajahi Produk
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { value: "Kolaboratif", label: "Cara kerja yang terbuka dan adaptif" },
                { value: "Terstruktur", label: "Proses jelas dari ide sampai rilis" },
                { value: "Berdampak", label: "Fokus pada hasil yang relevan" },
              ].map((item) => (
                <div
                  key={item.value}
                  className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 hidden rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur md:block lg:-left-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Workflow
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                Ide, desain, bangun, evaluasi
              </p>
            </div>

            <div className="absolute -right-2 bottom-8 hidden w-56 rounded-[1.75rem] bg-[#0B1120] p-5 text-white shadow-[0_28px_80px_rgba(15,23,42,0.28)] md:block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                Fokus Kami
              </p>
              <p className="mt-3 text-lg font-semibold leading-7">
                Membangun solusi yang rapi, cepat dipakai, dan mudah berkembang.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/70 p-3 shadow-[0_30px_100px_rgba(15,23,42,0.16)] backdrop-blur">
              <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2rem] md:aspect-[5/6] lg:aspect-[4/4.8]">
                <Image
                  src={Home}
                  alt="Students Community"
                  fill
                  priority
                  quality={65}
                  sizes="(min-width: 1280px) 560px, (min-width: 1024px) 44vw, (min-width: 768px) 80vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,32,0.02),rgba(11,17,32,0.08)_62%,rgba(11,17,32,0.2)_100%)]" />
              </div>

              <div className="grid gap-3 px-1 pb-1 pt-4 sm:grid-cols-3">
                {[
                  "Kolaborasi lintas peran",
                  "Eksekusi yang konsisten",
                  "Pendekatan yang human-centered",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.35rem] border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur md:grid-cols-3 md:p-5">
          {[
            {
              title: "Tim yang sinkron",
              text: "Setiap anggota bergerak dengan ritme yang sama, sehingga pekerjaan terasa lebih cepat dan lebih rapi.",
            },
            {
              title: "Keputusan yang terarah",
              text: "Kami menyederhanakan proses diskusi menjadi langkah konkret yang bisa dieksekusi dan dievaluasi.",
            },
            {
              title: "Hasil yang enak dipakai",
              text: "Output bukan hanya selesai, tapi juga jelas, nyaman dipakai, dan siap dikembangkan lebih lanjut.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
