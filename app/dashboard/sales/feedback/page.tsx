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
      <FeedbackWizard
        schools={schools}
        schoolProductMap={schoolProductMap}
        questions={questions}
      />
    </div>
  );
}
