"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, CheckCircle, Clock, FileText, Search, Users, AlertCircle, Copy } from "lucide-react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  endDate: z.date({
    required_error: "La fecha de fin es requerida",
  }),
  responsible: z.string().min(1, "Debe seleccionar un responsable"),
  priority: z.enum(["baja", "media", "alta", "critica"]),
  checklists: z.array(z.string()).min(1, "Debe seleccionar al menos un checklist"),
  notifications: z.boolean().default(true),
  autoClose: z.boolean().default(false),
  visibility: z.enum(["publico", "privado"]).default("publico"),
})

type FormData = z.infer<typeof formSchema>

interface Assessment {
  id: string
  name: string
  description?: string
  date: string
  status: string
  compliance: number
  responsible: string
  category: string
  priority?: "baja" | "media" | "alta" | "critica"
  checklists?: string[]
  notifications?: boolean
  autoClose?: boolean
  visibility?: "publico" | "privado"
}

interface CreateAssessmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  duplicateFrom?: Assessment | null
}

// Datos de ejemplo
const users = [
  { id: "1", name: "Juan Pérez", email: "juan.perez@empresa.com" },
  { id: "2", name: "María González", email: "maria.gonzalez@empresa.com" },
  { id: "3", name: "Carlos Rodríguez", email: "carlos.rodriguez@empresa.com" },
  { id: "4", name: "Ana Martínez", email: "ana.martinez@empresa.com" },
]

const checklists = [
  {
    id: "1",
    name: "ISO 27001 - Controles de Seguridad",
    description: "Evaluación de controles de seguridad de la información según ISO 27001",
    category: "ISO 27001",
    questions: 45,
  },
  {
    id: "2",
    name: "GDPR - Protección de Datos",
    description: "Verificación de cumplimiento del Reglamento General de Protección de Datos",
    category: "GDPR",
    questions: 32,
  },
  {
    id: "3",
    name: "PCI DSS - Seguridad de Pagos",
    description: "Evaluación de estándares de seguridad para datos de tarjetas de pago",
    category: "PCI DSS",
    questions: 28,
  },
  {
    id: "4",
    name: "Ley Fintech - Cumplimiento Regulatorio",
    description: "Verificación de cumplimiento de la Ley para Regular las Instituciones de Tecnología Financiera",
    category: "Ley Fintech",
    questions: 38,
  },
  {
    id: "5",
    name: "SOX - Controles Internos",
    description: "Evaluación de controles internos según Sarbanes-Oxley",
    category: "SOX",
    questions: 25,
  },
]

const priorityColors = {
  baja: "bg-blue-100 text-blue-800 border-blue-200",
  media: "bg-yellow-100 text-yellow-800 border-yellow-200",
  alta: "bg-orange-100 text-orange-800 border-orange-200",
  critica: "bg-red-100 text-red-800 border-red-200",
}

// Función para mapear categorías a checklists (simulación)
const getCategoryChecklists = (category: string): string[] => {
  const mapping: Record<string, string[]> = {
    "ISO 27001": ["1"],
    GDPR: ["2"],
    "PCI DSS": ["3"],
    "Ley Fintech": ["4"],
    SOX: ["5"],
  }
  return mapping[category] || []
}

