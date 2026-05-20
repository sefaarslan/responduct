"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2, Link2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImportDialog } from "./import-dialog";

interface School {
  id: string;
  school_name: string;
  city: string | null;
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface Product {
  id: string;
  product_name: string;
}

interface AssignmentsClientProps {
  schools: School[];
  salesUsers: User[];
  products: Product[];
  schoolUserMap: Record<string, string[]>;
  schoolProductMap: Record<string, string[]>;
}

export function AssignmentsClient({
  schools,
  salesUsers,
  products,
  schoolUserMap,
  schoolProductMap,
}: AssignmentsClientProps) {
  const router = useRouter();

  const [userDialog, setUserDialog] = useState<School | null>(null);
  const [productDialog, setProductDialog] = useState<School | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const [pendingUsers, setPendingUsers] = useState<Set<string>>(new Set());
  const [pendingProducts, setPendingProducts] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const openUserDialog = (school: School) => {
    setPendingUsers(new Set(schoolUserMap[school.id] ?? []));
    setUserDialog(school);
  };

  const openProductDialog = (school: School) => {
    setPendingProducts(new Set(schoolProductMap[school.id] ?? []));
    setProductDialog(school);
  };

  const toggleUser = (userId: string) => {
    setPendingUsers((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const toggleProduct = (productId: string) => {
    setPendingProducts((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const saveUserAssignments = async () => {
    if (!userDialog) return;
    setSaving(true);

    const current = new Set(schoolUserMap[userDialog.id] ?? []);
    const next = pendingUsers;

    const toAdd = [...next].filter((id) => !current.has(id));
    const toRemove = [...current].filter((id) => !next.has(id));

    await Promise.all([
      ...toAdd.map((user_id) =>
        fetch("/api/assignments/school-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ school_id: userDialog.id, user_id }),
        })
      ),
      ...toRemove.map((user_id) =>
        fetch("/api/assignments/school-user", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ school_id: userDialog.id, user_id }),
        })
      ),
    ]);

    setSaving(false);
    setUserDialog(null);
    router.refresh();
  };

  const saveProductAssignments = async () => {
    if (!productDialog) return;
    setSaving(true);

    const current = new Set(schoolProductMap[productDialog.id] ?? []);
    const next = pendingProducts;

    const toAdd = [...next].filter((id) => !current.has(id));
    const toRemove = [...current].filter((id) => !next.has(id));

    await Promise.all([
      ...toAdd.map((product_id) =>
        fetch("/api/assignments/school-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ school_id: productDialog.id, product_id }),
        })
      ),
      ...toRemove.map((product_id) =>
        fetch("/api/assignments/school-product", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ school_id: productDialog.id, product_id }),
        })
      ),
    ]);

