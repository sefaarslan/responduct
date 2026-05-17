import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schoolSchema = z.object({
  school_name: z.string().min(2, "Okul adı en az 2 karakter olmalı"),
  city: z.string().min(2, "Şehir gerekli"),
  district: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  contact_person: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .order("school_name");
    if (error) throw error;
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schoolSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
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

    const { data, error } = await supabase
      .from("schools")
      .insert({ ...parsed.data, company_id: profile.company_id })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
