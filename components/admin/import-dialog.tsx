"use client";

import { useState, useRef } from "react";
import { Upload, Download, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ImportType = "schools" | "products" | "users" | "school-assignments";

interface ColumnMap {
  label: string;
  key: string;
}

const columnMaps: Record<ImportType, ColumnMap[]> = {
  schools: [
    { label: "Okul Adı", key: "school_name" },
    { label: "Şehir", key: "city" },
    { label: "İlçe", key: "district" },
    { label: "Adres", key: "address" },
    { label: "Telefon", key: "phone" },
    { label: "İletişim Kişisi", key: "contact_person" },
  ],
  products: [
    { label: "Ürün Adı", key: "product_name" },
    { label: "Açıklama", key: "description" },
  ],
  users: [
    { label: "Ad Soyad", key: "full_name" },
    { label: "E-posta", key: "email" },
    { label: "Rol", key: "role" },
    { label: "Şifre", key: "password" },
  ],
  "school-assignments": [
    { label: "Okul Adı", key: "school_name" },
    { label: "Kullanıcı E-postası", key: "user_email" },
  ],
};

// Excel sütun başlığı → alan adı eşlemesi
const excelKeyMap: Record<ImportType, Record<string, string>> = {
  schools: {
    okul_adi: "school_name",
    sehir: "city",
    ilce: "district",
    adres: "address",
    telefon: "phone",
    iletisim_kisi: "contact_person",
    "okul adı": "school_name",
    şehir: "city",
    ilçe: "district",
  },
  products: {
    urun_adi: "product_name",
    aciklama: "description",
    "ürün adı": "product_name",
    açıklama: "description",
  },
  users: {
    ad_soyad: "full_name",
    email: "email",
    rol: "role",
    sifre: "password",
    şifre: "password",
    "ad soyad": "full_name",
  },
  "school-assignments": {
    okul_adi: "school_name",
    kullanici_email: "user_email",
    "okul adı": "school_name",
    "kullanıcı e-postası": "user_email",
    kullanici_eposta: "user_email",
  },
};

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ImportType;
  onSuccess: () => void;
}

export function ImportDialog({
  open,
  onOpenChange,
  type,
  onSuccess,
}: ImportDialogProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ inserted: number; skipped: number } | null>(null);

  const columns = columnMaps[type];
  const keyMap = excelKeyMap[type];

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);
    setResult(null);

    try {
      const XLSX = await import("xlsx");
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
        defval: "",
      });

      if (json.length === 0) {
        setParseError("Dosyada veri bulunamadı.");
        return;
      }

      const mapped = json.map((row) => {
        const result: Record<string, string> = {};
        for (const [rawKey, val] of Object.entries(row)) {
          const normalized = rawKey.trim().toLowerCase().replace(/\s+/g, "_");
          const mappedKey = keyMap[normalized] ?? keyMap[rawKey.trim().toLowerCase()];
          if (mappedKey) {
            result[mappedKey] = String(val ?? "").trim();
          }
        }
        return result;
      });

      setRows(mapped.slice(0, 500));
    } catch {
      setParseError("Dosya okunamadı. Lütfen şablon formatını kullanın.");
    }
  };

  const handleImport = async () => {
    setImporting(true);
    const res = await fetch(`/api/import/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    const data = await res.json();
    setImporting(false);

    if (!res.ok) {
      setParseError(data.error ?? "İçe aktarım başarısız");
      return;
    }

    setResult(data);
  };

  const handleClose = () => {
    if (result) onSuccess();
    setRows([]);
    setParseError(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Excel ile İçe Aktar —{" "}
            {type === "schools"
              ? "Okullar"
              : type === "products"
              ? "Ürünler"
              : type === "users"
              ? "Kullanıcılar"
              : "Okul–Kullanıcı Atamaları"}
          </DialogTitle>
          <DialogDescription>
            Şablonu indirin, doldurun ve yükleyin.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Şablon indir + dosya yükle */}
          <div className="flex items-center gap-3">
            <a
              href={`/api/import/template/${type}`}
              download
              className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-800 font-medium"
            >
              <Download className="h-4 w-4" />
              Şablonu İndir
            </a>
            <span className="text-zinc-300">|</span>
            <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-zinc-700 hover:text-zinc-900 font-medium">
              <Upload className="h-4 w-4" />
              Excel Dosyası Seç
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFile}
                className="hidden"
              />
            </label>
            {rows.length > 0 && (
              <button
                onClick={() => {
                  setRows([]);
                  setResult(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="ml-auto text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {parseError && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {parseError}
            </div>
          )}

          {result && (
            <div className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>{result.inserted}</strong> kayıt eklendi
                {result.skipped > 0 && (
                  <>, <strong>{result.skipped}</strong> satır atlandı (eksik alan)</>
                )}
                .
              </span>
            </div>
          )}

          {/* Önizleme tablosu */}
          {rows.length > 0 && !result && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500">
                {rows.length} satır okundu — ilk 5 önizleme:
              </p>
              <div className="rounded-lg border border-zinc-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                      {columns.map((col) => (
                        <TableHead key={col.key} className="text-xs font-medium text-zinc-600">
                          {col.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(0, 5).map((row, i) => (
                      <TableRow key={i} className="hover:bg-zinc-50">
                        {columns.map((col) => (
                          <TableCell key={col.key} className="text-xs text-zinc-700 max-w-[120px] truncate">
                            {row[col.key] || (
                              <span className="text-zinc-300">—</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {rows.length > 5 && (
                <p className="text-xs text-zinc-400 text-right">
                  +{rows.length - 5} satır daha
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-4 border-t border-zinc-100">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            {result ? "Kapat" : "İptal"}
          </Button>
          {!result && (
            <Button
              className="flex-1"
              disabled={rows.length === 0 || importing}
              onClick={handleImport}
            >
              {importing
                ? "Aktarılıyor…"
                : `${rows.length} Kaydı İçe Aktar`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
