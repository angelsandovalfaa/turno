"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Clock, MessageSquare, User } from "lucide-react"
import AppointmentCalendar from "@/components/appointment-calendar"
import ChatInterface from "@/components/chat-interface"
import { initializeDatabase } from "@/lib/database"
import { Badge } from "@/components/ui/badge"
import { getNotifications, markNotificationAsRead } from "@/lib/notifications"
import AppointmentList from "@/components/appointment-list"
import NotificationCenter from "@/components/notification-center"

export default function ManagementDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ role: string; name: string } | null>(null)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "management") {
      router.push("/")
      return
    }

    setUser(parsedUser)

    // Initialize database
    initializeDatabase()

    // Load notifications
    const loadNotifications = () => {
      const notifs = getNotifications("management")
      setNotifications(notifs)
    }

    loadNotifications()

    // Set up interval to check for new notifications
    const interval = setInterval(loadNotifications, 10000)

    return () => clearInterval(interval)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleNotificationRead = (id) => {
    markNotificationAsRead(id)
    setNotifications(getNotifications("management"))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-3 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel de Jefatura</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
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
        </div>

        {showNotifications && (
          <NotificationCenter
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
            onMarkAsRead={handleNotificationRead}
          />
        )}

        <Tabs defaultValue="calendar">
          <TabsList className="mb-6">
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" /> Calendario
            </TabsTrigger>
            <TabsTrigger value="list">
              <Clock className="h-4 w-4 mr-2" /> Lista de Turnos
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" /> Chat con Secretaría
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <AppointmentCalendar userRole="management" />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <AppointmentList userRole="management" />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <ChatInterface sender="management" recipient="secretary" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

