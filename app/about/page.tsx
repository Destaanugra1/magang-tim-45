import React from 'react'
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";

const about = () => {
  return (
      <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <FadeIn>
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm text-slate-600 mb-6">About Us</div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">Kami Tim 45, Membangun Solusi Digital Modern</h1>
          <p className="mt-6 text-lg text-slate-600 max-w-xl">Fokus kami adalah menghadirkan website cepat, UI elegan, dan pengalaman pengguna terbaik menggunakan teknologi modern seperti Next.js dan React.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#story" className="px-6 py-3 rounded-2xl bg-slate-900 text-white shadow-sm hover:-translate-y-0.5 transition">Cerita Kami</a>
            <a href="#team" className="px-6 py-3 rounded-2xl border hover:bg-slate-50 transition">Tim Kami</a>
          </div>
        </FadeIn>
        <Stagger className="grid grid-cols-2 gap-4">
          <StaggerItem className="rounded-3xl border p-6 shadow-sm">
            <div className="text-3xl font-semibold">3+</div>
            <div className="text-slate-500 mt-2">Bidang Keahlian</div>
          </StaggerItem>
          <StaggerItem className="rounded-3xl border p-6 shadow-sm mt-8">
            <div className="text-3xl font-semibold">50+</div>
            <div className="text-slate-500 mt-2">Ide & Proyek</div>
          </StaggerItem>
          <StaggerItem className="rounded-3xl border p-6 shadow-sm -mt-2">
            <div className="text-3xl font-semibold">100%</div>
            <div className="text-slate-500 mt-2">Semangat Belajar</div>
          </StaggerItem>
          <StaggerItem className="rounded-3xl border p-6 shadow-sm mt-6">
            <div className="text-3xl font-semibold">24/7</div>
            <div className="text-slate-500 mt-2">Kolaborasi</div>
          </StaggerItem>
        </Stagger>
      </section>
      <section id="story" className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12">
          <FadeIn>
            <h2 className="text-3xl font-semibold">Cerita Kami</h2>
            <p className="mt-5 text-slate-600 leading-8">Tim 45 terbentuk dari semangat belajar, berkembang, dan menciptakan sesuatu yang berdampak. Kami percaya bahwa desain yang baik dan teknologi yang tepat dapat menyelesaikan banyak masalah.</p>
          </FadeIn>
          <Stagger className="space-y-4">
            <StaggerItem className="rounded-2xl border p-5"><div className="font-semibold">Vision</div><p className="text-slate-600 mt-2">Menjadi tim kreatif yang menghadirkan produk digital bernilai tinggi.</p></StaggerItem>
            <StaggerItem className="rounded-2xl border p-5"><div className="font-semibold">Mission</div><p className="text-slate-600 mt-2">Membangun solusi modern, cepat, dan mudah digunakan.</p></StaggerItem>
          </Stagger>
        </div>
      </section>
    </main>
  )
}

export default about
