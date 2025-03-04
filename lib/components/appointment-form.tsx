"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createAppointment } from "@/lib/appointments"
import { createNotification } from "@/lib/notifications"

export default function AppointmentForm({
  onClose,
  onSuccess,
  appointmentToEdit = null,
}: {
  onClose: () => void
  onSuccess: () => void
  appointmentToEdit?: any
}) {
  const [formData, setFormData] = useState({
    date: appointmentToEdit?.date || new Date().toISOString().split("T")[0],
    time: appointmentToEdit?.time || "09:00",
    personName: appointmentToEdit?.personName || "",
    notes: appointmentToEdit?.notes || "",
    priority: appointmentToEdit?.priority || "normal",
    notifyManagement: appointmentToEdit?.priority === "high" || false,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      notifyManagement: checked,
      priority: checked ? "high" : "normal",
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const appointmentData = {
      ...formData,
      status: "waiting",
      id: appointmentToEdit?.id || Date.now().toString(),
    }

    createAppointment(appointmentData)

    if (formData.notifyManagement) {
      createNotification({
        recipient: "management",
        title: "Turno Urgente",
        message: `Nuevo turno urgente para ${formData.personName} el ${formData.date} a las ${formData.time}`,
        appointmentId: appointmentData.id,
        read: false,
        timestamp: new Date().toISOString(),
      })
    }

    onSuccess()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{appointmentToEdit ? "Editar Turno" : "Nuevo Turno"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personName">Nombre de la Persona</Label>
            <Input id="personName" name="personName" value={formData.personName} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas / Motivo de la Cita</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridad</Label>
            <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione la prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="notifyManagement" checked={formData.notifyManagement} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="notifyManagement">Notificar a Jefatura (turno urgente)</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{appointmentToEdit ? "Guardar Cambios" : "Crear Turno"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

