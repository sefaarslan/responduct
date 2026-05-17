"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Building2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SchoolForm, type SchoolFormValues } from "./school-form";
import { ImportDialog } from "./import-dialog";

interface School {
  id: string;
  school_name: string;
  city: string | null;
  district: string | null;
  address: string | null;
  phone: string | null;
  contact_person: string | null;
  is_active: boolean;
}

interface SchoolsClientProps {
  initialSchools: School[];
}

export function SchoolsClient({ initialSchools }: SchoolsClientProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editSchool, setEditSchool] = useState<School | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => router.refresh();

  const handleCreate = async (values: SchoolFormValues) => {
    setError(null);
    const res = await fetch("/api/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu");
      return;
    }
    refresh();
  };

  const handleEdit = async (values: SchoolFormValues) => {
    if (!editSchool) return;
    setError(null);
    const res = await fetch(`/api/schools/${editSchool.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu");
      return;
    }
    setEditSchool(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/schools/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    refresh();
  };

  const activeSchools = initialSchools.filter((s) => s.is_active);

  return (
    <>
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Okullar
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {activeSchools.length} aktif okul
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setImportOpen(true)}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel ile İçe Aktar
          </Button>
          <Button
            onClick={() => setFormOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Okul
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* Tablo */}
      {initialSchools.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-900">Henüz okul eklenmedi</p>
          <p className="text-sm text-zinc-500 mt-1">
            Sağ üstteki butona tıklayarak ilk okulunuzu ekleyin.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                <TableHead className="font-medium text-zinc-700">Okul Adı</TableHead>
                <TableHead className="font-medium text-zinc-700">Şehir / İlçe</TableHead>
                <TableHead className="font-medium text-zinc-700">İletişim</TableHead>
                <TableHead className="font-medium text-zinc-700">Durum</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialSchools.map((school) => (
                <TableRow key={school.id} className="hover:bg-zinc-50">
                  <TableCell className="font-medium text-zinc-900">
                    {school.school_name}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {school.district
                      ? `${school.district}, ${school.city}`
                      : school.city}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {school.contact_person ?? (
                      <span className="text-zinc-400">—</span>
                    )}
                    {school.phone && (
                      <span className="block text-xs text-zinc-400">
                        {school.phone}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={school.is_active ? "default" : "secondary"}
                      className={
                        school.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          : "bg-zinc-100 text-zinc-500"
                      }
                    >
                      {school.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                        onClick={() => setEditSchool(school)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-red-600"
                        onClick={() => setDeleteId(school.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        type="schools"
        onSuccess={refresh}
      />

      {/* Yeni okul formu */}
      <SchoolForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
        mode="create"
      />

      {/* Düzenleme formu */}
      {editSchool && (
        <SchoolForm
          open={!!editSchool}
          onOpenChange={(open) => !open && setEditSchool(null)}
          defaultValues={{
            school_name: editSchool.school_name,
            city: editSchool.city ?? "",
            district: editSchool.district ?? "",
            address: editSchool.address ?? "",
            phone: editSchool.phone ?? "",
            contact_person: editSchool.contact_person ?? "",
          }}
          onSubmit={handleEdit}
          mode="edit"
        />
      )}

      {/* Silme onayı */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Okulu pasife al</AlertDialogTitle>
            <AlertDialogDescription>
              Bu okul pasife alınacak ve satışçı listelerinde görünmeyecek.
              İşlem geri alınabilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-slate-800 hover:bg-slate-900 text-white"
            >
              Pasife Al
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
