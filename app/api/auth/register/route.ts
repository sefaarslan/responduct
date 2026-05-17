import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { company_name, full_name, email, password } = await request.json();

    if (!company_name || !full_name || !email || !password) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Şirketi oluştur (service role ile — RLS bypass)
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({ company_name })
      .select("id")
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: "Şirket oluşturulamadı" },
        { status: 500 }
      );
    }

    // 2. Auth kullanıcısını oluştur — metadata ile company_id ve role inject edilir.
    //    on_auth_user_created trigger'ı public.users kaydını otomatik açar.
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // E-posta doğrulamasını atla (MVP için)
        user_metadata: {
          company_id: company.id,
          full_name,
          role: "admin",
        },
      });

    if (authError || !authData.user) {
      // Kullanıcı oluşturulamazsa şirketi geri sil
      await supabase.from("companies").delete().eq("id", company.id);
      return NextResponse.json(
        { error: authError?.message ?? "Kullanıcı oluşturulamadı" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
