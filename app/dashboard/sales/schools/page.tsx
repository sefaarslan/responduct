import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { MapPin, Phone, User, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function SalesSchoolsPage() {
  await connection();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Atanmış okullar
  const { data: assignments } = await supabase
    .from("school_assignments")
    .select(
      "school_id, schools(id, school_name, city, district, address, phone, contact_person)"
    )
    .eq("user_id", user.id);

  type School = {
    id: string;
    school_name: string;
    city: string | null;
    district: string | null;
    address: string | null;
    phone: string | null;
    contact_person: string | null;
  };

  const schools: School[] = (assignments ?? [])
    .map((a) => a.schools as School | null)
    .filter((s): s is School => !!s);

  const schoolIds = schools.map((s) => s.id);

  // Her okula atanmış ürünler
  const { data: productAssignments } =
    schoolIds.length > 0
      ? await supabase
          .from("school_product_assignments")
          .select("school_id, products(id, product_name)")
          .in("school_id", schoolIds)
      : { data: [] };

  type ProductRow = { school_id: string; products: { id: string; product_name: string } | null };
  const schoolProductMap: Record<string, { id: string; product_name: string }[]> = {};
  for (const pa of (productAssignments ?? []) as ProductRow[]) {
    if (!pa.products) continue;
    if (!schoolProductMap[pa.school_id]) schoolProductMap[pa.school_id] = [];
    schoolProductMap[pa.school_id].push(pa.products);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Okullarım</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {schools.length} atanmış okul
        </p>
      </div>

      {schools.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-900">Atanmış okul yok</p>
          <p className="text-sm text-zinc-500 mt-1">
            Yöneticinizden size okul atamalarını yapmasını isteyin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schools.map((school) => {
            const products = schoolProductMap[school.id] ?? [];
            return (
              <div
                key={school.id}
                className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4"
              >
                {/* Okul başlığı */}
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-slate-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 leading-snug">
                      {school.school_name}
                    </p>
                    {(school.city || school.district) && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {[school.district, school.city].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* İletişim */}
                {(school.contact_person || school.phone) && (
                  <div className="space-y-1.5 pl-0">
                    {school.contact_person && (
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        {school.contact_person}
                      </div>
                    )}
                    {school.phone && (
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <a
                          href={`tel:${school.phone}`}
                          className="hover:text-slate-700 transition-colors"
                        >
                          {school.phone}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Ürünler */}
                {products.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      <Package className="h-3 w-3" />
                      Ürünler
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {products.map((p) => (
                        <Badge
                          key={p.id}
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs font-normal"
                        >
                          {p.product_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
