"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Plus, Search, Filter, MoreHorizontal, Eye, Pencil, Trash2, CheckCircle, X, ChevronDown } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CreateChecklistDialog } from "@/components/checklists/create-checklist-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Datos de ejemplo con preguntas
const checklists = [
  {
    id: "CL-001",
    name: "ISO 27001 - Controles de Seguridad",
    description: "Checklist para evaluar el cumplimiento de los controles de seguridad según ISO 27001.",
    category: "ISO 27001",
    questions: [
      { id: "Q1", text: "¿Se ha implementado un sistema de gestión de seguridad de la información (SGSI)?" },
      { id: "Q2", text: "¿Existe una política de seguridad de la información aprobada por la dirección?" },
      { id: "Q3", text: "¿Se realizan evaluaciones de riesgos de seguridad periódicamente?" },
      { id: "Q4", text: "¿Se han definido roles y responsabilidades de seguridad?" },
      { id: "Q5", text: "¿Existe un plan de continuidad del negocio?" },
    ],
  },
  {
    id: "CL-002",
    name: "Ley Fintech - Requisitos Generales",
    description: "Checklist para evaluar el cumplimiento de los requisitos generales de la Ley Fintech.",
    category: "Ley Fintech",
    questions: [
      { id: "Q6", text: "¿La organización cuenta con los permisos y licencias requeridos por la Ley Fintech?" },
      { id: "Q7", text: "¿Se han implementado los controles para la prevención de lavado de dinero?" },
      { id: "Q8", text: "¿Se cumple con los requisitos de capital mínimo?" },
      { id: "Q9", text: "¿Se cuenta con un oficial de cumplimiento designado?" },
    ],
  },
  {
    id: "CL-003",
    name: "PCI DSS - Protección de Datos",
    description: "Checklist para evaluar el cumplimiento de los requisitos de protección de datos según PCI DSS.",
    category: "PCI DSS",
    questions: [
      { id: "Q10", text: "¿Se mantiene un inventario de componentes del sistema que están en el alcance de PCI DSS?" },
      { id: "Q11", text: "¿Se protegen los datos del titular de la tarjeta almacenados?" },
      {
        id: "Q12",
        text: "¿Se cifran los datos de titulares de tarjetas durante la transmisión a través de redes públicas?",
      },
      { id: "Q13", text: "¿Se utilizan y actualizan regularmente software o programas antivirus?" },
    ],
  },
  {
    id: "CL-004",
    name: "GDPR - Derechos de los Titulares",
    description: "Checklist para evaluar el cumplimiento de los derechos de los titulares según GDPR.",
    category: "GDPR",
    questions: [
      { id: "Q14", text: "¿Se informa adecuadamente a los titulares sobre el tratamiento de sus datos personales?" },
      { id: "Q15", text: "¿Existen procedimientos para atender solicitudes de acceso a datos personales?" },
      { id: "Q16", text: "¿Se cuenta con mecanismos para el ejercicio del derecho al olvido?" },
      { id: "Q17", text: "¿Se implementan medidas para garantizar la portabilidad de los datos?" },
    ],
  },
  {
    id: "CL-005",
    name: "ISO 27001 - Gestión de Incidentes",
    description: "Checklist para evaluar el cumplimiento de la gestión de incidentes según ISO 27001.",
    category: "ISO 27001",
    questions: [
      { id: "Q18", text: "¿Existe un procedimiento documentado para la gestión de incidentes de seguridad?" },
      { id: "Q19", text: "¿Se registran y clasifican todos los incidentes de seguridad?" },
      { id: "Q20", text: "¿Se realizan análisis post-incidente para identificar mejoras?" },
      { id: "Q21", text: "¿El personal está capacitado para identificar y reportar incidentes de seguridad?" },
    ],
  },
  {
    id: "CL-006",
    name: "Ley Fintech - Seguridad de la Información",
    description:
      "Checklist para evaluar el cumplimiento de los requisitos de seguridad de la información según la Ley Fintech.",
    category: "Ley Fintech",
    questions: [
      {
        id: "Q22",
        text: "¿Se cuenta con políticas de seguridad de la información específicas para servicios financieros?",
      },
      { id: "Q23", text: "¿Se realizan pruebas de penetración periódicas a los sistemas?" },
      { id: "Q24", text: "¿Existe un plan de respuesta a incidentes de ciberseguridad?" },
      { id: "Q25", text: "¿Se implementan controles de acceso basados en el principio de privilegio mínimo?" },
    ],
  },
]

