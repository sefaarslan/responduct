"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
});

type Schema = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: Schema) => {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setServerError("İstek gönderilemedi. Lütfen tekrar deneyin.");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">E-postanızı kontrol edin</h1>
          <p className="text-sm text-muted-foreground">
            Şifre sıfırlama bağlantısı gönderildi. Spam klasörünü de kontrol etmeyi unutmayın.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          ← Giriş sayfasına dön
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Şifremi unuttum</h1>
        <p className="text-sm text-muted-foreground">
          E-postanızı girin, sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="siz@sirket.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <p className="text-sm font-medium text-destructive">{serverError}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Gönderiliyor…" : "Sıfırlama bağlantısı gönder"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/auth/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          ← Giriş sayfasına dön
        </Link>
      </p>
    </div>
  );
}
