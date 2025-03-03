import { getFromDB, saveToDB } from "./database"

export function getNotifications(recipient: string) {
  const notifications = getFromDB("notifications")
  return notifications
    .filter((notification) => notification.recipient === recipient)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function createNotification(notificationData: any) {
  const notifications = getFromDB("notifications")

  const newNotification = {
    id: Date.now().toString(),
    ...notificationData,
  }

  notifications.push(newNotification)
  saveToDB("notifications", notifications)
  return newNotification
}

export function markNotificationAsRead(id: string) {
  const notifications = getFromDB("notifications")
  const updatedNotifications = notifications.map((notification) => {
    if (notification.id === id) {
      return { ...notification, read: true }
    }
    return notification
  })

  saveToDB("notifications", updatedNotifications)
}

