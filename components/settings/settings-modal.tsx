"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bell, Globe, Lock, Moon, Palette, Shield, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <Tabs defaultValue="general" className="flex h-full">
          {/* Sidebar de navegación */}
          <div className="w-64 border-r bg-muted/40 p-4">
            <DialogHeader className="px-2">
              <DialogTitle className="text-xl">Configuración</DialogTitle>
            </DialogHeader>
            <TabsList className="flex flex-col h-auto bg-transparent mt-4">
              <TabsTrigger value="general" className="w-full justify-start px-2 py-3">
                <Globe className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="account" className="w-full justify-start px-2 py-3">
                <User className="h-4 w-4 mr-2" />
                Cuenta
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full justify-start px-2 py-3">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="appearance" className="w-full justify-start px-2 py-3">
                <Palette className="h-4 w-4 mr-2" />
                Apariencia
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full justify-start px-2 py-3">
                <Shield className="h-4 w-4 mr-2" />
                Seguridad
              </TabsTrigger>
              <TabsTrigger value="privacy" className="w-full justify-start px-2 py-3">
                <Lock className="h-4 w-4 mr-2" />
                Privacidad
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                <TabsContent value="general" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración General</CardTitle>
                      <CardDescription>
                        Configura las opciones generales de la aplicación
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="language">Idioma</Label>
                        <Select defaultValue="es">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="timezone">Zona Horaria</Label>
                        <Select defaultValue="america/santiago">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una zona horaria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="america/santiago">Santiago (GMT-4)</SelectItem>
                            <SelectItem value="america/new_york">New York (GMT-5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="account" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Información de la Cuenta</CardTitle>
                      <CardDescription>
                        Actualiza la información de tu cuenta
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" defaultValue="Juan Pérez" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" type="email" defaultValue="juan.perez@orbitecs.com" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" defaultValue="Orbitecs S.A." />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferencias de Notificaciones</CardTitle>
                      <CardDescription>
                        Configura cómo recibirás las notificaciones
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Notificaciones por Email</Label>
                          <p className="text-sm text-muted-foreground">
                            Recibe notificaciones importantes por correo electrónico
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Notificaciones Push</Label>
                          <p className="text-sm text-muted-foreground">
                            Recibe notificaciones en tiempo real
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Apariencia</CardTitle>
                      <CardDescription>
                        Personaliza la apariencia de la aplicación
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="theme">Tema</Label>
                        <Select defaultValue="system">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tema" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Oscuro</SelectItem>
                            <SelectItem value="system">Sistema</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Modo Oscuro</Label>
                          <p className="text-sm text-muted-foreground">
                            Activa el modo oscuro para la interfaz
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Seguridad</CardTitle>
                      <CardDescription>
                        Configura las opciones de seguridad de tu cuenta
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Autenticación de Dos Factores</Label>
                          <p className="text-sm text-muted-foreground">
                            Añade una capa extra de seguridad a tu cuenta
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <Separator />
                      <div className="grid gap-2">
                        <Label htmlFor="current-password">Contraseña Actual</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>Cambiar Contraseña</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="privacy" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacidad</CardTitle>
                      <CardDescription>
                        Configura tus preferencias de privacidad
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Compartir Datos de Uso</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite compartir datos anónimos para mejorar el servicio
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Mostrar Estado en Línea</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite que otros usuarios vean tu estado en línea
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 