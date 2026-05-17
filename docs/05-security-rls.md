# 05 — Güvenlik & RLS

## Temel Prensipler

- Tüm tablolarda RLS aktif
- Kullanıcı yalnızca kendi `company_id`'sine ait verilere erişir (tenant izolasyonu)
- Admin tüm şirket verisini yönetir; sales yalnızca kendi verisini görür/ekler
- Ses dosyaları hiçbir zaman veritabanına veya storage'a kaydedilmez
- Tüm yazma işlemleri Next.js API Route Handler üzerinden geçer
- `.env` dosyası asla commit edilmez

## Yardımcı Fonksiyon

```sql
-- RLS politikalarında kullanılır
CREATE FUNCTION get_my_company_id()
RETURNS uuid AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

## Politika Özeti

| Tablo | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| companies | Kendi şirketi | — | — | — |
| subscriptions | Kendi şirketi | — | — | — |
| users | Kendi şirketi | Admin | Kendi profili | Admin |
| schools | Kendi şirketi | Admin | Admin | Admin |
| school_assignments | Kendi şirketi | Admin | — | Admin |
| products | Kendi şirketi | Admin | Admin | Admin |
| school_product_assignments | Kendi şirketi | Admin | — | Admin |
| questions | Kendi şirketi ürünleri | Admin | Admin | Admin |
| feedbacks | Admin=tümü, Sales=kendi | Sales | Sales (draft) | — |
| feedback_answers | Kendi şirketi feedbackleri | Sales (kendi) | Sales (draft) | — |

## Auth Kuralları

- Supabase Auth JWT tabanlı session yönetimi
- `company_id` ve `role` bilgisi `auth.users.raw_user_meta_data`'da tutulur
- Yeni `auth.users` kaydı açılınca trigger ile `public.users` otomatik oluşur
- API route'larında `createClient()` ile sunucu tarafı session doğrulaması yapılır

## Lemon Squeezy Webhook Güvenliği

```ts
// Her webhook isteğinde HMAC imzası doğrulanır
const signature = req.headers['x-signature'];
verifyWebhookSignature(rawBody, signature, process.env.LEMON_WEBHOOK_SECRET);
```

## Ek Güvenlik Önlemleri

- `SUPABASE_SERVICE_ROLE_KEY` yalnızca sunucu tarafında (webhook handler) kullanılır
- Client-side kodda yalnızca `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` kullanılır
- API route'larında Zod ile input validation zorunlu
- Rate limiting kritik endpoint'lerde aktif olmalı
