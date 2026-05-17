# 07 — UI Planı

## Tech Stack

- **Next.js App Router** — Sayfa ve layout yönetimi
- **Tailwind CSS** — Utility-first stil
- **shadcn/ui** — Hazır komponentler (zaten kurulu)
- **lucide-react** — İkon seti

## Sayfa Yapısı

```
app/
├── (public)/                   → Auth gerektirmeyen sayfalar
│   ├── page.tsx                → Landing / Home
│   ├── features/page.tsx
│   ├── pricing/page.tsx
│   ├── contact/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   └── auth/callback/route.ts  → Supabase OAuth callback
│
└── (dashboard)/                → Auth zorunlu, layout ile korunur
    ├── layout.tsx              → Session kontrolü + rol yönlendirme
    ├── admin/
    │   ├── page.tsx            → Admin dashboard (özet metrikler)
    │   ├── schools/page.tsx    → Okul listesi + CRUD
    │   ├── products/page.tsx   → Ürün listesi + soru yönetimi
    │   ├── users/page.tsx      → Ekip yönetimi
    │   ├── assignments/page.tsx → Okul ↔ Satışçı / Ürün ataması
    │   ├── import/page.tsx     → Excel içe aktarım
    │   └── reports/page.tsx    → Filtreli raporlar
    │
    └── sales/
        ├── page.tsx            → Sales dashboard
        └── feedback/
            ├── page.tsx        → Okul seçimi
            ├── [schoolId]/page.tsx      → Ürün seçimi
            └── [schoolId]/[productId]/
                ├── page.tsx             → Soru adımları
                └── summary/page.tsx     → Özet & onay
```

## Komponent Yapısı

```
components/
├── ui/                     → shadcn/ui komponentleri (dokunma)
├── layout/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx         → Admin sidebar
│   └── MobileNav.tsx       → Sales için alt navigasyon
├── feedback/
│   ├── SchoolCard.tsx      → Okul listesi öğesi
│   ├── ProductCard.tsx
│   ├── QuestionStep.tsx    → Tek soru adımı (dumb)
│   ├── FeedbackSummary.tsx → Özet ekranı
│   └── SpeechRecorder.tsx  → Ses kayıt + STT (reusable)
├── admin/
│   ├── DataTable.tsx       → Genel tablo komponenti
│   ├── ImportUploader.tsx
│   └── AssignmentModal.tsx
└── shared/
    ├── ConfirmDialog.tsx
    ├── PageHeader.tsx
    └── StatusBadge.tsx
```

## Tasarım Kuralları

| Kural | Değer |
|-------|-------|
| Min dokunma alanı | 48px |
| Birincil aksiyon butonu | Tam genişlik, mobilde sabit alt |
| Breakpoints | sm:640 / md:768 (tablet ana hedef) / lg:1024 / xl:1280 |
| Tema | Light default, dark mode hazır (next-themes kurulu) |
| Font | System font stack |

## Kritik Ekranlar

### QuestionStep (Feedback ana ekranı)
- Tam ekran, yalnızca bir soru görünür
- Üstte: ilerleme çubuğu (`3/7`)
- Ortada: soru metni (büyük)
- Altta: büyük Kayıt butonu + Geç linki
- Kayıt aktifken: animasyonlu dalga göstergesi

### SpeechRecorder Komponenti
```tsx
<SpeechRecorder
  onTranscription={(text) => setAnswer(text)}
  onStateChange={(recording) => setIsRecording(recording)}
/>
```

### FeedbackSummary
- Okul + Ürün başlıkta
- Her soru satırında: soru metni, cevap, "Düzenle" linki
- Atlanan sorular `Geçildi` etiketi ile gösterilir
- Onayla butonu sayfanın altında sabit
