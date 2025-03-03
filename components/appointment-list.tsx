"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllAppointments } from "@/lib/appointments"
import AppointmentDetails from "./appointment-details"

export default function AppointmentList({ userRole }: { userRole: string }) {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    const appts = getAllAppointments()
    setAppointments(appts)
    applyFilters(appts)
  }, [])

  const applyFilters = (appts = appointments) => {
    let filtered = [...appts]

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (a) => a.personName.toLowerCase().includes(searchTerm) || a.notes.toLowerCase().includes(searchTerm),
      )
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((a) => a.status === filters.status)
    }

    // Filter by priority
    if (filters.priority !== "all") {
      filtered = filtered.filter((a) => a.priority === filters.priority)
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter((a) => a.date >= filters.dateFrom)
    }

    if (filters.dateTo) {
      filtered = filtered.filter((a) => a.date <= filters.dateTo)
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateB - dateA // Most recent first
    })

    setFilteredAppointments(filtered)
  }

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)

    // Apply filters after a short delay to avoid excessive filtering
    setTimeout(() => {
      applyFilters()
    }, 300)
  }

  const getStatusBadge = (status) => {
    return (
      <Badge
        variant={
          status === "waiting"
            ? "outline"
            : status === "approved"
              ? "default"
              : status === "completed"
                ? "success"
                : "destructive"
        }
      >
        {status === "waiting"
          ? "En espera"
          : status === "approved"
            ? "Aprobado"
            : status === "completed"
              ? "Atendido"
              : "Cancelado"}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Nombre o notas"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="status">Estado</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="waiting">En espera</SelectItem>
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="completed">Atendido</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Prioridad</Label>
            <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Todas las prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dateFrom">Desde</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="dateTo">Hasta</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Resultados ({filteredAppointments.length} turnos)</h3>

        {filteredAppointments.length === 0 ? (
          <p className="text-muted-foreground">No se encontraron turnos con los filtros aplicados.</p>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium">{appointment.personName}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.date} - {appointment.time}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm line-clamp-2">{appointment.notes}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(appointment.status)}
                      {appointment.priority === "high" && <Badge variant="destructive">Urgente</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          userRole={userRole}
        />
      )}
    </div>
  )
}

