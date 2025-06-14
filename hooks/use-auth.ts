"use client"

import { useState, useEffect } from "react"

interface User {
  name: string
  email: string
  avatar?: string
  role: string
}

interface AuthContextType {
  user: User | null
  signOut: () => void
}

// Datos de ejemplo - En producción esto vendría de tu backend
const mockUser: User = {
  name: "Juan Pérez",
  email: "juan.perez@orbitecs.com",
  role: "Administrador de Compliance",
  avatar: ""
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // En producción, aquí harías una llamada a tu API para obtener el usuario actual
    setUser(mockUser)
  }, [])

  const signOut = () => {
    // En producción, aquí manejarías el cierre de sesión
    setUser(null)
  }

  return {
    user,
    signOut
  }
} 