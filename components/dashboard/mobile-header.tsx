"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

interface MobileHeaderProps {
  role: "admin" | "sales";
}

export function MobileHeader({ role }: MobileHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="md:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-zinc-200">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-slate-700 flex items-center justify-center">
          <span className="text-white font-bold text-sm select-none">R</span>
        </div>
        <span className="font-semibold text-sm tracking-tight text-zinc-900">
          Responduct
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md">
          {role === "admin" ? "Yönetici" : "Satış"}
        </span>
        <button
          onClick={handleLogout}
          className="p-2 text-zinc-400 hover:text-red-600 transition-colors rounded-lg"
          aria-label="Çıkış yap"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
