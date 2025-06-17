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
  Plus,
  PawPrint,
  LogOut,
  Settings,
  Download,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity
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

// Datos simulados de pacientes
const mockPacientes = [
  {
    id: "P001",
    mascota: "Max",
    especie: "Perro",
    raza: "Golden Retriever",
    edad: "5 años",
    peso: "32 kg",
    sexo: "Macho",
    color: "Dorado",
    dueño: "Carlos García",
    telefono: "+56 9 1234 5678",
    email: "carlos.garcia@email.com",
    direccion: "Las Condes 123, Santiago",
    fechaRegistro: "2020-03-15",
    ultimaVisita: "2024-06-15",
    estadoSalud: "Saludable",
    totalVisitas: 15,
    proximaCita: "2024-08-16"
  },
  {
    id: "P002",
    mascota: "Luna",
    especie: "Gato",
    raza: "Persa",
    edad: "3 años",
    peso: "4.5 kg",
    sexo: "Hembra",
    color: "Blanco",
    dueño: "María López",
    telefono: "+56 9 2345 6789",
    email: "maria.lopez@email.com",
    direccion: "Providencia 456, Santiago",
    fechaRegistro: "2021-08-20",
    ultimaVisita: "2024-06-10",
    estadoSalud: "En tratamiento",
    totalVisitas: 8,
    proximaCita: "2024-06-20"
  },
  {
    id: "P003",
    mascota: "Rocky",
    especie: "Perro",
    raza: "Bulldog",
    edad: "7 años",
    peso: "25 kg",
    sexo: "Macho",
    color: "Atigrado",
    dueño: "Ana Martínez",
    telefono: "+56 9 3456 7890",
    email: "ana.martinez@email.com",
    direccion: "Ñuñoa 789, Santiago",
    fechaRegistro: "2018-05-10",
    ultimaVisita: "2024-06-12",
    estadoSalud: "Seguimiento",
    totalVisitas: 25,
    proximaCita: "2024-07-12"
  },
  {
    id: "P004",
    mascota: "Mimi",
    especie: "Gato",
    raza: "Siamés",
    edad: "2 años",
    peso: "3.8 kg",
    sexo: "Hembra",
    color: "Crema y marrón",
    dueño: "Pedro Rodríguez",
    telefono: "+56 9 4567 8901",
    email: "pedro.rodriguez@email.com",
    direccion: "San Bernardo 321, Santiago",
    fechaRegistro: "2022-01-15",
    ultimaVisita: "2024-06-14",
    estadoSalud: "Saludable",
    totalVisitas: 6,
    proximaCita: "2024-09-14"
  },
  {
    id: "P005",
    mascota: "Toby",
    especie: "Perro",
    raza: "Labrador",
    edad: "4 años",
    peso: "28 kg",
    sexo: "Macho",
    color: "Negro",
    dueño: "Sofía Herrera",
    telefono: "+56 9 5678 9012",
    email: "sofia.herrera@email.com",
    direccion: "Las Condes 987, Santiago",
    fechaRegistro: "2020-11-30",
    ultimaVisita: "2024-06-16",
    estadoSalud: "Saludable",
    totalVisitas: 12,
    proximaCita: "2024-07-15"
  }
]

