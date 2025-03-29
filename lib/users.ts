import { getFromDB, saveToDB } from "./database"

export interface User {
  id: string
  name: string
  username: string
  password: string
  role: "assistant" | "management" | "admin"
}

export function getAllUsers(): User[] {
  return getFromDB("users")
}

export function getUserById(id: string): User | undefined {
  const users = getAllUsers()
  return users.find((user) => user.id === id)
}

export function getUserByUsername(username: string): User | undefined {
  const users = getAllUsers()
  return users.find((user) => user.username === username)
}

export function createUser(userData: User): User {
  const users = getAllUsers()

  // Check if username already exists
  const existingUser = users.find((user) => user.username === userData.username)
  if (existingUser) {
    throw new Error("Username already exists")
  }

  users.push(userData)
  saveToDB("users", users)
  return userData
}

export function updateUser(userData: User): User {
  const users = getAllUsers()

  // Find user index
  const userIndex = users.findIndex((user) => user.id === userData.id)
  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Check if username already exists (for a different user)
  const existingUser = users.find((user) => user.username === userData.username && user.id !== userData.id)
  if (existingUser) {
    throw new Error("Username already exists")
  }

  // Update user
  users[userIndex] = userData
  saveToDB("users", users)
  return userData
}

export function deleteUser(id: string): void {
  const users = getAllUsers()
  const filteredUsers = users.filter((user) => user.id !== id)
  saveToDB("users", filteredUsers)
}

