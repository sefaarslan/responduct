# Responduct — Claude Code Proje Talimatları

Bu dosya, Responduct projesinde Claude Code ile çalışmak için temel referans dokümanıdır. Tüm kod üretimi bu kurallara uygun olmalıdır.

---

## Proje Hakkında

- **Uygulama Adı:** Responduct
- **Sektör:** Eğitim sektörü — saha satış ekipleri
- **Amaç:** Saha satış personelinin ziyaret ettiği okullardan sesli geri bildirim toplaması
- **Kullanıcı Tipleri:** Saha satış personeli (sales), şirket yöneticisi (admin)
- **Cihaz Hedefi:** Tablet + mobil öncelikli, web desteği ile birlikte
- **İş Modeli:** Aylık SaaS aboneliği — Lemon Squeezy

---

## Teknoloji Stack

| Teknoloji | Versiyon | Notlar |
|-----------|---------|--------|
| Next.js | 16 (App Router) | Tek framework — frontend + backend birlikte |
| React | 19 | Server/Client Component modeli |
| TypeScript | 5+ | Strict mode zorunlu |
| Tailwind CSS | 4 | Utility-first stil |
| shadcn/ui | latest | Tek UI component kütüphanesi |
| react-hook-form + zod | latest | Tüm formlar bu ikilisi ile yazılır |
| Supabase SSR (`@supabase/ssr`) | latest | Auth + veritabanı |
| Lemon Squeezy | — | SaaS abonelik & ödeme — **Faz 2, MVP kapsamında değil** |
| Faster-Whisper | — | Sesli giriş → Türkçe metin dönüşümü |
| Vercel | — | Deploy (tek platform) |

> Ayrı bir Node.js/Express backend yoktur. Tüm sunucu tarafı mantığı Next.js Route Handler'lar (`app/api/`) içinde çalışır.

---

## Sistem Mimarisi

```
Tarayıcı / Tablet
       │
       ▼
Next.js (Vercel)
       │
       ├── Server Components     → Supabase'den doğrudan veri çeker
       ├── Client Components     → Form, interaksiyon, STT kayıt
       ├── Route Handlers        → API endpoint'leri (app/api/)
       │     ├── /api/auth/register      Service role ile kayıt
       │     └── /api/...               CRUD endpoint'leri
       └── lib/supabase/proxy.ts → Auth yönlendirme (Next.js 16 Fluid)
              │
              ▼
       Supabase
              ├── PostgreSQL (RLS aktif, multi-tenant)
              └── Auth (session yönetimi)
```

---

## Dosya & Klasör Yapısı

```
app/
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── update-password/page.tsx
│   └── confirm/route.ts           (Supabase email confirm handler)
│
├── dashboard/
│   ├── layout.tsx                 (Server — session kontrolü, sidebar)
│   ├── page.tsx                   (Rol bazlı yönlendirme)
│   ├── admin/
│   │   ├── page.tsx               (Genel bakış + metrikler)
│   │   ├── schools/page.tsx
│   │   ├── products/page.tsx
│   │   ├── users/page.tsx
│   │   ├── assignments/page.tsx
│   │   └── reports/page.tsx
│   └── sales/
│       ├── page.tsx               (Genel bakış)
│       ├── feedback/page.tsx      (Feedback giriş akışı)
│       └── schools/page.tsx
│
├── api/
│   ├── auth/register/route.ts     (Şirket + kullanıcı oluşturma)
│   ├── schools/route.ts
│   ├── products/route.ts
│   ├── users/route.ts
│   ├── feedbacks/route.ts
│   └── import/                    (Excel import — schools, products, users, school-assignments)
│
├── globals.css
└── layout.tsx

components/
├── ui/                            (shadcn/ui — doğrudan değiştirilmez)
├── dashboard/
│   └── sidebar.tsx                ("use client" — nav + logout)
├── login-form.tsx
├── register-form.tsx
├── forgot-password-form.tsx
└── update-password-form.tsx

lib/
├── supabase/
│   ├── client.ts                  (Tarayıcı client — "use client" içinde)
│   ├── server.ts                  (Server Component client)
│   ├── admin.ts                   (Service role — RLS bypass, sadece API route)
│   └── proxy.ts                   (Auth yönlendirme — Next.js 16 Fluid compute)
└── utils.ts                       (cn helper)

types/
├── database.types.ts              (Supabase CLI ile üretilir)
└── helper.types.ts                (SupabaseDBClient vb. kısayollar)

supabase/
└── migrations/                    (SQL migration dosyaları)
```

---

## Server vs Client Component Kuralı

