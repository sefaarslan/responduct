import Link from "next/link";
import {
  ArrowRight,
  Mic,
  BarChart3,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

const features = [
  {
    icon: Mic,
    title: "Sesli Geri Bildirim",
    desc: "Okul ziyaretinde sesle konuşun, sistem otomatik transkript oluştursun. Yazma derdi yok, veri kaybı yok.",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    icon: BarChart3,
    title: "Gerçek Zamanlı Raporlar",
    desc: "Ürün, okul ve satışçı bazında filtreli raporlar. Karar vermek için ihtiyacınız olan tüm veriler tek ekranda.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Building2,
    title: "Çoklu Okul Yönetimi",
    desc: "Yüzlerce okulu, atanmış ürün ve satışçılarıyla birlikte tek panelden kolayca yönetin.",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
];

const steps = [
  {
    n: "1",
    title: "Okul ve ürünü seçin",
    desc: "Ziyaret ettiğiniz okulu ve sunduğunuz ürünü seçin. Atamalar yönetici tarafından önceden yapılmıştır.",
  },
  {
    n: "2",
    title: "Soruları sesle yanıtlayın",
    desc: "Her soru için mikrofon butonuna basın ve konuşun. Sistem Türkçe olarak anında transkript oluşturur.",
  },
  {
    n: "3",
    title: "Özeti onaylayın",
    desc: "Yanıtları gözden geçirin, gerekirse düzenleyin ve onaylayın. Geri bildirim sisteme anında kaydedilir.",
  },
];

const stats = [
  { value: "500", label: "Aktif Okul" },
  { value: "12K+", label: "Geri Bildirim" },
  { value: "%98", label: "Memnuniyet" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingNav />

      <main className="flex-1">
        {/* ── HERO ── slate-700 solid bg */}
        <section className="relative px-4 sm:px-6 pt-24 pb-28 md:pt-36 md:pb-36 bg-slate-700 overflow-hidden">
          {/* subtle dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* bottom fade into white */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent" />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
              Eğitim Sektörü için Tasarlandı
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[74px] font-bold tracking-tight text-white leading-[1.07] mb-6">
              Saha satışında geri bildirimi{" "}
              <span className="text-slate-300">yeniden tanımlayın</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Okul ziyaretlerinizden sesli geri bildirim toplayın.
              Yapılandırılmış sorularla verileri anında kaydedin, raporlayın ve
              analiz edin.
            </p>

            <ul className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10 text-sm text-slate-200/70">
              {[
                "Kurulum gerektirmez",
                "Türkçe konuşma tanıma",
                "Verileriniz tamamen izole",
              ].map((b) => (
                <li key={b} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 h-12 rounded-lg text-[15px] transition-colors shadow-sm"
              >
                Ücretsiz Başla
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white/90 font-medium px-8 h-12 rounded-lg text-[15px] transition-colors"
              >
                Demo Talep Edin
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-4"
                >
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-300/70 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── white */}
        <section className="px-4 sm:px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-widest text-slate-700 uppercase mb-3">
                Özellikler
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Her şey tek bir platformda
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Saha ekibinizden toplantı odanıza kadar tüm süreci
                Responduct&apos;ta yönetin.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div
                    className={`h-10 w-10 rounded-lg ${feature.iconBg} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── slate-50 */}
        <section className="px-4 sm:px-6 py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-widest text-slate-700 uppercase mb-3">
                Nasıl Çalışır?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Üç adımda geri bildirim toplayın
              </h2>
              <p className="text-slate-500">Saha personeli dakikalar içinde kullanmaya başlar.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((item, i) => (
                <div key={item.n} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-5 left-[calc(100%_-_1.5rem)] w-[calc(100%_-_0.5rem)] h-px bg-slate-300" />
                  )}
                  <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white mb-4 shadow-sm">
                    {item.n}
                  </div>
                  <h3 className="text-[17px] font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── slate-900 */}
        <section className="px-4 sm:px-6 py-16 bg-white">
          <div className="max-w-4xl mx-auto rounded-2xl bg-slate-700 px-8 py-14 text-center overflow-hidden relative">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative">
              <p className="text-xs font-semibold tracking-widest text-slate-300 uppercase mb-3">
                Başlamaya Hazır Mısınız?
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Saha ekibinizin verilerini dijitalleştirin
              </h2>
              <p className="text-slate-200/80 mb-8 max-w-lg mx-auto">
                Hemen kaydolun, kurulum gerekmez. Ekibiniz dakikalar içinde
                kullanmaya başlar.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 h-12 rounded-lg text-[15px] transition-colors shadow-sm"
                >
                  Ücretsiz Başla
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 h-12 rounded-lg text-[15px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Demo Talep Edin
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
