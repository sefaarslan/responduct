import Link from "next/link";
import {
  Mic,
  BarChart3,
  Building2,
  Users,
  FileSpreadsheet,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

const featureGroups = [
  {
    label: "Geri Bildirim Toplama",
    features: [
      {
        icon: Mic,
        title: "Sesli Geri Bildirim",
        desc: "Saha personeli okul ziyaretinde mikrofon butonuna basarak konuşur. Browser tabanlı konuşma tanıma teknolojisi Türkçe transkript oluşturur. Ses verisi hiçbir zaman sunucuya gönderilmez.",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-700",
      },
      {
        icon: Building2,
        title: "Yapılandırılmış Sorular",
        desc: "Her ürün için özelleştirilmiş soru setleri tanımlayın. Satış personeliniz önceden belirlenen soruları eksiksiz yanıtlar. Zorunlu ve isteğe bağlı sorular ayrı ayrı yönetilir.",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        icon: Users,
        title: "Adım Adım Akış",
        desc: "Okul → Ürün → Sorular → Özet → Onayla adımlarından oluşan kılavuzlu akış. Personel hangi sorunun cevapsız kaldığını her zaman görür, önceki adıma dönebilir.",
        iconBg: "bg-sky-50",
        iconColor: "text-sky-600",
      },
    ],
  },
  {
    label: "Yönetim & Raporlama",
    features: [
      {
        icon: BarChart3,
        title: "Filtreli Raporlar",
        desc: "Okul, ürün, satışçı ve tarih aralığına göre geri bildirimleri filtreleyin. Hangi okuldan, hangi ürün için, hangi sorulara nasıl yanıtlar alındığını tek ekranda görün.",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        icon: Users,
        title: "Ekip & Atama Yönetimi",
        desc: "Satış personelinizi ekleyin, her birine hangi okulların sorumluluğunu verin. Okullara hangi ürünlerin sunulacağını belirleyin. Tüm atamalar merkezi panelden yönetilir.",
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
      },
      {
        icon: FileSpreadsheet,
        title: "Excel İçe Aktarım",
        desc: "Yüzlerce okul, ürün veya kullanıcıyı Excel dosyasıyla toplu olarak yükleyin. Şablon indirin, doldurun, yükleyin — bu kadar. Önizleme ekranıyla verilerinizi kontrol edin.",
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
    ],
  },
  {
    label: "Güvenlik & Altyapı",
    features: [
      {
        icon: ShieldCheck,
        title: "Çok Kiracılı Mimari",
        desc: "Her şirketin verileri veritabanı düzeyinde tamamen izole edilmiştir. Row-Level Security (RLS) sayesinde bir şirketin kullanıcısı, başka bir şirketin hiçbir verisine erişemez.",
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
      },
      {
        icon: Building2,
        title: "Rol Bazlı Yetkilendirme",
        desc: "Admin rolü tüm yönetim işlemlerini gerçekleştirir. Sales rolü yalnızca kendi atandığı okullara geri bildirim girebilir. Rol tablosu genişletilebilir yapıdadır.",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
      {
        icon: Mic,
        title: "Mobil & Tablet Uyumlu",
        desc: "Saha personeli akıllı telefon veya tablet üzerinden kullanabilir. Büyük dokunma hedefleri, sade arayüz ve hızlı yükleme süreleri mobil kullanım için optimize edilmiştir.",
        iconBg: "bg-cyan-50",
        iconColor: "text-cyan-600",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingNav />

      <main className="flex-1">
        {/* Header — slate-700, matches home hero */}
        <section className="relative px-4 sm:px-6 pt-20 pb-20 text-center bg-slate-700 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
              Özellikler
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-5">
              Saha satışı için ihtiyaç duyduğunuz{" "}
              <span className="text-slate-300">her araç</span>
            </h1>
            <p className="text-lg text-slate-200/75 leading-relaxed">
              Geri bildirim toplamadan raporlamaya, ekip yönetiminden veri içe
              aktarımına — tüm iş akışı tek platformda.
            </p>
          </div>
        </section>

        {/* Feature Groups — alternating white / slate-50 */}
        {featureGroups.map((group, gi) => (
          <section
            key={group.label}
            className={`px-4 sm:px-6 py-16 border-b border-slate-200 last:border-b-0 ${
              gi % 2 === 0 ? "bg-white" : "bg-slate-50"
            }`}
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xs font-semibold tracking-widest text-slate-700 uppercase mb-8">
                {group.label}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {group.features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-slate-200 bg-white p-6"
                  >
                    <div
                      className={`h-10 w-10 rounded-lg ${feature.iconBg} flex items-center justify-center mb-4`}
                    >
                      <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="px-4 sm:px-6 py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Hemen kullanmaya başlayın
            </h2>
            <p className="text-slate-500 mb-8">14 gün ücretsiz, kredi kartı gerekmez.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/register">
                <Button className="bg-slate-700 hover:bg-slate-800 text-white h-12 px-8 text-[15px] gap-2">
                  Ücretsiz Başla
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="h-12 px-8 text-[15px]">
                  Fiyatlandırmayı Gör
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
