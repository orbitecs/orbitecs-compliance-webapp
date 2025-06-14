"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface SelectedChecklistsSummaryProps {
  selectedIds: string[]
  checklists: any[]
  onRemove: (id: string) => void
}

export function SelectedChecklistsSummary({ selectedIds, checklists, onRemove }: SelectedChecklistsSummaryProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const selectedChecklists = checklists.filter((cl) => selectedIds.includes(cl.id))

  if (selectedChecklists.length === 0) {
    return null
  }

  const handleCreateAssessment = async () => {
    setIsCreating(true)

    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Éxito",
        description: "Assessment creado exitosamente",
      })
      router.push("/assessments/new")
    } catch (error) {
      console.error("Error al crear el assessment", error)
    } finally {
      setIsCreating(false)
    }
  }

  // Manejar eliminar checklist
  const handleRemoveChecklist = (checklistId: string) => {
    onRemove(checklistId)
    toast({
      title: "Éxito",
      description: "Checklist eliminado correctamente.",
    })
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Checklists Seleccionados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {selectedChecklists.map((checklist) => (
            <Badge key={checklist.id} variant="outline" className="flex items-center gap-1 py-1">
              {checklist.name}
              <button onClick={() => handleRemoveChecklist(checklist.id)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar</span>
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleCreateAssessment} disabled={isCreating}>
          {isCreating ? "Creando Assessment..." : "Crear Assessment"}
        </Button>
      </CardFooter>
    </Card>
  )
}
