"use client";

import { useState } from "react";
import { CheckCircle2, Clock, ChevronRight, ClipboardList, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

interface FeedbackListItem {
  id: string;
  visit_date: string | null;
  status: string;
  created_at: string;
  schools: { school_name: string; city: string | null; district: string | null } | null;
  products: { product_name: string } | null;
}

interface Answer {
  id: string;
  answer_text: string | null;
  is_skipped: boolean;
  questions: { question_text: string; order_index: number } | null;
}

interface FeedbacksClientProps {
  feedbacks: FeedbackListItem[];
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function FeedbacksClient({ feedbacks }: FeedbacksClientProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackListItem | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const openDetail = async (fb: FeedbackListItem) => {
    setSelectedFeedback(fb);
    setAnswers([]);
    setLoadingDetail(true);

    const supabase = createClient();
    const { data } = await supabase
      .from("feedback_answers")
      .select("id, answer_text, is_skipped, questions(question_text, order_index)")
      .eq("feedback_id", fb.id)
      .order("questions(order_index)", { ascending: true });

    setAnswers((data as Answer[]) ?? []);
    setLoadingDetail(false);
  };

  const closeDetail = () => {
    setSelectedFeedback(null);
    setAnswers([]);
  };

  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="h-5 w-5 text-zinc-400" />
        </div>
        <p className="text-sm font-medium text-zinc-900">Henüz feedback girilmedi</p>
        <p className="text-sm text-zinc-500 mt-1">
          "Yeni Feedback" butonuna tıklayarak ilk kaydınızı oluşturun.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
        {feedbacks.map((fb) => (
          <button
            key={fb.id}
            onClick={() => openDetail(fb)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors text-left"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="mt-0.5 shrink-0">
                {fb.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">
                  {fb.schools?.school_name ?? "—"}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-zinc-500">
                    {fb.products?.product_name ?? "—"}
                  </span>
                  {fb.visit_date && (
                    <>
                      <span className="text-zinc-300 text-xs">·</span>
                      <span className="text-xs text-zinc-400">
                        {formatDate(fb.visit_date)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <Badge
                className={
                  fb.status === "completed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs"
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-xs"
                }
              >
                {fb.status === "completed" ? "Tamamlandı" : "Taslak"}
              </Badge>
              <ChevronRight className="h-4 w-4 text-zinc-300" />
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="truncate">
              {selectedFeedback?.schools?.school_name ?? "Feedback Detayı"}
            </DialogTitle>
            <DialogDescription>
              {selectedFeedback?.products?.product_name}
              {selectedFeedback?.visit_date && ` · ${formatDate(selectedFeedback.visit_date)}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
              </div>
            ) : answers.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center">
                Bu feedback için yanıt kaydedilmemiş.
              </p>
            ) : (
              answers.map((answer, i) => (
                <div
                  key={answer.id}
                  className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 space-y-1"
                >
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    Soru {i + 1}
                  </p>
                  <p className="text-sm font-medium text-zinc-900">
                    {answer.questions?.question_text ?? "—"}
                  </p>
                  {answer.is_skipped ? (
                    <p className="text-sm text-zinc-400 italic">Atlandı</p>
                  ) : answer.answer_text ? (
                    <p className="text-sm text-zinc-700 leading-relaxed">
                      {answer.answer_text}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-400 italic">Yanıtlanmadı</p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
