import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

interface ChecklistBadgeProps {
  isAdded: boolean
}

export function ChecklistBadge({ isAdded }: ChecklistBadgeProps) {
  if (!isAdded) return null

  return (
    <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      <span>Agregado</span>
    </Badge>
  )
}
