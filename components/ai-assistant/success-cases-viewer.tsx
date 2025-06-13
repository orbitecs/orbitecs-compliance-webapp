"use client"

import { useState } from "react"
import { TrendingUp, Clock, DollarSign, Shield, Star, CheckCircle, Lightbulb, Quote } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { type SuccessCase, getSuccessStats } from "@/lib/success-cases"

interface SuccessCasesViewerProps {
  cases: SuccessCase[]
  category: string
  onSelectActions: (actions: SuccessCase["implementedActions"]) => void
}

export function SuccessCasesViewer({ cases, category, onSelectActions }: SuccessCasesViewerProps) {
  const [selectedCase, setSelectedCase] = useState<SuccessCase | null>(null)
  const stats = getSuccessStats(category)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "low":
        return "Baja"
      case "medium":
        return "Media"
      case "high":
        return "Alta"
      case "critical":
        return "Crítica"
      default:
        return severity
    }
  }

  if (cases.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron casos similares</h3>
          <p className="text-muted-foreground text-center">
            No hay casos exitosos registrados para esta categoría y tipo de hallazgo.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Estadísticas de Éxito - {category}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalCases}</div>
              <div className="text-sm text-muted-foreground">Casos Exitosos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.avgTimeToResolution}d</div>
              <div className="text-sm text-muted-foreground">Tiempo Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.avgRiskReduction}%</div>
              <div className="text-sm text-muted-foreground">Reducción de Riesgo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.avgSatisfactionScore}/5</div>
              <div className="text-sm text-muted-foreground">Satisfacción</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de casos similares */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Casos Similares Exitosos</h3>
        {cases.map((case_) => (
          <Card key={case_.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{case_.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{case_.industry}</p>
                </div>
                <Badge className={getSeverityColor(case_.severity)}>{getSeverityLabel(case_.severity)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Hallazgo Original:</h4>
                  <p className="text-sm text-muted-foreground">{case_.originalFinding}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      {case_.results.timeToResolution}d
                    </div>
                    <div className="text-xs text-muted-foreground">Resolución</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Shield className="h-4 w-4" />
                      {case_.results.riskReduction}%
                    </div>
                    <div className="text-xs text-muted-foreground">Reducción</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Star className="h-4 w-4" />
                      {case_.results.satisfactionScore}/5
                    </div>
                    <div className="text-xs text-muted-foreground">Satisfacción</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedCase(case_)}>
                    Ver Detalles
                  </Button>
                  <Button size="sm" onClick={() => onSelectActions(case_.implementedActions)}>
                    Usar Estas Acciones
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de detalles del caso */}
      {selectedCase && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-background">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedCase.title}</CardTitle>
                <p className="text-muted-foreground">{selectedCase.industry}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCase(null)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="actions">Acciones</TabsTrigger>
                <TabsTrigger value="results">Resultados</TabsTrigger>
                <TabsTrigger value="lessons">Lecciones</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Hallazgo Original</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedCase.originalFinding}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Categoría</h4>
                    <Badge variant="outline">{selectedCase.category}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Severidad</h4>
                    <Badge className={getSeverityColor(selectedCase.severity)}>
                      {getSeverityLabel(selectedCase.severity)}
                    </Badge>
                  </div>
                </div>

                {selectedCase.testimonial && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Quote className="h-4 w-4" />
                      Testimonio
                    </h4>
                    <blockquote className="text-sm bg-muted p-3 rounded-md italic">
                      "{selectedCase.testimonial}"
                    </blockquote>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <h4 className="font-medium">Acciones Implementadas</h4>
                {selectedCase.implementedActions.map((action, index) => (
                  <Card key={action.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium">Acción {index + 1}</h5>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < action.effectiveness ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-3">{action.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Responsable:</span>
                          <br />
                          {action.responsible}
                        </div>
                        <div>
                          <span className="font-medium">Duración:</span>
                          <br />
                          {action.duration} días
                        </div>
                        <div>
                          <span className="font-medium">Costo:</span>
                          <br />${action.cost.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <h4 className="font-medium">Resultados Obtenidos</h4>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Tiempo de Resolución</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedCase.results.timeToResolution} días</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium">Reducción de Riesgo</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedCase.results.riskReduction}%</div>
                      <Progress value={selectedCase.results.riskReduction} className="mt-2" />
                    </CardContent>
                  </Card>

                  {selectedCase.results.costSavings && (
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="font-medium">Ahorro de Costos</span>
                        </div>
                        <div className="text-2xl font-bold">${selectedCase.results.costSavings.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="font-medium">Satisfacción</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedCase.results.satisfactionScore}/5</div>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < selectedCase.results.satisfactionScore
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="lessons" className="space-y-4">
                <h4 className="font-medium">Lecciones Aprendidas</h4>
                <div className="space-y-3">
                  {selectedCase.lessons.map((lesson, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{lesson}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
