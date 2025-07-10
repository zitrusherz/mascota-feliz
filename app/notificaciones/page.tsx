"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
    Bell,
    AlertTriangle,
    CheckCircle,
    X,
    Clock,
    Truck,
    Calendar,
    Star,
    Home,
    PawPrint,
    Settings,
    LogOut,
    ExternalLink,
    BarChart3
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Tipos para las notificaciones
interface NotificacionKRI {
    id: string
    tipo: "alta_demanda" | "veterinaria_movil" | "demoras_sucursal"
    titulo: string
    mensaje: string
    accion: string
    urgencia: "alta" | "media" | "baja"
    timestamp: string
    leida: boolean
}

interface Recordatorio {
    id: string
    tipo: "vacuna" | "control" | "confirmacion"
    titulo: string
    mensaje: string
    accion: string
    fechaVencimiento: string
    mascota: string
    urgente: boolean
    leida: boolean
}

interface ConfirmacionServicio {
    id: string
    tipo: "cita_agendada" | "veterinario_camino" | "examenes_listos"
    titulo: string
    mensaje: string
    timestamp: string
    leida: boolean
}

// Función para generar alertas KRI dinámicas
const generarAlertasKRI = (kpisPersonales: any): NotificacionKRI[] => {
    const alertas: NotificacionKRI[] = []

    // Alerta de alta demanda si tiempo de espera es bajo (indica eficiencia del servicio móvil)
    if (kpisPersonales.tiempoPromedioEspera < 20) {
        alertas.push({
            id: "KRI001",
            tipo: "alta_demanda",
            titulo: "⚠️ Alta demanda detectada",
            mensaje: "Hay alta demanda en sucursal. Reserve con 2 días de anticipación o use nuestro servicio móvil sin espera.",
            accion: "Ver disponibilidad móvil",
            urgencia: "media",
            timestamp: new Date().toISOString(),
            leida: false
        })
    }

    // Alerta de servicio móvil disponible
    alertas.push({
        id: "KRI002",
        tipo: "veterinaria_movil",
        titulo: "🚐 Veterinaria móvil disponible",
        mensaje: "Evite esperas en sucursal. Servicio móvil disponible en su zona con 3 slots libres hoy.",
        accion: "Agendar servicio móvil",
        urgencia: "baja",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
        leida: false
    })

    // Alerta de demoras si hay problemas
    if (Math.random() > 0.7) { // 30% de probabilidad
        alertas.push({
            id: "KRI003",
            tipo: "demoras_sucursal",
            titulo: "⏰ Demoras en sucursal",
            mensaje: "Detectamos demoras de 15-20 minutos en sucursal. Servicio móvil mantiene horarios normales.",
            accion: "Cambiar a servicio móvil",
            urgencia: "alta",
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
            leida: false
        })
    }

    return alertas
}

// Función para generar recordatorios
const generarRecordatorios = (mascotas: any[]): Recordatorio[] => {
    const recordatorios: Recordatorio[] = []

    mascotas.forEach((mascota, index) => {
        // Recordatorio de vacuna próxima
        const fechaVacuna = new Date(mascota.proximaVacuna)
        const hoy = new Date()
        const diasRestantes = Math.ceil((fechaVacuna.getTime() - hoy.getTime()) / (1000 * 3600 * 24))

        if (diasRestantes <= 30 && diasRestantes > 0) {
            recordatorios.push({
                id: `REC00${index + 1}`,
                tipo: "vacuna",
                titulo: "💉 Vacuna próxima",
                mensaje: `La vacuna de ${mascota.nombre} vence en ${diasRestantes} días. Agenda ahora para asegurar disponibilidad.`,
                accion: "Agendar vacuna",
                fechaVencimiento: mascota.proximaVacuna,
                mascota: mascota.nombre,
                urgente: diasRestantes <= 7,
                leida: false
            })
        }

        // Recordatorio de control post-operatorio (ejemplo)
        if (mascota.estadoSalud === "Seguimiento") {
            recordatorios.push({
                id: `REC00${index + 3}`,
                tipo: "control",
                titulo: "🏥 Control post-operatorio",
                mensaje: `${mascota.nombre} necesita control post-operatorio. Programa tu cita de seguimiento.`,
                accion: "Agendar control",
                fechaVencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 días
                mascota: mascota.nombre,
                urgente: false,
                leida: false
            })
        }
    })

    // Recordatorio de confirmación de cita (ejemplo)
    recordatorios.push({
        id: "REC004",
        tipo: "confirmacion",
        titulo: "📋 Confirme su cita",
        mensaje: "Recuerde su cita de mañana a las 10:00 AM para Max. Confirme su asistencia.",
        accion: "Confirmar cita",
        fechaVencimiento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // mañana
        mascota: "Max",
        urgente: true,
        leida: false
    })

    return recordatorios
}

