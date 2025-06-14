"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Building2, Briefcase, Mail, Phone } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo - En producción esto vendría de tu backend
const userData = {
  name: "Juan Pérez",
  email: "juan.perez@orbitecs.com",
  role: "Administrador de Compliance",
  avatar: "",
  company: {
    name: "Orbitecs S.A.",
    industry: "Tecnología y Consultoría",
    position: "Gerente de Compliance"
  },
  contact: {
    phone: "+56 9 1234 5678",
    department: "Compliance"
  }
}

export function UserProfile() {
  return (
    <div className="grid gap-6">
      {/* Información del Usuario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
          <CardDescription>
            Detalles de tu perfil de usuario
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="text-2xl">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <h3 className="text-xl font-semibold">{userData.name}</h3>
              <p className="text-muted-foreground">{userData.role}</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{userData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{userData.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{userData.contact.department}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de la Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Empresa
          </CardTitle>
          <CardDescription>
            Detalles de tu empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Empresa</h3>
            <p className="text-muted-foreground">{userData.company.name}</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Industria</h3>
            <p className="text-muted-foreground">{userData.company.industry}</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Cargo</h3>
            <p className="text-muted-foreground">{userData.company.position}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 