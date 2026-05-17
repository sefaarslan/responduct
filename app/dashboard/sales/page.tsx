import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { MapPin, Plus, CheckCircle2, Clock } from "lucide-react";

export default async function SalesDashboardPage() {
  await connection();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: assignments } = await supabase
    .from("school_assignments")
    .select("school_id, schools(school_name, city, district)")
    .eq("user_id", user.id);

  const schools = assignments?.map((a) => a.schools).filter(Boolean) ?? [];

  const { data: recentFeedbacks } = await supabase
    .from("feedbacks")
    .select("id, visit_date, status, schools(school_name), products(product_name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Sayfa başlığı */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Genel Bakış
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Atanmış okullarınız ve son ziyaretleriniz
          </p>
        </div>
        <a
          href="/dashboard/sales/feedback"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Feedback
        </a>
      </div>

      {/* Okullar */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-zinc-900">
            Atanmış Okullarım
          </h2>
          <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-medium">
            {schools.length}
          </span>
        </div>

        {schools.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center mx-auto mb-4 border border-zinc-200">
              <MapPin className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900">Okul atanmadı</p>
            <p className="text-sm text-zinc-500 mt-1">
              Yöneticinizle iletişime geçin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {schools.map((school, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-zinc-200 p-4 flex items-start gap-3 hover:border-indigo-200 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {school?.school_name}
                  </p>
                  {school?.city && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {school.district ? `${school.district}, ` : ""}
                      {school.city}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Son Feedbackler */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-900">Son Feedbackler</h2>

        {!recentFeedbacks || recentFeedbacks.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
            <p className="text-sm text-zinc-500">Henüz feedback girilmedi.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
            {recentFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-zinc-900">
                    {fb.schools?.school_name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {fb.products?.product_name}
                    {fb.visit_date && ` · ${fb.visit_date}`}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    fb.status === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {fb.status === "completed" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {fb.status === "completed" ? "Tamamlandı" : "Taslak"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
