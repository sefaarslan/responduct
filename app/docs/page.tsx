import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { LandingNav } from "@/components/landing/nav";

export const metadata = {
  title: "Dokümantasyon — Responduct",
  description: "Responduct kullanım kılavuzu",
};

export default function DocsPage() {
  const filePath = path.join(process.cwd(), "docs", "KULLANIM-KILAVUZU.md");
  const raw = fs.readFileSync(filePath, "utf-8");

  const content = raw.replace(
    /\(\.\.\/public\/tutorial\//g,
    "(/tutorial/"
  );

  return (
    <>
      <LandingNav />
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <article className="prose-docs">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-8 pb-4 border-b border-slate-200">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-slate-900 mt-12 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-1">
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
                hr: () => <hr className="my-10 border-slate-200" />,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-slate-300 pl-4 py-1 my-4 bg-slate-50 rounded-r-lg text-sm text-slate-600">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 mb-4 text-sm text-slate-600">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 mb-4 text-sm text-slate-600">
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
          </article>
        </div>
      </main>

      <footer className="bg-slate-700 border-t border-slate-600 py-6 text-center">
        <p className="text-sm text-slate-300">
          © {new Date().getFullYear()} Responduct
        </p>
      </footer>
    </>
  );
}
