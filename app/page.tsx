"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { initializeDatabase } from "@/lib/database"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeRole, setActiveRole] = useState<"assistant" | "management">("assistant")

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  // Initialize database on first load
  useState(() => {
    initializeDatabase()
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!formData.username || !formData.password) {
      toast({
        title: "Error de validación",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      })
      return
    }

    // Check for admin credentials in management tab
    if (activeRole === "management" && formData.username === "admin" && formData.password === "admin123") {
      localStorage.setItem("user", JSON.stringify({ role: "admin", name: "Administrador" }))
      router.push("/dashboard/admin")
      return
    }

    // Check if user exists in the database
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find(
      (u) => u.username === formData.username && u.password === formData.password && u.role === activeRole,
    )

    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          role: user.role,
          name: user.name,
          id: user.id,
        }),
      )
      router.push(`/dashboard/${user.role}`)
    } else {
      // Fallback to demo credentials
      if (activeRole === "assistant" && formData.username === "ayudante" && formData.password === "123456") {
        localStorage.setItem("user", JSON.stringify({ role: "assistant", name: "Ayudantía" }))
        router.push("/dashboard/assistant")
      } else if (activeRole === "management" && formData.username === "jefe" && formData.password === "123456") {
        localStorage.setItem("user", JSON.stringify({ role: "management", name: "Jefatura" }))
        router.push("/dashboard/management")
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sistema de Gestión de Turnos</CardTitle>
          <CardDescription>Accede para gestionar los turnos</CardDescription>
        </CardHeader>

        <Tabs
          value={activeRole}
          onValueChange={(value) => setActiveRole(value as "assistant" | "management")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="assistant">Ayudantía</TabsTrigger>
            <TabsTrigger value="management">Jefatura</TabsTrigger>
          </TabsList>

          <TabsContent value="assistant">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Ingrese su usuario"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Para demostración:</p>
                  <p>Usuario: ayudante / Contraseña: 123456</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Ingresar como Ayudantía
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="management">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Ingrese su usuario"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Para demostración:</p>
                  <p>Usuario jefe: jefe / Contraseña: 123456</p>
                  <p>Usuario admin: admin / Contraseña: admin123</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Ingresar como Jefatura/Admin
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

