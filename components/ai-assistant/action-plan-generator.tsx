"use client"
import { useState } from "react"
import { FileText, Download, Save, Wand2, AlertTriangle, Calendar, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToastContext } from "@/components/ui/toast-provider"
import { findSimilarCases, type SuccessCase } from "@/lib/success-cases"
import { SuccessCasesViewer } from "./success-cases-viewer"

interface GeneratedActionPlan {
  id: string
  finding: string
  severity: "low" | "medium" | "high" | "critical"
  category: string
  correctiveActions: Array<{
    id: string
    description: string
    responsible: string
    dueDate: string
    priority: "low" | "medium" | "high"
  }>
  rootCause: string
  preventiveActions: string[]
  resources: string[]
  successCriteria: string[]
  estimatedCost: string
  timeline: string
}

interface ActionPlanGeneratorProps {
  onClose: () => void
  onSave: (plan: GeneratedActionPlan) => void
}

export function ActionPlanGenerator({ onClose, onSave }: ActionPlanGeneratorProps) {
  const [step, setStep] = useState<"input" | "generating" | "result">("input")
  const [findingDescription, setFindingDescription] = useState("")
  const [findingCategory, setFindingCategory] = useState("")
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedActionPlan | null>(null)
  const { showToast } = useToastContext()
  const [similarCases, setSimilarCases] = useState<SuccessCase[]>([])
  const [showSimilarCases, setShowSimilarCases] = useState(false)

  const categories = [
    "Seguridad de la Información",
    "Protección de Datos",
    "Gestión de Riesgos",
    "Auditoría Interna",
    "Cumplimiento Regulatorio",
    "Gestión de Calidad",
    "Seguridad Física",
    "Recursos Humanos",
    "Tecnología",
    "Procesos Operativos",
  ]

  const generateActionPlan = async () => {
    if (!findingDescription.trim() || !findingCategory || !severity) {
      showToast("Por favor, completa todos los campos requeridos", "error")
      return
    }

    // Buscar casos similares antes de generar
    const cases = findSimilarCases(findingCategory, severity, findingDescription)
    setSimilarCases(cases)

    if (cases.length > 0) {
      setShowSimilarCases(true)
      return
    }

    setStep("generating")

    // Simular generación con IA (en producción sería una llamada real a la API)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generar plan basado en el hallazgo
    const plan: GeneratedActionPlan = {
      id: `plan-${Date.now()}`,
      finding: findingDescription,
      severity,
      category: findingCategory,
      rootCause: generateRootCause(findingDescription, findingCategory),
      correctiveActions: generateCorrectiveActions(findingDescription, findingCategory, severity),
      preventiveActions: generatePreventiveActions(findingCategory),
      resources: generateResources(findingCategory),
      successCriteria: generateSuccessCriteria(findingCategory),
      estimatedCost: generateEstimatedCost(severity),
      timeline: generateTimeline(severity),
    }

    setGeneratedPlan(plan)
    setStep("result")
  }

  const generateRootCause = (finding: string, category: string): string => {
    const rootCauses: Record<string, string[]> = {
      "Seguridad de la Información": [
        "Falta de políticas de seguridad actualizadas",
        "Capacitación insuficiente del personal",
        "Controles de acceso inadecuados",
        "Monitoreo insuficiente de sistemas",
      ],
      "Protección de Datos": [
        "Procesos de consentimiento inadecuados",
        "Falta de clasificación de datos",
        "Controles de transferencia insuficientes",
        "Procedimientos de eliminación deficientes",
      ],
      "Gestión de Riesgos": [
        "Identificación incompleta de riesgos",
        "Evaluación inadecuada de impacto",
        "Controles de mitigación insuficientes",
        "Monitoreo irregular de riesgos",
      ],
    }

    const categoryOptions = rootCauses[category] || [
      "Falta de procedimientos documentados",
      "Capacitación insuficiente",
      "Controles inadecuados",
      "Supervisión deficiente",
    ]

    return categoryOptions[Math.floor(Math.random() * categoryOptions.length)]
  }

  const generateCorrectiveActions = (
    finding: string,
    category: string,
    severity: string,
  ): GeneratedActionPlan["correctiveActions"] => {
    const baseActions = [
      {
        id: "action-1",
        description: "Revisar y actualizar las políticas relacionadas",
        responsible: "Responsable de Compliance",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        priority: "high" as const,
      },
      {
        id: "action-2",
        description: "Implementar controles adicionales de seguridad",
        responsible: "Equipo de TI",
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        priority: "medium" as const,
      },
      {
        id: "action-3",
        description: "Capacitar al personal involucrado",
        responsible: "Recursos Humanos",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        priority: "medium" as const,
      },
    ]

    if (severity === "critical" || severity === "high") {
      baseActions.unshift({
        id: "action-0",
        description: "Implementar medidas de contención inmediatas",
        responsible: "Gerente de Área",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        priority: "high" as const,
      })
    }

    return baseActions
  }

  const generatePreventiveActions = (category: string): string[] => {
    const preventiveActions: Record<string, string[]> = {
      "Seguridad de la Información": [
        "Implementar revisiones periódicas de accesos",
        "Establecer monitoreo continuo de sistemas",
        "Crear programa de concienciación en seguridad",
      ],
      "Protección de Datos": [
        "Implementar evaluaciones de impacto regulares",
        "Establecer auditorías de privacidad",
        "Crear procedimientos de notificación de brechas",
      ],
      "Gestión de Riesgos": [
        "Implementar evaluaciones de riesgo periódicas",
        "Establecer indicadores de riesgo temprano",
        "Crear comité de gestión de riesgos",
      ],
    }

    return (
      preventiveActions[category] || [
        "Implementar controles preventivos",
        "Establecer monitoreo continuo",
        "Crear procedimientos de revisión",
      ]
    )
  }

  const generateResources = (category: string): string[] => {
    return [
      "Personal especializado en " + category.toLowerCase(),
      "Herramientas de monitoreo y control",
      "Presupuesto para implementación",
      "Tiempo de dedicación del equipo",
      "Consultoría externa si es necesario",
    ]
  }

  const generateSuccessCriteria = (category: string): string[] => {
    return [
      "Reducción del 100% de incidencias similares",
      "Implementación completa de controles",
      "Capacitación del 100% del personal involucrado",
      "Documentación actualizada y aprobada",
      "Verificación exitosa en próxima auditoría",
    ]
  }

  const generateEstimatedCost = (severity: string): string => {
    const costs = {
      low: "$1,000 - $5,000",
      medium: "$5,000 - $15,000",
      high: "$15,000 - $50,000",
      critical: "$50,000 - $100,000+",
    }
    return costs[severity as keyof typeof costs]
  }

  const generateTimeline = (severity: string): string => {
    const timelines = {
      low: "3-6 meses",
      medium: "2-4 meses",
      high: "1-3 meses",
      critical: "2-6 semanas",
    }
    return timelines[severity as keyof typeof timelines]
  }

  const handleSave = () => {
    if (generatedPlan) {
      onSave(generatedPlan)
      showToast("Plan de acción guardado exitosamente", "success")
      onClose()
    }
  }

  const exportToPDF = () => {
    // En una implementación real, esto generaría un PDF
    showToast("Funcionalidad de exportación a PDF próximamente", "info")
  }

  const useSuccessfulActions = (actions: SuccessCase["implementedActions"]) => {
    // Adaptar las acciones del caso exitoso al plan actual
    const adaptedActions = actions.map((action, index) => ({
      id: `action-${index}`,
      description: action.description,
      responsible: action.responsible,
      dueDate: new Date(Date.now() + action.duration * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: action.effectiveness >= 4 ? "high" : action.effectiveness >= 3 ? "medium" : ("low" as const),
    }))

    // Crear plan basado en caso exitoso
    const plan: GeneratedActionPlan = {
      id: `plan-${Date.now()}`,
      finding: findingDescription,
      severity,
      category: findingCategory,
      rootCause: "Basado en análisis de casos similares exitosos",
      correctiveActions: adaptedActions,
      preventiveActions: generatePreventiveActions(findingCategory),
      resources: generateResources(findingCategory),
      successCriteria: generateSuccessCriteria(findingCategory),
      estimatedCost: generateEstimatedCost(severity),
      timeline: generateTimeline(severity),
    }

    setGeneratedPlan(plan)
    setShowSimilarCases(false)
    setStep("result")
  }

  if (showSimilarCases) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Casos Exitosos Similares Encontrados</h2>
          <Button
            variant="outline"
            onClick={() => {
              setShowSimilarCases(false)
              setStep("generating")
              // Continuar con generación normal después de un delay
              setTimeout(() => {
                generateActionPlan()
              }, 100)
            }}
          >
            Generar Plan Original
          </Button>
        </div>
        <SuccessCasesViewer cases={similarCases} category={findingCategory} onSelectActions={useSuccessfulActions} />
      </div>
    )
  }

  if (step === "input") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Generar Plan de Acción con IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="finding">Descripción del Hallazgo *</Label>
            <Textarea
              id="finding"
              placeholder="Describe detalladamente el hallazgo o no conformidad encontrada..."
              value={findingDescription}
              onChange={(e) => setFindingDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={findingCategory} onValueChange={setFindingCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severidad *</Label>
              <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={generateActionPlan} disabled={!findingDescription.trim() || !findingCategory}>
              <Wand2 className="h-4 w-4 mr-2" />
              Generar Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === "generating") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Generando Plan de Acción</h3>
          <p className="text-muted-foreground text-center">
            La IA está analizando el hallazgo y generando un plan de acción personalizado...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (step === "result" && generatedPlan) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Plan de Acción Generado
            </CardTitle>
            <Badge variant={generatedPlan.severity === "critical" ? "destructive" : "secondary"}>
              {generatedPlan.severity === "low" && "Severidad Baja"}
              {generatedPlan.severity === "medium" && "Severidad Media"}
              {generatedPlan.severity === "high" && "Severidad Alta"}
              {generatedPlan.severity === "critical" && "Severidad Crítica"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hallazgo */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Hallazgo
            </h3>
            <p className="text-sm bg-muted p-3 rounded-md">{generatedPlan.finding}</p>
          </div>

          {/* Causa Raíz */}
          <div>
            <h3 className="font-semibold mb-2">Causa Raíz Identificada</h3>
            <p className="text-sm bg-muted p-3 rounded-md">{generatedPlan.rootCause}</p>
          </div>

          {/* Acciones Correctivas */}
          <div>
            <h3 className="font-semibold mb-3">Acciones Correctivas</h3>
            <div className="space-y-3">
              {generatedPlan.correctiveActions.map((action, index) => (
                <Card key={action.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">Acción {index + 1}</h4>
                    <Badge variant={action.priority === "high" ? "destructive" : "secondary"}>
                      {action.priority === "high" ? "Alta" : action.priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                  </div>
                  <p className="text-sm mb-3">{action.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {action.responsible}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(action.dueDate).toLocaleDateString("es-ES")}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Acciones Preventivas */}
          <div>
            <h3 className="font-semibold mb-2">Acciones Preventivas</h3>
            <ul className="list-disc list-inside space-y-1 text-sm bg-muted p-3 rounded-md">
              {generatedPlan.preventiveActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>

          {/* Recursos Necesarios */}
          <div>
            <h3 className="font-semibold mb-2">Recursos Necesarios</h3>
            <ul className="list-disc list-inside space-y-1 text-sm bg-muted p-3 rounded-md">
              {generatedPlan.resources.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          </div>

          {/* Criterios de Éxito */}
          <div>
            <h3 className="font-semibold mb-2">Criterios de Éxito</h3>
            <ul className="list-disc list-inside space-y-1 text-sm bg-muted p-3 rounded-md">
              {generatedPlan.successCriteria.map((criteria, index) => (
                <li key={index}>{criteria}</li>
              ))}
            </ul>
          </div>

          {/* Información Adicional */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Costo Estimado</h3>
              <p className="text-sm bg-muted p-3 rounded-md">{generatedPlan.estimatedCost}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Cronograma</h3>
              <p className="text-sm bg-muted p-3 rounded-md">{generatedPlan.timeline}</p>
            </div>
          </div>

          <Separator />

          {/* Acciones */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep("input")}>
              Generar Nuevo
            </Button>
            <Button variant="outline" onClick={exportToPDF}>
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
