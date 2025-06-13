"use client"

import { useState } from "react"
import { Globe, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const [theme, setTheme] = useState("light")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 md:w-auto w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Actualice la información general de su organización.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Nombre de la Organización</Label>
                <Input id="company" defaultValue="Mi Empresa S.A." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input id="website" defaultValue="https://miempresa.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industria</Label>
                <Select defaultValue="fintech">
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Seleccionar industria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fintech">Fintech</SelectItem>
                    <SelectItem value="healthcare">Salud</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="education">Educación</SelectItem>
                    <SelectItem value="other">Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" defaultValue="Empresa líder en soluciones financieras digitales." rows={3} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencias Regionales</CardTitle>
              <CardDescription>Configure sus preferencias de idioma y zona horaria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="es">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select defaultValue="america_mexico_city">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Seleccionar zona horaria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america_mexico_city">América/Ciudad de México (UTC-6)</SelectItem>
                    <SelectItem value="america_bogota">América/Bogotá (UTC-5)</SelectItem>
                    <SelectItem value="america_buenos_aires">América/Buenos Aires (UTC-3)</SelectItem>
                    <SelectItem value="europe_madrid">Europa/Madrid (UTC+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_format">Formato de Fecha</Label>
                <Select defaultValue="dd_mm_yyyy">
                  <SelectTrigger id="date_format">
                    <SelectValue placeholder="Seleccionar formato de fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy_mm_dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tema</CardTitle>
              <CardDescription>Personalice la apariencia de la plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Modo</Label>
                <div className="flex items-center space-x-4">
                  <RadioGroup defaultValue="light" className="flex" onValueChange={setTheme}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center">
                        <Sun className="mr-2 h-4 w-4" /> Claro
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center">
                        <Moon className="mr-2 h-4 w-4" /> Oscuro
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" /> Sistema
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vista Compacta</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="compact-mode" />
                  <Label htmlFor="compact-mode">Activar vista compacta</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configure cómo y cuándo recibir notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">
                      Notificaciones por Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Reciba actualizaciones importantes por correo electrónico
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications" className="text-base">
                      Notificaciones Push
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Reciba notificaciones en tiempo real en la plataforma
                    </p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="due-date-reminders" className="text-base">
                      Recordatorios de Fechas Límite
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Reciba recordatorios antes de las fechas límite de planes de acción
                    </p>
                  </div>
                  <Switch id="due-date-reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="assessment-updates" className="text-base">
                      Actualizaciones de Assessments
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Reciba notificaciones cuando se actualicen los assessments
                    </p>
                  </div>
                  <Switch id="assessment-updates" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad de la Cuenta</CardTitle>
              <CardDescription>Gestione la seguridad de su cuenta y configure la autenticación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="2fa" className="text-base">
                      Autenticación de Dos Factores
                    </Label>
                    <p className="text-sm text-muted-foreground">Añada una capa adicional de seguridad a su cuenta</p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sesiones Activas</CardTitle>
              <CardDescription>Gestione sus sesiones activas en diferentes dispositivos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Chrome en Windows</p>
                    <p className="text-xs text-muted-foreground">Ciudad de México • Activo ahora</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Este dispositivo
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Safari en MacOS</p>
                    <p className="text-xs text-muted-foreground">Ciudad de México • Hace 2 días</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Cerrar Sesión
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Chrome en Android</p>
                    <p className="text-xs text-muted-foreground">Ciudad de México • Hace 1 semana</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Cerrar Todas las Sesiones
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claves API</CardTitle>
              <CardDescription>Gestione sus claves API para integrar con otros sistemas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Clave API Actual</Label>
                <div className="flex">
                  <Input readOnly value="••••••••••••••••••••••••••••••" className="rounded-r-none font-mono" />
                  <Button variant="outline" className="rounded-l-none">
                    Copiar
                  </Button>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline">Generar Nueva Clave API</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Configure webhooks para recibir notificaciones en tiempo real.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL del Webhook</Label>
                <Input id="webhook-url" placeholder="https://su-dominio.com/webhook" />
              </div>
              <div className="space-y-2">
                <Label>Eventos</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="assessment-created" />
                    <Label htmlFor="assessment-created">Assessment Creado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="assessment-updated" />
                    <Label htmlFor="assessment-updated">Assessment Actualizado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="action-plan-created" />
                    <Label htmlFor="action-plan-created">Plan de Acción Creado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="action-plan-completed" />
                    <Label htmlFor="action-plan-completed">Plan de Acción Completado</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Guardar Webhook</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
