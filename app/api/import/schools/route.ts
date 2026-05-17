import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const rowSchema = z.object({
  school_name: z.string().min(2),
  city: z.string().min(1),
  district: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  contact_person: z.string().optional(),
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
      .select("company_id")
      .eq("id", user.id)
      .single();
    if (!profile) return NextResponse.json({ error: "Profil bulunamadı" }, { status: 403 });

    const valid = rows
      .map((r) => rowSchema.safeParse(r))
      .filter((r) => r.success)
      .map((r) => ({ ...(r as { success: true; data: z.infer<typeof rowSchema> }).data, company_id: profile.company_id }));

    if (valid.length === 0) {
      return NextResponse.json({ error: "Geçerli satır bulunamadı" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("schools")
      .insert(valid)
      .select();
    if (error) throw error;

    return NextResponse.json({ inserted: data?.length ?? 0, skipped: rows.length - valid.length });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
