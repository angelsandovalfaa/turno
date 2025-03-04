"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Check } from "lucide-react"

export default function NotificationCenter({
  notifications,
  onClose,
  onMarkAsRead,
}: {
  notifications: any[]
  onClose: () => void
  onMarkAsRead: (id: string) => void
}) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notificaciones
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay notificaciones</div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${notification.read ? "bg-muted/50" : "border-l-4 border-l-primary"}`}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className={`font-medium ${notification.read ? "text-muted-foreground" : ""}`}>
                          {notification.title}
                        </div>
                        <div className="text-sm mt-1">{notification.message}</div>
                        <div className="text-xs text-muted-foreground mt-2">{formatTime(notification.timestamp)}</div>
                      </div>

                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