    setSaving(false);
    setProductDialog(null);
    router.refresh();
  };

  if (schools.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-6">
          Atamalar
        </h1>
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
            <Link2 className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-900">Henüz okul eklenmedi</p>
          <p className="text-sm text-zinc-500 mt-1">
            Önce Okullar sayfasından okul ekleyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Atamalar
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Okullara satışçı ve ürün atayın
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setImportOpen(true)}
          className="gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Excel ile İçe Aktar
        </Button>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Okul → Satışçı</TabsTrigger>
          <TabsTrigger value="products">Okul → Ürün</TabsTrigger>
        </TabsList>

        {/* Okul → Satışçı */}
        <TabsContent value="users">
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                  <TableHead className="font-medium text-zinc-700">Okul</TableHead>
                  <TableHead className="font-medium text-zinc-700">Atanmış Satışçılar</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => {
                  const assignedIds = schoolUserMap[school.id] ?? [];
                  const assignedUsers = salesUsers.filter((u) =>
                    assignedIds.includes(u.id)
                  );
                  return (
                    <TableRow key={school.id} className="hover:bg-zinc-50">
                      <TableCell>
                        <p className="font-medium text-zinc-900">
                          {school.school_name}
                        </p>
                        {school.city && (
                          <p className="text-xs text-zinc-400">{school.city}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        {assignedUsers.length === 0 ? (
                          <span className="text-sm text-zinc-400">Atanmadı</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {assignedUsers.map((u) => (
                              <Badge
                                key={u.id}
                                className="bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100 text-xs"
                              >
                                {u.full_name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                          onClick={() => openUserDialog(school)}
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Okul → Ürün */}
        <TabsContent value="products">
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                  <TableHead className="font-medium text-zinc-700">Okul</TableHead>
                  <TableHead className="font-medium text-zinc-700">Atanmış Ürünler</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => {
                  const assignedIds = schoolProductMap[school.id] ?? [];
                  const assignedProducts = products.filter((p) =>
                    assignedIds.includes(p.id)
                  );
                  return (
                    <TableRow key={school.id} className="hover:bg-zinc-50">
                      <TableCell>
                        <p className="font-medium text-zinc-900">
                          {school.school_name}
                        </p>
                        {school.city && (
                          <p className="text-xs text-zinc-400">{school.city}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        {assignedProducts.length === 0 ? (
                          <span className="text-sm text-zinc-400">Atanmadı</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {assignedProducts.map((p) => (
                              <Badge
                                key={p.id}
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs"
                              >
                                {p.product_name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                          onClick={() => openProductDialog(school)}
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Satışçı atama diyalogu */}
      <Dialog open={!!userDialog} onOpenChange={(open) => !open && setUserDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Satışçı Ata</DialogTitle>
            <DialogDescription>
              {userDialog?.school_name} — atanacak satışçıları seçin
            </DialogDescription>
          </DialogHeader>

          {salesUsers.length === 0 ? (
            <p className="text-sm text-zinc-500 py-2">
              Henüz satış personeli eklenmedi.
            </p>
          ) : (
            <ul className="space-y-2 py-2 max-h-64 overflow-y-auto">
              {salesUsers.map((user) => (
                <li key={user.id}>
                  <label className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 hover:bg-zinc-50">
                    <input
                      type="checkbox"
                      checked={pendingUsers.has(user.id)}
                      onChange={() => toggleUser(user.id)}
                      className="rounded border-zinc-300 text-slate-700 focus:ring-slate-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setUserDialog(null)}
            >
              İptal
            </Button>
            <Button
              className="flex-1"
              onClick={saveUserAssignments}
              disabled={saving}
            >
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ürün atama diyalogu */}
      <Dialog
        open={!!productDialog}
        onOpenChange={(open) => !open && setProductDialog(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Ürün Ata</DialogTitle>
            <DialogDescription>
              {productDialog?.school_name} — atanacak ürünleri seçin
            </DialogDescription>
          </DialogHeader>

          {products.length === 0 ? (
            <p className="text-sm text-zinc-500 py-2">
              Henüz ürün eklenmedi.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between px-1 pt-1 pb-0">
                <span className="text-xs text-zinc-500">
                  {pendingProducts.size} / {products.length} seçili
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (pendingProducts.size === products.length) {
                      setPendingProducts(new Set());
                    } else {
                      setPendingProducts(new Set(products.map((p) => p.id)));
                    }
                  }}
                  className="text-xs font-medium text-slate-700 hover:text-slate-800"
                >
                  {pendingProducts.size === products.length
                    ? "Tümünü Kaldır"
                    : "Tümünü Seç"}
                </button>
              </div>
              <ul className="space-y-2 py-2 max-h-64 overflow-y-auto">
                {products.map((product) => (
                  <li key={product.id}>
                    <label className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 hover:bg-zinc-50">
                      <input
                        type="checkbox"
                        checked={pendingProducts.has(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        className="rounded border-zinc-300 text-slate-700 focus:ring-slate-700"
                      />
                      <p className="text-sm font-medium text-zinc-900">
                        {product.product_name}
                      </p>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setProductDialog(null)}
            >
              İptal
            </Button>
            <Button
              className="flex-1"
              onClick={saveProductAssignments}
              disabled={saving}
            >
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        type="school-assignments"
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
