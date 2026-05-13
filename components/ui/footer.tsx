import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm">
                U
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                UMKM Digital
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
              Platform digital untuk mendukung dan mempromosikan produk UMKM lokal dari seluruh Indonesia.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { label: "Beranda", href: "/" },
                { label: "Produk", href: "/produk" },
                { label: "Tim", href: "/team" },
                { label: "Tentang Kami", href: "/about" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-500 transition hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Bantuan
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { label: "Kontak", href: "/contact" },
                { label: "Layanan", href: "/service" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Daftar", href: "/register" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-500 transition hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Hubungi Kami
            </h3>
            <p className="mt-4 text-sm text-slate-500 leading-7">
              Email: halo@umkm-digital.id
              <br />
              WhatsApp: +62 812-3456-7890
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} UMKM Digital. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-slate-500 transition hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-slate-500 transition hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
