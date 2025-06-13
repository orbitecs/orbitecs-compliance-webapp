export interface SuccessCase {
  id: string
  title: string
  category: string
  severity: "low" | "medium" | "high" | "critical"
  industry: string
  originalFinding: string
  implementedActions: Array<{
    id: string
    description: string
    responsible: string
    duration: number // días
    cost: number
    effectiveness: number // 1-5
  }>
  results: {
    timeToResolution: number // días
    costSavings?: number
    riskReduction: number // porcentaje
    satisfactionScore: number // 1-5
    recurrenceRate: number // porcentaje
  }
  lessons: string[]
  testimonial?: string
  dateCompleted: string
  tags: string[]
}

// Base de datos simulada de casos exitosos
export const successCases: SuccessCase[] = [
  {
    id: "case-001",
    title: "Implementación de Política de Seguridad de la Información",
    category: "Seguridad de la Información",
    severity: "high",
    industry: "Servicios Financieros",
    originalFinding: "Ausencia de política formal de seguridad de la información aprobada por la alta dirección",
    implementedActions: [
      {
        id: "action-1",
        description: "Desarrollo de política integral de seguridad",
        responsible: "CISO",
        duration: 21,
        cost: 15000,
        effectiveness: 5,
      },
      {
        id: "action-2",
        description: "Capacitación a todo el personal",
        responsible: "Recursos Humanos",
        duration: 30,
        cost: 8000,
        effectiveness: 4,
      },
      {
        id: "action-3",
        description: "Implementación de controles técnicos",
        responsible: "Equipo de TI",
        duration: 45,
        cost: 25000,
        effectiveness: 5,
      },
    ],
    results: {
      timeToResolution: 60,
      costSavings: 100000,
      riskReduction: 85,
      satisfactionScore: 4.8,
      recurrenceRate: 0,
    },
    lessons: [
      "La involucración de la alta dirección desde el inicio es crucial",
      "La capacitación debe ser continua, no un evento único",
      "Los controles técnicos deben complementar las políticas",
    ],
    testimonial:
      "La implementación fue exitosa gracias al enfoque integral y el compromiso de todos los niveles organizacionales.",
    dateCompleted: "2023-08-15",
    tags: ["política", "capacitación", "controles técnicos", "alta dirección"],
  },
  {
    id: "case-002",
    title: "Mejora en Controles de Acceso Físico",
    category: "Seguridad Física",
    severity: "medium",
    industry: "Manufactura",
    originalFinding: "Controles de acceso físico inadecuados en áreas críticas de producción",
    implementedActions: [
      {
        id: "action-1",
        description: "Instalación de sistema biométrico",
        responsible: "Seguridad Física",
        duration: 14,
        cost: 12000,
        effectiveness: 5,
      },
      {
        id: "action-2",
        description: "Revisión y actualización de procedimientos",
        responsible: "Gerente de Operaciones",
        duration: 7,
        cost: 2000,
        effectiveness: 4,
      },
      {
        id: "action-3",
        description: "Capacitación en nuevos procedimientos",
        responsible: "Recursos Humanos",
        duration: 10,
        cost: 3000,
        effectiveness: 4,
      },
    ],
    results: {
      timeToResolution: 21,
      riskReduction: 75,
      satisfactionScore: 4.5,
      recurrenceRate: 5,
    },
    lessons: [
      "La tecnología biométrica reduce significativamente los riesgos",
      "Es importante actualizar procedimientos junto con la tecnología",
      "La resistencia al cambio se supera con capacitación adecuada",
    ],
    testimonial: "El nuevo sistema ha mejorado notablemente la seguridad y el control de accesos.",
    dateCompleted: "2023-09-10",
    tags: ["biométrico", "procedimientos", "capacitación", "tecnología"],
  },
  {
    id: "case-003",
    title: "Implementación de Sistema de Backup Automático",
    category: "Gestión de Riesgos",
    severity: "critical",
    industry: "Tecnología",
    originalFinding: "Ausencia de sistema de respaldo automático para datos críticos del negocio",
    implementedActions: [
      {
        id: "action-1",
        description: "Implementación de solución de backup en la nube",
        responsible: "Administrador de Sistemas",
        duration: 10,
        cost: 20000,
        effectiveness: 5,
      },
      {
        id: "action-2",
        description: "Configuración de respaldos automáticos diarios",
        responsible: "Equipo de TI",
        duration: 5,
        cost: 5000,
        effectiveness: 5,
      },
      {
        id: "action-3",
        description: "Pruebas de restauración mensuales",
        responsible: "Equipo de TI",
        duration: 30,
        cost: 3000,
        effectiveness: 4,
      },
    ],
    results: {
      timeToResolution: 15,
      costSavings: 500000,
      riskReduction: 95,
      satisfactionScore: 5.0,
      recurrenceRate: 0,
    },
    lessons: [
      "La implementación rápida es crucial para riesgos críticos",
      "Las pruebas regulares de restauración son esenciales",
      "La inversión en backup se justifica con el primer incidente evitado",
    ],
    testimonial: "Esta implementación nos salvó de una pérdida catastrófica de datos apenas 2 meses después.",
    dateCompleted: "2023-07-20",
    tags: ["backup", "nube", "automatización", "pruebas"],
  },
  {
    id: "case-004",
    title: "Programa de Concienciación en Privacidad",
    category: "Protección de Datos",
    severity: "medium",
    industry: "Salud",
    originalFinding: "Personal no capacitado en regulaciones de privacidad de datos de pacientes",
    implementedActions: [
      {
        id: "action-1",
        description: "Desarrollo de programa de capacitación GDPR",
        responsible: "DPO",
        duration: 21,
        cost: 10000,
        effectiveness: 4,
      },
      {
        id: "action-2",
        description: "Implementación de evaluaciones periódicas",
        responsible: "Recursos Humanos",
        duration: 30,
        cost: 5000,
        effectiveness: 4,
      },
      {
        id: "action-3",
        description: "Creación de materiales de referencia",
        responsible: "Equipo Legal",
        duration: 14,
        cost: 3000,
        effectiveness: 3,
      },
    ],
    results: {
      timeToResolution: 45,
      riskReduction: 70,
      satisfactionScore: 4.2,
      recurrenceRate: 10,
    },
    lessons: [
      "La capacitación debe ser específica para el sector",
      "Los materiales de referencia facilitan la consulta diaria",
      "Las evaluaciones periódicas mantienen el conocimiento actualizado",
    ],
    testimonial: "El programa ha creado una cultura de privacidad en toda la organización.",
    dateCompleted: "2023-06-30",
    tags: ["GDPR", "capacitación", "privacidad", "evaluaciones"],
  },
]