Next.js App Router'da varsayılan olarak her component **Server Component**'tır.

| Durum | Kullanılacak |
|-------|-------------|
| Veri çekme (Supabase sorgu) | Server Component |
| `async/await` sayfa mantığı | Server Component |
| `useState`, `useEffect`, event handler | Client Component (`"use client"`) |
| Form submit, kullanıcı etkileşimi | Client Component |
| `useRouter`, `usePathname` | Client Component |

```typescript
// Server Component — veri çeker, async olabilir
// app/dashboard/admin/page.tsx
export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("schools").select("*");
  return <SchoolList schools={data} />;
}

// Client Component — etkileşim yönetir
// components/dashboard/sidebar.tsx
"use client";
export function Sidebar() {
  const router = useRouter();
  const handleLogout = async () => { ... };
  return <nav>...</nav>;
}
```

---

## API Route Handler Yapısı

```typescript
// app/api/schools/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("schools").select("*");
    if (error) throw error;
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // zod validation burada
    const supabase = await createClient();
    const { data, error } = await supabase.from("schools").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
```

---

## API Endpoint Listesi

```
POST  /api/auth/register          — Şirket + admin kullanıcı oluşturma

GET   /api/schools                — Şirkete ait okullar
POST  /api/schools
PUT   /api/schools/[id]
DELETE /api/schools/[id]

GET   /api/products
POST  /api/products
PUT   /api/products/[id]
DELETE /api/products/[id]

GET   /api/users                  — Admin: şirket kullanıcıları
POST  /api/users
PUT   /api/users/[id]
DELETE /api/users/[id]

POST  /api/assignments/school-user
DELETE /api/assignments/school-user
POST  /api/assignments/school-product
DELETE /api/assignments/school-product

POST  /api/feedbacks
GET   /api/feedbacks              — Admin: tüm feedbackler
GET   /api/feedbacks/my           — Sales: kendi feedbackleri
GET   /api/feedbacks/[id]

# POST /api/stt/transcribe       — MVP'de kullanılmıyor (Browser Speech API kullanılır)
#                                   Faster-Whisper entegrasyonunda eklenecek

POST  /api/import/schools
POST  /api/import/products
POST  /api/import/users
GET   /api/import/template/[type]

# GET   /api/subscription/status         — Faz 2
# POST  /api/webhooks/lemon-squeezy      — Faz 2
```

---

## Supabase Client Kullanım Kuralları

```typescript
// Server Component veya Route Handler içinde
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// Client Component içinde ("use client")
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Route Handler içinde RLS bypass gerektiğinde (sadece api/auth/register gibi)
import { createAdminClient } from "@/lib/supabase/admin";
const supabase = createAdminClient();
```

- `admin.ts` yalnızca `app/api/` altındaki route handler'larda kullanılır, asla component içinde kullanılmaz
- Server Component'larda `getUser()` yerine `getClaims()` tercih edilir (performans)
- `connection()` from `next/server` — dinamik sayfalarda `await connection()` ile işaretlenir

---

## Veritabanı Şeması

```sql
companies (
  id               uuid PK,
  company_name     varchar(255),
  plan_type        enum(starter, professional, enterprise),
  max_users        integer,
  max_schools      integer,    -- -1 sınırsız
  max_feedbacks_monthly integer,
  subscription_status enum(active, trialing, cancelled, past_due),
  created_at       timestamptz
)

subscriptions (
  id                     uuid PK,
  company_id             uuid FK companies,
  lemon_subscription_id  varchar,
  lemon_customer_id      varchar,
  plan_type              enum,
  status                 varchar,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  created_at             timestamptz,
  updated_at             timestamptz
)

users (
  id           uuid PK,   -- = Supabase Auth UID
  company_id   uuid FK companies,
  email        varchar UNIQUE,
  full_name    varchar,
  role         enum(admin, sales),
  is_active    boolean DEFAULT true,
  created_at   timestamptz
)

schools (
  id             uuid PK,
  company_id     uuid FK companies,
  school_name    varchar(255),
  city           varchar,
  district       varchar,
  address        text,
  phone          varchar,
  contact_person varchar,
  is_active      boolean DEFAULT true,
  created_at     timestamptz
)

school_assignments (
  id          uuid PK,
  school_id   uuid FK schools,
  user_id     uuid FK users,
  assigned_at timestamptz
)

products (
  id           uuid PK,
  company_id   uuid FK companies,
  product_name varchar(255),
  description  text,
  is_active    boolean DEFAULT true,
  created_at   timestamptz
)

school_product_assignments (
  id          uuid PK,
  school_id   uuid FK schools,
  product_id  uuid FK products,
  assigned_at timestamptz
)

questions (
  id            uuid PK,
  product_id    uuid FK products,
  question_text text,
  order_index   integer,
  is_required   boolean DEFAULT false,
  is_active     boolean DEFAULT true
)

feedbacks (
  id          uuid PK,
  company_id  uuid FK companies,
  school_id   uuid FK schools,
  product_id  uuid FK products,
  user_id     uuid FK users,
  status      enum(draft, completed),
  visit_date  date,
  created_at  timestamptz
)

feedback_answers (
  id            uuid PK,
  feedback_id   uuid FK feedbacks,
  question_id   uuid FK questions,
  answer_text   text,
  is_skipped    boolean DEFAULT false,
  created_at    timestamptz
)
```

