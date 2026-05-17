import { Mail, MessageSquare } from "lucide-react";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";
import { ContactForm } from "@/components/landing/contact-form";

export default function ContactPage() {
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
              İletişim
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Sizinle tanışmak isteriz
            </h1>
            <p className="text-lg text-slate-200/75 max-w-xl mx-auto">
              Demo talebi, fiyatlandırma sorusu veya teknik destek için bize
              yazın. Genellikle 1 iş günü içinde yanıt veriyoruz.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 sm:px-6 py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10">
            {/* Info cards */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                  <Mail className="h-4 w-4 text-slate-700" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">E-posta</h3>
                <p className="text-sm text-slate-500">
                  Genel sorularınız ve demo talepleriniz için
                </p>
                <p className="text-sm font-medium text-slate-700 mt-2">
                  hello@responduct.com
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-4 w-4 text-slate-700" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Destek</h3>
                <p className="text-sm text-slate-500">
                  Teknik sorunlar ve hesap yönetimi için
                </p>
                <p className="text-sm font-medium text-slate-700 mt-2">
                  destek@responduct.com
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Yanıt sürelerimiz</h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-center justify-between">
                    <span>Genel sorular</span>
                    <span className="font-medium text-slate-900">1 iş günü</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Teknik destek</span>
                    <span className="font-medium text-slate-900">4 saat</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Kurumsal</span>
                    <span className="font-medium text-slate-900">1 saat</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Mesaj gönderin
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