export function CreateAssessmentModal({ open, onOpenChange, onSuccess, duplicateFrom }: CreateAssessmentModalProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDuplicating = !!duplicateFrom

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      responsible: "",
      priority: "media",
      checklists: [],
      notifications: true,
      autoClose: false,
      visibility: "publico",
    },
  })

  // Efecto para pre-llenar datos cuando se duplica
  useEffect(() => {
    if (duplicateFrom && open) {
      const today = new Date()
      const endDate = addDays(today, 30) // 30 días por defecto

      // Buscar el usuario responsable
      const responsibleUser = users.find((u) => u.name === duplicateFrom.responsible)

      // Obtener checklists basados en la categoría
      const categoryChecklists = getCategoryChecklists(duplicateFrom.category)

      form.reset({
        title: `${duplicateFrom.name} - Copia`,
        description: duplicateFrom.description || `Assessment duplicado de ${duplicateFrom.name}`,
        startDate: today,
        endDate: endDate,
        responsible: responsibleUser?.id || "",
        priority: duplicateFrom.priority || "media",
        checklists: duplicateFrom.checklists || categoryChecklists,
        notifications: duplicateFrom.notifications ?? true,
        autoClose: duplicateFrom.autoClose ?? false,
        visibility: duplicateFrom.visibility || "publico",
      })
    } else if (!duplicateFrom && open) {
      // Reset para nuevo assessment
      form.reset({
        title: "",
        description: "",
        responsible: "",
        priority: "media",
        checklists: [],
        notifications: true,
        autoClose: false,
        visibility: "publico",
      })
    }
  }, [duplicateFrom, open, form])

  const filteredChecklists = checklists.filter(
    (checklist) =>
      checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedChecklists = form.watch("checklists")
  const totalQuestions = checklists
    .filter((c) => selectedChecklists.includes(c.id))
    .reduce((sum, c) => sum + c.questions, 0)

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Assessment data:", data)
    console.log("Is duplicating:", isDuplicating)
    console.log("Original assessment:", duplicateFrom)

    setIsSubmitting(false)
    onSuccess()
  }

  const handleClose = () => {
    if (form.formState.isDirty) {
      if (confirm("¿Está seguro de que desea cerrar? Se perderán los cambios no guardados.")) {
        form.reset()
        onOpenChange(false)
      }
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDuplicating ? (
              <>
                <Copy className="h-5 w-5" />
                Duplicar Assessment
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                Crear Nuevo Assessment
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isDuplicating
              ? `Creando una copia del assessment "${duplicateFrom?.name}". Puede modificar cualquier campo antes de guardar.`
              : "Complete la información necesaria para crear un nuevo assessment de cumplimiento."}
          </DialogDescription>
        </DialogHeader>

        {isDuplicating && (
          <Alert>
            <Copy className="h-4 w-4" />
            <AlertDescription>
              Este assessment se está creando como una copia de <strong>{duplicateFrom?.name}</strong>. Las fechas se
              han actualizado automáticamente y puede modificar cualquier campo según sea necesario.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Información Básica
                </TabsTrigger>
                <TabsTrigger value="checklists" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Checklists
                </TabsTrigger>
                <TabsTrigger value="config" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Configuración
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Título del Assessment</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: ISO 27001 - Evaluación Anual 2024" {...field} />
                        </FormControl>
                        {isDuplicating && (
                          <FormDescription>
                            Se ha añadido "- Copia" al título original. Puede modificarlo según sea necesario.
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe el propósito y alcance de este assessment..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Inicio</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccionar fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {isDuplicating && (
                          <FormDescription>
                            La fecha se ha actualizado a hoy. Puede cambiarla si es necesario.
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Fin</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccionar fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responsible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsable</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar responsable" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex flex-col">
                                  <span>{user.name}</span>
                                  <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridad</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="baja">
                              <Badge className={priorityColors.baja}>Baja</Badge>
                            </SelectItem>
                            <SelectItem value="media">
                              <Badge className={priorityColors.media}>Media</Badge>
                            </SelectItem>
                            <SelectItem value="alta">
                              <Badge className={priorityColors.alta}>Alta</Badge>
                            </SelectItem>
                            <SelectItem value="critica">
                              <Badge className={priorityColors.critica}>Crítica</Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="checklists" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Seleccionar Checklists</h3>
                    <p className="text-sm text-muted-foreground">
                      {isDuplicating
                        ? "Los checklists del assessment original están preseleccionados. Puede modificar la selección."
                        : "Elija los checklists que desea incluir en este assessment"}
                    </p>
                  </div>
                  {selectedChecklists.length > 0 && (
                    <Badge variant="secondary">
                      {selectedChecklists.length} seleccionados • {totalQuestions} preguntas
                    </Badge>
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar checklists..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="checklists"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredChecklists.map((checklist) => (
                          <FormField
                            key={checklist.id}
                            control={form.control}
                            name="checklists"
                            render={({ field }) => {
                              return (
                                <FormItem key={checklist.id}>
                                  <Card
                                    className={cn(
                                      "cursor-pointer transition-colors hover:bg-muted/50",
                                      field.value?.includes(checklist.id) && "ring-2 ring-primary",
                                    )}
                                  >
                                    <CardHeader className="pb-2">
                                      <div className="flex items-start space-x-3">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(checklist.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, checklist.id])
                                                : field.onChange(field.value?.filter((value) => value !== checklist.id))
                                            }}
                                          />
                                        </FormControl>
                                        <div className="flex-1">
                                          <CardTitle className="text-sm">{checklist.name}</CardTitle>
                                          <Badge variant="outline" className="mt-1">
                                            {checklist.category}
                                          </Badge>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                      <CardDescription className="text-xs">{checklist.description}</CardDescription>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                          {checklist.questions} preguntas
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Configuración Adicional</h3>
                    <p className="text-sm text-muted-foreground">
                      {isDuplicating
                        ? "La configuración del assessment original se ha copiado. Puede modificarla según sea necesario."
                        : "Configure opciones adicionales para el assessment"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visibilidad</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="publico">Público</SelectItem>
                                <SelectItem value="privado">Privado</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Determina quién puede ver este assessment</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="notifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notificaciones</FormLabel>
                              <FormDescription>Enviar recordatorios por email</FormDescription>
                            </div>
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="autoClose"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Cierre Automático</FormLabel>
                              <FormDescription>Cerrar automáticamente al llegar a la fecha límite</FormDescription>
                            </div>
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {selectedChecklists.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {isDuplicating ? "Resumen del Assessment Duplicado" : "Resumen del Assessment"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">{selectedChecklists.length}</div>
                            <div className="text-xs text-muted-foreground">Checklists</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
                            <div className="text-xs text-muted-foreground">Preguntas</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{Math.ceil(totalQuestions / 10)}</div>
                            <div className="text-xs text-muted-foreground">Horas estimadas</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              {form.watch("priority") === "critica"
                                ? "🔴"
                                : form.watch("priority") === "alta"
                                  ? "🟠"
                                  : form.watch("priority") === "media"
                                    ? "🟡"
                                    : "🔵"}
                            </div>
                            <div className="text-xs text-muted-foreground">Prioridad</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {form.formState.errors.root && (
                  <>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-destructive">Por favor, complete todos los campos requeridos</span>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? isDuplicating
                      ? "Duplicando..."
                      : "Creando..."
                    : isDuplicating
                      ? "Duplicar Assessment"
                      : "Crear Assessment"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
