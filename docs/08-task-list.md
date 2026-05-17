# 08 — Görev Listesi

MVP geliştirme sırası. Her aşama bir öncekine bağımlıdır.

---

## Aşama 0 — Altyapı

- [x] Next.js + Supabase SSR template kurulumu
- [x] Tailwind CSS + shadcn/ui kurulumu
- [x] Supabase projesi oluşturuldu (.env hazır)
- [x] Migration çalıştırıldı (`09-migration.sql`) — 10 tablo, trigger'lar, RLS
- [x] `docs/` klasörü ve dokümanlar tamamlandı
- [x] CLAUDE.md + PRD.md Next.js stack'e güncellendi
- [x] `.env` dosyası doğrudan kullanılıyor — `.env.example` kullanılmıyor (Lemon Squeezy değişkenleri CLAUDE.md'de Faz 2 olarak işaretli)

---

## Aşama 1 — Auth & Tenant Kurulumu

- [x] Login sayfası + `LoginForm` bileşeni
- [x] Register sayfası + `RegisterForm` bileşeni
- [x] `POST /api/auth/register` — şirket + admin kullanıcı oluşturma (service role)
- [x] Forgot password sayfası + `ForgotPasswordForm` bileşeni
- [x] Supabase Auth callback route (`/auth/confirm`)
- [x] Dashboard layout — session kontrolü + sidebar + logout
- [x] Rol bazlı yönlendirme (`/dashboard` → admin veya sales)
- [ ] `get_my_company_id()` trigger testi — gerçek kayıt ile doğrulama

---

## Aşama 2 — Admin: Temel CRUD

- [x] Admin dashboard sayfası — metrik kartlar + hızlı aksiyonlar
- [x] Okullar sayfası — liste, ekle, düzenle, sil
- [x] Ürünler sayfası — liste, ekle, düzenle, sil
- [x] Sorular yönetimi (ürün altında accordion/liste)
- [x] Kullanıcılar sayfası — liste, ekle, deaktive et
- [x] Atama sayfası — okul ↔ satışçı, okul ↔ ürün

---

## Aşama 3 — Feedback Modülü (Ana Modül)

- [x] Sales dashboard — atanmış okullar + son feedbackler
- [x] Feedback akışı: okul seç → ürün seç → sorular → özet → kaydet
- [x] `SpeechRecorder` bileşeni (Browser Speech API, `lang: 'tr-TR'`)
- [x] `QuestionStep` bileşeni — tek soru, kayıt butonu, geç seçeneği
- [x] `FeedbackSummary` sayfası — özet + düzenle + onayla
- [x] `POST /api/feedbacks` Route Handler — toplu kayıt
- [x] Chrome dışı tarayıcı uyarısı

---

## Aşama 4 — Excel İçe Aktarım

- [x] `GET /api/import/template/[type]` — Excel şablon indir
- [x] `POST /api/import/schools` — parse + validate + insert
- [x] `POST /api/import/products`
- [x] `POST /api/import/users`
- [x] `POST /api/import/school-assignments`
- [x] Admin import sayfası — yükle, önizle, onayla

---

## Aşama 5 — Landing Page

- [x] Home sayfası
- [x] Features sayfası
- [x] Pricing sayfası — plan kartları (statik, ödeme yok) + "İletişime Geç" CTA
- [x] Contact sayfası

---

## Aşama 5.5 — Abonelik & Ödeme _(Faz 2 — MVP sonrası)_

- [ ] Lemon Squeezy ürün/plan oluşturma
- [ ] `POST /api/webhooks/lemon-squeezy` — subscription_created / updated / cancelled
- [ ] `GET /api/subscription/status`
- [ ] Admin: abonelik bilgisi gösterimi
- [ ] Pricing sayfasına Lemon Squeezy checkout butonları ekle

---

## Aşama 6 — Raporlar & Son Dokunuşlar

- [ ] Admin raporlar sayfası — filtreli tablo (okul / ürün / kişi / tarih)
- [ ] Aylık feedback limit kontrolü (trigger aktif, UI mesajı)
- [ ] Hata sayfaları (404, 500)
- [ ] Loading skeleton'ları
- [ ] Mobil/tablet responsive kontrol

---

## Aşama 7 — Deploy

- [ ] Vercel deploy (frontend + API routes)
- [ ] Environment variables Vercel'e ekle
- [ ] Supabase production migration
- [ ] Domain bağlantısı
- [ ] Smoke test (auth → feedback → rapor akışı)