### RLS Kuralları

```sql
CREATE POLICY "company_isolation" ON schools
  USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));
```

Her tablo için aynı `company_id` izolasyonu uygulanır. Yeni tablo eklendiğinde RLS politikası da eklenmelidir.

---

## Speech-to-Text Mimarisi

### MVP Fazı — Browser Speech API (Şu An)

STT işlemi tamamen tarayıcıda gerçekleşir, backend endpoint gerekmez.

**Kısıtlar:**
- Yalnızca Chrome / Edge desteği (MVP'de Chrome zorunlu)
- İnternet bağlantısı gerektirir (Chrome, Google altyapısını kullanır)
- Kullanıcı mikrofon iznini kabul etmelidir

```
Kullanıcı mikrofona basar (Chrome)
    └─→ window.SpeechRecognition başlar (lang: 'tr-TR')
        └─→ Gerçek zamanlı transkript → textarea'ya yazılır
            └─→ Kullanıcı metni düzenleyebilir
                └─→ Form submit → Supabase'e yalnızca metin kaydedilir
```

**Kod örneği (Client Component):**

```typescript
"use client";

const recognition = new (window.SpeechRecognition ?? window.webkitSpeechRecognition)();
recognition.lang = "tr-TR";
recognition.continuous = false;
recognition.interimResults = true;

recognition.onresult = (event) => {
  const transcript = Array.from(event.results)
    .map((r) => r[0].transcript)
    .join("");
  setAnswer(transcript);
};

recognition.start();
```

**Kurallar:**
- Ses verisi **hiçbir zaman backend'e gönderilmez**
- Supabase'e yalnızca dönüştürülmüş metin kaydedilir
- SpeechRecognition desteği yoksa kullanıcıya açık hata gösterilir

### Gelecek Fazı — Faster-Whisper (İhtiyaç Halinde)

Browser Speech API'nin yetersiz kaldığı durumlarda (offline, Firefox, yüksek doğruluk ihtiyacı) ayrı bir FastAPI Python servisi devreye alınır. Bu faza geçildiğinde `/api/stt/transcribe` Route Handler eklenir. **MVP kapsamında değildir.**

---

## Lemon Squeezy Entegrasyonu _(Faz 2 — MVP kapsamı dışı)_

> MVP'de Lemon Squeezy entegrasyonu yoktur. Landing Page'deki Pricing sayfası statik plan bilgisi gösterir. Aşağıdaki detaylar Faz 2 referansı için korunmuştur.

### Webhook Güvenliği

```typescript
// app/api/webhooks/lemon-squeezy/route.ts  (Faz 2)
const signature = req.headers.get("x-signature");
const isValid = verifyLemonSqueezySignature(rawBody, signature, process.env.LEMON_WEBHOOK_SECRET!);
if (!isValid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

### Webhook Event Tablosu

| Event | Yapılacak İşlem |
|-------|----------------|
| `subscription_created` | subscriptions insert, companies planını güncelle |
| `subscription_updated` | Plan değişikliği varsa güncelle |
| `subscription_cancelled` | status = cancelled |
| `subscription_resumed` | status = active |
| `payment_success` | subscriptions.updated_at güncelle |
| `payment_failed` | subscription_status = past_due |

---

## Kullanıcı Rolleri & Yetki Matrisi

| Özellik | Admin | Sales |
|---------|-------|-------|
| Okul CRUD | ✓ | Yalnızca okuma (atananlar) |
| Ürün CRUD | ✓ | Yalnızca okuma (atananlar) |
| Kullanıcı yönetimi | ✓ | — |
| Okul/ürün atama | ✓ | — |
| Excel import | ✓ | — |
| Feedback girişi | — | ✓ |
| Kendi feedbackleri | — | ✓ |
| Tüm raporlar | ✓ | — |
| Abonelik yönetimi | ✓ | — |

---

## Kod Kuralları

### İsimlendirme

- **Fonksiyonlar:** camelCase (`getUserFeedbacks`, `transcribeAudio`)
- **Component'lar:** PascalCase (`FeedbackSummaryCard`)
- **Dosyalar:** kebab-case (`feedback-summary-card.tsx`)
- **Interface'ler:** PascalCase, `I` prefix yok (`User`, `Feedback`)
- **Sabitler:** SCREAMING_SNAKE_CASE (`MAX_RECORDING_SECONDS`)

### TypeScript Kuralları

```typescript
// ✓ Doğru — tip güvenli
async function getSchool(id: string): Promise<School> { ... }

// ✗ Yanlış — any kullanma
function process(data: any) { ... }
```

---

## Güvenlik Kuralları

- `.env` dosyasını **ASLA** git'e commit etme
- `SUPABASE_SERVICE_ROLE_KEY` yalnızca sunucu tarafında (`app/api/`) kullanılır
- `NEXT_PUBLIC_` prefix'li key'ler tarayıcıya açıktır — secret olmaz
- Supabase Client Component sorguları RLS tarafından korunur, ekstra filtre gerekmez
- Route Handler'larda session kontrolü her endpoint başında yapılır
- Lemon Squeezy webhook imzası Faz 2'de mutlaka doğrulanır (MVP'de entegrasyon yok)
- Admin client (`createAdminClient`) yalnızca zorunlu durumlarda kullanılır

---

## UI / Design System Kuralları

### Tasarım Felsefesi

Responduct, eğitim sektöründe kurumsal müşterilere yönelik bir B2B SaaS uygulamasıdır.
Tasarım dili **güven veren, minimal ve profesyonel** olmalıdır.

| Hedef | Kaçınılacak |
|-------|-------------|
| Linear / Stripe / Notion tarzı sadelik | AI-generated startup template görünümü |
| Kurumsal güven hissi | Neon gradient, glassmorphism, cyberpunk efektler |
| Temiz beyaz alan kullanımı | Aşırı dolgu ve karmaşık layout |
| İnce border yapıları | Çok yuvarlak veya plastik görünümlü köşeler |
| Hafif, amaçlı gölge | Gereksiz animasyon ve geçiş efektleri |

### Component Sistemi

- **shadcn/ui** — tek ve zorunlu UI component kütüphanesi
- **Tailwind CSS** — yalnızca utility class, custom CSS minimum düzeyde tutulur
- Yeni component ihtiyacında önce `components/ui/` klasörü kontrol edilir
- Olmayan component için `npx shadcn add <component>` kullanılır, sıfırdan yazılmaz

### Renk Sistemi

Tüm uygulama **slate** renk skalasını kullanır. indigo, violet, purple, zinc yasaktır.

```
── Landing Pages (tam slate) ────────────────────────────────
Arka plan (section): white / slate-50     (#ffffff / #f8fafc)
Primary text:        slate-900            (#0f172a)
Secondary text:      slate-500            (#64748b)
Border:              slate-200            (#e2e8f0)
Primary accent:      slate-700            (#334155)
Hero / CTA kart / Footer bg: slate-700   (#334155)
Hover (dark bg):     bg-white/10

── Dashboard ────────────────────────────────────────────────
Neutral text:        zinc-900 / zinc-500  (dashboard iç metinler)
Border:              zinc-200             (dashboard kenarlar)
Sidebar logo:        bg-slate-700         (R harfi kutusu)
Active nav item:     bg-slate-100 text-slate-800
Avatar:              bg-slate-100 text-slate-800

── Genel ────────────────────────────────────────────────────
Başarı:              emerald-50/700       (badge'ler)
Uyarı:               amber-50/700         (taslak badge)
Hata:                red-500 / destructive
```

CSS değişkenleri `app/globals.css`'te tanımlıdır:
- `--primary: 215 25% 27%` → slate-700 (#334155)
- `--ring: 215 25% 27%`

Renk değerleri Tailwind class'ı olarak kullanılır; hardcoded hex kullanılmaz.

### Tipografi

- Font: sistem font stack (sans-serif) — harici font yüklenmez
- Başlık hiyerarşisi: `text-2xl font-semibold` → `text-lg font-medium` → `text-sm`
- Body text: `text-sm` veya `text-base`, `text-slate-700` (landing) / `text-zinc-700` (dashboard)
- Muted metin: `text-muted-foreground`
- Letter spacing: başlıklarda `tracking-tight`

### Spacing & Layout

- Beyaz alan cömert kullanılır — elementler sıkıştırılmaz
- Section arası boşluk: `space-y-6` veya `gap-6`
- Card iç padding: `p-5` (mobil) → `p-6` (desktop)
- Page padding: `p-6 md:p-8`
- Max content genişliği: `max-w-5xl` (admin), `max-w-sm` (auth formlar)
- Dashboard layout: sol sidebar (240px) + sağ main alan

### Border & Shadow

```
Border:    border border-slate-200          — landing; border-zinc-200 dashboard
Radius:    rounded-xl (12px)               — kartlar için
Shadow:    shadow-sm                        — hafif, amaçlı
Hover:     hover:bg-slate-50               — landing; hover:bg-zinc-50 dashboard
Focus:     ring-2 ring-slate-700/20        — net ama agresif değil
Accent:    border-t-2 border-t-slate-700   — auth kartlarında üst vurgu
```

`shadow-xl`, `shadow-2xl` kullanılmaz.

### Form & Input Kuralları

- Input minimum yüksekliği: `h-10` (40px)
- Button minimum yüksekliği: `h-10` (40px), formlar için `w-full`
- Label: her zaman input'un üzerinde, `text-sm font-medium`
- Hata mesajı: `text-sm text-destructive`, input'un hemen altında
- Tüm formlar `react-hook-form` + `zod` ile yazılır

### Mobil & Responsive

- **Mobil-first** — tüm stil önce küçük ekran için yazılır
- Tablet (768px–1024px): birincil kullanım cihazı
- Dokunma hedefi minimum: `48px`
- Dashboard sidebar: `md:` breakpoint'ten itibaren görünür

### Yasak Patternler

```
✗ backdrop-blur (glassmorphism)
✗ bg-gradient-to-* (gradient arka planlar)
✗ animate-pulse / animate-bounce
✗ shadow-2xl / drop-shadow-lg
✗ rounded-full (pill-shape — buton hariç)
✗ text-transparent bg-clip-text (gradient text)
✗ border-2 border-purple-500 (neon border)
```

---

## Test Gereksinimleri

- Her API Route Handler için unit test yazılmalı
- Feedback akışı için integration testi yazılmalı
- Webhook handler'lar için test yazılmalı
- External servisler (Supabase) mock'lanmalı
- `npm test` başarıyla geçmeli

---

## Git Kuralları

### Branch Yapısı

```
main          → Production
develop       → Geliştirme ana branch
feature/xxx   → Yeni özellik
fix/xxx       → Bug fix
```

### Commit Mesajı Formatı

```
feat: feedback step-by-step akışı eklendi
fix: STT geçici dosya silme hatası düzeltildi
refactor: school list server component'a taşındı
chore: next.js 16.3'e güncellendi
```

---

## Environment Değişkenleri (`.env`)

```
# Supabase — tarayıcıya açık (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Supabase — yalnızca sunucu tarafı
SUPABASE_SERVICE_ROLE_KEY=

# Lemon Squeezy (Faz 2 — MVP'de kullanılmıyor)
# LEMON_SQUEEZY_API_KEY=
# LEMON_WEBHOOK_SECRET=
```

---

## Yaygın Görevler & Komutlar

### Yeni Sayfa Ekle

```
app/dashboard/admin/schools/page.tsx   → Server Component oluştur
```

### Yeni API Route Ekle

```
app/api/schools/[id]/route.ts          → Route Handler oluştur
```

### Yeni shadcn Component Ekle

```bash
npx shadcn add <component-adı>
```

### Yeni Supabase Migration

```bash
supabase migration new add_school_table
# Dosyayı düzenle
supabase db push
```

### Development

```bash
npm run dev       # Geliştirme sunucusu
npm run build     # Production build kontrolü
```

---

## Claude Code İçin Özel Talimatlar

- Kodları production-ready yaz, placeholder bırakma
- TypeScript strict mode — `any` kullanma
- Veri çekme işlemlerini Server Component'ta yap, Client Component'a prop olarak geç
- `"use client"` yalnızca gerektiğinde ekle — varsayılan Server Component'tır
- `createAdminClient()` yalnızca `app/api/` içinde ve zorunlu durumlarda kullan
- Ses dosyaları hiçbir zaman kalıcı olarak saklanmamalı
- Tüm formlar `react-hook-form` + `zod` ile yazılmalı
- Gereksiz abstraction ekleme — YAGNI prensibini uygula
- Yeni özellik eklerken mevcut RLS politikalarını bozmamaya dikkat et
- `connection()` from `next/server` — dinamik veri çeken her sayfada kullanılır
