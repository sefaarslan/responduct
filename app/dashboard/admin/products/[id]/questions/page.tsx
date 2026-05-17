import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { QuestionsClient } from "@/components/admin/questions-client";

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, product_name")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("product_id", id)
    .eq("is_active", true)
    .order("order_index");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Ürünlere Dön
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Sorular
        </h1>
      </div>

      <QuestionsClient
        productId={product.id}
        productName={product.product_name}
        initialQuestions={questions ?? []}
      />
    </div>
  );
}
