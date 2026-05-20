"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Clock, Filter, X, BarChart3, Download } from "lucide-react";
import * as XLSX from "xlsx";

type Feedback = {
  id: string;
  visit_date: string;
  status: string;
  created_at: string;
  schools: { school_name: string; city: string | null } | null;
  products: { product_name: string } | null;
  users: { full_name: string } | null;
};

type FilterOption = { id: string; label: string };

interface ReportsClientProps {
  feedbacks: Feedback[];
  schools: { id: string; school_name: string }[];
  products: { id: string; product_name: string }[];
  users: { id: string; full_name: string }[];
}

export function ReportsClient({
  feedbacks,
  schools,
  products,
  users,
}: ReportsClientProps) {
  const [schoolFilter, setSchoolFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return feedbacks.filter((fb) => {
      if (schoolFilter && fb.schools?.school_name !== schoolFilter) return false;
      if (productFilter && fb.products?.product_name !== productFilter) return false;
      if (userFilter && fb.users?.full_name !== userFilter) return false;
      if (statusFilter && fb.status !== statusFilter) return false;
      if (dateFrom && fb.visit_date < dateFrom) return false;
      if (dateTo && fb.visit_date > dateTo) return false;
      return true;
    });
  }, [feedbacks, schoolFilter, productFilter, userFilter, statusFilter, dateFrom, dateTo]);

  const completedCount = filtered.filter((fb) => fb.status === "completed").length;
  const draftCount = filtered.filter((fb) => fb.status === "draft").length;

  const hasActiveFilter = schoolFilter || productFilter || userFilter || statusFilter || dateFrom || dateTo;

  function clearFilters() {
    setSchoolFilter("");
    setProductFilter("");
    setUserFilter("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
  }

  const schoolOptions: FilterOption[] = schools.map((s) => ({ id: s.school_name, label: s.school_name }));
  const productOptions: FilterOption[] = products.map((p) => ({ id: p.product_name, label: p.product_name }));
  const userOptions: FilterOption[] = users.map((u) => ({ id: u.full_name, label: u.full_name }));

  function exportToExcel() {
    const rows = filtered.map((fb) => ({
      "Ziyaret Tarihi": fb.visit_date
        ? new Date(fb.visit_date).toLocaleDateString("tr-TR")
        : "",
      "Okul": fb.schools?.school_name ?? "",
      "Şehir": fb.schools?.city ?? "",
      "Ürün": fb.products?.product_name ?? "",
      "Satışçı": fb.users?.full_name ?? "",
      "Durum": fb.status === "completed" ? "Tamamlandı" : "Taslak",
      "Kayıt Zamanı": new Date(fb.created_at).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const colWidths = [14, 30, 14, 22, 20, 14, 20];
    ws["!cols"] = colWidths.map((w) => ({ wch: w }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Raporlar");

    const fileName = `responduct-raporlar-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Raporlar
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Tüm feedback kayıtlarını filtreleyin ve analiz edin
          </p>
        </div>
        <button
          onClick={exportToExcel}
          disabled={filtered.length === 0}
          className="shrink-0 inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 h-9 rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          Excel İndir
        </button>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Toplam", value: filtered.length, color: "text-zinc-900" },
          { label: "Tamamlandı", value: completedCount, color: "text-emerald-700" },
          { label: "Taslak", value: draftCount, color: "text-amber-700" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-zinc-200 px-5 py-4"
          >
            <p className={`text-2xl font-semibold ${color}`}>{value}</p>
            <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-700">Filtreler</span>
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Temizle
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Select
            placeholder="Tüm Okullar"
            value={schoolFilter}
            onChange={setSchoolFilter}
            options={schoolOptions}
          />
          <Select
            placeholder="Tüm Ürünler"
            value={productFilter}
            onChange={setProductFilter}
            options={productOptions}
          />
          <Select
            placeholder="Tüm Satışçılar"
            value={userFilter}
            onChange={setUserFilter}
            options={userOptions}
          />
          <Select
            placeholder="Tüm Durumlar"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { id: "completed", label: "Tamamlandı" },
              { id: "draft", label: "Taslak" },
            ]}
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-700/20 focus:border-slate-400 w-full"
            title="Başlangıç tarihi"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-700/20 focus:border-slate-400 w-full"
            title="Bitiş tarihi"
          />
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900">
              {hasActiveFilter ? "Filtreye uyan kayıt bulunamadı" : "Henüz feedback kaydı yok"}
            </p>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="mt-2 text-xs text-slate-700 hover:underline"
              >
                Filtreleri temizle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Ziyaret Tarihi
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Okul
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Satışçı
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Kayıt Zamanı
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((fb) => (
                  <tr key={fb.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3.5 text-zinc-700 whitespace-nowrap">
                      {fb.visit_date
                        ? new Date(fb.visit_date).toLocaleDateString("tr-TR")
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-zinc-900">
                        {fb.schools?.school_name ?? "—"}
                      </p>
                      {fb.schools?.city && (
                        <p className="text-xs text-zinc-400">{fb.schools.city}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-700">
                      {fb.products?.product_name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-700">
                      {fb.users?.full_name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          fb.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {fb.status === "completed" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {fb.status === "completed" ? "Tamamlandı" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 whitespace-nowrap text-xs">
                      {new Date(fb.created_at).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-zinc-400 text-right">
          {filtered.length} kayıt gösteriliyor
          {feedbacks.length !== filtered.length && ` (toplam ${feedbacks.length})`}
        </p>
      )}
    </div>
  );
}

function Select({
  placeholder,
  value,
  onChange,
  options,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-700/20 focus:border-slate-400 w-full"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
