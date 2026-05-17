# Responduct — Ürün Gereksinim Dokümanı (PRD)

**Versiyon:** 1.3  
**Tarih:** 2026-05-17  
**Durum:** Taslak  
**Değişiklik:** v1.1 — Tech stack Angular+Express → Next.js 16 olarak güncellendi  
**Değişiklik:** v1.2 — STT mimarisi: Faster-Whisper → Browser Speech API (MVP fazı, Chrome)  
**Değişiklik:** v1.3 — Lemon Squeezy abonelik entegrasyonu MVP kapsamından çıkarıldı, Faz 2'ye alındı. MVP'de Landing Page statik Pricing sayfası içerir (ödeme yok).

---

## İçindekiler

1. [Proje Özeti](#1-proje-özeti)
2. [Problem Tanımı](#2-problem-tanımı)
3. [Hedef Kullanıcılar & Personas](#3-hedef-kullanıcılar--personas)
4. [Kullanıcı Hikayeleri](#4-kullanıcı-hikayeleri)
5. [Özellik Listesi & MVP Kapsamı](#5-özellik-listesi--mvp-kapsamı)
6. [Sistem Mimarisi](#6-sistem-mimarisi)
7. [Veritabanı Şeması](#7-veritabanı-şeması)
8. [API Endpoint Yapısı](#8-api-endpoint-yapısı)
9. [Kullanıcı Akışları](#9-kullanıcı-akışları)
10. [UI/UX Gereksinimleri](#10-uiux-gereksinimleri)
11. [Güvenlik Gereksinimleri](#11-güvenlik-gereksinimleri)
12. [SaaS İş Modeli](#12-saas-iş-modeli)
13. [Başarı Kriterleri](#13-başarı-kriterleri)
14. [Açık Sorular & Riskler](#14-açık-sorular--riskler)

---

## 1. Proje Özeti

**Ürün Adı:** Responduct  
**Vizyon:** Eğitim sektöründe çalışan saha satış ekiplerine, ziyaret ettikleri okullardan hızlı, sesli ve yapılandırılmış geri bildirim toplama imkânı sunan mobil-first SaaS platformu.  
**Hedef Kitle:** Eğitim alanında saha satışı yapan şirketlerin satış personelleri ve yöneticileri  
**İş Modeli:** Aylık SaaS aboneliği (Starter / Professional / Enterprise)  
**Platform:** Web + Tablet optimizasyonu (PWA uyumlu mimari, gelecekte native app için zemin)

### Temel Değer Önerileri

| Değer | Açıklama |
|-------|----------|
| Hız | Sesli giriş ile soru başına 10 saniyede feedback kaydı |
| Yapılandırılmış veri | Her feedback ürün & soru bazlı kaydedilir, raporlanabilir |
| Düşük öğrenme eğrisi | Saha personeli için tek sayfa, büyük buton, minimum yazma |
| Merkezi yönetim | Admin okul, ürün, satışçı ve atamaları merkezi yönetir |

---

## 2. Problem Tanımı

### Mevcut Durum

Eğitim sektöründe saha satış ekipleri, ziyaret ettikleri okullardan geri bildirim toplarken genellikle:

- Kağıt formlar veya WhatsApp mesajları kullanır
- Toplanan veriler standart değildir, raporlanamaz
- Yöneticiler sahadan bilgiyi gecikmeli alır
- Satış personeli okul ziyaretlerinde not almak için zaman kaybeder
- Farklı okullar için farklı ürünlere yönelik soruları takip etmek karmaşıktır

### Çözüm

Responduct, her satış personeline kendi atanmış okul ve ürünleri kapsamında, belirlenen soru setlerini sesli yanıtlayarak feedback girmesini sağlar. Tüm veriler anında buluta kaydedilir ve admin kullanıcıya raporlanır.

---

## 3. Hedef Kullanıcılar & Personas

### Persona 1: Saha Satış Personeli — "Ahmet"

- **Yaş:** 25-40  
- **Cihaz:** Tablet + Akıllı Telefon  
- **Teknik Yeterlilik:** Orta (WhatsApp, temel mobil uygulamalar)  
- **Beklentiler:**  
  - Hızlı kullanım, minimum yazma  
  - Okul ziyaretinde 3-5 dakika içinde feedback tamamlanabilmeli  
  - Sesle yanıt verme tercih edilmeli  
- **Acı Noktaları:**  
  - Kağıt form doldurmak zaman alıyor  
  - Hangi soruları sorması gerektiğini karıştırıyor  
  - Ofise döndüğünde verileri sisteme girmek gerekiyor

### Persona 2: Satış Yöneticisi / Admin — "Ayşe"

- **Yaş:** 30-50  
- **Cihaz:** Laptop + Masaüstü  
- **Teknik Yeterlilik:** Orta-Yüksek  
- **Beklentiler:**  
  - Ekip performansını tek ekranda görmek  
  - Okul & ürün bazında raporlara erişim  
  - Kolay Excel ile toplu veri girişi  
- **Acı Noktaları:**  
  - Sahadan bilgi gecikmeli geliyor  
  - Ekibin hangi okulu ziyaret ettiğini takip etmek zor  
  - Raporları manuel hazırlamak çok zaman alıyor

---

## 4. Kullanıcı Hikayeleri

### Kimlik Doğrulama

- Saha personeli olarak sisteme e-posta ve şifre ile giriş yapabilmeli, session 8 saat geçerli olmalıdır.
- Admin olarak şifremi unuttuğumda e-posta ile sıfırlama bağlantısı alabilmeliyim.

### Feedback Modülü (Sales User)

- Saha personeli olarak atanmış okullarımı listeleyebilmeli ve birini seçebilmeliyim.
- Okul seçtikten sonra o okula atanmış ürünleri görebilmeliyim.
- Ürün seçtikten sonra sorular tek tek ekrana gelmeli, sesi ile yanıt verebilmeliyim.
- Sesli yanıtım otomatik olarak metne dönüşmeli ve düzenleyebildim.
- Bir soruyu atlamak istediğimde "Geç" butonuna basabilmeliyim.
- Tüm soruları tamamladığımda özet ekranını görmeli ve onay verdikten sonra veriler kaydedilmelidir.
- Kaydedilmemiş verilerim varken uygulamayı kapatmadan önce uyarı almalıyım.

### Yönetim Paneli (Admin User)

- Admin olarak yeni okul ekleyebilmeli, düzenleyebilmeli ve silebilmeliyim.
- Admin olarak ürün tanımlayabilmeli ve ürünlere soru setleri atayabilmeliyim.
- Admin olarak saha personeli hesabı oluşturabilmeli ve okul ataması yapabilmeliyim.
- Admin olarak Excel dosyası yükleyerek toplu okul/ürün/satışçı içe aktarımı yapabilmeliyim.
- Admin olarak feedback raporlarını okul, ürün, personel ve tarih aralığına göre filtreleyebildim.

### Abonelik & Ödeme _(Faz 2 — MVP kapsamı dışı)_

- Şirket olarak Pricing sayfasından plan seçip Lemon Squeezy üzerinden ödeme yapabilmeliyim.
- Aboneliğim başladığında otomatik olarak dashboard'a yönlendirilmeliyim.
- Admin olarak mevcut planımı yükseltebilmeli veya iptal edebilmeliyim.

---

## 5. Özellik Listesi & MVP Kapsamı

### Öncelik Tanımları
- **P0 — MVP Zorunlu:** İlk sürümde mutlaka olmalı
- **P1 — MVP Sonrası:** İkinci iterasyonda
- **P2 — Gelecek:** Uzun vadeli yol haritası

### Özellik Tablosu

| Özellik | Öncelik | Notlar |
|---------|---------|--------|
| Kullanıcı girişi / şifre sıfırlama | P0 | Supabase Auth |
| Sales Dashboard (okul listesi, son feedbackler) | P0 | |
| Feedback modülü (sesli, step-by-step) | P0 | Sistemin çekirdeği |
| Speech-to-text dönüşümü | P0 | Browser Speech API (Chrome), Türkçe — ücretsiz, backend gerektirmez |
| Admin: Okul CRUD | P0 | |
| Admin: Ürün & soru yönetimi | P0 | |
| Admin: Satışçı & atama yönetimi | P0 | |
| Admin: Feedback raporları | P0 | Basit tablo görünümü |
| Landing Page (Home, Features, Pricing, Contact) | P0 | Pricing statik — ödeme formu yok |
| Excel toplu içe aktarım | P0 | Okul, ürün, satışçı |
| Lemon Squeezy abonelik entegrasyonu | P1 | Webhook, ödeme, plan yönetimi — Faz 2 |
| Admin: Grafik bazlı analytics dashboard | P1 | Recharts veya Chart.js |
| Push notification (ziyaret hatırlatma) | P1 | |
| Offline mode + sync | P2 | PWA service worker |
| Mobil native uygulama | P2 | |

---

## 6. Sistem Mimarisi

### Genel Mimari

```
Kullanıcı (Tablet / Telefon / Laptop)
          │
          ▼
  Next.js (Vercel) ──── Landing + Dashboard + API Routes
          │
          ├── Server Components    → Supabase'den doğrudan veri çeker
          ├── Client Components    → Form, interaksiyon, STT kayıt
          ├── Route Handlers       → /api/* endpoint'leri
          │     ├── /api/webhooks/...       → Lemon Squeezy webhook
          │     └── /api/...               → CRUD işlemleri
          ├── Browser Speech API   → STT doğrudan tarayıcıda (Chrome, ücretsiz)
          └── proxy.ts             → Auth yönlendirme (session kontrolü)
          │
          ▼
  Supabase
  ├── PostgreSQL (veritabanı, RLS aktif)
  └── Auth (session yönetimi)
```

> Ayrı bir backend sunucusu yoktur. Tüm sunucu tarafı mantığı Next.js Route Handler'lar içinde çalışır ve tek Vercel deploy'u ile yayına alınır.

### Deploy Mimarisi

| Katman | Servis | Notlar |
|--------|--------|--------|
| Uygulama (Frontend + API) | Vercel | Next.js — tek deploy, CI/CD GitHub entegrasyonu |
| Veritabanı | Supabase | PostgreSQL + RLS |
| Auth | Supabase Auth | SSR uyumlu session yönetimi |
| STT | Browser Speech API | Chrome/Edge, ücretsiz, backend gerektirmez |
| Ödeme | Lemon Squeezy | **Faz 2** — MVP'de entegrasyon yok |

### Tech Stack

| Alan | Teknoloji |
|------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Stil | Tailwind CSS 4, shadcn/ui |
| Form | react-hook-form + zod |
| Veritabanı | Supabase PostgreSQL |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Speech-to-Text | Browser Speech API — MVP fazı (Chrome zorunlu, ücretsiz, backend yok) |
| Dosya formatı | SheetJS (xlsx) — import/export |
| Ödeme | Lemon Squeezy — **Faz 2** |

---

## 7. Veritabanı Şeması

### Tablolar & İlişkiler

```
companies ─┬─< subscriptions
           ├─< users
           └─< schools

users ──────< school_assignments (user_id + school_id)

schools ────< school_product_assignments (school_id + product_id)
           └─< feedbacks

products ───< questions
           └─< school_product_assignments

feedbacks ──< feedback_answers (feedback_id + question_id)
```

### companies

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK | |
| company_name | varchar(255) | |
| plan_type | enum (starter/professional/enterprise) | |
| max_users | integer | Plan limitine göre |
| max_schools | integer | Plan limitine göre (-1 = sınırsız) |
| max_feedbacks_monthly | integer | Plan limitine göre (-1 = sınırsız) |
| subscription_status | enum (active/trialing/cancelled/past_due) | |
| created_at | timestamptz | |

### subscriptions

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK | |
| company_id | uuid FK → companies | |
| lemon_subscription_id | varchar | Lemon Squeezy ID |
| lemon_customer_id | varchar | |
| plan_type | enum | |
| status | varchar | Lemon Squeezy status |
| current_period_start | timestamptz | |
| current_period_end | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### users

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK (= Supabase Auth UID) | |
| company_id | uuid FK → companies | |
| email | varchar | |
| full_name | varchar | |
| role | enum (admin/sales) | |
| is_active | boolean | |
| created_at | timestamptz | |

### schools

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK | |
| company_id | uuid FK → companies | |
| school_name | varchar(255) | |
| city | varchar | |
| district | varchar | |
| address | text | |
| phone | varchar | |
| contact_person | varchar | |
| is_active | boolean | |
| created_at | timestamptz | |

### school_assignments (Okul → Satışçı)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK | |
| school_id | uuid FK → schools | |
| user_id | uuid FK → users | |
| assigned_at | timestamptz | |

### products

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK | |
| company_id | uuid FK → companies | |
| product_name | varchar(255) | |
| description | text | |
| is_active | boolean | |
| created_at | timestamptz | |

### school_product_assignments (Okul → Ürün)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK | |
| school_id | uuid FK → schools | |
| product_id | uuid FK → products | |
| assigned_at | timestamptz | |

### questions

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK | |
| product_id | uuid FK → products | |
| question_text | text | |
| order_index | integer | Gösterim sırası |
| is_required | boolean | |
| is_active | boolean | |

### feedbacks

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK | |
| company_id | uuid FK → companies | |
| school_id | uuid FK → schools | |
| product_id | uuid FK → products | |
| user_id | uuid FK → users | |
| status | enum (draft/completed) | |
| visit_date | date | |
| created_at | timestamptz | |

### feedback_answers

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid PK | |
| feedback_id | uuid FK → feedbacks | |
| question_id | uuid FK → questions | |
| answer_text | text | STT sonucu veya manuel |
| is_skipped | boolean | Pass geçildi mi |
| created_at | timestamptz | |

---

## 8. API Endpoint Yapısı

Tüm endpoint'ler Next.js App Router Route Handler olarak `app/api/` altında yer alır.

### Auth

```
POST   /api/auth/register        — Şirket + admin kullanıcı oluşturma (service role)
```
> Giriş/çıkış ve şifre sıfırlama Supabase Auth tarafından yönetilir, ayrı API endpoint'i gerekmez.

### Okul Yönetimi

```
GET    /api/schools              — Şirkete ait okullar
POST   /api/schools              — Yeni okul oluştur
PUT    /api/schools/[id]         — Okul güncelle
DELETE /api/schools/[id]         — Okul sil (soft delete)
GET    /api/schools/[id]/products — Okula atanmış ürünler
```

### Ürün & Soru Yönetimi

```
GET    /api/products             — Şirkete ait ürünler
POST   /api/products             — Yeni ürün oluştur
PUT    /api/products/[id]        — Ürün güncelle
DELETE /api/products/[id]        — Ürün sil
GET    /api/products/[id]/questions
POST   /api/products/[id]/questions
PUT    /api/questions/[id]
DELETE /api/questions/[id]
```

### Kullanıcı & Atama Yönetimi

```
GET    /api/users                — Şirkete ait satışçılar
POST   /api/users                — Yeni satışçı oluştur
PUT    /api/users/[id]
DELETE /api/users/[id]
POST   /api/assignments/school-user
DELETE /api/assignments/school-user
POST   /api/assignments/school-product
DELETE /api/assignments/school-product
```

### Feedback

```
POST   /api/feedbacks            — Yeni feedback oluştur (toplu kayıt)
GET    /api/feedbacks            — Admin: tüm şirket feedbackleri
GET    /api/feedbacks/my         — Sales: kendi feedbackleri
GET    /api/feedbacks/[id]
```

### Speech-to-Text

> MVP fazında STT tamamen tarayıcıda gerçekleşir (Browser Speech API). Backend endpoint yoktur.
> Faster-Whisper entegrasyonu ihtiyaç halinde sonraki fazda `POST /api/stt/transcribe` olarak eklenecektir.

### Excel Import

```
POST   /api/import/schools
POST   /api/import/products
POST   /api/import/users
POST   /api/import/school-assignments
GET    /api/import/template/[type] — Excel şablon indir
```

### Abonelik & Webhook _(Faz 2 — MVP kapsamı dışı)_

```
GET    /api/subscription/status
POST   /api/webhooks/lemon-squeezy — İmza doğrulamalı webhook
```

---

## 9. Kullanıcı Akışları

### Feedback Akışı (Ana Modül)

```
[Sales] Giriş yap
    └─→ Okul listesini gör
        └─→ Okul seç
            └─→ Ürün listesini gör
                └─→ Ürün seç
                    └─→ 1. Soru ekrana gelir
                        ├─→ [Sesli Yanıt] → STT → Metin göster → Düzenle
                        ├─→ [Geç] → Sonraki soruya
                        └─→ [Sonraki]
                            └─→ Tüm sorular bitti
                                └─→ Özet ekranı
                                    ├─→ [Düzenle] → İlgili soruya geri dön
                                    └─→ [Onayla & Kaydet] → Veritabanına toplu insert
```

### Abonelik Akışı _(Faz 2 — MVP kapsamı dışı)_

```
[Anonim] Pricing sayfasına gelir
    └─→ Plan seçer → Lemon Squeezy Checkout
        └─→ Ödeme tamamlanır
            └─→ Webhook: subscription_created → Supabase'e kayıt
                └─→ Kullanıcı register/login sayfasına yönlendirilir
                    └─→ Admin hesabı oluşturulur → Dashboard'a yönlendirme
```

> MVP'de Pricing sayfası yalnızca plan bilgisi gösterir. "İletişime Geç" veya kayıt formu ile satış süreci manuel yönetilir.

### STT Akışı (MVP — Browser Speech API)

```
Kullanıcı mikrofona basar (Chrome)
    └─→ window.SpeechRecognition başlar (lang: 'tr-TR')
        └─→ Gerçek zamanlı transkript → textarea'ya yazılır
            └─→ Kullanıcı metni düzenleyebilir
                └─→ Onay → yalnızca metin Supabase'e kaydedilir
```

> Ses verisi backend'e gönderilmez, sunucuda işlenmez. Supabase'e yalnızca metin kaydedilir.
> **Tarayıcı desteği:** Chrome ve Edge. MVP'de Chrome zorunlu olarak belgelenir.

---

## 10. UI/UX Gereksinimleri

### Tasarım İlkeleri

| İlke | Açıklama |
|------|----------|
| Mobil-first | 360px genişlikten başlayan grid |
| Tablet optimizasyonu | 768px - 1024px arası ana hedef |
| Büyük butonlar | Minimum 48px dokunma alanı |
| Tek elle kullanım | Tüm önemli aksiyonlar başparmak bölgesinde |
| Minimum yazma | Sesli giriş ana yöntem, klavye yedek |
| Yüksek kontrast | Güneş ışığında dışarıda okunabilir |

### Kritik Ekranlar

- **Feedback Soru Ekranı:** Tam ekran, tek soru, büyük kayıt butonu ortada
- **Okul Listesi:** Arama + büyük liste öğeleri
- **Özet Ekranı:** Tüm cevaplar görünür, düzenleme linki her satırda

### Responsive Breakpoints

```
sm:  640px  → Mobil landscape
md:  768px  → Tablet portrait (Ana hedef)
lg:  1024px → Tablet landscape
xl:  1280px → Laptop/Desktop (Admin için)
```

---

## 11. Güvenlik Gereksinimleri

- `.env` dosyası asla git'e commit edilmeyecek
- `NEXT_PUBLIC_` prefix'li değişkenler tarayıcıya açıktır; secret key'ler yalnızca sunucu tarafında kullanılacak
- Supabase'de tüm tablolarda RLS (Row Level Security) aktif olacak
- Kullanıcılar yalnızca kendi `company_id`'lerine ait verilere erişebilir
- Veri yazma işlemleri Next.js Route Handler'lar üzerinden yapılacak
- Service Role key (`SUPABASE_SERVICE_ROLE_KEY`) yalnızca Route Handler içinde ve zorunlu durumlarda kullanılacak
- Ses dosyaları veritabanında veya storage'da saklanmayacak
- Route Handler'larda tüm input'lar Zod ile validate edilecek
- Session yönetimi Supabase Auth + `@supabase/ssr` tarafından yapılacak
- Lemon Squeezy webhook'ları imza doğrulaması ile kontrol edilecek

---

## 12. SaaS İş Modeli

### Plan Yapısı

| Özellik | Starter | Professional | Enterprise |
|---------|---------|--------------|------------|
| Aylık ücret | Sabit (belirlenir) | Sabit (belirlenir) | Özel fiyat |
| Satış personeli | 5 | 25 | Sınırsız |
| Okul limiti | 20 | Sınırsız | Sınırsız |
| Aylık feedback | 100 | Sınırsız | Sınırsız |
| Raporlama | Temel | Gelişmiş | Gelişmiş + Özel |
| Destek | E-posta | Öncelikli | Özel destek |

> **MVP Notu:** Plan limitleri ve tablosu Landing Page'de statik olarak gösterilir. Satış ve ödeme süreci şu an manuel (e-posta / iletişim formu) yönetilir. Otomatik ödeme ve plan yönetimi Faz 2'de Lemon Squeezy ile devreye alınacaktır.

### Lemon Squeezy Webhook Event'leri _(Faz 2)_

| Event | Aksiyon |
|-------|---------|
| `subscription_created` | Supabase'e abonelik kaydı yap, şirket planını güncelle |
| `subscription_updated` | Plan değişikliğini Supabase'e yansıt |
| `subscription_cancelled` | Status'ü cancelled yap, current_period_end'e kadar aktif tut |
| `subscription_resumed` | Status'ü active yap |
| `payment_success` | Ödeme kaydı güncelle |
| `payment_failed` | Şirketi bilgilendir, past_due status'e al |

---

## 13. Başarı Kriterleri

### Teknik KPI'lar

| Metrik | Hedef |
|--------|-------|
| STT doğruluk oranı (Türkçe) | ≥ %85 |
| Feedback kayıt süresi (mobil) | ≤ 5 dakika / okul ziyareti |
| API yanıt süresi | ≤ 500ms (p95) |
| Uptime | ≥ %99.5 |
| Tablet Lighthouse skoru | ≥ 85 (Performance) |

### Ürün KPI'ları

| Metrik | Hedef |
|--------|-------|
| Pilot müşteri sayısı (ilk 3 ay) | 3-5 şirket |
| Günlük aktif kullanıcı oranı | ≥ %60 (abonelik başına) |
| Churn oranı (3. aydan sonra) | ≤ %5 aylık |
| NPS (Net Promoter Score) | ≥ 40 |

---

## 14. Açık Sorular & Riskler

### Açık Sorular

1. **Fiyatlandırma:** Starter ve Professional plan ücretleri ne olacak?
2. **Trial süresi:** Kaç günlük ücretsiz deneme sunulacak?
3. **Soru yönetimi:** Admin sorularını ürün bazlı mı yoksa global şablon olarak mı yönetecek?
4. **Offline desteği:** MVP'de offline support olmayacak, ancak mimari buna uygun kurulacak mı?
5. **Dil desteği:** Uygulama arayüzü yalnızca Türkçe mi?

### Riskler & Azaltma Önlemleri

| Risk | Olasılık | Etki | Azaltma |
|------|---------|------|---------|
| Browser Speech API Türkçe doğruluğu yetersiz | Düşük | Orta | Pilot aşamada test et; sorun çıkarsa Faster-Whisper fazına geç |
| Chrome dışı tarayıcıda kullanım | Orta | Orta | MVP'de Chrome zorunlu olarak belgelenir, kullanıcıya açık uyarı gösterilir |
| Tablet'te mikrofon erişim izni sorunu | Düşük | Yüksek | İlk kullanımda yönlendirici mesaj göster |
| Lemon Squeezy webhook gecikmeleri | Düşük | Orta | Faz 2 kapsamında, webhook retry + idempotency key ile ele alınacak |
| Plan limiti aşımı | Orta | Düşük | Backend'de her feedback öncesi limit kontrolü |
| Supabase RLS yanlış konfigürasyonu | Düşük | Çok Yüksek | Her tablo için RLS testi, integration test yazılacak |

---

*Bu doküman projenin başlangıç referansıdır. Geliştirme sürecinde güncellenmelidir.*
