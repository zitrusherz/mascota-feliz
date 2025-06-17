"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Calendar, 
  Users, 
  FileText, 
  TrendingUp, 
  Search,
  Filter,
  Eye,
  Edit,
  Check,
  X,
  Phone,
  Mail,
  PawPrint,
  LogOut,
  Settings,
  Plus,
  Download
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/form/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Datos simulados más completos
const mockReservas = [
  {
    id: "R001",
    fecha: "2024-06-16",
    hora: "09:00",
    mascota: "Max",
    especie: "Perro",
    raza: "Golden Retriever",
    dueño: "Carlos García",
    telefono: "+56 9 1234 5678",
    email: "carlos.garcia@email.com",
    servicio: "Consulta General",
    tipo: "Sucursal",
    estado: "confirmada",
    notas: "Primera consulta, vacunas al día"
  },
  {
    id: "R002",
    fecha: "2024-06-16",
    hora: "10:30",
    mascota: "Luna",
    especie: "Gato",
    raza: "Persa",
    dueño: "María López",
    telefono: "+56 9 2345 6789",
    email: "maria.lopez@email.com",
    servicio: "Vacunación",
    tipo: "Sucursal",
    estado: "pendiente",
    notas: "Vacuna anual"
  },
  {
    id: "R003",
    fecha: "2024-06-16",
    hora: "11:00",
    mascota: "Rocky",
    especie: "Perro",
    raza: "Bulldog",
    dueño: "Ana Martínez",
    telefono: "+56 9 3456 7890",
    email: "ana.martinez@email.com",
    servicio: "Peluquería",
    tipo: "Sucursal",
    estado: "confirmada",
    notas: "Corte completo"
  },
  {
    id: "R004",
    fecha: "2024-06-16",
    hora: "14:00",
    mascota: "Mimi",
    especie: "Gato",
    raza: "Siamés",
    dueño: "Pedro Rodríguez",
    telefono: "+56 9 4567 8901",
    email: "pedro.rodriguez@email.com",
    servicio: "Radiografía",
    tipo: "Sucursal",
    estado: "pendiente",
    notas: "Revisión de cadera"
  },
  {
    id: "R005",
    fecha: "2024-06-16",
    hora: "15:30",
    mascota: "Toby",
    especie: "Perro",
    raza: "Labrador",
    dueño: "Sofía Herrera",
    telefono: "+56 9 5678 9012",
    email: "sofia.herrera@email.com",
    servicio: "Vacunación a Domicilio",
    tipo: "Móvil",
    estado: "confirmada",
    notas: "Domicilio: Las Condes 123"
  },
  {
    id: "R006",
    fecha: "2024-06-17",
    hora: "09:15",
    mascota: "Bella",
    especie: "Perro",
    raza: "Pastor Alemán",
    dueño: "Jorge Morales",
    telefono: "+56 9 6789 0123",
    email: "jorge.morales@email.com",
    servicio: "Cirugía",
    tipo: "Sucursal",
    estado: "pendiente",
    notas: "Esterilización programada"
  }
]

