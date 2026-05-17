import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { ProductsClient } from "@/components/admin/products-client";

export default async function ProductsPage() {
  await connection();
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, questions(id)")
    .order("product_name");

  return <ProductsClient initialProducts={products ?? []} />;
}
