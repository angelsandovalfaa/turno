"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAppointmentsByDate } from "@/lib/appointments"
import AppointmentDetails from "./appointment-details"

export default function AppointmentCalendar({ userRole }: { userRole: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    if (date) {
      const dateStr = date.toISOString().split("T")[0]
      const appts = getAppointmentsByDate(dateStr)
      setAppointments(appts)
    }
  }, [date])

  // Function to highlight dates with appointments
  const getDayClass = (day: Date) => {
    const dateStr = day.toISOString().split("T")[0]
    const appts = getAppointmentsByDate(dateStr)

    if (appts.length === 0) return undefined

    const hasUrgent = appts.some((a) => a.priority === "high")

    if (hasUrgent) return "bg-red-100 text-red-600 font-bold"
    return "bg-blue-100 text-blue-600 font-bold"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiersClassNames={{
              selected: "bg-primary text-primary-foreground",
            }}
            modifiers={{
              customModifier: (date) => getDayClass(date) !== undefined,
            }}
            modifiersStyles={{
              customModifier: (date) => ({
                fontWeight: "bold",
                backgroundColor: getDayClass(date)?.split(" ")[0],
                color: getDayClass(date)?.split(" ")[1],
              }),
            }}
          />
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">
          {date ? `Turnos para ${date.toLocaleDateString()}` : "Seleccione una fecha"}
        </h3>

        {appointments.length === 0 ? (
          <p className="text-muted-foreground">No hay turnos agendados para esta fecha.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{appointment.personName}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.time} - {appointment.notes.substring(0, 50)}
                        {appointment.notes.length > 50 ? "..." : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          appointment.status === "waiting"
                            ? "outline"
                            : appointment.status === "approved"
                              ? "default"
                              : appointment.status === "completed"
                                ? "success"
                                : "destructive"
                        }
                      >
                        {appointment.status === "waiting"
                          ? "En espera"
                          : appointment.status === "approved"
                            ? "Aprobado"
                            : appointment.status === "completed"
                              ? "Atendido"
                              : "Cancelado"}
                      </Badge>
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

