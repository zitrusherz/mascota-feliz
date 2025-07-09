"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    Calendar,
    Users,
    Settings,
    LogOut,
    PawPrint,
    Bell,
    Clock,
    MapPin,
    Star,
    Syringe,
    Heart,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Truck,
    Home,
    Phone,
    CalendarCheck,
    Activity,
    DollarSign,
    Award
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Función para generar próximas citas basadas en las mascotas del usuario
const generarProximasCitas = (mascotas: any[]) => {
    const citasBase = [
        { servicio: "Control rutinario", tipo: "Sucursal", veterinario: "Dr. González" },
        { servicio: "Vacunación", tipo: "Móvil", veterinario: "Dra. Martínez" },
        { servicio: "Peluquería", tipo: "Sucursal", veterinario: "Estilista Ana" }
    ]

    return mascotas.slice(0, 2).map((mascota, index) => ({
        id: `C00${index + 1}`,
        mascota: mascota.nombre,
        fecha: new Date(Date.now() + (index + 1) * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        hora: index === 0 ? "10:00" : "15:30",
        ...citasBase[index]
    }))
}

// Función para generar alertas dinámicas
const generarAlertas = (mascotas: any[], kpis: any) => {
    const alertas = []

    // Alerta de alta demanda si tiempo de espera es bajo
    if (kpis.tiempoPromedioEspera < 20) {
        alertas.push({
            id: "A001",
            tipo: "info",
            titulo: "Servicio móvil disponible",
            mensaje: "Alta demanda detectada en sucursal. Te recomendamos usar nuestro servicio móvil para evitar esperas.",
            accion: "Agendar móvil",
            urgencia: "media"
        })
    }

    // Alerta de vacunas próximas
    mascotas.forEach((mascota, index) => {
        const fechaVacuna = new Date(mascota.proximaVacuna)
        const hoy = new Date()
        const diasRestantes = Math.ceil((fechaVacuna.getTime() - hoy.getTime()) / (1000 * 3600 * 24))

        if (diasRestantes <= 30 && diasRestantes > 0) {
            alertas.push({
                id: `A00${index + 2}`,
                tipo: "warning",
                titulo: "Vacuna próxima",
                mensaje: `La vacuna de ${mascota.nombre} vence en ${diasRestantes} días. Agenda ahora para asegurar disponibilidad.`,
                accion: "Agendar vacuna",
                urgencia: "alta"
            })
        }
    })

    return alertas
}

// Estado de servicios en tiempo real (simulado)
const estadoServiciosSimulado = {
    sucursal: "normal", // normal, ocupado, critico
    servicioMovil: "disponible", // disponible, ocupado, no_disponible
    farmacia: "normal",
    laboratorio: "demora" // normal, demora, critico
}

export default function ClienteDashboard() {
    const router = useRouter()
    const [clienteData, setClienteData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [userSession, setUserSession] = useState<any>(null)

    useEffect(() => {
        // Verificar sesión del cliente
        const session = localStorage.getItem("cliente_session")
        if (!session) {
            router.push("/iniciar-sesion")
            return
        }

        try {
            const sessionData = JSON.parse(session)
            setUserSession(sessionData)

            // Construir datos del cliente desde la sesión
            const proximasCitas = generarProximasCitas(sessionData.mascotas || [])
            const alertasActivas = generarAlertas(sessionData.mascotas || [], sessionData.kpisPersonales || {})

            // Agregar fotos placeholder a las mascotas
            const mascotasConFoto = sessionData.mascotas?.map((mascota: any) => ({
                ...mascota,
                foto: "/placeholder.svg?height=80&width=80"
            })) || []

            setClienteData({
                usuario: {
                    nombre: sessionData.nombre,
                    email: sessionData.email,
                    telefono: sessionData.telefono,
                    direccion: sessionData.direccion,
                    fechaRegistro: sessionData.fechaRegistro
                },
                mascotas: mascotasConFoto,
                proximasCitas,
                kpisPersonales: sessionData.kpisPersonales || {
                    tiempoPromedioEspera: 25,
                    satisfaccionHistorica: 4.5,
                    ahorroServicioMovil: 0,
                    visitasEsteAno: 0,
                    vacunasAlDia: true,
                    descuentosDisponibles: 5
                },
                alertasActivas,
                estadoServicios: estadoServiciosSimulado
            })
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

    const getAlertIcon = (tipo: string) => {
        switch (tipo) {
            case "warning":
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />
            case "info":
                return <Bell className="h-5 w-5 text-blue-600" />
            case "success":
                return <CheckCircle className="h-5 w-5 text-green-600" />
            default:
                return <Bell className="h-5 w-5 text-gray-600" />
        }
    }

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case "normal":
                return "text-green-600 bg-green-50"
            case "ocupado":
            case "demora":
                return "text-yellow-600 bg-yellow-50"
            case "critico":
            case "no_disponible":
                return "text-red-600 bg-red-50"
            case "disponible":
                return "text-blue-600 bg-blue-50"
            default:
                return "text-gray-600 bg-gray-50"
        }
    }

    const getEstadoTexto = (servicio: string, estado: string) => {
        const textos = {
            sucursal: {
                normal: "Tiempo normal",
                ocupado: "Alta demanda",
                critico: "Saturado"
            },
            servicioMovil: {
                disponible: "3 slots disponibles hoy",
                ocupado: "Últimos slots",
                no_disponible: "No disponible"
            },
            farmacia: {
                normal: "Stock completo",
                demora: "Producto en camino",
                critico: "Stock limitado"
            },
            laboratorio: {
                normal: "Resultados en 24h",
                demora: "Demora 2 horas",
                critico: "Sistema en mantención"
            }
        }

        return textos[servicio]?.[estado] || estado
    }

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
                                <h1 className="text-2xl font-bold text-gray-900">Mi Cuenta</h1>
                                <p className="text-sm text-gray-600">Mascota Feliz</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{clienteData.usuario.nombre}</p>
                                <p className="text-xs text-gray-500">{clienteData.usuario.email}</p>
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
                                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md bg-teal-50 text-teal-700 font-medium"
                                >
                                    <Home className="h-5 w-5" />
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mis-mascotas"
                                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100"
                                >
                                    <PawPrint className="h-5 w-5" />
                                    <span>Mis Mascotas</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mis-citas"
                                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100"
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span>Mis Citas</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/notificaciones"
                                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span>Notificaciones</span>
                                    {clienteData.alertasActivas.length > 0 ? (
                                        <Badge className="bg-red-500 text-white text-xs">
                                            {clienteData.alertasActivas.length}
                                        </Badge>
                                    ) : null}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">¡Hola, {clienteData.usuario.nombre}!</h2>
                        <p className="text-gray-600">Aquí tienes un resumen de todo lo importante sobre tus mascotas</p>
                    </div>

                    {/* Alertas Activas KRI */}
                    {clienteData.alertasActivas.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">🚨 Alertas Importantes</h3>
                            <div className="space-y-3">
                                {clienteData.alertasActivas.map((alerta) => (
                                    <Card key={alerta.id} className="border-l-4 border-l-yellow-400">
                                        <CardContent className="pt-4">
                                            <div className="flex items-start space-x-3">
                                                {getAlertIcon(alerta.tipo)}
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{alerta.titulo}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{alerta.mensaje}</p>
                                                </div>
                                                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                                    {alerta.accion}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* KPIs Personales del Cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tu Tiempo de Espera</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-teal-600">{clienteData.kpisPersonales.tiempoPromedioEspera} min</div>
                                <p className="text-xs text-muted-foreground">50% menos que el promedio</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tu Satisfacción</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{clienteData.kpisPersonales.satisfaccionHistorica}/5</div>
                                <p className="text-xs text-muted-foreground">Excelente historial</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ahorro con Móvil</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">${clienteData.kpisPersonales.ahorroServicioMovil.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">En transporte este año</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Descuentos</CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">{clienteData.kpisPersonales.descuentosDisponibles}%</div>
                                <p className="text-xs text-muted-foreground">Cliente preferente</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Estado de Servicios en Tiempo Real */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Activity className="h-5 w-5 mr-2" />
                                Estado de Servicios en Tiempo Real
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Home className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <p className="text-sm font-medium">Sucursal</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(clienteData.estadoServicios.sucursal)}`}>
                    {getEstadoTexto("sucursal", clienteData.estadoServicios.sucursal)}
                  </span>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Truck className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <p className="text-sm font-medium">Servicio Móvil</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(clienteData.estadoServicios.servicioMovil)}`}>
                    {getEstadoTexto("servicioMovil", clienteData.estadoServicios.servicioMovil)}
                  </span>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Syringe className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <p className="text-sm font-medium">Farmacia</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(clienteData.estadoServicios.farmacia)}`}>
                    {getEstadoTexto("farmacia", clienteData.estadoServicios.farmacia)}
                  </span>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <TrendingUp className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <p className="text-sm font-medium">Laboratorio</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(clienteData.estadoServicios.laboratorio)}`}>
                    {getEstadoTexto("laboratorio", clienteData.estadoServicios.laboratorio)}
                  </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Mis Mascotas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <PawPrint className="h-5 w-5 mr-2" />
                                    Mis Mascotas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {clienteData.mascotas.map((mascota) => (
                                        <div key={mascota.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                                            <Image
                                                src={mascota.foto}
                                                alt={mascota.nombre}
                                                width={60}
                                                height={60}
                                                className="rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium">{mascota.nombre}</h4>
                                                <p className="text-sm text-gray-600">{mascota.especie} • {mascota.raza}</p>
                                                <p className="text-sm text-gray-500">{mascota.edad} • {mascota.peso}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={mascota.estadoSalud === "Saludable" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                                    {mascota.estadoSalud}
                                                </Badge>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Vacuna: {mascota.proximaVacuna}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button asChild className="w-full" variant="outline">
                                        <Link href="/mis-mascotas">Ver todas mis mascotas</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Próximas Citas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Próximas Citas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {clienteData.proximasCitas.map((cita) => (
                                        <div key={cita.id} className="p-3 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{cita.mascota}</h4>
                                                <Badge variant={cita.tipo === "Móvil" ? "secondary" : "outline"}>
                                                    {cita.tipo}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">{cita.servicio}</p>
                                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                                <span>{cita.fecha} - {cita.hora}</span>
                                                <span>{cita.veterinario}</span>
                                            </div>
                                            {cita.tipo === "Móvil" && (
                                                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                                                    <MapPin className="h-3 w-3 inline mr-1" />
                                                    Se realizará en tu domicilio
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="space-y-2">
                                        <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                                            <Link href="/mis-citas">Agendar Nueva Cita</Link>
                                        </Button>
                                        <Button asChild className="w-full" variant="outline">
                                            <Link href="/mis-citas">Ver todas mis citas</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resumen de Beneficios */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2" />
                                Tus Beneficios con Mascota Feliz
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                    <h4 className="font-medium text-green-800">Tiempo Ahorrado</h4>
                                    <p className="text-sm text-green-600">
                                        {clienteData.kpisPersonales.visitasEsteAno * (42 - clienteData.kpisPersonales.tiempoPromedioEspera)} minutos este año
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <h4 className="font-medium text-blue-800">Servicio a Domicilio</h4>
                                    <p className="text-sm text-blue-600">
                                        Disponible en tu zona con veterinarios certificados
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                    <h4 className="font-medium text-purple-800">Cliente Preferente</h4>
                                    <p className="text-sm text-purple-600">
                                        {clienteData.kpisPersonales.descuentosDisponibles}% descuento en tu próxima visita
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}