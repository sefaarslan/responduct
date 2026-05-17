import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const rowSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "sales"]),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows: unknown[] = body.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const { data: profile } = await supabase
      .from("users")
      .select("company_id, role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const adminClient = createAdminClient();
    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      const parsed = rowSchema.safeParse(row);
      if (!parsed.success) { skipped++; continue; }

      const { error: authError } = await adminClient.auth.admin.createUser({
        email: parsed.data.email,
        password: parsed.data.password,
        email_confirm: true,
        user_metadata: {
          full_name: parsed.data.full_name,
          company_id: profile.company_id,
          role: parsed.data.role,
        },
      });

      if (authError) {
        skipped++;
      } else {
        inserted++;
      }
    }

    return NextResponse.json({ inserted, skipped });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
