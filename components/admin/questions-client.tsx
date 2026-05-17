"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, GripVertical, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Question {
  id: string;
  question_text: string;
  is_required: boolean;
  order_index: number;
}

interface QuestionsClientProps {
  productId: string;
  productName: string;
  initialQuestions: Question[];
}

export function QuestionsClient({
  productId,
  productName,
  initialQuestions,
}: QuestionsClientProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [newText, setNewText] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => router.refresh();

  const handleAdd = async () => {
    if (newText.trim().length < 5) {
      setError("Soru en az 5 karakter olmalı");
      return;
    }
    setError(null);
    setAdding(true);
    const res = await fetch(`/api/products/${productId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_text: newText.trim(), is_required: isRequired }),
    });
    const data = await res.json();
    setAdding(false);
    if (!res.ok) { setError(data.error ?? "Bir hata oluştu"); return; }
    setQuestions((prev) => [...prev, data.data]);
    setNewText("");
    setIsRequired(false);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/questions/${deleteId}`, { method: "DELETE" });
    setQuestions((prev) => prev.filter((q) => q.id !== deleteId));
    setDeleteId(null);
    refresh();
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-sm text-zinc-500">
          <span className="font-medium text-zinc-900">{productName}</span> ürününe ait sorular
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* Soru listesi */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden mb-4">
        {questions.length === 0 ? (
          <div className="p-10 text-center">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
              <CircleDot className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900">Henüz soru eklenmedi</p>
            <p className="text-sm text-zinc-500 mt-1">
              Aşağıdaki alandan ilk soruyu ekleyin.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {questions.map((q, i) => (
              <li
                key={q.id}
                className="flex items-start gap-3 px-5 py-4 hover:bg-zinc-50"
              >
                <GripVertical className="h-4 w-4 text-zinc-300 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-500 w-5 shrink-0 mt-0.5">
                  {i + 1}.
                </span>
                <p className="flex-1 text-sm text-zinc-900">{q.question_text}</p>
                {q.is_required && (
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs shrink-0">
                    Zorunlu
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-zinc-400 hover:text-red-600 shrink-0"
                  onClick={() => setDeleteId(q.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Yeni soru ekle */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
        <p className="text-sm font-medium text-zinc-900">Yeni Soru Ekle</p>
        <Input
          placeholder="Okul yönetimi ürünlerimizden memnun mu?"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600"
            />
            Zorunlu soru
          </label>
          <Button
            onClick={handleAdd}
            disabled={adding || newText.trim().length < 5}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {adding ? "Ekleniyor…" : "Ekle"}
          </Button>
        </div>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Soruyu sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu soru feedback akışından kaldırılacak. İşlem geri alınabilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
