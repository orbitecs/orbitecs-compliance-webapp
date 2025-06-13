"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditUserDialog } from "@/components/users/edit-user-dialog"
import { ChangePasswordDialog } from "@/components/users/change-password-dialog"
import { ToggleStatusDialog } from "@/components/users/toggle-status-dialog"
import { DeleteUserDialog } from "@/components/users/delete-user-dialog"
import { PermissionGuard, usePermissions } from "@/lib/rbac"

// Datos de ejemplo
const users = [
  {
    id: "U-001",
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    role: "admin",
    status: "active",
  },
  {
    id: "U-002",
    name: "María González",
    email: "maria.gonzalez@empresa.com",
    role: "gestor",
    status: "active",
  },
  {
    id: "U-003",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    role: "auditor",
    status: "active",
  },
  {
    id: "U-004",
    name: "Ana Martínez",
    email: "ana.martinez@empresa.com",
    role: "lector",
    status: "inactive",
  },
  {
    id: "U-005",
    name: "Roberto Sánchez",
    email: "roberto.sanchez@empresa.com",
    role: "gestor",
    status: "active",
  },
]

const roleMap = {
  admin: { label: "Administrador", color: "default" as const },
  gestor: { label: "Gestor", color: "default" as const },
  auditor: { label: "Auditor", color: "secondary" as const },
  lector: { label: "Lector", color: "outline" as const },
}

const statusMap = {
  active: { label: "Activo", color: "default" as const },
  inactive: { label: "Inactivo", color: "outline" as const },
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { hasPermission } = usePermissions()

  // Estados para los diálogos de acciones
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <PermissionGuard permissions="users.create">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>Complete los detalles para crear un nuevo usuario</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="Nombre completo" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                </div>
                <PermissionGuard permissions="users.manage_roles">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="gestor">Gestor</SelectItem>
                        <SelectItem value="auditor">Auditor</SelectItem>
                        <SelectItem value="lector">Lector</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </PermissionGuard>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Crear Usuario</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={roleMap[user.role].color}>{roleMap[user.role].label}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[user.status].color}>{statusMap[user.status].label}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <PermissionGuard permissions="users.edit">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setIsPasswordDialogOpen(true)
                          }}
                        >
                          Cambiar contraseña
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard permissions="users.edit">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setIsStatusDialogOpen(true)
                          }}
                        >
                          {user.status === "active" ? "Suspender usuario" : "Activar usuario"}
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard permissions="users.delete">
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Diálogos para acciones de usuario */}
      {selectedUser && (
        <>
          <EditUserDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} user={selectedUser} />

          <ChangePasswordDialog
            isOpen={isPasswordDialogOpen}
            onClose={() => setIsPasswordDialogOpen(false)}
            userId={selectedUser.id}
            userName={selectedUser.name}
          />

          <ToggleStatusDialog
            isOpen={isStatusDialogOpen}
            onClose={() => setIsStatusDialogOpen(false)}
            userId={selectedUser.id}
            userName={selectedUser.name}
            currentStatus={selectedUser.status as "active" | "inactive"}
          />

          <DeleteUserDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            userId={selectedUser.id}
            userName={selectedUser.name}
          />
        </>
      )}
    </div>
  )
}
