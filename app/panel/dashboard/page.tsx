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
  Settings,
  Bell,
  Send,
  Truck,
  Star,
  Activity,
  Zap,
  RefreshCw
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/form/input"
import { Textarea } from "@/components/ui/form/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { useAdminSync, simulateAdminActions, simulateClientActions } from "@/lib/sync-system"

export default function PanelDashboard() {
  const router = useRouter()
  const [userSession, setUserSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<string>("")
  const [selectedClient, setSelectedClient] = useState<string>("")

  // Hook de sincronización
  const { recentActivity, kpis, agendarCita, confirmarCita, movilEnRuta, actualizarKRI } = useAdminSync()

  // Datos simulados con clientes reales
  const mockStats = {
    totalReservas: kpis.totalReservas || 156,
    reservasHoy: 12,
    fichasMedicas: 89,
    pacientesActivos: 234,
    reservasPendientes: 8,
    emergenciasSemanales: 3,
    satisfaccionPromedio: kpis.satisfaccionPromedio || 4.5,
    cancelaciones: kpis.cancelaciones || 5
  }

  const clientesActivos = [
    { email: "carlos.garcia@email.com", nombre: "Carlos García", mascota: "Max" },
    { email: "maria.lopez@email.com", nombre: "María López", mascota: "Luna" },
    { email: "ana.martinez@email.com", nombre: "Ana Martínez", mascota: "Rocky" }
  ]

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

    // Simular acciones automáticas para la demo (solo una vez)
    const hasSimulated = localStorage.getItem('demo_simulated')
    if (!hasSimulated) {
      setTimeout(() => {
        simulateAdminActions()
        simulateClientActions()
        localStorage.setItem('demo_simulated', 'true')
      }, 2000)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    router.push("/panel")
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

  const executeAction = () => {
    const cliente = clientesActivos.find(c => c.email === selectedClient)
    if (!cliente) return

    switch (actionType) {
      case "agenda_cita":
        agendarCita({
          mascota: cliente.mascota,
          fecha: "2024-07-20",
          hora: "10:30",
          servicio: "Consulta General",
          veterinario: "Dr. González"
        }, selectedClient)
        break

      case "confirma_cita":
        confirmarCita({
          mascota: cliente.mascota,
          fecha: "2024-07-18",
          hora: "14:00"
        }, selectedClient)
        break

      case "movil_en_ruta":
        movilEnRuta({
          veterinario: "Dr. García",
          tiempoEstimado: 15,
          ubicacion: "A 2 km de su domicilio"
        }, selectedClient)
        break

      case "actualiza_kri":
        actualizarKRI({
          titulo: "Alta demanda detectada",
          mensaje: "Recomendamos usar servicio móvil para evitar esperas en sucursal",
          urgencia: "media"
        }, selectedClient)
        break
    }

    setShowActionModal(false)
    setActionType("")
    setSelectedClient("")
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "nueva_reserva":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "nueva_calificacion":
        return <Star className="h-4 w-4 text-yellow-600" />
      case "cita_cancelada":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "confirmacion_cliente":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return "Ahora"
    if (minutes < 60) return `Hace ${minutes} min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Hace ${hours}h`
    return time.toLocaleDateString()
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Dashboard en Tiempo Real</h2>
                  <p className="text-gray-600">Sincronización automática con portales de clientes</p>
                </div>

                {/* Controles de Sincronización */}
                <div className="flex space-x-3">
                  <Button
                      variant="outline"
                      onClick={() => setShowActionModal(true)}
                      className="bg-blue-50 text-blue-600 border-blue-200"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Acción a Cliente
                  </Button>
                  <Button
                      variant="outline"
                      onClick={() => {
                        simulateAdminActions()
                        simulateClientActions()
                      }}
                      className="bg-green-50 text-green-600 border-green-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Simular Actividad
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards - Actualizados en tiempo real */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{mockStats.totalReservas}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +12% desde la semana pasada
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfacción Promedio</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{mockStats.satisfaccionPromedio}/5</div>
                  <p className="text-xs text-muted-foreground">
                    Actualizado por clientes en tiempo real
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockStats.reservasHoy}</div>
                  <p className="text-xs text-muted-foreground">{mockStats.reservasPendientes} pendientes</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{mockStats.pacientesActivos}</div>
                  <p className="text-xs text-muted-foreground">+5 nuevos esta semana</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Actividad en Tiempo Real */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>Actividad en Tiempo Real</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">LIVE</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {recentActivity.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No hay actividad reciente</p>
                          <p className="text-xs">Las acciones de los clientes aparecerán aquí</p>
                        </div>
                    ) : (
                        recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              {getActivityIcon(activity.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.mensaje}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatTimeAgo(activity.timestamp)}
                                </p>
                                {activity.data && (
                                    <div className="mt-1 text-xs text-gray-600">
                                      {Object.entries(activity.data).slice(0, 2).map(([key, value]) => (
                                          <span key={key} className="mr-3">
                                  {key}: {String(value)}
                                </span>
                                      ))}
                                    </div>
                                )}
                              </div>
                            </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Panel de Control de Sincronización */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-blue-500" />
                    <span>Control de Clientes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Clientes Conectados</h4>
                      <div className="space-y-2">
                        {clientesActivos.map((cliente) => (
                            <div key={cliente.email} className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <div>
                                <p className="text-sm font-medium">{cliente.nombre}</p>
                                <p className="text-xs text-gray-500">{cliente.mascota}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600">Online</span>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Acciones Rápidas</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              actualizarKRI({
                                titulo: "Alta demanda en sucursal",
                                mensaje: "Recomendamos servicio móvil",
                                urgencia: "alta"
                              }, "carlos.garcia@email.com")
                            }}
                            className="text-xs"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Alerta KRI
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              movilEnRuta({
                                veterinario: "Dr. Silva",
                                tiempoEstimado: 10,
                                ubicacion: "Muy cerca"
                              }, "maria.lopez@email.com")
                            }}
                            className="text-xs"
                        >
                          <Truck className="h-3 w-3 mr-1" />
                          Móvil en Ruta
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              confirmarCita({
                                mascota: "Rocky",
                                fecha: "2024-07-19",
                                hora: "11:00"
                              }, "ana.martinez@email.com")
                            }}
                            className="text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirmar Cita
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              agendarCita({
                                mascota: "Max",
                                fecha: "2024-07-21",
                                hora: "16:00",
                                servicio: "Peluquería"
                              }, "carlos.garcia@email.com")
                            }}
                            className="text-xs"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Agendar Cita
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-900 mb-1">💡 Tip de Sincronización</h5>
                        <p className="text-xs text-blue-700">
                          Todas las acciones que realices aquí se reflejan instantáneamente en los portales de los clientes.
                          Los clientes recibirán notificaciones push automáticas.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métricas de Sincronización */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-green-500" />
                  <span>Estado de Sincronización</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-800">Sistema Activo</h4>
                    <p className="text-sm text-green-600">Sincronización en tiempo real</p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-800">Clientes Online</h4>
                    <p className="text-sm text-blue-600">{clientesActivos.length} conectados</p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-purple-800">Eventos Hoy</h4>
                    <p className="text-sm text-purple-600">{recentActivity.length} sincronizaciones</p>
                  </div>

                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-medium text-yellow-800">Latencia Promedio</h4>
                    <p className="text-sm text-yellow-600">100ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>

        {/* Modal para Acciones Personalizadas */}
        {showActionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Enviar Acción a Cliente</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cliente</label>
                      <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientesActivos.map((cliente) => (
                              <SelectItem key={cliente.email} value={cliente.email}>
                                {cliente.nombre} ({cliente.mascota})
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Acción</label>
                      <Select value={actionType} onValueChange={setActionType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona acción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agenda_cita">Agendar Cita</SelectItem>
                          <SelectItem value="confirma_cita">Confirmar Cita</SelectItem>
                          <SelectItem value="movil_en_ruta">Móvil en Ruta</SelectItem>
                          <SelectItem value="actualiza_kri">Enviar Alerta KRI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={() => setShowActionModal(false)}>
                      Cancelar
                    </Button>
                    <Button
                        onClick={executeAction}
                        disabled={!selectedClient || !actionType}
                        className="bg-teal-600 hover:bg-teal-700"
                    >
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}