// Función para generar confirmaciones
const generarConfirmaciones = (): ConfirmacionServicio[] => {
    return [
        {
            id: "CONF001",
            tipo: "cita_agendada",
            titulo: "🎉 Cita agendada exitosamente",
            mensaje: "Su cita para Luna ha sido confirmada para el 25 de julio a las 15:30. Recibirá recordatorio 1 hora antes.",
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min atrás
            leida: false
        },
        {
            id: "CONF002",
            tipo: "veterinario_camino",
            titulo: "🚐 Veterinaria móvil en camino",
            mensaje: "Dr. García está en camino a su domicilio. Llegada estimada: 15 minutos. Tel: +56 9 1234 5678",
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min atrás
            leida: false
        },
        {
            id: "CONF003",
            tipo: "examenes_listos",
            titulo: "📋 Exámenes listos para retirar",
            mensaje: "Los resultados de laboratorio de Rocky están disponibles. Puede retirarlos en sucursal o solicitar envío digital.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
            leida: false
        }
    ]
}

export default function NotificacionesPage() {
    const router = useRouter()
    const pathname = usePathname()
    const [clienteData, setClienteData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [alertasKRI, setAlertasKRI] = useState<NotificacionKRI[]>([])
    const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([])
    const [confirmaciones, setConfirmaciones] = useState<ConfirmacionServicio[]>([])
    const [filtroActivo, setFiltroActivo] = useState<"todas" | "no_leidas" | "urgentes">("todas")

    useEffect(() => {
        // Verificar sesión del cliente
        const session = localStorage.getItem("cliente_session")
        if (!session) {
            router.push("/iniciar-sesion")
            return
        }

        try {
            const sessionData = JSON.parse(session)
            setClienteData(sessionData)

            // Generar notificaciones dinámicas
            const alertas = generarAlertasKRI(sessionData.kpisPersonales || {})
            const recordatoriosList = generarRecordatorios(sessionData.mascotas || [])
            const confirmacionesList = generarConfirmaciones()

            setAlertasKRI(alertas)
            setRecordatorios(recordatoriosList)
            setConfirmaciones(confirmacionesList)
        } catch (error) {
            localStorage.removeItem("cliente_session")
            router.push("/iniciar-sesion")
            return
        }

        setLoading(false)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("cliente_session")
        router.push("/")
    }

    const marcarComoLeida = (tipo: "kri" | "recordatorio" | "confirmacion", id: string) => {
        switch (tipo) {
            case "kri":
                setAlertasKRI(prev => prev.map(alerta =>
                    alerta.id === id ? { ...alerta, leida: true } : alerta
                ))
                break
            case "recordatorio":
                setRecordatorios(prev => prev.map(rec =>
                    rec.id === id ? { ...rec, leida: true } : rec
                ))
                break
            case "confirmacion":
                setConfirmaciones(prev => prev.map(conf =>
                    conf.id === id ? { ...conf, leida: true } : conf
                ))
                break
        }
    }

    const getIconoNotificacion = (tipo: string) => {
        switch (tipo) {
            case "alta_demanda":
            case "demoras_sucursal":
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />
            case "veterinaria_movil":
                return <Truck className="h-5 w-5 text-blue-600" />
            case "vacuna":
                return <Calendar className="h-5 w-5 text-red-600" />
            case "control":
                return <Clock className="h-5 w-5 text-orange-600" />
            case "confirmacion":
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case "cita_agendada":
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case "veterinario_camino":
                return <Truck className="h-5 w-5 text-blue-600" />
            case "examenes_listos":
                return <Star className="h-5 w-5 text-purple-600" />
            default:
                return <Bell className="h-5 w-5 text-gray-600" />
        }
    }

    const getUrgenciaBadge = (urgencia: string) => {
        switch (urgencia) {
            case "alta":
                return <Badge className="bg-red-100 text-red-800">Alta</Badge>
            case "media":
                return <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>
            case "baja":
                return <Badge className="bg-green-100 text-green-800">Baja</Badge>
            default:
                return null
        }
    }

    const formatearTiempo = (timestamp: string) => {
        const ahora = new Date()
        const tiempo = new Date(timestamp)
        const diferencia = ahora.getTime() - tiempo.getTime()
        const minutos = Math.floor(diferencia / (1000 * 60))
        const horas = Math.floor(diferencia / (1000 * 60 * 60))

        if (minutos < 60) {
            return `Hace ${minutos} min`
        } else if (horas < 24) {
            return `Hace ${horas}h`
        } else {
            return tiempo.toLocaleDateString()
        }
    }

    // Filtrar notificaciones
    const todasLasNotificaciones = [
        ...alertasKRI.map(a => ({ ...a, categoria: "kri" as const })),
        ...recordatorios.map(r => ({ ...r, categoria: "recordatorio" as const })),
        ...confirmaciones.map(c => ({ ...c, categoria: "confirmacion" as const }))
    ].sort((a, b) => {
        const fechaA = new Date(a.timestamp || "").getTime()
        const fechaB = new Date(b.timestamp || "").getTime()
        return fechaB - fechaA
    })

    const notificacionesFiltradas = todasLasNotificaciones.filter(notif => {
        switch (filtroActivo) {
            case "no_leidas":
                return !notif.leida
            case "urgentes":
                return (notif.urgencia === "alta") || (notif.categoria === "recordatorio" && notif.urgente)
            default:
                return true
        }
    })

    const totalNoLeidas = todasLasNotificaciones.filter(n => !n.leida).length

    if (loading || !clienteData) {
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
                                <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
                                <p className="text-sm text-gray-600">Mascota Feliz</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{clienteData.nombre}</p>
                                <p className="text-xs text-gray-500">{clienteData.email}</p>
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
                                    href="/mi-cuenta"
                                    className={`flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100 ${
                                        pathname === '/mi-cuenta' ? 'bg-teal-50 text-teal-700 font-medium' : ''
                                    }`}
                                >
                                    <Home className="h-5 w-5" />
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mis-mascotas"
                                    className={`flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100 ${
                                        pathname === '/mis-mascotas' ? 'bg-teal-50 text-teal-700 font-medium' : ''
                                    }`}
                                >
                                    <PawPrint className="h-5 w-5" />
                                    <span>Mis Mascotas</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mis-citas"
                                    className={`flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100 ${
                                        pathname === '/mis-citas' ? 'bg-teal-50 text-teal-700 font-medium' : ''
                                    }`}
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span>Mis Citas</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/notificaciones"
                                    className={`flex items-center space-x-3 text-gray-700 p-2 rounded-md bg-teal-50 text-teal-700 font-medium ${
                                        pathname === '/notificaciones' ? 'bg-teal-50 text-teal-700 font-medium' : ''
                                    }`}
                                >
                                    <Bell className="h-5 w-5" />
                                    <span>Notificaciones</span>
                                    {totalNoLeidas > 0 && (
                                        <Badge className="bg-red-500 text-white text-xs">
                                            {totalNoLeidas}
                                        </Badge>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mi-dashboard"
                                    className={`flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100 ${
                                        pathname === '/mi-dashboard' ? 'bg-teal-50 text-teal-700 font-medium' : ''
                                    }`}
                                >
                                    <BarChart3 className="h-5 w-5" />
                                    <span>Mi Dashboard</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h2>
                        <p className="text-gray-600">Mantente al día con alertas, recordatorios y confirmaciones</p>
                    </div>

                    {/* Filtros */}
                    <div className="flex space-x-4 mb-6">
                        <Button
                            variant={filtroActivo === "todas" ? "default" : "outline"}
                            onClick={() => setFiltroActivo("todas")}
                            className={filtroActivo === "todas" ? "bg-teal-600 hover:bg-teal-700" : ""}
                        >
                            Todas ({todasLasNotificaciones.length})
                        </Button>
                        <Button
                            variant={filtroActivo === "no_leidas" ? "default" : "outline"}
                            onClick={() => setFiltroActivo("no_leidas")}
                            className={filtroActivo === "no_leidas" ? "bg-teal-600 hover:bg-teal-700" : ""}
                        >
                            No leídas ({totalNoLeidas})
                        </Button>
                        <Button
                            variant={filtroActivo === "urgentes" ? "default" : "outline"}
                            onClick={() => setFiltroActivo("urgentes")}
                            className={filtroActivo === "urgentes" ? "bg-teal-600 hover:bg-teal-700" : ""}
                        >
                            Urgentes
                        </Button>
                    </div>

                    {/* Lista de Notificaciones */}
                    <div className="space-y-4">
                        {notificacionesFiltradas.length === 0 ? (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        No hay notificaciones {filtroActivo === "todas" ? "" : filtroActivo.replace("_", " ")}
                                    </h3>
                                    <p className="text-gray-600">
                                        Cuando recibas nuevas alertas o recordatorios, aparecerán aquí.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            notificacionesFiltradas.map((notificacion) => (
                                <Card
                                    key={notificacion.id}
                                    className={`transition-all ${
                                        !notificacion.leida ? "border-l-4 border-l-teal-400 bg-teal-50/30" : ""
                                    }`}
                                >
                                    <CardContent className="pt-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                {getIconoNotificacion(notificacion.tipo)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 mb-1">
                                                            {notificacion.titulo}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {notificacion.mensaje}
                                                        </p>

                                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                            <span>{formatearTiempo(notificacion.timestamp || "")}</span>
                                                            {notificacion.urgencia && getUrgenciaBadge(notificacion.urgencia)}
                                                            {notificacion.categoria === "recordatorio" && notificacion.urgente && (
                                                                <Badge className="bg-red-100 text-red-800">Urgente</Badge>
                                                            )}
                                                            {notificacion.mascota && (
                                                                <Badge variant="outline">
                                                                    {notificacion.mascota}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-2 ml-4">
                                                        {!notificacion.leida && (
                                                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => marcarComoLeida(notificacion.categoria, notificacion.id)}
                                                            disabled={notificacion.leida}
                                                        >
                                                            {notificacion.leida ? (
                                                                <CheckCircle className="h-4 w-4" />
                                                            ) : (
                                                                <X className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {notificacion.accion && (
                                                    <div className="mt-3">
                                                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                                            {notificacion.accion}
                                                            <ExternalLink className="h-3 w-3 ml-1" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Marcar todas como leídas */}
                    {totalNoLeidas > 0 && (
                        <div className="mt-6 text-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setAlertasKRI(prev => prev.map(a => ({ ...a, leida: true })))
                                    setRecordatorios(prev => prev.map(r => ({ ...r, leida: true })))
                                    setConfirmaciones(prev => prev.map(c => ({ ...c, leida: true })))
                                }}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marcar todas como leídas
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}