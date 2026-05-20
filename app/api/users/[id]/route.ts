import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  full_name: z.string().min(2).optional(),
  role: z.enum(["admin", "sales"]).optional(),
  is_active: z.boolean().optional(),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı").optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Admin yetkisi kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const { password, ...profileFields } = parsed.data;

    // Profil alanlarını güncelle (varsa)
    if (Object.keys(profileFields).length > 0) {
      const { error } = await supabase
        .from("users")
        .update(profileFields)
        .eq("id", id);
      if (error) throw error;
    }

    // Şifre güncellemesi (varsa) — admin client gerektirir
    if (password) {
      const adminClient = createAdminClient();
      const { error: authError } = await adminClient.auth.admin.updateUserById(id, { password });
      if (authError) throw authError;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Kendi hesabını deaktive etmeye çalışıyor mu?
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === id) {
      return NextResponse.json(
        { error: "Kendi hesabınızı deaktive edemezsiniz" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("users")
      .update({ is_active: false })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
