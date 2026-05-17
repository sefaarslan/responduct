import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/login");

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar role={profile.role as "admin" | "sales"} fullName={profile.full_name} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobil header */}
        <header className="md:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm select-none">R</span>
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-900">
              Responduct
            </span>
          </div>
          <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md">
            {profile.role === "admin" ? "Yönetici" : "Satış"}
          </span>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
