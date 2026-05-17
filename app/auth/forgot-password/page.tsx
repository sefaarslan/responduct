import { ForgotPasswordForm } from "@/components/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="mb-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Responduct
        </Link>
      </div>

      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
