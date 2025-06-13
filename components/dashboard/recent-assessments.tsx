import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentAssessments = [
  {
    id: "ASS-001",
    name: "ISO 27001 - Evaluación Anual",
    date: "12/06/2023",
    status: "Completado",
    compliance: 85,
  },
  {
    id: "ASS-002",
    name: "Ley Fintech - Evaluación Trimestral",
    date: "28/05/2023",
    status: "En revisión",
    compliance: 72,
  },
  {
    id: "ASS-003",
    name: "PCI DSS - Evaluación Semestral",
    date: "15/05/2023",
    status: "Completado",
    compliance: 90,
  },
  {
    id: "ASS-004",
    name: "GDPR - Evaluación de Cumplimiento",
    date: "02/05/2023",
    status: "Completado",
    compliance: 78,
  },
]

export function RecentAssessments() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Assessments Recientes</h2>
        <Button variant="outline" size="sm">
          Ver todos
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Cumplimiento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentAssessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell className="font-medium">{assessment.id}</TableCell>
                <TableCell>{assessment.name}</TableCell>
                <TableCell>{assessment.date}</TableCell>
                <TableCell>
                  <Badge variant={assessment.status === "Completado" ? "default" : "outline"}>
                    {assessment.status}
                  </Badge>
                </TableCell>
                <TableCell>{assessment.compliance}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
