import { ForgotPasswordForm } from "@/components/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-svh bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex flex-col items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-slate-700 flex items-center justify-center">
          <span className="text-white font-bold text-lg select-none">R</span>
        </div>
        <span className="text-base font-semibold tracking-tight text-slate-900">
          Responduct
        </span>
      </Link>

      {/* Kart */}
      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-xl shadow-sm px-8 py-10 border-t-2 border-t-slate-700">
        <ForgotPasswordForm />
      </div>

      <p className="mt-6 text-xs text-zinc-400">
        © {new Date().getFullYear()} Responduct
      </p>
    </div>
  );
}
