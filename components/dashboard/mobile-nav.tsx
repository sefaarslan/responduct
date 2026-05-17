"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Package,
  Users,
  BarChart3,
  PlusCircle,
  ClipboardList,
  MapPin,
} from "lucide-react";

const adminNav = [
  { href: "/dashboard/admin", label: "Genel", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/schools", label: "Okullar", icon: Building2, exact: false },
  { href: "/dashboard/admin/users", label: "Kullanıcılar", icon: Users, exact: false },
  { href: "/dashboard/admin/reports", label: "Raporlar", icon: BarChart3, exact: false },
];

const salesNav = [
  { href: "/dashboard/sales", label: "Genel", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/sales/feedback", label: "Yeni", icon: PlusCircle, exact: false },
  { href: "/dashboard/sales/feedbacks", label: "Feedbackler", icon: ClipboardList, exact: false },
  { href: "/dashboard/sales/schools", label: "Okullarım", icon: MapPin, exact: false },
];

export function MobileNav({ role }: { role: "admin" | "sales" }) {
  const pathname = usePathname();
  const navItems = role === "admin" ? adminNav : salesNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200">
      <div className="flex items-center justify-around h-16 px-2 safe-area-pb">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 flex-1 py-2 rounded-lg transition-colors",
                isActive ? "text-slate-800" : "text-zinc-400"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-slate-700")} />
              <span className={cn("text-[10px] font-medium", isActive ? "text-slate-700" : "text-zinc-400")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
