import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { MobileHeader } from "@/components/dashboard/mobile-header";

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
        <MobileHeader role={profile.role as "admin" | "sales"} />

        <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-5xl">{children}</div>
        </main>

        <MobileNav role={profile.role as "admin" | "sales"} />
      </div>
    </div>
  );
}
