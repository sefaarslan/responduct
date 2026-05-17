import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { UsersClient } from "@/components/admin/users-client";

export default async function UsersPage() {
  await connection();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: users } = await supabase
    .from("users")
    .select("id, full_name, email, role, is_active, created_at")
    .order("full_name");

  return (
    <UsersClient
      initialUsers={users ?? []}
      currentUserId={user?.id ?? ""}
    />
  );
}
