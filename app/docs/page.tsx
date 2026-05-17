import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { LandingNav } from "@/components/landing/nav";
import { DocsSidebar } from "@/components/docs-sidebar";

export const metadata = {
  title: "Dokümantasyon — Responduct",
  description: "Responduct kullanım kılavuzu",
};

const H2_IDS: Record<string, string> = {
  "1. Giriş": "giris",
  "2. Yönetici (Admin) Kılavuzu": "yonetici-kilavuzu",
  "3. Saha Personeli Kılavuzu": "saha-personeli-kilavuzu",
  "4. Mobil Kullanım": "mobil-kullanim",
  "5. Sık Sorulan Sorular": "sik-sorulan-sorular",
};

const H3_IDS: Record<string, string> = {
  "2.1 Genel Bakış": "admin-genel-bakis",
  "2.2 Okul Yönetimi": "okul-yonetimi",
  "2.3 Ürün Yönetimi": "urun-yonetimi",
  "2.4 Kullanıcı Yönetimi": "kullanici-yonetimi",
  "2.5 Atamalar": "atamalar",
  "2.6 Raporlar": "raporlar",
  "3.1 Genel Bakış": "saha-genel-bakis",
  "3.2 Feedback Girişi": "feedback-girisi",
  "3.3 Feedbacklerim": "feedbacklerim",
  "3.4 Okullarım": "okullarim",
};

export default function DocsPage() {
  const filePath = path.join(process.cwd(), "docs", "KULLANIM-KILAVUZU.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const content = raw.replace(/\(\.\.\/public\/tutorial\//g, "(/tutorial/");

  return (
    <>
      <LandingNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 xl:w-64 shrink-0 border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <DocsSidebar />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-6 xl:px-12 py-10">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-10 pb-5 border-b border-slate-200">
                  {children}
                </h1>
              ),
              h2: ({ children }) => {
                const text = String(children);
                const id = H2_IDS[text] ?? text;
                return (
                  <h2
                    id={id}
                    className="text-xl font-semibold text-slate-900 mt-14 mb-5 scroll-mt-20"
                  >
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const text = String(children);
                const id = H3_IDS[text] ?? text;
                return (
                  <h3
                    id={id}
                    className="text-base font-semibold text-slate-800 mt-8 mb-3 scroll-mt-20"
                  >
                    {children}
                  </h3>
                );
              },
              h4: ({ children }) => (
                <h4 className="text-sm font-semibold text-slate-700 mt-5 mb-2 scroll-mt-20">
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {children}
                </p>
              ),
              img: ({ src, alt }) => (
                <div className="my-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt ?? ""} className="w-full" />
                </div>
              ),
              hr: () => <hr className="my-10 border-slate-100" />,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-slate-200 pl-4 py-1 my-4 rounded-r-lg text-sm text-slate-600 bg-slate-50">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1.5 mb-4 text-sm text-slate-600">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1.5 mb-4 text-sm text-slate-600">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-800">{children}</strong>
              ),
              code: ({ children }) => (
                <code className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                  {children}
                </code>
              ),
              a: ({ href, children }) => (
                <Link
                  href={href ?? "#"}
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  {children}
                </Link>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </main>
      </div>

      <footer className="bg-slate-700 border-t border-slate-600 py-6 text-center">
        <p className="text-sm text-slate-300">
          © {new Date().getFullYear()} Responduct
        </p>
      </footer>
    </>
  );
}
