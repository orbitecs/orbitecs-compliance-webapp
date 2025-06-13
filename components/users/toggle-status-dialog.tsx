"use client"

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
import { useToast } from "@/components/ui/use-toast"

interface ToggleStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  currentStatus: "active" | "inactive"
}

export function ToggleStatusDialog({ isOpen, onClose, userId, userName, currentStatus }: ToggleStatusDialogProps) {
  const { toast } = useToast()
  const isActivating = currentStatus === "inactive"

  const handleConfirm = async () => {
    try {
      // Aquí iría la lógica para cambiar el estado del usuario
      console.log(`${isActivating ? "Activando" : "Suspendiendo"} usuario:`, userId)

      toast({
        title: `Usuario ${isActivating ? "activado" : "suspendido"}`,
        description: `El usuario ha sido ${isActivating ? "activado" : "suspendido"} correctamente.`,
      })

      onClose()
    } catch (error) {
      console.error(`Error al ${isActivating ? "activar" : "suspender"} usuario:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${isActivating ? "activar" : "suspender"} el usuario. Inténtelo de nuevo.`,
      })
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isActivating ? "¿Activar usuario?" : "¿Suspender usuario?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isActivating
              ? `¿Está seguro de que desea activar al usuario ${userName}? El usuario podrá acceder nuevamente al sistema.`
              : `¿Está seguro de que desea suspender al usuario ${userName}? El usuario no podrá acceder al sistema hasta que sea reactivado.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>{isActivating ? "Activar" : "Suspender"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
