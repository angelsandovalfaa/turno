"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Trash } from "lucide-react"
import { createUser, deleteUser, getAllUsers, updateUser } from "@/lib/users"

export default function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [userToEdit, setUserToEdit] = useState(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    password: "",
    role: "assistant",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const allUsers = getAllUsers()
    setUsers(allUsers)
  }

  const handleOpenForm = (user = null) => {
    if (user) {
      setUserToEdit(user)
      setFormData({
        id: user.id,
        name: user.name,
        username: user.username,
        password: user.password,
        role: user.role,
      })
    } else {
      setUserToEdit(null)
      setFormData({
        id: "",
        name: "",
        username: "",
        password: "",
        role: "assistant",
      })
    }
    setShowUserForm(true)
  }

  const handleCloseForm = () => {
    setShowUserForm(false)
    setUserToEdit(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.username || !formData.password) {
      toast({
        title: "Error de validación",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    // Check if username already exists (for new users)
    if (!userToEdit) {
      const existingUser = users.find((u) => u.username === formData.username)
      if (existingUser) {
        toast({
          title: "Error de validación",
          description: "El nombre de usuario ya existe",
          variant: "destructive",
        })
        return
      }
    }

    try {
      if (userToEdit) {
        // Update existing user
        updateUser(formData)
        toast({
          title: "Usuario actualizado",
          description: `El usuario ${formData.name} ha sido actualizado correctamente`,
        })
      } else {
        // Create new user
        createUser({
          ...formData,
          id: Date.now().toString(),
        })
        toast({
          title: "Usuario creado",
          description: `El usuario ${formData.name} ha sido creado correctamente`,
        })
      }

      handleCloseForm()
      loadUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al guardar el usuario",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        deleteUser(userId)
        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido eliminado correctamente",
        })
        loadUsers()
      } catch (error) {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al eliminar el usuario",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Usuarios</CardTitle>
          <Button onClick={() => handleOpenForm()} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Nuevo Usuario
          </Button>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay usuarios registrados</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {user.role === "assistant"
                        ? "Ayudantía"
                        : user.role === "management"
                          ? "Jefatura"
                          : "Administrador"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenForm(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showUserForm && (
        <Dialog open={showUserForm} onOpenChange={handleCloseForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{userToEdit ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre de usuario"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingrese la contraseña"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assistant">Ayudantía</SelectItem>
                    <SelectItem value="management">Jefatura</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Cancelar
                </Button>
                <Button type="submit">{userToEdit ? "Guardar Cambios" : "Crear Usuario"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