export default function PanelPacientes() {
  const router = useRouter()
  const [userSession, setUserSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pacientes, setPacientes] = useState(mockPacientes)
  const [filtroEspecie, setFiltroEspecie] = useState("todas")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null)
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

  const filteredPacientes = pacientes.filter(paciente => {
    const matchesSearch = 
      paciente.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.dueño.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEspecie = filtroEspecie === "todas" || paciente.especie.toLowerCase() === filtroEspecie.toLowerCase()
    const matchesEstado = filtroEstado === "todos" || paciente.estadoSalud.toLowerCase() === filtroEstado.toLowerCase()
    
    return matchesSearch && matchesEspecie && matchesEstado
  })

  const getEstadoBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "saludable":
        return <Badge className="bg-green-100 text-green-800">Saludable</Badge>
      case "en tratamiento":
        return <Badge className="bg-yellow-100 text-yellow-800">En Tratamiento</Badge>
      case "seguimiento":
        return <Badge className="bg-blue-100 text-blue-800">Seguimiento</Badge>
      case "crítico":
        return <Badge className="bg-red-100 text-red-800">Crítico</Badge>
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

  const calculateAge = (fechaRegistro: string) => {
    const registro = new Date(fechaRegistro)
    const now = new Date()
    const years = Math.floor((now.getTime() - registro.getTime()) / (1000 * 3600 * 24 * 365))
    return `${years} años como paciente`
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
                  className="flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100"
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
                  className="flex items-center space-x-3 text-gray-700 p-2 rounded-md bg-teal-50 text-teal-700 font-medium"
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
                <h2 className="text-3xl font-bold text-gray-900">Registro de Pacientes</h2>
                <p className="text-gray-600">Gestiona la información de todas las mascotas registradas</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Lista
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Paciente
                </Button>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                    <p className="text-2xl font-bold text-gray-900">{pacientes.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <PawPrint className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Perros</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pacientes.filter(p => p.especie === "Perro").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Gatos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pacientes.filter(p => p.especie === "Gato").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En Tratamiento</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pacientes.filter(p => p.estadoSalud === "En tratamiento").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                
                <Select value={filtroEspecie} onValueChange={setFiltroEspecie}>
                  <SelectTrigger>
                    <SelectValue placeholder="Especie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las especies</SelectItem>
                    <SelectItem value="perro">Perro</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                    <SelectItem value="ave">Ave</SelectItem>
                    <SelectItem value="roedor">Roedor</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado de salud" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="saludable">Saludable</SelectItem>
                    <SelectItem value="en tratamiento">En Tratamiento</SelectItem>
                    <SelectItem value="seguimiento">Seguimiento</SelectItem>
                    <SelectItem value="crítico">Crítico</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avanzados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de Pacientes */}
          <Card>
            <CardHeader>
              <CardTitle>Pacientes Registrados ({filteredPacientes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Especie/Raza</TableHead>
                    <TableHead>Edad/Peso</TableHead>
                    <TableHead>Última Visita</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total Visitas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPacientes.map((paciente) => (
                    <TableRow key={paciente.id}>
                      <TableCell className="font-medium">{paciente.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{paciente.mascota}</p>
                          <p className="text-sm text-gray-500">{paciente.sexo} • {paciente.color}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{paciente.dueño}</p>
                          <p className="text-sm text-gray-500">{paciente.telefono}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{paciente.especie}</p>
                          <p className="text-sm text-gray-500">{paciente.raza}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{paciente.edad}</p>
                          <p className="text-sm text-gray-500">{paciente.peso}</p>
                        </div>
                      </TableCell>
                      <TableCell>{paciente.ultimaVisita}</TableCell>
                      <TableCell>{getEstadoBadge(paciente.estadoSalud)}</TableCell>
                      <TableCell className="text-center">{paciente.totalVisitas}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPaciente(paciente)
                              setShowModal(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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

      {/* Modal de Detalles del Paciente */}
      {showModal && selectedPaciente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Perfil del Paciente - {selectedPaciente.mascota}</h3>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información Principal */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PawPrint className="h-5 w-5 mr-2" />
                        Información de la Mascota
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nombre</p>
                        <p className="font-medium text-lg">{selectedPaciente.mascota}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ID de Paciente</p>
                        <p className="font-medium">{selectedPaciente.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Especie</p>
                        <p className="font-medium">{selectedPaciente.especie}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Raza</p>
                        <p className="font-medium">{selectedPaciente.raza}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Edad</p>
                        <p className="font-medium">{selectedPaciente.edad}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Peso</p>
                        <p className="font-medium">{selectedPaciente.peso}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sexo</p>
                        <p className="font-medium">{selectedPaciente.sexo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Color</p>
                        <p className="font-medium">{selectedPaciente.color}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Información del Propietario
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Nombre Completo</p>
                        <p className="font-medium">{selectedPaciente.dueño}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Teléfono</p>
                          <p className="font-medium flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {selectedPaciente.telefono}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {selectedPaciente.email}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dirección</p>
                        <p className="font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {selectedPaciente.direccion}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Información secundaria, por ejemplo, historial de visitas, próximas citas, etc. */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Detalles de Registro
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Registro</p>
                        <p className="font-medium">{selectedPaciente.fechaRegistro}</p>
                        <p className="text-xs text-gray-500">{calculateAge(selectedPaciente.fechaRegistro)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Próxima Cita</p>
                        <p className="font-medium">{selectedPaciente.proximaCita}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Estado de Salud
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getEstadoBadge(selectedPaciente.estadoSalud)}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
