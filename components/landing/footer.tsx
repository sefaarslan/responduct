import Link from "next/link";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-700 border-t border-slate-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-white/15 flex items-center justify-center">
              <span className="text-white font-bold text-sm select-none">R</span>
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">
              Responduct
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            {[
              { href: "/features", label: "Özellikler" },
              { href: "/pricing", label: "Fiyatlandırma" },
              { href: "/contact", label: "İletişim" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-200 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-sm text-slate-300">
            © {year} Responduct. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
