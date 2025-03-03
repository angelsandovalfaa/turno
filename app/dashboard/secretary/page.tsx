"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MessageSquare, Plus, User } from "lucide-react"
import AppointmentCalendar from "@/components/appointment-calendar"
import AppointmentForm from "@/components/appointment-form"
import ChatInterface from "@/components/chat-interface"
import { initializeDatabase } from "@/lib/database"
import { useToast } from "@/components/ui/use-toast"
import AppointmentList from "@/components/appointment-list"

export default function SecretaryDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [user, setUser] = useState<{ role: string; name: string } | null>(null)

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "secretary") {
      router.push("/login?role=secretary")
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
          <h1 className="text-xl font-bold">Panel de Secretaría</h1>
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
          <h2 className="text-2xl font-bold">Gestión de Turnos</h2>
          <Button onClick={() => setShowAppointmentForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nuevo Turno
          </Button>
        </div>

        <Tabs defaultValue="calendar">
          <TabsList className="mb-6">
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" /> Calendario
            </TabsTrigger>
            <TabsTrigger value="list">
              <Clock className="h-4 w-4 mr-2" /> Lista de Turnos
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" /> Chat con Jefatura
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <AppointmentCalendar userRole="secretary" />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <AppointmentList userRole="secretary" />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <ChatInterface sender="secretary" recipient="management" />
          </TabsContent>
        </Tabs>

        {showAppointmentForm && (
          <AppointmentForm
            onClose={() => setShowAppointmentForm(false)}
            onSuccess={() => {
              setShowAppointmentForm(false)
              toast({
                title: "Turno creado",
                description: "El turno ha sido agendado exitosamente",
              })
            }}
          />
        )}
      </main>
    </div>
  )
}

