import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-svh bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="h-12 w-12 rounded-xl bg-slate-700 flex items-center justify-center mb-6">
        <span className="text-white font-bold text-xl select-none">R</span>
      </div>
      <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-3">
        404
      </p>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
        Sayfa bulunamadı
      </h1>
      <p className="text-sm text-slate-500 max-w-xs mb-8">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium px-5 h-10 rounded-lg transition-colors"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}
