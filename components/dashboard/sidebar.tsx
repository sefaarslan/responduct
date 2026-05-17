"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Package,
  Users,
  Link2,
  BarChart3,
  PlusCircle,
  MapPin,
  LogOut,
  ClipboardList,
} from "lucide-react";

type Role = "admin" | "sales";

interface SidebarProps {
  role: Role;
  fullName: string;
}

const adminNav = [
  { href: "/dashboard/admin", label: "Genel Bakış", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/schools", label: "Okullar", icon: Building2, exact: false },
  { href: "/dashboard/admin/products", label: "Ürünler", icon: Package, exact: false },
  { href: "/dashboard/admin/users", label: "Kullanıcılar", icon: Users, exact: false },
  { href: "/dashboard/admin/assignments", label: "Atamalar", icon: Link2, exact: false },
  { href: "/dashboard/admin/reports", label: "Raporlar", icon: BarChart3, exact: false },
];

const salesNav = [
  { href: "/dashboard/sales", label: "Genel Bakış", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/sales/feedback", label: "Yeni Feedback", icon: PlusCircle, exact: false },
  { href: "/dashboard/sales/feedbacks", label: "Feedbacklerim", icon: ClipboardList, exact: false },
  { href: "/dashboard/sales/schools", label: "Okullarım", icon: MapPin, exact: false },
];

export function Sidebar({ role, fullName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = role === "admin" ? adminNav : salesNav;

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-zinc-200 bg-white shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-slate-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm select-none">R</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-900">
            Responduct
          </span>
        </div>
      </div>

      {/* Navigasyon */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {role === "admin" ? "Yönetim" : "Saha"}
        </p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-800 font-medium"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Kullanıcı & Çıkış */}
      <div className="border-t border-zinc-200 p-3 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-slate-800">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">{fullName}</p>
            <p className="text-xs text-zinc-500">
              {role === "admin" ? "Yönetici" : "Satış Personeli"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Çıkış yap
        </button>
      </div>
    </aside>
  );
}
