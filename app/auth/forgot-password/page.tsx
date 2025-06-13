"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">ComplianceHub</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Plataforma de Gestión de Compliance Regulatorio
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 px-6 py-8 shadow-md rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">Recuperar Contraseña</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ingrese su correo electrónico para recibir un enlace de recuperación
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="correo@ejemplo.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
              </div>
              <Button className="w-full">Enviar Enlace de Recuperación</Button>
            </div>
          </div>
        </div>
        <div className="text-center text-sm">
          <Link href="/auth/login" className="font-medium hover:underline">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
