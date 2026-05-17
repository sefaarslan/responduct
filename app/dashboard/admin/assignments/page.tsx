import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { AssignmentsClient } from "@/components/admin/assignments-client";

export default async function AssignmentsPage() {
  await connection();
  const supabase = await createClient();

  const [
    { data: schools },
    { data: salesUsers },
    { data: products },
    { data: schoolUserAssignments },
    { data: schoolProductAssignments },
  ] = await Promise.all([
    supabase
      .from("schools")
      .select("id, school_name, city")
      .eq("is_active", true)
      .order("school_name"),
    supabase
      .from("users")
      .select("id, full_name, email")
      .eq("role", "sales")
      .eq("is_active", true)
      .order("full_name"),
    supabase
      .from("products")
      .select("id, product_name")
      .eq("is_active", true)
      .order("product_name"),
    supabase
      .from("school_assignments")
      .select("school_id, user_id"),
    supabase
      .from("school_product_assignments")
      .select("school_id, product_id"),
  ]);

  // school_id → user_id[] haritası
  const schoolUserMap: Record<string, string[]> = {};
  for (const a of schoolUserAssignments ?? []) {
    if (!schoolUserMap[a.school_id]) schoolUserMap[a.school_id] = [];
    schoolUserMap[a.school_id].push(a.user_id);
  }

  // school_id → product_id[] haritası
  const schoolProductMap: Record<string, string[]> = {};
  for (const a of schoolProductAssignments ?? []) {
    if (!schoolProductMap[a.school_id]) schoolProductMap[a.school_id] = [];
    schoolProductMap[a.school_id].push(a.product_id);
  }

  return (
    <AssignmentsClient
      schools={schools ?? []}
      salesUsers={salesUsers ?? []}
      products={products ?? []}
      schoolUserMap={schoolUserMap}
      schoolProductMap={schoolProductMap}
    />
  );
}
