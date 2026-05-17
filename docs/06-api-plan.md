# 06 — API Planı

Next.js App Router kullanılır. Tüm endpointler `app/api/` altında Route Handler olarak tanımlanır.

## Auth
```
POST  /api/auth/logout
GET   /api/auth/me          → Oturum bilgisi + rol
```
> Giriş ve kayıt Supabase Auth client-side ile yapılır (Supabase SSR).

## Okullar
```
GET    /api/schools              → Şirkete ait okullar (admin: tümü, sales: atamalılar)
POST   /api/schools              → Yeni okul [admin]
PUT    /api/schools/[id]         → Güncelle [admin]
DELETE /api/schools/[id]         → Sil (soft) [admin]
GET    /api/schools/[id]/products → Okula atanmış ürünler
```

## Ürünler & Sorular
```
GET    /api/products             → Şirkete ait ürünler
POST   /api/products             → Yeni ürün [admin]
PUT    /api/products/[id]        → Güncelle [admin]
DELETE /api/products/[id]        → Sil [admin]

GET    /api/products/[id]/questions
POST   /api/products/[id]/questions  → Soru ekle [admin]
PUT    /api/questions/[id]           → Güncelle [admin]
DELETE /api/questions/[id]           → Sil [admin]
```

## Kullanıcı & Atama Yönetimi
```
GET    /api/users                → Şirket kullanıcıları [admin]
POST   /api/users                → Yeni satışçı oluştur [admin]
PUT    /api/users/[id]
DELETE /api/users/[id]           → Deaktive et [admin]

POST   /api/assignments/school-user     → Okul ↔ Satışçı ata [admin]
DELETE /api/assignments/school-user     → Atama kaldır [admin]
POST   /api/assignments/school-product  → Okul ↔ Ürün ata [admin]
DELETE /api/assignments/school-product  → Atama kaldır [admin]
```

## Feedback
```
POST   /api/feedbacks            → Toplu kaydet (feedback + answers)
GET    /api/feedbacks            → Admin: tüm şirket / Sales: kendi
GET    /api/feedbacks/[id]
```

## Speech-to-Text
```
POST   /api/stt/transcribe       → multipart/form-data
                                    → Faster-Whisper çalıştır
                                    → Geçici dosyayı sil
                                    → { text } döndür
```

## Excel İçe Aktarım
```
POST   /api/import/schools
POST   /api/import/products
POST   /api/import/users
POST   /api/import/school-assignments
GET    /api/import/template/[type]   → Excel şablon indir
```

## Abonelik & Webhook
```
GET    /api/subscription/status       → Mevcut plan bilgisi
POST   /api/webhooks/lemon-squeezy    → Lemon Squeezy webhook (imza doğrulamalı)
```

## Response Formatı

```ts
// Başarı
{ data: T }

// Hata
{ error: string, details?: unknown }
```

## Ortak Kurallar

- Her route handler başında `createClient()` ile session doğrulaması
- Zod ile request body validation
- `company_id` session'dan alınır, client'tan kabul edilmez
- Admin gerektiren route'larda `role === 'admin'` kontrolü
