import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { SchoolsClient } from "@/components/admin/schools-client";

export default async function SchoolsPage() {
  await connection();
  const supabase = await createClient();

  const { data: schools } = await supabase
    .from("schools")
    .select("*")
    .order("school_name");

  return <SchoolsClient initialSchools={schools ?? []} />;
}
