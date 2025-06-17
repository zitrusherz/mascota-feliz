"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Calendar, 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  PawPrint,
  LogOut,
  Settings
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Datos simulados
const mockStats = {
  totalReservas: 156,
  reservasHoy: 12,
  fichasMedicas: 89,
  pacientesActivos: 234,
  reservasPendientes: 8,
  emergenciasSemanales: 3
}

const mockRecentReservas = [
  {
    id: "1",
    mascota: "Max",
    dueño: "Carlos García",
    servicio: "Consulta General",
    fecha: "2024-06-16",
    hora: "10:00",
    estado: "confirmada"
  },
  {
    id: "2",
    mascota: "Luna",
    dueño: "María López",
    servicio: "Vacunación",
    fecha: "2024-06-16",
    hora: "11:30",
    estado: "pendiente"
  },
  {
    id: "3",
    mascota: "Rocky",
    dueño: "Ana Martínez",
    servicio: "Peluquería",
    fecha: "2024-06-16",
    hora: "14:00",
    estado: "confirmada"
  },
  {
    id: "4",
    mascota: "Mimi",
    dueño: "Pedro Rodríguez",
    servicio: "Radiografía",
    fecha: "2024-06-17",
    hora: "09:15",
    estado: "pendiente"
  }
]

export default function PanelDashboard() {
  const router = useRouter()
  const [userSession, setUserSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "text-green-600 bg-green-50"
      case "pendiente":
        return "text-yellow-600 bg-yellow-50"
      case "cancelada":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
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
                  className="flex items-center space-x-3 text-gray-700 p-2 rounded-md bg-teal-50 text-teal-700 font-medium"
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
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Resumen general del día</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalReservas}</div>
                <p className="text-xs text-muted-foreground">+12% desde la semana pasada</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.reservasHoy}</div>
                <p className="text-xs text-muted-foreground">{mockStats.reservasPendientes} pendientes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fichas Médicas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.fichasMedicas}</div>
                <p className="text-xs text-muted-foreground">Actualizadas este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.pacientesActivos}</div>
                <p className="text-xs text-muted-foreground">+5 nuevos esta semana</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Próximas Reservas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Próximas Reservas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentReservas.map((reserva) => (
                    <div key={reserva.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{reserva.mascota}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(reserva.estado)}`}>
                            {reserva.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{reserva.dueño}</p>
                        <p className="text-sm text-gray-500">{reserva.servicio}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{reserva.fecha}</p>
                        <p className="text-sm text-gray-500">{reserva.hora}</p>
                      </div>
                    </div>
                  ))}
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/panel/reservas">Ver todas las reservas</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alertas y Notificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Alertas y Notificaciones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50 rounded">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                      <p className="text-sm font-medium text-yellow-800">
                        {mockStats.reservasPendientes} reservas pendientes de confirmación
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 border-l-4 border-red-400 bg-red-50 rounded">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      <p className="text-sm font-medium text-red-800">
                        {mockStats.emergenciasSemanales} emergencias esta semana
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 border-l-4 border-green-400 bg-green-50 rounded">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-sm font-medium text-green-800">
                        Sistema funcionando correctamente
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}