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
  Heart,
  Activity,
  Syringe,
  Stethoscope,
  ClipboardList,
  AlertTriangle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Textarea } from "@/components/ui/form/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"

// Datos simulados de fichas médicas
const mockFichasMedicas = [
  {
    id: "FM001",
    mascota: "Max",
    especie: "Perro",
    raza: "Golden Retriever",
    edad: "5 años",
    peso: "32 kg",
    dueño: "Carlos García",
    telefono: "+56 9 1234 5678",
    ultimaVisita: "2024-06-15",
    proximaVacuna: "2024-12-15",
    estado: "Saludable",
    alergias: ["Pollo"],
    vacunas: [
      { nombre: "Rabia", fecha: "2024-06-15", proxima: "2025-06-15" },
      { nombre: "Múltiple", fecha: "2024-06-15", proxima: "2025-06-15" }
    ],
    tratamientos: [
      { fecha: "2024-06-15", motivo: "Consulta rutinaria", diagnostico: "Saludable", tratamiento: "Ninguno" }
    ],
    observaciones: "Paciente muy dócil, excelente estado general"
  },
  {
    id: "FM002",
    mascota: "Luna",
    especie: "Gato",
    raza: "Persa",
    edad: "3 años",
    peso: "4.5 kg",
    dueño: "María López",
    telefono: "+56 9 2345 6789",
    ultimaVisita: "2024-06-10",
    proximaVacuna: "2024-11-10",
    estado: "En tratamiento",
    alergias: [],
    vacunas: [
      { nombre: "Triple Felina", fecha: "2024-05-10", proxima: "2024-11-10" },
      { nombre: "Leucemia", fecha: "2024-05-10", proxima: "2024-11-10" }
    ],
    tratamientos: [
      { fecha: "2024-06-10", motivo: "Infección respiratoria", diagnostico: "Rinotraqueitis felina", tratamiento: "Antibióticos por 7 días" }
    ],
    observaciones: "Paciente con tendencia a problemas respiratorios"
  },
  {
    id: "FM003",
    mascota: "Rocky",
    especie: "Perro",
    raza: "Bulldog",
    edad: "7 años",
    peso: "25 kg",
    dueño: "Ana Martínez",
    telefono: "+56 9 3456 7890",
    ultimaVisita: "2024-06-12",
    proximaVacuna: "2024-08-12",
    estado: "Seguimiento",
    alergias: ["Soja", "Trigo"],
    vacunas: [
      { nombre: "Rabia", fecha: "2024-02-12", proxima: "2025-02-12" },
      { nombre: "Múltiple", fecha: "2024-02-12", proxima: "2025-02-12" }
    ],
    tratamientos: [
      { fecha: "2024-06-12", motivo: "Control de peso", diagnostico: "Sobrepeso", tratamiento: "Dieta específica y ejercicio" }
    ],
    observaciones: "Requiere control de peso mensual"
  },
  {
    id: "FM004",
    mascota: "Mimi",
    especie: "Gato",
    raza: "Siamés",
    edad: "2 años",
    peso: "3.8 kg",
    dueño: "Pedro Rodríguez",
    telefono: "+56 9 4567 8901",
    ultimaVisita: "2024-06-14",
    proximaVacuna: "2024-09-14",
    estado: "Saludable",
    alergias: [],
    vacunas: [
      { nombre: "Triple Felina", fecha: "2024-03-14", proxima: "2024-09-14" }
    ],
    tratamientos: [
      { fecha: "2024-06-14", motivo: "Esterilización", diagnostico: "Cirugía exitosa", tratamiento: "Cuidados post-operatorios" }
    ],
    observaciones: "Recuperación post-quirúrgica normal"
  }
]

