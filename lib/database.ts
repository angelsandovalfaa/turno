// This is a mock database implementation using localStorage
// In a real application, you would use a proper database like SQLite

export function initializeDatabase() {
  // Initialize appointments if not exists
  if (!localStorage.getItem("appointments")) {
    localStorage.setItem("appointments", JSON.stringify([]))
  }

  // Initialize messages if not exists
  if (!localStorage.getItem("messages")) {
    localStorage.setItem("messages", JSON.stringify([]))
  }

  // Initialize notifications if not exists
  if (!localStorage.getItem("notifications")) {
    localStorage.setItem("notifications", JSON.stringify([]))
  }
}

export function getFromDB(key: string) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

export function saveToDB(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data))
}

