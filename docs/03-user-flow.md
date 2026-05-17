# 03 — Kullanıcı Akışları

## 1. Kayıt & Abonelik Akışı

```
Landing / Pricing
  └─→ Plan seç → Lemon Squeezy Checkout
      └─→ Ödeme tamamlanır
          └─→ Webhook: subscription_created
              └─→ company + subscription Supabase'e kaydedilir
                  └─→ Kullanıcı /register sayfasına yönlendirilir
                      └─→ Admin hesabı oluşturulur (company_id metadata ile)
                          └─→ /dashboard'a yönlendirme
```

## 2. Giriş Akışı

```
/login
  ├─→ Başarılı → rol kontrolü
  │     ├─→ admin → /dashboard/admin
  │     └─→ sales → /dashboard/sales
  └─→ Başarısız → hata mesajı
```

## 3. Feedback Akışı (Ana Modül)

```
/dashboard/sales
  └─→ "Yeni Feedback" butonuna bas
      └─→ Okul listesi (atananlar)
          └─→ Okul seç
              └─→ Ürün listesi (o okula atananlar)
                  └─→ Ürün seç
                      └─→ Soru 1 ekrana gelir
                          ├─→ [Kayıt] → STT → Metin → Düzenle → İleri
                          ├─→ [Geç]   → is_skipped=true → İleri
                          └─→ Tüm sorular bitti
                              └─→ Özet ekranı
                                  ├─→ [Düzenle] → ilgili soruya dön
                                  └─→ [Onayla & Kaydet]
                                      └─→ feedbacks + feedback_answers toplu insert
                                          └─→ Başarı ekranı → /dashboard/sales
```

## 4. Admin Yönetim Akışı

```
/dashboard/admin
  ├─→ Okullar  → Ekle / Düzenle / Sil / Atama yap
  ├─→ Ürünler  → Ekle / Düzenle / Soru ekle
  ├─→ Ekip     → Kullanıcı ekle / Okul ata
  ├─→ İçe Aktar → Excel yükle → Önizleme → Onayla
  └─→ Raporlar → Filtrele (okul / ürün / kişi / tarih)
```

## 5. STT Akışı

```
Kullanıcı mikrofona basar (MediaRecorder API)
  └─→ Kayıt başlar
      └─→ Durdur → Blob oluşur
          └─→ POST /api/stt/transcribe (multipart)
              └─→ Faster-Whisper çalışır (language=tr)
                  └─→ Geçici dosya silinir
                      └─→ { text } → textarea'ya yazılır
```
