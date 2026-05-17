import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

const templates: Record<string, { headers: string[]; example: string[][] }> = {
  schools: {
    headers: ["okul_adi", "sehir", "ilce", "adres", "telefon", "iletisim_kisi"],
    example: [
      ["Örnek İlköğretim Okulu", "İstanbul", "Kadıköy", "Bağdat Cad. No:1", "0216 000 00 00", "Ahmet Müdür"],
      ["Deneme Anadolu Lisesi", "Ankara", "Çankaya", "Atatürk Blv. No:5", "0312 000 00 00", "Ayşe Hanım"],
    ],
  },
  products: {
    headers: ["urun_adi", "aciklama"],
    example: [
      ["Eğitim Paketi A", "İlkokul müfredatına uygun paket"],
      ["Dijital Öğrenme Seti", "Tablet destekli interaktif içerik"],
    ],
  },
  users: {
    headers: ["ad_soyad", "email", "rol", "sifre"],
    example: [
      ["Ahmet Yılmaz", "ahmet@firma.com", "sales", "Gizli123!"],
      ["Fatma Demir", "fatma@firma.com", "admin", "Gizli456!"],
    ],
  },
  "school-assignments": {
    headers: ["okul_adi", "kullanici_email"],
    example: [
      ["Örnek İlköğretim Okulu", "ahmet@firma.com"],
      ["Deneme Anadolu Lisesi", "fatma@firma.com"],
    ],
  },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const template = templates[type];

  if (!template) {
    return NextResponse.json({ error: "Geçersiz şablon türü" }, { status: 400 });
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([template.headers, ...template.example]);

  // Sütun genişlikleri
  ws["!cols"] = template.headers.map(() => ({ wch: 25 }));

  XLSX.utils.book_append_sheet(wb, ws, "Şablon");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${type}-sablonu.xlsx"`,
    },
  });
}
