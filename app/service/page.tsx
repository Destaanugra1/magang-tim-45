import React from 'react'

const page = () => {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm text-slate-600 mb-6">Our Services</div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Solusi Digital Modern untuk Bisnis Anda</h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">Kami membantu membangun produk digital yang cepat, menarik, dan siap berkembang dengan teknologi terbaru.</p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <a href="#services" className="px-6 py-3 rounded-2xl bg-slate-900 text-white hover:-translate-y-0.5 transition">Lihat Layanan</a>
        </div>
      </section>
      <section id="services" className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-3xl border p-8 shadow-sm"><h3 className="text-xl font-semibold">Web Development</h3><p className="mt-3 text-slate-600">Website cepat, SEO friendly, dan scalable menggunakan Next.js.</p></div>
        <div className="rounded-3xl border p-8 shadow-sm"><h3 className="text-xl font-semibold">UI/UX Design</h3><p className="mt-3 text-slate-600">Desain antarmuka modern, bersih, dan fokus pada pengalaman pengguna.</p></div>
        <div className="rounded-3xl border p-8 shadow-sm"><h3 className="text-xl font-semibold">Landing Page</h3><p className="mt-3 text-slate-600">Halaman promosi yang menarik untuk meningkatkan konversi bisnis.</p></div>
        <div className="rounded-3xl border p-8 shadow-sm"><h3 className="text-xl font-semibold">Maintenance</h3><p className="mt-3 text-slate-600">Perawatan website, update sistem, dan peningkatan performa rutin.</p></div>
        <div className="rounded-3xl border p-8 shadow-sm"><h3 className="text-xl font-semibold">API Integration</h3><p className="mt-3 text-slate-600">Integrasi pembayaran, pengiriman, dan sistem pihak ketiga.</p></div>
        <div className="rounded-3xl border p-8 shadow-sm"><h3 className="text-xl font-semibold">Consultation</h3><p className="mt-3 text-slate-600">Diskusi strategi digital dan pengembangan produk terbaik.</p></div>
      </section>
      <section id="pricing" className="border-t">
      </section>
    </main>
  )
}

export default page