import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { FeedbacksClient } from "@/components/sales/feedbacks-client";

export default async function FeedbacksPage() {
  await connection();
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/auth/login");

  const { data: feedbacks } = await supabase
    .from("feedbacks")
    .select("id, visit_date, status, created_at, schools(school_name, city, district), products(product_name)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Feedbacklerim
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {feedbacks?.length ?? 0} kayıt
        </p>
      </div>
      <FeedbacksClient feedbacks={feedbacks ?? []} />
    </div>
  );
}
