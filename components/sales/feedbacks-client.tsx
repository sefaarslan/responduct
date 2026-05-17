"use client";

import { useState } from "react";
import { CheckCircle2, Clock, ChevronRight, X, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Question {
  question_text: string;
  order_index: number;
}

interface Answer {
  id: string;
  answer_text: string | null;
  is_skipped: boolean;
  questions: Question | null;
}

interface Feedback {
  id: string;
  visit_date: string | null;
  status: string;
  created_at: string;
  schools: { school_name: string; city: string | null; district: string | null } | null;
  products: { product_name: string } | null;
  feedback_answers: Answer[];
}

interface FeedbacksClientProps {
  feedbacks: Feedback[];
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
  const [detail, setDetail] = useState<Feedback | null>(null);

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

  // Detay dialogu için yanıtları sırala
  const sortedAnswers = (fb: Feedback) =>
    [...fb.feedback_answers].sort(
      (a, b) => (a.questions?.order_index ?? 0) - (b.questions?.order_index ?? 0)
    );

  return (
    <>
      <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
        {feedbacks.map((fb) => (
          <button
            key={fb.id}
            onClick={() => setDetail(fb)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors text-left"
          >
            <div className="flex items-start gap-4 min-w-0">
              {/* Durum ikonu */}
              <div className="mt-0.5 shrink-0">
                {fb.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-500" />
                )}
              </div>

              {/* Bilgiler */}
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

      {/* Detay diyalogu */}
      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="truncate">
              {detail?.schools?.school_name ?? "Feedback Detayı"}
            </DialogTitle>
            <DialogDescription>
              {detail?.products?.product_name}
              {detail?.visit_date && ` · ${formatDate(detail.visit_date)}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {detail && sortedAnswers(detail).length === 0 && (
              <p className="text-sm text-zinc-400 py-4 text-center">
                Bu feedback için yanıt kaydedilmemiş.
              </p>
            )}
            {detail &&
              sortedAnswers(detail).map((answer, i) => (
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
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
