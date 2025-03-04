"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, User, Users } from "lucide-react"
import { initializeDatabase } from "@/lib/database"
import { useToast } from "@/components/ui/use-toast"
import UserManagement from "@/components/user-management"
import AppointmentCalendar from "@/components/appointment-calendar"
import AppointmentList from "@/components/appointment-list"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ role: string; name: string } | null>(null)

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "admin") {
      router.push("/")
      return
    }

    setUser(parsedUser)

    // Initialize database
    initializeDatabase()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-3 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Panel de Administración
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/20 p-1 rounded-full">
                <User className="h-5 w-5" />
              </div>
              <span>{user.name}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Panel de Administración</h2>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" /> Gestión de Usuarios
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <User className="h-4 w-4 mr-2" /> Vista Ayudantía
            </TabsTrigger>
            <TabsTrigger value="management">
              <User className="h-4 w-4 mr-2" /> Vista Jefatura
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <AppointmentCalendar userRole="admin" />
            <AppointmentList userRole="admin" />
          </TabsContent>

          <TabsContent value="management" className="space-y-4">
            <AppointmentCalendar userRole="admin" />
            <AppointmentList userRole="admin" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

