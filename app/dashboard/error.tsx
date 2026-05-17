"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </div>
      <h2 className="text-base font-semibold text-zinc-900 mb-2">
        Sayfa yüklenemedi
      </h2>
      <p className="text-sm text-zinc-500 max-w-xs mb-6">
        Bir sorun oluştu. Sayfayı yenilemeyi deneyin, sorun devam ederse yöneticinizle iletişime geçin.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium px-5 h-9 rounded-lg transition-colors"
      >
        Tekrar dene
      </button>
    </div>
  );
}
