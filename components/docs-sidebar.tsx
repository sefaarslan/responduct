"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const nav = [
  { id: "giris", label: "Giriş", level: 0 },
  { id: "yonetici-kilavuzu", label: "Yönetici Kılavuzu", level: 0 },
  { id: "admin-genel-bakis", label: "Genel Bakış", level: 1 },
  { id: "okul-yonetimi", label: "Okul Yönetimi", level: 1 },
  { id: "urun-yonetimi", label: "Ürün Yönetimi", level: 1 },
  { id: "kullanici-yonetimi", label: "Kullanıcı Yönetimi", level: 1 },
  { id: "atamalar", label: "Atamalar", level: 1 },
  { id: "raporlar", label: "Raporlar", level: 1 },
  { id: "saha-personeli-kilavuzu", label: "Saha Personeli Kılavuzu", level: 0 },
  { id: "saha-genel-bakis", label: "Genel Bakış", level: 1 },
  { id: "feedback-girisi", label: "Feedback Girişi", level: 1 },
  { id: "feedbacklerim", label: "Feedbacklerim", level: 1 },
  { id: "okullarim", label: "Okullarım", level: 1 },
  { id: "mobil-kullanim", label: "Mobil Kullanım", level: 0 },
  { id: "sik-sorulan-sorular", label: "Sık Sorulan Sorular", level: 0 },
];

export function DocsSidebar() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -80% 0px" }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="py-10 pr-6">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
        İçindekiler
      </p>
      <ul className="space-y-0.5">
        {nav.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                className={`
                  flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors
                  ${item.level === 1 ? "ml-3" : ""}
                  ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-medium"
                      : item.level === 0
                      ? "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }
                `}
              >
                {item.level === 1 && (
                  <span className="mr-2 text-slate-300">—</span>
                )}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
