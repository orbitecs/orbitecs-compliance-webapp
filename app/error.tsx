'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Algo salió mal</h2>
      <p className="text-muted-foreground">
        {error.message || 'Ha ocurrido un error inesperado'}
      </p>
      <Button
        onClick={() => reset()}
        variant="outline"
      >
        Intentar de nuevo
      </Button>
    </div>
  )
} 