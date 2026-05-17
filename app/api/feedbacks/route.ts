import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const answerSchema = z.object({
  question_id: z.string().uuid(),
  answer_text: z.string(),
  is_skipped: z.boolean(),
});

const feedbackSchema = z.object({
  school_id: z.string().uuid(),
  product_id: z.string().uuid(),
  visit_date: z.string(),
  answers: z.array(answerSchema),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const { school_id, product_id, visit_date, answers } = parsed.data;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const { data: profile } = await supabase
      .from("users")
      .select("company_id, role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "sales") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const { data: feedback, error: feedbackError } = await supabase
      .from("feedbacks")
      .insert({
        company_id: profile.company_id,
        school_id,
        product_id,
        user_id: user.id,
        status: "completed",
        visit_date,
      })
      .select()
      .single();

    if (feedbackError) throw feedbackError;

    if (answers.length > 0) {
      const { error: answersError } = await supabase
        .from("feedback_answers")
        .insert(
          answers.map((a) => ({
            feedback_id: feedback.id,
            question_id: a.question_id,
            answer_text: a.answer_text,
            is_skipped: a.is_skipped,
          }))
        );
      if (answersError) throw answersError;
    }

    return NextResponse.json({ id: feedback.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
