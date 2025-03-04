"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateAppointment } from "@/lib/appointments"
import { createNotification } from "@/lib/notifications"
import AppointmentForm from "./appointment-form"

export default function AppointmentDetails({
  appointment,
  onClose,
  userRole,
}: {
  appointment: any
  onClose: () => void
  userRole: string
}) {
  const [notes, setNotes] = useState(appointment.notes)
  const [status, setStatus] = useState(appointment.status)
  const [showEditForm, setShowEditForm] = useState(false)

  const handleUpdateStatus = (newStatus) => {
    const updatedAppointment = {
      ...appointment,
      status: newStatus,
    }

    updateAppointment(updatedAppointment)
    setStatus(newStatus)

    // Notify secretary if management changes status
    if (userRole === "management") {
      createNotification({
        recipient: "secretary",
        title: "Actualización de Turno",
        message: `El turno de ${appointment.personName} ha sido ${
          newStatus === "approved"
            ? "aprobado"
            : newStatus === "completed"
              ? "marcado como atendido"
              : newStatus === "cancelled"
                ? "cancelado"
                : "actualizado"
        }`,
        appointmentId: appointment.id,
        read: false,
        timestamp: new Date().toISOString(),
      })
    }
  }

  const handleUpdateNotes = () => {
    const updatedAppointment = {
      ...appointment,
      notes,
    }

    updateAppointment(updatedAppointment)
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

  const getPriorityBadge = (priority) => {
    return (
      <Badge variant={priority === "low" ? "outline" : priority === "normal" ? "secondary" : "destructive"}>
        {priority === "low" ? "Baja" : priority === "normal" ? "Normal" : "Alta"}
      </Badge>
    )
  }

  return (
    <>
      <Dialog open={!showEditForm} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalles del Turno</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-medium">{appointment.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hora</p>
                <p className="font-medium">{appointment.time}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Persona</p>
              <p className="font-medium">{appointment.personName}</p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Estado</p>
                {getStatusBadge(status)}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Prioridad</p>
                {getPriorityBadge(appointment.priority)}
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="notes" className="text-sm text-muted-foreground">
                Notas
              </Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-1" />
              {notes !== appointment.notes && (
                <Button size="sm" className="mt-2" onClick={handleUpdateNotes}>
                  Guardar Notas
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {userRole === "secretary" && (
              <Button variant="outline" onClick={() => setShowEditForm(true)}>
                Editar Turno
              </Button>
            )}

            {userRole === "management" && status === "waiting" && (
              <Button variant="default" onClick={() => handleUpdateStatus("approved")}>
                Aprobar Turno
              </Button>
            )}

            {userRole === "management" && status === "approved" && (
              <Button
                variant="success"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleUpdateStatus("completed")}
              >
                Marcar como Atendido
              </Button>
            )}

            {status !== "cancelled" && (
              <Button variant="destructive" onClick={() => handleUpdateStatus("cancelled")}>
                Cancelar Turno
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showEditForm && (
        <AppointmentForm
          appointmentToEdit={appointment}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false)
            onClose()
          }}
        />
      )}
    </>
  )
}

