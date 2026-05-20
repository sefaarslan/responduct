"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, UserX, Users, FileSpreadsheet, KeyRound } from "lucide-react";
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
import { UserForm, type UserFormValues } from "./user-form";
import { ImportDialog } from "./import-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "sales";
  is_active: boolean;
  created_at: string;
}

interface UsersClientProps {
  initialUsers: User[];
  currentUserId: string;
}

export function UsersClient({ initialUsers, currentUserId }: UsersClientProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => router.refresh();

  const handleCreate = async (values: UserFormValues) => {
    setError(null);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu");
      throw new Error(data.error);
    }
    refresh();
  };

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    const res = await fetch(`/api/users/${deactivateId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu");
    }
    setDeactivateId(null);
    refresh();
  };

  const activeUsers = initialUsers.filter((u) => u.is_active);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Kullanıcılar
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {activeUsers.length} aktif kullanıcı
          </p>
        </div>
        <div className="flex gap-2">
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
            Yeni Kullanıcı
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {initialUsers.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
            <Users className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-900">Henüz kullanıcı eklenmedi</p>
          <p className="text-sm text-zinc-500 mt-1">
            Sağ üstteki butona tıklayarak ekip üyesi ekleyin.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                <TableHead className="font-medium text-zinc-700">Ad Soyad</TableHead>
                <TableHead className="font-medium text-zinc-700">E-posta</TableHead>
                <TableHead className="font-medium text-zinc-700">Rol</TableHead>
                <TableHead className="font-medium text-zinc-700">Durum</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialUsers.map((user) => {
                const isMe = user.id === currentUserId;
                return (
                  <TableRow key={user.id} className="hover:bg-zinc-50">
                    <TableCell className="font-medium text-zinc-900">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-slate-800">
                            {user.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <span>
                          {user.full_name}
                          {isMe && (
                            <span className="ml-1.5 text-xs text-zinc-400">(siz)</span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "admin"
                            ? "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100"
                            : "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                        }
                      >
                        {user.role === "admin" ? "Yönetici" : "Satış Personeli"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-100"
                        }
                      >
                        {user.is_active ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {user.role === "sales" && user.is_active && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-slate-700"
                            onClick={() => setPasswordUser(user)}
                            title="Şifre değiştir"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {!isMe && user.is_active && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-red-600"
                            onClick={() => setDeactivateId(user.id)}
                            title="Deaktive et"
                          >
                            <UserX className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />

      {passwordUser && (
        <ChangePasswordDialog
          open={!!passwordUser}
          onOpenChange={(open) => !open && setPasswordUser(null)}
          userId={passwordUser.id}
          userName={passwordUser.full_name}
        />
      )}

      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        type="users"
        onSuccess={refresh}
      />

      <AlertDialog
        open={!!deactivateId}
        onOpenChange={(open) => !open && setDeactivateId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı deaktive et</AlertDialogTitle>
            <AlertDialogDescription>
              Bu kullanıcı sisteme giriş yapamayacak ve atamalardan çıkarılacak.
              İşlem geri alınabilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-slate-800 hover:bg-slate-900 text-white"
            >
              Deaktive Et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