export default function ChecklistsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedChecklists, setSelectedChecklists] = useState<string[]>([])
  const [viewingChecklist, setViewingChecklist] = useState<(typeof checklists)[0] | null>(null)
  const [open, setOpen] = useState(false)
  const [openSummary, setOpenSummary] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const router = useRouter()

  const filteredChecklists = checklists.filter((checklist) => {
    const matchesSearch =
      checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || checklist.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...new Set(checklists.map((cl) => cl.category))]
  const selectedChecklistsData = checklists.filter((cl) => selectedChecklists.includes(cl.id))

  const handleAddToAssessment = (checklistId: string) => {
    // Añadir a la lista de seleccionados si no está ya
    if (!selectedChecklists.includes(checklistId)) {
      setSelectedChecklists([...selectedChecklists, checklistId])
    }

    toast({
      title: "Éxito",
      description: "Checklist agregado al assessment",
    })
  }

  const handleRemoveFromAssessment = (checklistId: string) => {
    setSelectedChecklists(selectedChecklists.filter((id) => id !== checklistId))
  }

  const handleViewQuestions = (checklist: (typeof checklists)[0]) => {
    setViewingChecklist(checklist)
    setOpen(true)
  }

  const handleCreateAssessment = async () => {
    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Éxito",
        description: "Assessment creado exitosamente",
      })
      // Aquí iría la redirección a la página de nuevo assessment
    } catch (error) {
      console.error("Error al crear el assessment", error)
    }
  }

  const SummaryContent = () => (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Checklists Seleccionados ({selectedChecklists.length})</h3>
          {selectedChecklists.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setSelectedChecklists([])}>
              Limpiar todo
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {selectedChecklistsData.map((checklist) => (
            <div key={checklist.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">{checklist.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveFromAssessment(checklist.id)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          ))}

          {selectedChecklists.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">No hay checklists seleccionados</div>
          )}
        </div>
      </div>

      {selectedChecklists.length > 0 && (
        <div className="mt-4">
          <Button className="w-full" onClick={handleCreateAssessment}>
            Crear Assessment
          </Button>
        </div>
      )}
    </>
  )

  // Manejar eliminar checklist
  const handleDelete = (id: string) => {
    // Aquí iría la lógica para eliminar el checklist
    toast({
      title: "Éxito",
      description: "Checklist eliminado correctamente.",
    })
  }

  // Manejar ver detalles
  const handleViewDetails = (id: string) => {
    router.push(`/checklists/${id}`)
  }

  // Manejar editar
  const handleEdit = (id: string) => {
    router.push(`/checklists/${id}/edit`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Checklists</h1>
        <div className="flex gap-2">
          {selectedChecklists.length > 0 && (
            <Button variant="outline" onClick={() => setOpenSummary(true)} className="md:hidden">
              Ver seleccionados ({selectedChecklists.length})
            </Button>
          )}
          <CreateChecklistDialog />
        </div>
      </div>

      {selectedChecklists.length > 0 && (
        <Collapsible className="md:hidden">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex justify-between w-full">
              <span>Checklists seleccionados ({selectedChecklists.length})</span>
              <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <SummaryContent />
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar checklists..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChecklists.map((checklist) => (
          <Popover key={checklist.id} delayDuration={200}>
            <PopoverTrigger asChild>
              <Card className="flex flex-col relative card-hover-effect">
                {selectedChecklists.includes(checklist.id) && (
                  <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Agregado</span>
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{checklist.name}</CardTitle>
                      <CardDescription className="mt-1">{checklist.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{checklist.category}</Badge>
                    <span className="text-gray-500 dark:text-gray-400">{checklist.questions.length} preguntas</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.preventDefault()
                      handleViewQuestions(checklist)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Ver preguntas
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToAssessment(checklist.id)
                    }}
                    disabled={selectedChecklists.includes(checklist.id)}
                    variant={selectedChecklists.includes(checklist.id) ? "outline" : "default"}
                  >
                    {selectedChecklists.includes(checklist.id) ? "Agregado" : "Agregar"}
                  </Button>
                </CardFooter>
              </Card>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0"
              align="center"
              side="top"
              sideOffset={5}
              avoidCollisions={true}
              collisionPadding={20}
              className="w-80 p-0 shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            >
              <div className="p-4 space-y-2">
                <h4 className="font-medium text-sm flex items-center animate-in fade-in-50 duration-300">
                  <Eye className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  Vista previa de preguntas
                </h4>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {checklist.questions.slice(0, 3).map((question, index) => (
                    <div
                      key={question.id}
                      className="text-sm p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors duration-200 animate-in fade-in-50 slide-in-from-left-3"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <p>
                        <span className="font-medium">{index + 1}.</span> {question.text}
                      </p>
                    </div>
                  ))}
                  {checklist.questions.length > 3 && (
                    <div
                      className="text-xs text-center text-muted-foreground pt-1 animate-in fade-in-50 duration-300"
                      style={{ animationDelay: "300ms" }}
                    >
                      +{checklist.questions.length - 3} preguntas más
                    </div>
                  )}
                </div>
                <div
                  className="pt-2 flex justify-end animate-in fade-in-50 duration-300"
                  style={{ animationDelay: "350ms" }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs hover:bg-muted/80 transition-colors duration-200 gentle-bounce-hover"
                    onClick={(e) => {
                      e.preventDefault()
                      handleViewQuestions(checklist)
                    }}
                  >
                    Ver todas
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      {selectedChecklists.length > 0 && (
        <div className="hidden md:block fixed right-6 top-24 w-80 bg-background border rounded-lg shadow-md p-4 overflow-auto max-h-[calc(100vh-120px)]">
          <SummaryContent />
        </div>
      )}

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{viewingChecklist?.name}</DialogTitle>
              <DialogDescription>{viewingChecklist?.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <h3 className="font-medium">Preguntas:</h3>
              <div className="space-y-2">
                {viewingChecklist?.questions.map((question, index) => (
                  <div key={question.id} className="p-3 border rounded-md">
                    <p>
                      <span className="font-medium">{index + 1}.</span> {question.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              {!selectedChecklists.includes(viewingChecklist?.id || "") && (
                <Button
                  onClick={() => {
                    if (viewingChecklist) {
                      handleAddToAssessment(viewingChecklist.id)
                      setOpen(false)
                    }
                  }}
                >
                  Agregar al Assessment
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{viewingChecklist?.name}</DrawerTitle>
              <DrawerDescription>{viewingChecklist?.description}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-2 space-y-4">
              <h3 className="font-medium">Preguntas:</h3>
              <div className="space-y-2">
                {viewingChecklist?.questions.map((question, index) => (
                  <div key={question.id} className="p-3 border rounded-md">
                    <p>
                      <span className="font-medium">{index + 1}.</span> {question.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <DrawerFooter>
              {!selectedChecklists.includes(viewingChecklist?.id || "") && (
                <Button
                  onClick={() => {
                    if (viewingChecklist) {
                      handleAddToAssessment(viewingChecklist.id)
                      setOpen(false)
                    }
                  }}
                >
                  Agregar al Assessment
                </Button>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      <Drawer open={openSummary} onOpenChange={setOpenSummary}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Checklists Seleccionados</DrawerTitle>
            <DrawerDescription>Checklists que se incluirán en el nuevo assessment</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2">
            <SummaryContent />
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setOpenSummary(false)}>
              Cerrar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
