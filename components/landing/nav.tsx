"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/features", label: "Özellikler" },
  { href: "/pricing", label: "Fiyatlandırma" },
  { href: "/docs", label: "Dokümantasyon" },
  { href: "/contact", label: "İletişim" },
];

export function LandingNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-slate-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm select-none">R</span>
          </div>
          <span className="font-semibold text-slate-900 text-[15px] tracking-tight">
            Responduct
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md transition-colors"
          >
            Giriş Yap
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-medium px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-800 text-white transition-colors"
          >
            Ücretsiz Başla
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-slate-500 hover:text-slate-900"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menüyü aç/kapat"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-slate-700 py-2.5"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center text-sm font-medium py-2.5 rounded-md border border-slate-200 text-slate-700"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileOpen(false)}
              className="block text-center text-sm font-medium py-2.5 rounded-md bg-slate-700 hover:bg-slate-800 text-white transition-colors"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
