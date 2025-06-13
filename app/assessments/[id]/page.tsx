"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2, FileText, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComplianceChart } from "@/components/assessments/compliance-chart"
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
import { Input } from "@/components/ui/input"

// Datos de ejemplo para un assessment específico
const assessmentData = {
  id: "ASS-001",
  name: "ISO 27001 - Evaluación Anual",
  date: "12/06/2023",
  status: "Completado",
  compliance: 85,
  responsible: "Juan Pérez",
  category: "ISO 27001",
  description: "Evaluación anual de cumplimiento de controles de seguridad según ISO 27001.",
  checklists: [
    {
      id: "CL-001",
      name: "ISO 27001 - Controles de Seguridad",
      compliance: 90,
      questions: [
        {
          id: "Q1",
          text: "¿Se ha implementado un sistema de gestión de seguridad de la información (SGSI)?",
          answer: "Sí",
          compliance: true,
          evidence: "Documento SGSI-2023.pdf",
          comments: "Se verificó la existencia y actualización del SGSI",
        },
        {
          id: "Q2",
          text: "¿Existe una política de seguridad de la información aprobada por la dirección?",
          answer: "Sí",
          compliance: true,
          evidence: "Política-SI-v2.1.pdf",
          comments: "Política actualizada y aprobada en enero 2023",
        },
        {
          id: "Q3",
          text: "¿Se realizan evaluaciones de riesgos de seguridad periódicamente?",
          answer: "Parcial",
          compliance: false,
          evidence: "Registro-Evaluaciones.xlsx",
          comments: "Se realizan evaluaciones pero no con la periodicidad establecida",
        },
      ],
    },
    {
      id: "CL-005",
      name: "ISO 27001 - Gestión de Incidentes",
      compliance: 75,
      questions: [
        {
          id: "Q18",
          text: "¿Existe un procedimiento documentado para la gestión de incidentes de seguridad?",
          answer: "Sí",
          compliance: true,
          evidence: "Proc-GI-2023.pdf",
          comments: "Procedimiento actualizado y socializado",
        },
        {
          id: "Q19",
          text: "¿Se registran y clasifican todos los incidentes de seguridad?",
          answer: "Sí",
          compliance: true,
          evidence: "Registro-Incidentes.xlsx",
          comments: "Se mantiene registro actualizado",
        },
        {
          id: "Q20",
          text: "¿Se realizan análisis post-incidente para identificar mejoras?",
          answer: "No",
          compliance: false,
          evidence: "",
          comments: "No se evidencia análisis formal post-incidente",
        },
        {
          id: "Q21",
          text: "¿El personal está capacitado para identificar y reportar incidentes de seguridad?",
          answer: "Parcial",
          compliance: false,
          evidence: "Registro-Capacitaciones.pdf",
          comments: "Solo el 60% del personal ha recibido capacitación",
        },
      ],
    },
  ],
  findings: [
    {
      id: "F1",
      description: "No se realizan evaluaciones de riesgo con la periodicidad establecida",
      severity: "Media",
      relatedQuestion: "Q3",
    },
    {
      id: "F2",
      description: "No se realizan análisis post-incidente formales",
      severity: "Alta",
      relatedQuestion: "Q20",
    },
    {
      id: "F3",
      description: "Falta de capacitación en identificación y reporte de incidentes",
      severity: "Media",
      relatedQuestion: "Q21",
    },
  ],
}

const statusMap = {
  Completado: { color: "default" as const },
  "En revisión": { color: "secondary" as const },
  "En progreso": { color: "outline" as const },
}

const severityMap = {
  Alta: { color: "destructive" as const },
  Media: { color: "default" as const },
  Baja: { color: "secondary" as const },
}