export default function PanelFichasMedicas() {
  const router = useRouter()
  const [userSession, setUserSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fichasMedicas, setFichasMedicas] = useState(mockFichasMedicas)
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroEspecie, setFiltroEspecie] = useState("todas")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFicha, setSelectedFicha] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showNewTreatment, setShowNewTreatment] = useState(false)
  const [newTreatment, setNewTreatment] = useState({
    fecha: new Date().toISOString().split('T')[0],
    motivo: "",
    diagnostico: "",
    tratamiento: ""
  })

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

  const filteredFichas = fichasMedicas.filter(ficha => {
    const matchesSearch = 
      ficha.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ficha.dueño.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ficha.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = filtroEstado === "todos" || ficha.estado.toLowerCase() === filtroEstado.toLowerCase()
    const matchesEspecie = filtroEspecie === "todas" || ficha.especie.toLowerCase() === filtroEspecie.toLowerCase()
    
    return matchesSearch && matchesEstado && matchesEspecie
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

  const addNewTreatment = () => {
    if (selectedFicha && newTreatment.motivo && newTreatment.diagnostico) {
      const updatedFichas = fichasMedicas.map(ficha => 
        ficha.id === selectedFicha.id 
          ? {
              ...ficha,
              tratamientos: [newTreatment, ...ficha.tratamientos],
              ultimaVisita: newTreatment.fecha
            }
          : ficha
      )
      setFichasMedicas(updatedFichas)
      setSelectedFicha({
        ...selectedFicha,
        tratamientos: [newTreatment, ...selectedFicha.tratamientos],
        ultimaVisita: newTreatment.fecha
      })
      setNewTreatment({
        fecha: new Date().toISOString().split('T')[0],
        motivo: "",
        diagnostico: "",
        tratamiento: ""
      })
      setShowNewTreatment(false)
    }
  }

  const isVaccinationDue = (proximaVacuna: string) => {
    const today = new Date()
    const dueDate = new Date(proximaVacuna)
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysDiff <= 30
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
                  className="flex items-center space-x-3 text-gray-700 p-2 rounded-md bg-teal-50 text-teal-700 font-medium"
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
                <h2 className="text-3xl font-bold text-gray-900">Fichas Médicas</h2>
                <p className="text-gray-600">Historial médico completo de cada paciente</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Ficha
                </Button>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Fichas</p>
                    <p className="text-2xl font-bold text-gray-900">{fichasMedicas.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pacientes Saludables</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {fichasMedicas.filter(f => f.estado === "Saludable").length}
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
                      {fichasMedicas.filter(f => f.estado === "En tratamiento").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Syringe className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Vacunas Próximas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {fichasMedicas.filter(f => isVaccinationDue(f.proximaVacuna)).length}
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

                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avanzados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de Fichas Médicas */}
          <Card>
            <CardHeader>
              <CardTitle>Fichas Médicas ({filteredFichas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Dueño</TableHead>
                    <TableHead>Especie/Raza</TableHead>
                    <TableHead>Edad/Peso</TableHead>
                    <TableHead>Última Visita</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Próxima Vacuna</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFichas.map((ficha) => (
                    <TableRow key={ficha.id}>
                      <TableCell className="font-medium">{ficha.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ficha.mascota}</p>
                          {ficha.alergias.length > 0 && (
                            <div className="flex items-center mt-1">
                              <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                              <span className="text-xs text-red-600">Alergias</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ficha.dueño}</p>
                          <p className="text-sm text-gray-500">{ficha.telefono}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ficha.especie}</p>
                          <p className="text-sm text-gray-500">{ficha.raza}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ficha.edad}</p>
                          <p className="text-sm text-gray-500">{ficha.peso}</p>
                        </div>
                      </TableCell>
                      <TableCell>{ficha.ultimaVisita}</TableCell>
                      <TableCell>{getEstadoBadge(ficha.estado)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{ficha.proximaVacuna}</p>
                          {isVaccinationDue(ficha.proximaVacuna) && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              Próxima
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFicha(ficha)
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

      {/* Modal de Ficha Médica Completa */}
      {showModal && selectedFicha && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Ficha Médica - {selectedFicha.mascota}</h3>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  ✕
                </Button>
              </div>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="tratamientos">Tratamientos</TabsTrigger>
                  <TabsTrigger value="vacunas">Vacunas</TabsTrigger>
                  <TabsTrigger value="observaciones">Observaciones</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PawPrint className="h-5 w-5 mr-2" />
                          Datos de la Mascota
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-600">Nombre</Label>
                          <p className="font-medium">{selectedFicha.mascota}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Especie</Label>
                          <p className="font-medium">{selectedFicha.especie}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Raza</Label>
                          <p className="font-medium">{selectedFicha.raza}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Edad</Label>
                          <p className="font-medium">{selectedFicha.edad}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Peso</Label>
                          <p className="font-medium">{selectedFicha.peso}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Estado de Salud</Label>
                          <div className="mt-1">{getEstadoBadge(selectedFicha.estado)}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Datos del Propietario
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-600">Nombre</Label>
                          <p className="font-medium">{selectedFicha.dueño}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Teléfono</Label>
                          <p className="font-medium">{selectedFicha.telefono}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Última Visita</Label>
                          <p className="font-medium">{selectedFicha.ultimaVisita}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Alergias</Label>
                          <div className="mt-1">
                            {selectedFicha.alergias.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {selectedFicha.alergias.map((alergia, index) => (
                                  <Badge key={index} variant="destructive" className="text-xs">
                                    {alergia}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Sin alergias conocidas</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="tratamientos" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">Historial de Tratamientos</h4>
                      <Button 
                        onClick={() => setShowNewTreatment(true)}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Tratamiento
                      </Button>
                    </div>

                    {showNewTreatment && (
                      <Card className="border-teal-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Nuevo Tratamiento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="fecha">Fecha</Label>
                              <Input
                                id="fecha"
                                type="date"
                                value={newTreatment.fecha}
                                onChange={(e) => setNewTreatment({...newTreatment, fecha: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="motivo">Motivo de Consulta</Label>
                              <Input
                                id="motivo"
                                value={newTreatment.motivo}
                                onChange={(e) => setNewTreatment({...newTreatment, motivo: e.target.value})}
                                placeholder="Ej: Control rutinario, síntomas..."
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="diagnostico">Diagnóstico</Label>
                            <Textarea
                              id="diagnostico"
                              value={newTreatment.diagnostico}
                              onChange={(e) => setNewTreatment({...newTreatment, diagnostico: e.target.value})}
                              placeholder="Diagnóstico detallado..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="tratamiento">Tratamiento</Label>
                            <Textarea
                              id="tratamiento"
                              value={newTreatment.tratamiento}
                              onChange={(e) => setNewTreatment({...newTreatment, tratamiento: e.target.value})}
                              placeholder="Tratamiento prescrito, medicamentos, instrucciones..."
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setShowNewTreatment(false)}
                            >
                              Cancelar
                            </Button>
                            <Button 
                              onClick={addNewTreatment}
                              className="bg-teal-600 hover:bg-teal-700"
                            >
                              Guardar Tratamiento
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-3">
                      {selectedFicha.tratamientos.map((tratamiento, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-semibold text-lg">{tratamiento.motivo}</h5>
                              <Badge variant="outline">{tratamiento.fecha}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Diagnóstico</Label>
                                <p className="mt-1">{tratamiento.diagnostico}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Tratamiento</Label>
                                <p className="mt-1">{tratamiento.tratamiento}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="vacunas" className="mt-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Registro de Vacunas</h4>
                    <div className="grid gap-4">
                      {selectedFicha.vacunas.map((vacuna, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-semibold">{vacuna.nombre}</h5>
                                <p className="text-sm text-gray-600">
                                  Aplicada: {vacuna.fecha}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">Próxima dosis:</p>
                                <p className="font-medium">{vacuna.proxima}</p>
                                {isVaccinationDue(vacuna.proxima) && (
                                  <Badge variant="destructive" className="mt-1">
                                    Próxima a vencer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="observaciones" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Observaciones Generales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={selectedFicha.observaciones}
                        readOnly
                        className="min-h-[200px]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cerrar
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Ficha
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}