"use client"

import { useState } from "react"
import { CalendarIcon, Filter, Plus, Search, Eye, Pencil, Trash2, MoreHorizontal, Copy } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToastContext } from "@/components/ui/toast-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CreateAssessmentModal } from "@/components/assessments/create-assessment-modal"

// Datos de ejemplo
const assessments = [
  {
    id: "ASS-001",
    name: "ISO 27001 - Evaluación Anual",
    description: "Evaluación anual de controles de seguridad de la información según ISO 27001",
    date: "12/06/2023",
    status: "Completado",
    compliance: 85,
    responsible: "Juan Pérez",
    category: "ISO 27001",
    priority: "alta" as const,
    checklists: ["1"],
    notifications: true,
    autoClose: false,
    visibility: "publico" as const,
  },
  {
    id: "ASS-002",
    name: "Ley Fintech - Evaluación Trimestral",
    description: "Evaluación trimestral de cumplimiento de la Ley Fintech",
    date: "28/05/2023",
    status: "En revisión",
    compliance: 72,
    responsible: "María González",
    category: "Ley Fintech",
    priority: "media" as const,
    checklists: ["4"],
    notifications: true,
    autoClose: true,
    visibility: "publico" as const,
  },
  {
    id: "ASS-003",
    name: "PCI DSS - Evaluación Semestral",
    description: "Evaluación semestral de estándares de seguridad para datos de tarjetas de pago",
    date: "15/05/2023",
    status: "Completado",
    compliance: 90,
    responsible: "Carlos Rodríguez",
    category: "PCI DSS",
    priority: "critica" as const,
    checklists: ["3"],
    notifications: false,
    autoClose: false,
    visibility: "privado" as const,
  },
  {
    id: "ASS-004",
    name: "GDPR - Evaluación de Cumplimiento",
    description: "Verificación de cumplimiento del Reglamento General de Protección de Datos",
    date: "02/05/2023",
    status: "Completado",
    compliance: 78,
    responsible: "Ana Martínez",
    category: "GDPR",
    priority: "alta" as const,
    checklists: ["2"],
    notifications: true,
    autoClose: false,
    visibility: "publico" as const,
  },
  {
    id: "ASS-005",
    name: "ISO 27001 - Evaluación de Controles",
    description: "Evaluación específica de controles de seguridad implementados",
    date: "20/04/2023",
    status: "En progreso",
    compliance: 45,
    responsible: "Juan Pérez",
    category: "ISO 27001",
    priority: "media" as const,
    checklists: ["1"],
    notifications: true,
    autoClose: false,
    visibility: "publico" as const,
  },
  {
    id: "ASS-006",
    name: "Ley Fintech - Evaluación de Seguridad",
    description: "Evaluación de medidas de seguridad según la Ley Fintech",
    date: "10/04/2023",
    status: "Completado",
    compliance: 88,
    responsible: "María González",
    category: "Ley Fintech",
    priority: "baja" as const,
    checklists: ["4"],
    notifications: false,
    autoClose: true,
    visibility: "publico" as const,
  },
]

const statusMap = {
  Completado: { color: "default" as const },
  "En revisión": { color: "secondary" as const },
  "En progreso": { color: "outline" as const },
}

export default function AssessmentsPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToastContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(null)
  const [confirmationId, setConfirmationId] = useState("")
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [duplicateAssessment, setDuplicateAssessment] = useState<(typeof assessments)[0] | null>(null)

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.responsible.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter
    const matchesCategory = categoryFilter === "all" || assessment.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = ["all", ...new Set(assessments.map((a) => a.category))]
  const statuses = ["all", ...new Set(assessments.map((a) => a.status))]

  const handleDeleteClick = (id: string) => {
    setAssessmentToDelete(id)
    setConfirmationId("")
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (assessmentToDelete && confirmationId === assessmentToDelete) {
      // Aquí iría la lógica para eliminar el assessment
      showSuccess(`Assessment ${assessmentToDelete} eliminado correctamente`)
      setDeleteDialogOpen(false)
      setAssessmentToDelete(null)
      setConfirmationId("")
    } else {
      showError("El ID de confirmación no coincide")
    }
  }

  const handleCreateSuccess = () => {
    setCreateModalOpen(false)
    setDuplicateAssessment(null)
    if (duplicateAssessment) {
      showSuccess(`Assessment duplicado exitosamente desde "${duplicateAssessment.name}"`)
    } else {
      showSuccess("Assessment creado exitosamente")
    }
    // Aquí podrías recargar la lista de assessments
  }

  const handleDuplicateClick = (assessment: (typeof assessments)[0]) => {
    setDuplicateAssessment(assessment)
    setCreateModalOpen(true)
  }

  const handleNewAssessment = () => {
    setDuplicateAssessment(null)
    setCreateModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
        <Button onClick={handleNewAssessment}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Assessment
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="mine">Mis Assessments</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assessments.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assessments.filter((a) => a.status === "Completado").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assessments.filter((a) => a.status !== "Completado").length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar assessments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "Todos los estados" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Todas las categorías" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Cumplimiento</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.id}</TableCell>
                    <TableCell>{assessment.name}</TableCell>
                    <TableCell>{assessment.date}</TableCell>
                    <TableCell>{assessment.responsible}</TableCell>
                    <TableCell>{assessment.category}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[assessment.status].color}>{assessment.status}</Badge>
                    </TableCell>
                    <TableCell>{assessment.compliance}%</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/assessments/${assessment.id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/assessments/${assessment.id}/edit`)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateClick(assessment)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(assessment.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="recent" className="space-y-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Cumplimiento</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.slice(0, 3).map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.id}</TableCell>
                    <TableCell>{assessment.name}</TableCell>
                    <TableCell>{assessment.date}</TableCell>
                    <TableCell>{assessment.responsible}</TableCell>
                    <TableCell>{assessment.category}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[assessment.status].color}>{assessment.status}</Badge>
                    </TableCell>
                    <TableCell>{assessment.compliance}%</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/assessments/${assessment.id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/assessments/${assessment.id}/edit`)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateClick(assessment)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(assessment.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="mine" className="space-y-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Cumplimiento</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments
                  .filter((a) => a.responsible === "Juan Pérez")
                  .map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.id}</TableCell>
                      <TableCell>{assessment.name}</TableCell>
                      <TableCell>{assessment.date}</TableCell>
                      <TableCell>{assessment.category}</TableCell>
                      <TableCell>
                        <Badge variant={statusMap[assessment.status].color}>{assessment.status}</Badge>
                      </TableCell>
                      <TableCell>{assessment.compliance}%</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/assessments/${assessment.id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/assessments/${assessment.id}/edit`)}>
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateClick(assessment)}>
                              <Copy className="mr-2 h-4 w-4" /> Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(assessment.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para crear/duplicar assessment */}
      <CreateAssessmentModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleCreateSuccess}
        duplicateFrom={duplicateAssessment}
      />

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El assessment será eliminado permanentemente de nuestros servidores.
              <div className="mt-4">
                <div className="font-medium text-sm">
                  Para confirmar, escriba el ID del assessment: {assessmentToDelete}
                </div>
                <Input
                  className="mt-2"
                  value={confirmationId}
                  onChange={(e) => setConfirmationId(e.target.value)}
                  placeholder="Escriba el ID para confirmar"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
