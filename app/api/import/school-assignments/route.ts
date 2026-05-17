import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const rowSchema = z.object({
  school_name: z.string().min(1),
  user_email: z.string().email(),
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

    // Şirkete ait okullar ve kullanıcıları önceden çek
    const [{ data: schools }, { data: salesUsers }] = await Promise.all([
      supabase
        .from("schools")
        .select("id, school_name")
        .eq("company_id", profile.company_id)
        .eq("is_active", true),
      supabase
        .from("users")
        .select("id, email")
        .eq("company_id", profile.company_id)
        .eq("is_active", true),
    ]);

    const schoolMap: Record<string, string> = {};
    for (const s of schools ?? []) {
      schoolMap[s.school_name.trim().toLowerCase()] = s.id;
    }

    const userMap: Record<string, string> = {};
    for (const u of salesUsers ?? []) {
      userMap[u.email.trim().toLowerCase()] = u.id;
    }

    // Mevcut atamaları çek (duplicate kontrolü)
    const { data: existing } = await supabase
      .from("school_assignments")
      .select("school_id, user_id");

    const existingSet = new Set(
      (existing ?? []).map((e) => `${e.school_id}:${e.user_id}`)
    );

    const toInsert: { school_id: string; user_id: string }[] = [];
    let skipped = 0;

    for (const row of rows) {
      const parsed = rowSchema.safeParse(row);
      if (!parsed.success) { skipped++; continue; }

      const schoolId = schoolMap[parsed.data.school_name.trim().toLowerCase()];
      const userId = userMap[parsed.data.user_email.trim().toLowerCase()];

      if (!schoolId || !userId) { skipped++; continue; }
      if (existingSet.has(`${schoolId}:${userId}`)) { skipped++; continue; }

      toInsert.push({ school_id: schoolId, user_id: userId });
      existingSet.add(`${schoolId}:${userId}`);
    }

    if (toInsert.length === 0) {
      return NextResponse.json({ inserted: 0, skipped });
    }

    const { data, error } = await supabase
      .from("school_assignments")
      .insert(toInsert)
      .select();
    if (error) throw error;

    return NextResponse.json({ inserted: data?.length ?? 0, skipped });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
