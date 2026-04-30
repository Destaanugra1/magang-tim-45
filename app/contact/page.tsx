import React from 'react'
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";

const page = () => {
  return (
    <div className="bg-white min-h-screen">
     <main className="bg-white text-slate-900 pb-20 md:pb-6">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-24 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
        <FadeIn>
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-xs sm:text-sm text-slate-600 mb-6">Contact Us</div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight leading-tight">Mari Bangun Sesuatu yang Hebat Bersama Tim 45</h1>
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-xl">Kami siap membantu pembuatan website, UI modern, pengembangan Next.js, dan solusi digital untuk bisnis atau proyek Anda.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href="#form" className="w-full sm:w-auto text-center px-6 py-3 rounded-2xl bg-slate-900 text-white shadow-sm hover:-translate-y-0.5 transition">Hubungi Sekarang</a>
            <a href="mailto:hello@tim45.id" className="w-full sm:w-auto text-center px-6 py-3 rounded-2xl border hover:bg-slate-50 transition">Email Kami</a>
          </div>
          <Stagger className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            <StaggerItem className="rounded-2xl border p-4"><div className="text-2xl font-semibold">50+</div><div className="text-sm text-slate-500">Project</div></StaggerItem>
            <StaggerItem className="rounded-2xl border p-4"><div className="text-2xl font-semibold">24/7</div><div className="text-sm text-slate-500">Support</div></StaggerItem>
            <StaggerItem className="rounded-2xl border p-4"><div className="text-2xl font-semibold">100%</div><div className="text-sm text-slate-500">Modern UI</div></StaggerItem>
          </Stagger>
        </FadeIn>
        <FadeIn id="form" className="rounded-3xl border shadow-sm p-5 sm:p-8 bg-white">
          <h2 className="text-2xl font-semibold">Kirim Pesan</h2>
          <p className="text-slate-500 mt-2">Balas cepat dan profesional.</p>
          <div className="mt-6 space-y-4">
            <input className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" placeholder="Nama lengkap" />
            <input className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" placeholder="Email aktif" />
            <input className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" placeholder="Subjek" />
            <textarea rows={5} className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" placeholder="Tulis kebutuhan Anda..."></textarea>
            <button className="w-full rounded-2xl bg-slate-900 text-white py-3 hover:opacity-90 transition">Kirim Sekarang</button>
          </div>
        </FadeIn>
      </section>
 
    </main>
    </div>
  )
}

export default page