export default function AssessmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { showSuccess, showError } = useToastContext()
  const [activeTab, setActiveTab] = useState("summary")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmationId, setConfirmationId] = useState("")

  // En una aplicación real, aquí cargaríamos los datos del assessment según el ID
  // Por ahora usamos los datos de ejemplo
  const assessment = assessmentData

  // Preparar datos para el gráfico de cumplimiento
  const chartData = assessment.checklists.map((checklist) => ({
    name: checklist.name.split(" - ")[1] || checklist.name,
    compliance: checklist.compliance,
  }))

  // Calcular el cumplimiento promedio
  const averageCompliance = Math.round(
    assessment.checklists.reduce((sum, checklist) => sum + checklist.compliance, 0) / assessment.checklists.length,
  )

  const handleDeleteClick = () => {
    setConfirmationId("")
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (confirmationId === assessment.id) {
      // Aquí iría la lógica para eliminar el assessment
      showSuccess(`Assessment ${assessment.id} eliminado correctamente`)
      setDeleteDialogOpen(false)
      router.push("/assessments")
    } else {
      showError("El ID de confirmación no coincide")
    }
  }

  const handleExportPDF = () => {
    showSuccess("Exportación a PDF iniciada")
    // Aquí iría la lógica para exportar a PDF
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{assessment.name}</h1>
            <p className="text-sm text-muted-foreground">ID: {assessment.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
          <Button variant="outline" onClick={() => router.push(`/assessments/${params.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cumplimiento General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageCompliance}%</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {averageCompliance >= 80
                ? "Cumplimiento satisfactorio"
                : averageCompliance >= 60
                  ? "Requiere mejoras"
                  : "Cumplimiento crítico"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={statusMap[assessment.status].color} className="text-base">
              {assessment.status}
            </Badge>
            <div className="mt-1 text-xs text-muted-foreground">Actualizado el {assessment.date}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hallazgos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assessment.findings.length}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {assessment.findings.filter((f) => f.severity === "Alta").length} críticos,{" "}
              {assessment.findings.filter((f) => f.severity === "Media").length} medios
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="questions">Preguntas</TabsTrigger>
          <TabsTrigger value="findings">Hallazgos</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Categoría</h3>
                  <p>{assessment.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Responsable</h3>
                  <p>{assessment.responsible}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha</h3>
                  <p>{assessment.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                  <Badge variant={statusMap[assessment.status].color}>{assessment.status}</Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Descripción</h3>
                <p className="mt-1">{assessment.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Gráfico de Cumplimiento</CardTitle>
              <CardDescription>Porcentaje de cumplimiento por checklist</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px]">
                  <ComplianceChart data={chartData} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklists Evaluados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessment.checklists.map((checklist) => (
                  <div key={checklist.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{checklist.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {checklist.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{checklist.compliance}%</div>
                        <p className="text-sm text-muted-foreground">{checklist.questions.length} preguntas</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {assessment.checklists.map((checklist) => (
            <Card key={checklist.id}>
              <CardHeader>
                <CardTitle>{checklist.name}</CardTitle>
                <CardDescription>
                  ID: {checklist.id} • Cumplimiento: {checklist.compliance}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {checklist.questions.map((question) => (
                  <div key={question.id} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {question.id}: {question.text}
                      </h3>
                      <Badge variant={question.compliance ? "default" : "destructive"}>
                        {question.compliance ? "Conforme" : "No Conforme"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Respuesta</h4>
                        <p>{question.answer}</p>
                      </div>
                      {question.evidence && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Evidencia</h4>
                          <p className="flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                            {question.evidence}
                          </p>
                        </div>
                      )}
                    </div>

                    {question.comments && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Comentarios</h4>
                        <p className="text-sm">{question.comments}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="findings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hallazgos Identificados</CardTitle>
              <CardDescription>
                Se identificaron {assessment.findings.length} hallazgos durante la evaluación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessment.findings.map((finding) => {
                const relatedQuestion = assessment.checklists
                  .flatMap((cl) => cl.questions)
                  .find((q) => q.id === finding.relatedQuestion)

                return (
                  <div key={finding.id} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{finding.id}</h3>
                      <Badge variant={severityMap[finding.severity].color}>Severidad {finding.severity}</Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Descripción</h4>
                      <p>{finding.description}</p>
                    </div>

                    {relatedQuestion && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Pregunta Relacionada</h4>
                        <p className="text-sm">
                          <span className="font-medium">{relatedQuestion.id}:</span> {relatedQuestion.text}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El assessment será eliminado permanentemente de nuestros servidores.
              <div className="mt-4">
                <div className="font-medium text-sm">Para confirmar, escriba el ID del assessment: {assessment.id}</div>
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
