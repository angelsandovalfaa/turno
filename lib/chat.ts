import { getFromDB, saveToDB } from "./database"

export function getMessages(sender: string, recipient: string) {
  const messages = getFromDB("messages")
  return messages
    .filter(
      (message) =>
        (message.sender === sender && message.recipient === recipient) ||
        (message.sender === recipient && message.recipient === sender),
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export function sendMessage(messageData: any) {
  const messages = getFromDB("messages")
  messages.push(messageData)
  saveToDB("messages", messages)
  return messageData
}

