"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

const registerSchema = z.object({
  company_name: z.string().min(2, "Şirket adı en az 2 karakter olmalı"),
  full_name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      company_name: "",
      full_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    setServerError(null);

    try {
      // 1. Şirket + kullanıcı oluştur (server-side API route — RLS bypass)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Kayıt başarısız");

      // 2. Otomatik giriş
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (loginError) throw loginError;

      router.push("/dashboard");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="w-full space-y-6">
      {/* Başlık */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Hesap oluşturun
        </h1>
        <p className="text-sm text-muted-foreground">
          14 gün ücretsiz deneyin, kredi kartı gerekmez.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Şirket adı</FormLabel>
                <FormControl>
                  <Input placeholder="Örnek Eğitim A.Ş." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Ad soyad</FormLabel>
                <FormControl>
                  <Input placeholder="Adınız Soyadınız" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">İş e-postası</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="siz@sirket.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Şifre</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="En az 8 karakter"
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Oluşturuluyor…" : "Hesabı oluştur"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Zaten hesabınız var mı?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Giriş yapın
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Hesap oluşturarak{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Kullanım Koşulları
        </Link>
        &apos;nı kabul etmiş olursunuz.
      </p>
    </div>
  );
}
