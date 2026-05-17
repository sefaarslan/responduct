# 01 — Problem Tanımı

## Sorun

Eğitim sektöründe saha satış ekipleri, ziyaret ettikleri okullardan feedback toplamak için kağıt form veya WhatsApp kullanıyor. Bu yöntemler:

- Standart değil → raporlanamaz
- Gecikmeli → yönetici sahadan bilgiyi günler sonra alıyor
- Hatalı → farklı satışçılar farklı sorular soruyor
- Verimsiz → ofise dönünce sisteme tekrar girilmesi gerekiyor

## Hedef Kitle

| Kullanıcı | Açıklama |
|-----------|----------|
| Saha Satış Personeli | Tablet ile okulları ziyaret eden, teknik bilgisi orta düzeyde |
| Satış Yöneticisi / Admin | Ekip performansını ve okul bazlı verileri takip eden |

## Çözüm

**Responduct** — Saha satış ekiplerinin okul ziyaretlerinde sesli ve yapılandırılmış geri bildirim girmesini sağlayan, mobil-first SaaS uygulaması.

- Sorular ürüne göre otomatik gelir
- Satışçı sesle yanıt verir → STT ile metne dönüşür
- Tüm veriler anlık olarak buluta kaydedilir
- Admin merkezi raporlama ekranından takip eder

## Temel Varsayımlar

- Saha personeli tablet kullanıyor
- İnternet bağlantısı ziyaret sırasında mevcut (offline MVP dışı)
- Türkçe sesli giriş yeterli doğrulukla çalışmalı (Faster-Whisper)
- Şirket başına abonelik modeli uygulanacak
