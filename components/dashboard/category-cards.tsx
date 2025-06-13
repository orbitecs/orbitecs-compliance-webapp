import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Server, AlertTriangle, FileText } from "lucide-react"

const categories = [
  {
    name: "Seguridad",
    icon: Shield,
    progress: 85,
    assessments: 8,
    actions: 3,
  },
  {
    name: "Continuidad",
    icon: Server,
    progress: 72,
    assessments: 5,
    actions: 4,
  },
  {
    name: "Riesgos",
    icon: AlertTriangle,
    progress: 68,
    assessments: 6,
    actions: 7,
  },
  {
    name: "Documentación",
    icon: FileText,
    progress: 90,
    assessments: 5,
    actions: 1,
  },
]

export function CategoryCards() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Categorías</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
              <category.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{category.progress}%</div>
              <Progress value={category.progress} className="h-2 mt-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <div>{category.assessments} assessments</div>
                <div>{category.actions} acciones</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
