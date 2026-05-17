import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { FeedbackWizard } from "@/components/sales/feedback-wizard";

interface School {
  id: string;
  school_name: string;
  city: string | null;
  district: string | null;
}

interface Product {
  id: string;
  product_name: string;
}

interface Question {
  id: string;
  product_id: string;
  question_text: string;
  order_index: number;
  is_required: boolean;
}

export default async function FeedbackPage() {
  await connection();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 0. Aylık limit kontrolü
  const thisMonthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();

  const [{ data: company }, { count: monthlyCount }] = await Promise.all([
    supabase
      .from("companies")
      .select("max_feedbacks_monthly")
      .single(),
    supabase
      .from("feedbacks")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thisMonthStart),
  ]);

  const maxMonthly = company?.max_feedbacks_monthly ?? -1;
  const usedMonthly = monthlyCount ?? 0;
  const limitReached = maxMonthly !== -1 && usedMonthly >= maxMonthly;
  const limitWarning = maxMonthly !== -1 && !limitReached && usedMonthly >= maxMonthly * 0.8;

  if (limitReached) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
          <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-amber-600 font-bold text-lg">!</span>
          </div>
          <h2 className="text-base font-semibold text-zinc-900 mb-2">
            Aylık feedback limitine ulaşıldı
          </h2>
          <p className="text-sm text-zinc-500 mb-1">
            Bu ay {usedMonthly} / {maxMonthly} feedback kaydedildi.
          </p>
          <p className="text-sm text-zinc-500">
            Yeni feedback eklemek için yöneticinizle iletişime geçin veya bir sonraki aya bekleyin.
          </p>
        </div>
      </div>
    );
  }

  // 1. Atanmış okullar
  const { data: schoolAssignments } = await supabase
    .from("school_assignments")
    .select("school_id, schools(id, school_name, city, district)")
    .eq("user_id", user.id);

  const schools: School[] = (schoolAssignments ?? [])
    .map((a) => a.schools as School | null)
    .filter((s): s is School => !!s);

  const schoolIds = schools.map((s) => s.id);

  // 2. Her okulun ürünleri
  const { data: productAssignments } =
    schoolIds.length > 0
      ? await supabase
          .from("school_product_assignments")
          .select("school_id, product_id")
          .in("school_id", schoolIds)
      : { data: [] };

  const productIds = [
    ...new Set((productAssignments ?? []).map((pa) => pa.product_id)),
  ];

  let products: Product[] = [];
  if (productIds.length > 0) {
    const { data } = await supabase
      .from("products")
      .select("id, product_name")
      .in("id", productIds)
      .eq("is_active", true);
    products = (data as Product[]) ?? [];
  }

  // Okul → ürünler haritası
  const schoolProductMap: Record<string, Product[]> = {};
  for (const pa of productAssignments ?? []) {
    const product = products.find((p) => p.id === pa.product_id);
    if (!product) continue;
    if (!schoolProductMap[pa.school_id]) schoolProductMap[pa.school_id] = [];
    schoolProductMap[pa.school_id].push(product);
  }

  // 3. Tüm soruları çek
  let questions: Question[] = [];
  if (productIds.length > 0) {
    const { data } = await supabase
      .from("questions")
      .select("id, product_id, question_text, order_index, is_required")
      .in("product_id", productIds)
      .eq("is_active", true)
      .order("order_index");
    questions = (data as Question[]) ?? [];
  }

  return (
    <div className="py-2">
      {limitWarning && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Aylık limitinizin dolmak üzere: {usedMonthly} / {maxMonthly} feedback kullanıldı.
        </div>
      )}
      <FeedbackWizard
        schools={schools}
        schoolProductMap={schoolProductMap}
        questions={questions}
      />
    </div>
  );
}
