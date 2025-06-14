"use client"

import { useState } from "react"
import { CalendarIcon, Filter, Plus, Search, Eye, Pencil, Trash2, MoreHorizontal, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo
const actionPlans = [
  {
    id: "AP-001",
    finding: "No existe una política de seguridad de la información aprobada",
    action: "Desarrollar y aprobar una política de seguridad de la información",
    responsible: "Juan Pérez",
    dueDate: new Date(2023, 6, 15),
    status: "pendiente",
  },
  {
    id: "AP-002",
    finding: "Falta de controles de acceso físico",
    action: "Implementar sistema de control de acceso biométrico",
    responsible: "María González",
    dueDate: new Date(2023, 7, 20),
    status: "en-curso",
  },
  {
    id: "AP-003",
    finding: "No se realizan copias de seguridad periódicas",
    action: "Configurar sistema de backup automático",
    responsible: "Carlos Rodríguez",
    dueDate: new Date(2023, 5, 10),
    status: "finalizado",
  },
  {
    id: "AP-004",
    finding: "Falta de registro de incidentes de seguridad",
    action: "Implementar sistema de registro y seguimiento de incidentes",
    responsible: "Ana Martínez",
    dueDate: new Date(2023, 8, 5),
    status: "pendiente",
  },
  {
    id: "AP-005",
    finding: "Ausencia de plan de continuidad de negocio",
    action: "Desarrollar e implementar plan de continuidad de negocio",
    responsible: "Juan Pérez",
    dueDate: new Date(2023, 9, 15),
    status: "en-curso",
  },
]

// Lista de assessments disponibles
const availableAssessments = [
  {
    id: "ASS-001",
    name: "ISO 27001 - Evaluación Anual",
  },
  {
    id: "ASS-002",
    name: "Ley Fintech - Evaluación Trimestral",
  },
  {
    id: "ASS-003",
    name: "PCI DSS - Evaluación Semestral",
  },
  {
    id: "ASS-004",
    name: "GDPR - Evaluación de Cumplimiento",
  },
  {
    id: "ASS-005",
    name: "ISO 27001 - Evaluación de Controles",
  },
]

const statusMap = {
  pendiente: { label: "Pendiente", variant: "outline" as const },
  "en-curso": { label: "En curso", variant: "default" as const },
  finalizado: { label: "Finalizado", variant: "secondary" as const },
}

export default function ActionPlansPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [date, setDate] = useState<Date>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([])

  // Campos del formulario
  const [finding, setFinding] = useState("")
  const [action, setAction] = useState("")
  const [responsible, setResponsible] = useState("")
  const [status, setStatus] = useState("pendiente")

  const filteredActionPlans = actionPlans.filter((plan) => {
    const matchesSearch =
      plan.finding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.responsible.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async () => {
    if (!selectedId) return
    setIsLoading(true)
    try {
      // Aquí iría la llamada a la API para eliminar el plan de acción
      toast({
        title: "Éxito",
        description: "Plan de acción eliminado correctamente",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el plan de acción",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setSelectedId(null)
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/action-plans/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/action-plans/${id}/edit`)
  }

  const handleAssessmentChange = (assessmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssessments([...selectedAssessments, assessmentId])
    } else {
      setSelectedAssessments(selectedAssessments.filter((id) => id !== assessmentId))
    }
  }

  const handleCreateActionPlan = async () => {
    // Validaciones
    if (!finding || !action || !responsible || !date) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
      })
      return
    }

    try {
      // Simular creación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Éxito",
        description: "Plan de acción creado exitosamente",
      })

      // Limpiar formulario
      setFinding("")
      setAction("")
      setResponsible("")
      setDate(undefined)
      setStatus("pendiente")
      setSelectedAssessments([])

      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el plan de acción",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Planes de Acción</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Plan de Acción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Nuevo Plan de Acción</DialogTitle>
              <DialogDescription>Complete los detalles del nuevo plan de acción</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="finding">Hallazgo</Label>
                <Textarea
                  id="finding"
                  placeholder="Descripción del hallazgo..."
                  value={finding}
                  onChange={(e) => setFinding(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="action">Acción Correctiva</Label>
                <Textarea
                  id="action"
                  placeholder="Descripción de la acción correctiva..."
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="responsible">Responsable</Label>
                <Select value={responsible} onValueChange={setResponsible}>
                  <SelectTrigger id="responsible">
                    <SelectValue placeholder="Seleccionar responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Juan Pérez">Juan Pérez</SelectItem>
                    <SelectItem value="María González">María González</SelectItem>
                    <SelectItem value="Carlos Rodríguez">Carlos Rodríguez</SelectItem>
                    <SelectItem value="Ana Martínez">Ana Martínez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Fecha de Término</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en-curso">En curso</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Assessments Relacionados</Label>
                <div className="border rounded-md p-3 space-y-3">
                  <div className="space-y-2">
                    {availableAssessments.map((assessment) => (
                      <div key={assessment.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`assessment-${assessment.id}`}
                          checked={selectedAssessments.includes(assessment.id)}
                          onCheckedChange={(checked) => handleAssessmentChange(assessment.id, !!checked)}
                        />
                        <label
                          htmlFor={`assessment-${assessment.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {assessment.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  {selectedAssessments.length > 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Assessments seleccionados:</Label>
                      <div className="flex flex-wrap gap-1">
                        {selectedAssessments.map((id) => {
                          const assessment = availableAssessments.find((a) => a.id === id)
                          return (
                            <Badge key={id} variant="outline" className="flex items-center gap-1">
                              {assessment?.id}
                              <button
                                onClick={() => handleAssessmentChange(id, false)}
                                className="ml-1 rounded-full hover:bg-muted p-0.5"
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Eliminar</span>
                              </button>
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateActionPlan}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar planes de acción..."
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
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en-curso">En curso</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Hallazgo</TableHead>
              <TableHead>Acción Correctiva</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Fecha de Término</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActionPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.id}</TableCell>
                <TableCell className="max-w-[200px] truncate">{plan.finding}</TableCell>
                <TableCell className="max-w-[200px] truncate">{plan.action}</TableCell>
                <TableCell>{plan.responsible}</TableCell>
                <TableCell>{format(plan.dueDate, "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[plan.status].variant}>{statusMap[plan.status].label}</Badge>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(plan.id)}>
                        <Eye className="mr-2 h-4 w-4" /> Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(plan.id)}>
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedId(plan.id)
                          setIsDeleteDialogOpen(true)
                        }}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Plan de Acción</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar este plan de acción? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