// Función para encontrar casos similares
export function findSimilarCases(
  category: string,
  severity: string,
  finding: string,
  industry?: string,
): SuccessCase[] {
  const keywords = finding.toLowerCase().split(" ")

  return successCases
    .filter((case_) => {
      // Filtrar por categoría
      if (case_.category !== category) return false

      // Filtrar por industria si se especifica
      if (industry && case_.industry !== industry) return false

      // Buscar palabras clave en el hallazgo original
      const caseKeywords = case_.originalFinding.toLowerCase()
      const hasKeywordMatch = keywords.some((keyword) => keyword.length > 3 && caseKeywords.includes(keyword))

      return hasKeywordMatch
    })
    .sort((a, b) => {
      // Priorizar por severidad similar
      const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 }
      const severityDiff = Math.abs(
        severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[severity as keyof typeof severityOrder],
      )

      // Priorizar por efectividad promedio
      const aEffectiveness =
        a.implementedActions.reduce((sum, action) => sum + action.effectiveness, 0) / a.implementedActions.length
      const bEffectiveness =
        b.implementedActions.reduce((sum, action) => sum + action.effectiveness, 0) / b.implementedActions.length

      return severityDiff - (bEffectiveness - aEffectiveness)
    })
    .slice(0, 3) // Retornar los 3 casos más relevantes
}

// Función para obtener estadísticas de éxito
export function getSuccessStats(category: string): {
  totalCases: number
  avgTimeToResolution: number
  avgRiskReduction: number
  avgSatisfactionScore: number
  mostEffectiveActions: string[]
} {
  const categoryCases = successCases.filter((case_) => case_.category === category)

  if (categoryCases.length === 0) {
    return {
      totalCases: 0,
      avgTimeToResolution: 0,
      avgRiskReduction: 0,
      avgSatisfactionScore: 0,
      mostEffectiveActions: [],
    }
  }

  const avgTimeToResolution =
    categoryCases.reduce((sum, case_) => sum + case_.results.timeToResolution, 0) / categoryCases.length
  const avgRiskReduction =
    categoryCases.reduce((sum, case_) => sum + case_.results.riskReduction, 0) / categoryCases.length
  const avgSatisfactionScore =
    categoryCases.reduce((sum, case_) => sum + case_.results.satisfactionScore, 0) / categoryCases.length

  // Encontrar las acciones más efectivas
  const allActions = categoryCases.flatMap((case_) => case_.implementedActions)
  const actionEffectiveness = allActions.reduce(
    (acc, action) => {
      const key = action.description
      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 }
      }
      acc[key].total += action.effectiveness
      acc[key].count += 1
      return acc
    },
    {} as Record<string, { total: number; count: number }>,
  )

  const mostEffectiveActions = Object.entries(actionEffectiveness)
    .map(([action, stats]) => ({ action, avg: stats.total / stats.count }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5)
    .map((item) => item.action)

  return {
    totalCases: categoryCases.length,
    avgTimeToResolution: Math.round(avgTimeToResolution),
    avgRiskReduction: Math.round(avgRiskReduction),
    avgSatisfactionScore: Math.round(avgSatisfactionScore * 10) / 10,
    mostEffectiveActions,
  }
}
