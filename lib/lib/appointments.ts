import { getFromDB, saveToDB } from "./database"

export function getAllAppointments() {
  return getFromDB("appointments")
}

export function getAppointmentsByDate(date: string) {
  const appointments = getAllAppointments()
  return appointments.filter((appointment) => appointment.date === date)
}

export function getAppointmentById(id: string) {
  const appointments = getAllAppointments()
  return appointments.find((appointment) => appointment.id === id)
}

export function createAppointment(appointmentData: any) {
  const appointments = getAllAppointments()

  // Check if it's an update or a new appointment
  const existingIndex = appointments.findIndex((a) => a.id === appointmentData.id)

  if (existingIndex >= 0) {
    // Update existing appointment
    appointments[existingIndex] = appointmentData
  } else {
    // Add new appointment
    appointments.push(appointmentData)
  }

  saveToDB("appointments", appointments)
  return appointmentData
}

export function updateAppointment(appointmentData: any) {
  return createAppointment(appointmentData)
}

export function deleteAppointment(id: string) {
  const appointments = getAllAppointments()
  const filteredAppointments = appointments.filter((appointment) => appointment.id !== id)
  saveToDB("appointments", filteredAppointments)
}

