import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { ReportsClient } from "@/components/admin/reports-client";

export default async function ReportsPage() {
  await connection();
  const supabase = await createClient();

  const [
    { data: feedbacks },
    { data: schools },
    { data: products },
    { data: users },
  ] = await Promise.all([
    supabase
      .from("feedbacks")
      .select(
        "id, visit_date, status, created_at, schools(school_name, city), products(product_name), users(full_name)"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("schools")
      .select("id, school_name")
      .eq("is_active", true)
      .order("school_name"),
    supabase
      .from("products")
      .select("id, product_name")
      .eq("is_active", true)
      .order("product_name"),
    supabase
      .from("users")
      .select("id, full_name")
      .eq("is_active", true)
      .order("full_name"),
  ]);

  return (
    <ReportsClient
      feedbacks={feedbacks ?? []}
      schools={schools ?? []}
      products={products ?? []}
      users={users ?? []}
    />
  );
}
