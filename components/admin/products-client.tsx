"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Package, ChevronRight, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
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
import { ProductForm, type ProductFormValues } from "./product-form";
import { ImportDialog } from "./import-dialog";

interface Product {
  id: string;
  product_name: string;
  description: string | null;
  is_active: boolean;
  questions: { id: string }[];
}

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => router.refresh();

  const handleCreate = async (values: ProductFormValues) => {
    setError(null);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Bir hata oluştu"); return; }
    refresh();
  };

  const handleEdit = async (values: ProductFormValues) => {
    if (!editProduct) return;
    setError(null);
    const res = await fetch(`/api/products/${editProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Bir hata oluştu"); return; }
    setEditProduct(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    refresh();
  };

  const activeProducts = initialProducts.filter((p) => p.is_active);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Ürünler
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {activeProducts.length} aktif ürün
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
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni Ürün
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {initialProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
            <Package className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-900">Henüz ürün eklenmedi</p>
          <p className="text-sm text-zinc-500 mt-1">
            Sağ üstteki butona tıklayarak ilk ürününüzü ekleyin.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                <TableHead className="font-medium text-zinc-700">Ürün Adı</TableHead>
                <TableHead className="font-medium text-zinc-700">Açıklama</TableHead>
                <TableHead className="font-medium text-zinc-700">Sorular</TableHead>
                <TableHead className="font-medium text-zinc-700">Durum</TableHead>
                <TableHead className="w-[120px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-zinc-50">
                  <TableCell className="font-medium text-zinc-900">
                    {product.product_name}
                  </TableCell>
                  <TableCell className="text-zinc-600 max-w-xs truncate">
                    {product.description ?? (
                      <span className="text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/admin/products/${product.id}/questions`}
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {product.questions.length} soru
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={
                        product.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          : "bg-zinc-100 text-zinc-500"
                      }
                    >
                      {product.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                        onClick={() => setEditProduct(product)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-red-600"
                        onClick={() => setDeleteId(product.id)}
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
        type="products"
        onSuccess={refresh}
      />

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
        mode="create"
      />

      {editProduct && (
        <ProductForm
          open={!!editProduct}
          onOpenChange={(open) => !open && setEditProduct(null)}
          defaultValues={{
            product_name: editProduct.product_name,
            description: editProduct.description ?? "",
          }}
          onSubmit={handleEdit}
          mode="edit"
        />
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ürünü pasife al</AlertDialogTitle>
            <AlertDialogDescription>
              Bu ürün pasife alınacak ve feedback akışında görünmeyecek.
              İşlem geri alınabilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Pasife Al
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
