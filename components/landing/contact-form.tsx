"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Mesajınız alındı!
        </h3>
        <p className="text-sm text-slate-500 max-w-xs">
          En kısa sürede sizinle iletişime geçeceğiz. Genellikle 1 iş günü içinde yanıt veriyoruz.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium text-slate-700">
            Ad Soyad
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Ahmet Yılmaz"
            required
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
            E-posta
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ahmet@firma.com"
            required
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company" className="text-sm font-medium text-slate-700">
          Şirket Adı
        </Label>
        <Input
          id="company"
          name="company"
          placeholder="Firma A.Ş."
          className="h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm font-medium text-slate-700">
          Mesaj
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Ekip büyüklüğünüz, kullanım senaryonuz veya sormak istedikleriniz..."
          rows={5}
          required
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-slate-700 hover:bg-slate-800 text-white h-11"
        disabled={loading}
      >
        {loading ? "Gönderiliyor…" : "Mesaj Gönder"}
      </Button>
    </form>
  );
}
