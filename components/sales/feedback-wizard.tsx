"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Building2,
  Package,
  CheckCircle2,
  MapPin,
  SkipForward,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SpeechRecorder } from "./speech-recorder";

interface School {
  id: string;
  school_name: string;
  city: string | null;
  district: string | null;
}

interface Product {
  id: string;
  product_name: string;
}

interface Question {
  id: string;
  product_id: string;
  question_text: string;
  order_index: number;
  is_required: boolean;
}

interface Answer {
  text: string;
  is_skipped: boolean;
}

interface FeedbackWizardProps {
  schools: School[];
  schoolProductMap: Record<string, Product[]>;
  questions: Question[];
}

type Step = "school" | "product" | "questions" | "summary" | "done";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function FeedbackWizard({
  schools,
  schoolProductMap,
  questions,
}: FeedbackWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("school");
  const [school, setSchool] = useState<School | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentText, setCurrentText] = useState("");
  const [visitDate, setVisitDate] = useState(todayISO());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const productQs = questions.filter((q) => q.product_id === product?.id);
  const currentQ = productQs[qIndex];
  const isLastQ = qIndex >= productQs.length - 1;
  const progress = productQs.length > 0 ? ((qIndex) / productQs.length) * 100 : 0;

  useEffect(() => {
    if (step === "questions" && currentQ) {
      setCurrentText(answers[currentQ.id]?.text ?? "");
    }
  }, [qIndex, step]);

  const saveCurrentAnswer = () => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { text: currentText, is_skipped: false },
    }));
  };

  const skipCurrentAnswer = () => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { text: "", is_skipped: true },
    }));
  };

  const goNextQuestion = () => {
    saveCurrentAnswer();
    if (isLastQ) {
      setStep("summary");
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const goSkipQuestion = () => {
    skipCurrentAnswer();
    if (isLastQ) {
      setStep("summary");
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const goPrevQuestion = () => {
    saveCurrentAnswer();
    if (qIndex === 0) {
      setStep("product");
    } else {
      setQIndex((i) => i - 1);
    }
  };

  const handleSave = async () => {
    if (!school || !product) return;
    setSaving(true);
    setSaveError(null);

    const answersList = productQs.map((q) => ({
      question_id: q.id,
      answer_text: answers[q.id]?.text ?? "",
      is_skipped: answers[q.id]?.is_skipped ?? true,
    }));

    const res = await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        school_id: school.id,
        product_id: product.id,
        visit_date: visitDate,
        answers: answersList,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setStep("done");
    } else {
      const data = await res.json();
      setSaveError(data.error ?? "Kayıt başarısız oldu.");
    }
  };

  // ── DONE ──────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Feedback kaydedildi</h2>
          <p className="text-sm text-zinc-500 mt-2">
            {school?.school_name} · {product?.product_name}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => router.push("/dashboard/sales")}>
            Panele Dön
          </Button>
          <Button
            onClick={() => {
              setStep("school");
              setSchool(null);
              setProduct(null);
              setAnswers({});
              setQIndex(0);
              setCurrentText("");
              setVisitDate(todayISO());
            }}
          >
            Yeni Feedback
          </Button>
        </div>
      </div>
    );
  }

  // ── SCHOOL STEP ───────────────────────────────────────────────────
  if (step === "school") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Yeni Feedback
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Ziyaret ettiğiniz okulu seçin</p>
        </div>

        {schools.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900">Atanmış okul yok</p>
            <p className="text-sm text-zinc-500 mt-1">
              Yöneticinizden size okul atamalarını yapmasını isteyin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {schools.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSchool(s);
                  setProduct(null);
                  setAnswers({});
                  setQIndex(0);
                  setStep("product");
                }}
                className="bg-white rounded-xl border border-zinc-200 p-4 flex items-start gap-3 hover:border-indigo-300 hover:shadow-sm text-left transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{s.school_name}</p>
                  {s.city && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {s.district ? `${s.district}, ` : ""}
                      {s.city}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-300 shrink-0 self-center ml-auto" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── PRODUCT STEP ──────────────────────────────────────────────────
  if (step === "product") {
    const availableProducts = schoolProductMap[school!.id] ?? [];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("school")}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
              {school!.school_name}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Ürün Seçin
            </h1>
          </div>
        </div>

        {availableProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
              <Package className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900">Bu okula ürün atanmamış</p>
            <p className="text-sm text-zinc-500 mt-1">
              Yöneticinizden ürün ataması yapmasını isteyin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {availableProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProduct(p);
                  setAnswers({});
                  setQIndex(0);
                  setStep(
                    questions.filter((q) => q.product_id === p.id).length > 0
                      ? "questions"
                      : "summary"
                  );
                }}
                className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-3 hover:border-indigo-300 hover:shadow-sm text-left transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-zinc-900 flex-1">{p.product_name}</p>
                <ChevronRight className="h-4 w-4 text-zinc-300 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── QUESTIONS STEP ────────────────────────────────────────────────
  if (step === "questions") {
    if (!currentQ) {
      setStep("summary");
      return null;
    }

    return (
      <div className="max-w-xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 gap-2">
            <span className="font-medium truncate">
              {school!.school_name} · {product!.product_name}
            </span>
            <span className="shrink-0">
              {qIndex + 1} / {productQs.length}
            </span>
          </div>
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-700 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
              Soru {qIndex + 1}
            </p>
            <p className="text-base font-medium text-zinc-900 leading-relaxed">
              {currentQ.question_text}
            </p>
            {currentQ.is_required && (
              <span className="inline-block text-xs text-red-500 font-medium">Zorunlu</span>
            )}
          </div>

          <Textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Yanıtınızı buraya yazın ya da sesli giriş yapın…"
            rows={4}
            className="resize-none text-sm"
          />

          <SpeechRecorder
            onResult={(text) =>
              setCurrentText((prev) => (prev ? `${prev} ${text}` : text))
            }
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={goPrevQuestion} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" />
            Geri
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={goSkipQuestion}
            className="gap-1.5 text-zinc-500"
          >
            <SkipForward className="h-4 w-4" />
            Geç
          </Button>
          <Button size="sm" onClick={goNextQuestion} className="gap-1.5">
            {isLastQ ? "Özete Git" : "İleri"}
            {!isLastQ && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }

  // ── SUMMARY STEP ──────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (productQs.length > 0) {
              setQIndex(productQs.length - 1);
              setStep("questions");
            } else {
              setStep("product");
            }
          }}
          className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Özet</h1>
      </div>

      {/* Meta bilgileri */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-zinc-900">{school!.school_name}</p>
            {school!.city && (
              <p className="text-xs text-zinc-500">
                {school!.district ? `${school!.district}, ` : ""}{school!.city}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Package className="h-4 w-4 text-zinc-400 shrink-0" />
          <p className="text-sm text-zinc-900">{product!.product_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="text-sm text-zinc-900 border border-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Yanıtlar */}
      {productQs.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
          {productQs.map((q, i) => {
            const answer = answers[q.id];
            return (
              <div key={q.id} className="p-5 space-y-2">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Soru {i + 1}
                </p>
                <p className="text-sm font-medium text-zinc-900">{q.question_text}</p>
                {answer?.is_skipped ? (
                  <p className="text-sm text-zinc-400 italic">Atlandı</p>
                ) : answer?.text ? (
                  <p className="text-sm text-zinc-700">{answer.text}</p>
                ) : (
                  <p className="text-sm text-zinc-400 italic">Yanıtlanmadı</p>
                )}
                <button
                  onClick={() => {
                    setQIndex(i);
                    setStep("questions");
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Düzenle
                </button>
              </div>
            );
          })}
        </div>
      )}

      {saveError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {saveError}
        </p>
      )}

      <Button
        className="w-full"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Kaydediliyor…" : "Onayla ve Kaydet"}
      </Button>
    </div>
  );
}