export default function PanelReservas() {
  const router = useRouter()
  const [userSession, setUserSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reservas, setReservas] = useState(mockReservas)
  const [filtroEstado, setFiltroEstado] = useState("todas")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReserva, setSelectedReserva] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Verificar sesión
    const session = localStorage.getItem("admin_session")
    if (!session) {
      router.push("/panel")
      return
    }
    
    try {
      const sessionData = JSON.parse(session)
      setUserSession(sessionData)
    } catch (error) {
      localStorage.removeItem("admin_session")
      router.push("/panel")
      return
    }
    
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    router.push("/panel")
  }

  const filteredReservas = reservas.filter(reserva => {
    const matchesSearch = 
      reserva.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.dueño.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = filtroEstado === "todas" || reserva.estado === filtroEstado
    const matchesTipo = filtroTipo === "todos" || reserva.tipo.toLowerCase() === filtroTipo.toLowerCase()
    
    return matchesSearch && matchesEstado && matchesTipo
  })

  const updateEstado = (id: string, nuevoEstado: string) => {
    setReservas(prev => 
      prev.map(reserva => 
        reserva.id === id 
          ? { ...reserva, estado: nuevoEstado }
          : reserva
      )
    )
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
      case "pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "cancelada":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
      case "completada":
        return <Badge className="bg-blue-100 text-blue-800">Completada</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{estado}</Badge>
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "veterinario":
        return "Veterinario"
      case "recepcion":
        return "Recepción"
      default:
        return "Usuario"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <PawPrint className="h-8 w-8 text-teal-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
                <p className="text-sm text-gray-600">Mascota Feliz</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userSession?.email}</p>
                <p className="text-xs text-gray-500">{getRoleDisplay(userSession?.role)}</p>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/panel/dashboard"
                  className="flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/panel/reservas"
                  className="flex items-center space-x-3 text-gray-700 p-2 rounded-md bg-teal-50 text-teal-700 font-medium"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Reservas</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/panel/fichas-medicas"
                  className="flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100"
                >
                  <FileText className="h-5 w-5" />
                  <span>Fichas Médicas</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/panel/pacientes"
                  className="flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100"
                >
                  <Users className="h-5 w-5" />
                  <span>Pacientes</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h2>
                <p className="text-gray-600">Administra todas las reservas de citas</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Reserva
                </Button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por mascota, dueño o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="confirmada">Confirmada</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="sucursal">Sucursal</SelectItem>
                    <SelectItem value="móvil">Móvil</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avanzados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de Reservas */}
          <Card>
            <CardHeader>
              <CardTitle>Reservas ({filteredReservas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Dueño</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservas.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell className="font-medium">{reserva.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reserva.fecha}</p>
                          <p className="text-sm text-gray-500">{reserva.hora}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reserva.mascota}</p>
                          <p className="text-sm text-gray-500">{reserva.especie} - {reserva.raza}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reserva.dueño}</p>
                          <p className="text-sm text-gray-500">{reserva.telefono}</p>
                        </div>
                      </TableCell>
                      <TableCell>{reserva.servicio}</TableCell>
                      <TableCell>
                        <Badge variant={reserva.tipo === "Móvil" ? "secondary" : "outline"}>
                          {reserva.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{getEstadoBadge(reserva.estado)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReserva(reserva)
                              setShowModal(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {reserva.estado === "pendiente" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateEstado(reserva.id, "confirmada")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateEstado(reserva.id, "cancelada")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedReserva && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Detalles de la Reserva</h3>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información de la Reserva</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">ID de Reserva:</span>
                      <p className="font-medium">{selectedReserva.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Fecha y Hora:</span>
                      <p className="font-medium">{selectedReserva.fecha} - {selectedReserva.hora}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Servicio:</span>
                      <p className="font-medium">{selectedReserva.servicio}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Tipo:</span>
                      <p className="font-medium">{selectedReserva.tipo}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Estado:</span>
                      <div className="mt-1">{getEstadoBadge(selectedReserva.estado)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información del Cliente</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Dueño:</span>
                      <p className="font-medium">{selectedReserva.dueño}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Teléfono:</span>
                      <p className="font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedReserva.telefono}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedReserva.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información de la Mascota</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Nombre:</span>
                      <p className="font-medium">{selectedReserva.mascota}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Especie:</span>
                      <p className="font-medium">{selectedReserva.especie}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Raza:</span>
                      <p className="font-medium">{selectedReserva.raza}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notas Adicionales</h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedReserva.notas}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cerrar
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                {selectedReserva.estado === "pendiente" && (
                  <Button 
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={() => {
                      updateEstado(selectedReserva.id, "confirmada")
                      setShowModal(false)
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar Reserva
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}