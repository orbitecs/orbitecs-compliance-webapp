"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/components/profile/user-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Factory, Mail, Phone, Globe, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

// Datos de ejemplo - En producción esto vendría de tu backend
const companyData = {
  name: "Orbitecs S.A.",
  industry: "Tecnología y Consultoría",
  description: "Empresa líder en soluciones tecnológicas y consultoría empresarial",
  contact: {
    email: "contacto@orbitecs.com",
    phone: "+56 2 1234 5678",
    website: "www.orbitecs.com",
    address: "Av. Apoquindo 4500, Las Condes, Santiago"
  }
}

function CompanyProfile() {
  return (
    <div className="grid gap-6">
      <Separator />

      {/* Información Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Empresa
          </CardTitle>
          <CardDescription>
            Detalles generales de tu organización
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <h3 className="font-semibold">Nombre de la Empresa</h3>
            <p className="text-muted-foreground">{companyData.name}</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Industria</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Factory className="h-4 w-4" />
              <span>{companyData.industry}</span>
            </div>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Descripción</h3>
            <p className="text-muted-foreground">{companyData.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Información de Contacto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Información de Contacto
          </CardTitle>
          <CardDescription>
            Datos de contacto de la empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{companyData.contact.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{companyData.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{companyData.contact.website}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{companyData.contact.address}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de la Industria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Información de la Industria
          </CardTitle>
          <CardDescription>
            Detalles sobre el sector industrial
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Sector Industrial</h3>
            <p className="text-muted-foreground">
              La industria de Tecnología y Consultoría se caracteriza por su enfoque en la innovación 
              y la transformación digital. Este sector abarca una amplia gama de servicios, desde 
              consultoría estratégica hasta implementación de soluciones tecnológicas avanzadas.
            </p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Regulaciones Relevantes</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Ley de Protección de Datos Personales</li>
              <li>Regulaciones de Ciberseguridad</li>
              <li>Normativas de Comercio Electrónico</li>
              <li>Estándares de Calidad ISO</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Mi Perfil</TabsTrigger>
            <TabsTrigger value="company">Empresa</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <UserProfile />
          </TabsContent>

          <TabsContent value="company">
            <CompanyProfile />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 