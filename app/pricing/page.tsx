import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

const plans = [
  {
    name: "Başlangıç",
    tagline: "Küçük satış ekipleri için",
    limits: "5 kullanıcı · 50 okul · 200 feedback/ay",
    features: [
      "Sesli geri bildirim girişi",
      "Temel raporlar",
      "Excel içe aktarım",
      "E-posta desteği",
      "Rol tabanlı yetkilendirme",
    ],
    featured: false,
  },
  {
    name: "Profesyonel",
    tagline: "Büyüyen ekipler için ideal",
    limits: "15 kullanıcı · 200 okul · 1.000 feedback/ay",
    features: [
      "Başlangıç planındaki her şey",
      "Gelişmiş filtreli raporlar",
      "Çoklu ürün yönetimi",
      "Toplu atama içe aktarım",
      "Öncelikli destek",
    ],
    featured: true,
  },
  {
    name: "Kurumsal",
    tagline: "Büyük sahalar için",
    limits: "Sınırsız kullanıcı & okul",
    features: [
      "Profesyonel plandaki her şey",
      "Sınırsız feedback",
      "Özel onboarding",
      "SLA garantisi",
      "Özel entegrasyon desteği",
    ],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingNav />

      <main className="flex-1">
        {/* Header */}
        <section className="relative px-4 sm:px-6 pt-20 pb-20 text-center bg-slate-700 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
              Fiyatlandırma
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5">
              İhtiyacınıza uygun plan seçin
            </h1>
            <p className="text-lg text-slate-200/75">
              Tüm planlar 14 günlük ücretsiz deneme ile başlar. Sözleşme veya
              kredi kartı gerekmez.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="px-4 sm:px-6 py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 flex flex-col relative ${
                  plan.featured
                    ? "bg-slate-700 shadow-lg"
                    : "bg-white border border-slate-200"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-slate-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      En Popüler
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={`text-lg font-semibold ${plan.featured ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mt-1 ${plan.featured ? "text-slate-200" : "text-slate-500"}`}>
                    {plan.tagline}
                  </p>
                  <p className={`text-xs mt-2 font-medium ${plan.featured ? "text-slate-300" : "text-slate-400"}`}>
                    {plan.limits}
                  </p>
                </div>

                <div className={`border-t pt-5 mb-6 flex-1 ${plan.featured ? "border-slate-500" : "border-slate-100"}`}>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`h-4 w-4 mt-0.5 shrink-0 ${
                            plan.featured ? "text-slate-200" : "text-slate-500"
                          }`}
                        />
                        <span className={`text-sm ${plan.featured ? "text-slate-200" : "text-slate-700"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/contact">
                  <Button
                    className={`w-full gap-2 ${
                      plan.featured
                        ? "bg-white text-slate-700 hover:bg-slate-50"
                        : "bg-slate-700 hover:bg-slate-800 text-white"
                    }`}
                  >
                    İletişime Geç
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 sm:px-6 py-16 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
              Sık sorulan sorular
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Deneme süresi bittikten sonra ne olur?",
                  a: "14 günlük deneme süresinin sonunda otomatik ücretlendirme yapılmaz. Devam etmek için bize ulaşmanız yeterli.",
                },
                {
                  q: "Plan değiştirebilir miyim?",
                  a: "İstediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklikler anında yansır.",
                },
                {
                  q: "Verilerim güvende mi?",
                  a: "Tüm veriler Supabase altyapısında saklanır. Row-Level Security ile her şirketin verileri tamamen izole edilmiştir.",
                },
                {
                  q: "Mobil cihazdan kullanılabilir mi?",
                  a: "Evet. Responduct tablet ve akıllı telefon üzerinde optimum şekilde çalışacak biçimde tasarlanmıştır.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900 mb-1">{q}</p>
                  <p className="text-sm text-slate-500">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
