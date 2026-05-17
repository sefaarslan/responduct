import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const questionSchema = z.object({
  question_text: z.string().min(5, "Soru en az 5 karakter olmalı"),
  is_required: z.boolean().default(false),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("product_id", id)
      .eq("is_active", true)
      .order("order_index");
    if (error) throw error;
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = questionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { count } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("product_id", id)
      .eq("is_active", true);

    const { data, error } = await supabase
      .from("questions")
      .insert({
        ...parsed.data,
        product_id: id,
        order_index: (count ?? 0) + 1,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
