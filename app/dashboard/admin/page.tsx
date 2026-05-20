import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Building2, Users, MessageSquare, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  await connection();
  const supabase = await createClient();

  const thisMonthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();

  const [
    { count: schoolCount },
    { count: userCount },
    { count: feedbackCount },
    { count: thisMonthCount },
  ] = await Promise.all([
    supabase
      .from("schools")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("feedbacks").select("*", { count: "exact", head: true }),
    supabase
      .from("feedbacks")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thisMonthStart),
  ]);

  const stats = [
    {
      label: "Aktif Okul",
      value: schoolCount ?? 0,
      icon: Building2,
      iconColor: "text-slate-700",
      iconBg: "bg-slate-100",
    },
    {
      label: "Satış Personeli",
      value: userCount ?? 0,
      icon: Users,
      iconColor: "text-slate-700",
      iconBg: "bg-slate-100",
    },
    {
      label: "Toplam Feedback",
      value: feedbackCount ?? 0,
      icon: MessageSquare,
      iconColor: "text-slate-700",
      iconBg: "bg-slate-100",
    },
    {
      label: "Bu Ay",
      value: thisMonthCount ?? 0,
      icon: TrendingUp,
      iconColor: "text-slate-700",
      iconBg: "bg-slate-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Sayfa başlığı */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Genel Bakış
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Şirketinizin saha performansına genel bakış
          </p>
        </div>
      </div>

      {/* Metrik kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, iconColor, iconBg }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4"
          >
            <div
              className={`h-9 w-9 rounded-lg ${iconBg} flex items-center justify-center`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{value}</p>
              <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hızlı Aksiyonlar */}
      <div>
        <h2 className="text-sm font-medium text-zinc-900 mb-3">Hızlı Aksiyonlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Yeni Okul Ekle", href: "/dashboard/admin/schools", desc: "Okul kaydı oluştur" },
            { label: "Kullanıcı Davet Et", href: "/dashboard/admin/users", desc: "Ekibinize üye ekleyin" },
            { label: "Raporları Görüntüle", href: "/dashboard/admin/reports", desc: "Feedback analizleri" },
          ].map(({ label, href, desc }) => (
            <a
              key={href}
              href={href}
              className="flex flex-col gap-1 bg-white rounded-xl border border-zinc-200 p-5 hover:border-slate-200 hover:bg-slate-100/40 transition-colors group"
            >
              <p className="text-sm font-medium text-zinc-900 group-hover:text-slate-800">
                {label}
              </p>
              <p className="text-xs text-zinc-500">{desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Boş durum */}
      <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
        <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center mx-auto mb-4 border border-zinc-200">
          <MessageSquare className="h-5 w-5 text-zinc-400" />
        </div>
        <p className="text-sm font-medium text-zinc-900">Son aktivite yok</p>
        <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">
          Saha ekibiniz feedback girmeye başladığında burada görünecek.
        </p>
      </div>
    </div>
  );
}
