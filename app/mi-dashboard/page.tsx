"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    TrendingUp,
    Clock,
    Star,
    DollarSign,
    Award,
    Activity,
    Home,
    PawPrint,
    Calendar,
    Bell,
    Settings,
    LogOut,
    BarChart3,
    Target,
    Zap,
    Shield,
    Users,
    MapPin,
    CheckCircle,
    AlertCircle,
    Info
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"

// Tipos para métricas
interface KPIPersonal {
    id: string
    nombre: string
    valor: number | string
    unidad: string
    comparacion: {
        tipo: "mejor" | "igual" | "peor"
        porcentaje: number
        referencia: string
    }
    tendencia: "subiendo" | "bajando" | "estable"
    icono: any
    color: string
    descripcion: string
    meta?: number
}

interface MetricaComparativa {
    categoria: string
    miValor: number
    promedioGeneral: number
    mejorPosible: number
    unidad: string
    descripcion: string
}

interface EstadoServicio {
    servicio: string
    estado: "normal" | "ocupado" | "demora" | "disponible" | "critico"
    tiempo: string
    descripcion: string
    icono: any
}

// Función para generar KPIs personales dinámicos
const generarKPIsPersonales = (clienteData: any): KPIPersonal[] => {
    const kpis = clienteData.kpisPersonales || {}

    return [
        {
            id: "tiempo_espera",
            nombre: "Tu Tiempo de Espera",
            valor: kpis.tiempoPromedioEspera || 25,
            unidad: "minutos",
            comparacion: {
                tipo: "mejor",
                porcentaje: 40,
                referencia: "promedio general"
            },
            tendencia: "bajando",
            icono: Clock,
            color: "text-green-600",
            descripcion: "Tiempo promedio desde agendamiento hasta atención completa",
            meta: 30
        },
        {
            id: "satisfaccion",
            nombre: "Tu Satisfacción",
            valor: kpis.satisfaccionHistorica || 4.7,
            unidad: "/5",
            comparacion: {
                tipo: "mejor",
                porcentaje: 15,
                referencia: "promedio clínica"
            },
            tendencia: "subiendo",
            icono: Star,
            color: "text-yellow-600",
            descripcion: "Calificación promedio de todos tus servicios",
            meta: 4.5
        },
        {
            id: "ahorro_movil",
            nombre: "Ahorro con Móvil",
            valor: `$${(kpis.ahorroServicioMovil || 0).toLocaleString()}`,
            unidad: "CLP",
            comparacion: {
                tipo: "mejor",
                porcentaje: 100,
                referencia: "transporte tradicional"
            },
            tendencia: "subiendo",
            icono: DollarSign,
            color: "text-green-600",
            descripcion: "Dinero ahorrado en transporte usando servicio móvil",
        },
        {
            id: "descuentos",
            nombre: "Descuentos Activos",
            valor: kpis.descuentosDisponibles || 15,
            unidad: "%",
            comparacion: {
                tipo: "mejor",
                porcentaje: 25,
                referencia: "clientes nuevos"
            },
            tendencia: "estable",
            icono: Award,
            color: "text-purple-600",
            descripcion: "Descuentos disponibles por fidelidad"
        },
        {
            id: "visitas_ano",
            nombre: "Visitas Este Año",
            valor: kpis.visitasEsteAno || 8,
            unidad: "visitas",
            comparacion: {
                tipo: "igual",
                porcentaje: 5,
                referencia: "promedio anual"
            },
            tendencia: "estable",
            icono: Activity,
            color: "text-blue-600",
            descripcion: "Total de consultas realizadas en 2024"
        },
        {
            id: "puntaje_fidelidad",
            nombre: "Puntaje de Fidelidad",
            valor: Math.floor((kpis.visitasEsteAno || 8) * 125 + (kpis.satisfaccionHistorica || 4.7) * 200),
            unidad: "puntos",
            comparacion: {
                tipo: "mejor",
                porcentaje: 60,
                referencia: "clientes promedio"
            },
            tendencia: "subiendo",
            icono: Target,
            color: "text-indigo-600",
            descripcion: "Puntos acumulados por tu actividad y satisfacción"
        }
    ]
}

// Función para generar métricas comparativas
const generarMetricasComparativas = (clienteData: any): MetricaComparativa[] => {
    const kpis = clienteData.kpisPersonales || {}

    return [
        {
            categoria: "Eficiencia en Tiempo",
            miValor: kpis.tiempoPromedioEspera || 25,
            promedioGeneral: 42,
            mejorPosible: 15,
            unidad: "minutos",
            descripcion: "Tu eficiencia vs otros clientes"
        },
        {
            categoria: "Satisfacción",
            miValor: (kpis.satisfaccionHistorica || 4.7) * 20, // Convertir a porcentaje
            promedioGeneral: 78,
            mejorPosible: 100,
            unidad: "%",
            descripcion: "Tu nivel de satisfacción"
        },
        {
            categoria: "Uso Servicio Móvil",
            miValor: 65, // Porcentaje estimado de uso
            promedioGeneral: 25,
            mejorPosible: 100,
            unidad: "%",
            descripcion: "Adopción de nuevas modalidades"
        },
        {
            categoria: "Frecuencia de Visitas",
            miValor: kpis.visitasEsteAno || 8,
            promedioGeneral: 6,
            mejorPosible: 12,
            unidad: "visitas/año",
            descripcion: "Cuidado preventivo de mascotas"
        }
    ]
}

// Estado de servicios en tiempo real
const obtenerEstadoServicios = (): EstadoServicio[] => {
    return [
        {
            servicio: "Sucursal",
            estado: Math.random() > 0.6 ? "ocupado" : "normal",
            tiempo: Math.random() > 0.6 ? "Demora 15-20 min" : "Tiempo normal",
            descripcion: Math.random() > 0.6 ? "Alta demanda" : "Funcionamiento normal",
            icono: Home
        },
        {
            servicio: "Servicio Móvil",
            estado: "disponible",
            tiempo: "3 slots disponibles hoy",
            descripcion: "Disponible en tu zona",
            icono: MapPin
        },
        {
            servicio: "Farmacia",
            estado: "normal",
            tiempo: "Stock completo",
            descripcion: "Todos los medicamentos disponibles",
            icono: Shield
        },
        {
            servicio: "Laboratorio",
            estado: Math.random() > 0.7 ? "demora" : "normal",
            tiempo: Math.random() > 0.7 ? "Demora 2 horas" : "Resultados en 24h",
            descripcion: Math.random() > 0.7 ? "Alto volumen de muestras" : "Procesamiento normal",
            icono: Activity
        }
    ]
}

// Componente para métricas individuales
const MetricaCard = ({ kpi }: { kpi: KPIPersonal }) => {
    const IconComponent = kpi.icono
    const progreso = kpi.meta ? Math.min((Number(kpi.valor) / kpi.meta) * 100, 100) : 100

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.nombre}</CardTitle>
                <IconComponent className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {kpi.valor}
                    <span className="text-sm font-normal text-gray-500 ml-1">{kpi.unidad}</span>
                </div>

                {kpi.meta && (
                    <div className="mt-2">
                        <Progress value={progreso} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                            Meta: {kpi.meta}{kpi.unidad} ({Math.round(progreso)}%)
                        </p>
                    </div>
                )}

                <div className="flex items-center mt-2 text-xs">
                    {kpi.comparacion.tipo === "mejor" && (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    )}
                    {kpi.comparacion.tipo === "peor" && (
                        <TrendingUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                    )}
                    {kpi.comparacion.tipo === "igual" && (
                        <div className="h-3 w-3 bg-gray-400 rounded-full mr-1" />
                    )}

                    <span className={
                        kpi.comparacion.tipo === "mejor" ? "text-green-600" :
                            kpi.comparacion.tipo === "peor" ? "text-red-600" :
                                "text-gray-600"
                    }>
            {kpi.comparacion.porcentaje}% {kpi.comparacion.tipo} que {kpi.comparacion.referencia}
          </span>
                </div>

                <p className="text-xs text-gray-500 mt-2">{kpi.descripcion}</p>
            </CardContent>
        </Card>
    )
}

export default function ClienteKPIDashboard() {
    const router = useRouter()
    const [clienteData, setClienteData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [kpisPersonales, setKpisPersonales] = useState<KPIPersonal[]>([])
    const [metricasComparativas, setMetricasComparativas] = useState<MetricaComparativa[]>([])
    const [estadoServicios, setEstadoServicios] = useState<EstadoServicio[]>([])

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

            // Generar datos dinámicos
            setKpisPersonales(generarKPIsPersonales(sessionData))
            setMetricasComparativas(generarMetricasComparativas(sessionData))
            setEstadoServicios(obtenerEstadoServicios())
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

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case "normal":
                return "text-green-600 bg-green-50 border-green-200"
            case "disponible":
                return "text-blue-600 bg-blue-50 border-blue-200"
            case "ocupado":
                return "text-yellow-600 bg-yellow-50 border-yellow-200"
            case "demora":
                return "text-orange-600 bg-orange-50 border-orange-200"
            case "critico":
                return "text-red-600 bg-red-50 border-red-200"
            default:
                return "text-gray-600 bg-gray-50 border-gray-200"
        }
    }

    const getEstadoIcono = (estado: string) => {
        switch (estado) {
            case "normal":
            case "disponible":
                return <CheckCircle className="h-4 w-4" />
            case "ocupado":
            case "demora":
                return <AlertCircle className="h-4 w-4" />
            case "critico":
                return <AlertCircle className="h-4 w-4" />
            default:
                return <Info className="h-4 w-4" />
        }
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
                                <h1 className="text-2xl font-bold text-gray-900">Mi Dashboard</h1>
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
                                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100"
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
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mi-dashboard"
                                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md bg-teal-50 text-teal-700 font-medium"
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
                        <h2 className="text-3xl font-bold text-gray-900">Tus Métricas Personales</h2>
                        <p className="text-gray-600">Conoce tu rendimiento y beneficios como cliente preferente</p>
                    </div>

                    <Tabs defaultValue="kpis" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="kpis">Mis KPIs</TabsTrigger>
                            <TabsTrigger value="comparacion">Comparación</TabsTrigger>
                            <TabsTrigger value="servicios">Estado Servicios</TabsTrigger>
                        </TabsList>

                        {/* Tab: Mis KPIs */}
                        <TabsContent value="kpis" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {kpisPersonales.map((kpi) => (
                                    <MetricaCard key={kpi.id} kpi={kpi} />
                                ))}
                            </div>

                            {/* Resumen de beneficios */}
                            <Card className="mt-8">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Award className="h-5 w-5 mr-2 text-purple-600" />
                                        Resumen de Beneficios
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                            <h4 className="font-medium text-green-800">Tiempo Ahorrado</h4>
                                            <p className="text-2xl font-bold text-green-900">
                                                {((clienteData.kpisPersonales?.visitasEsteAno || 8) *
                                                    (42 - (clienteData.kpisPersonales?.tiempoPromedioEspera || 25))).toFixed(0)} min
                                            </p>
                                            <p className="text-sm text-green-600">este año vs promedio</p>
                                        </div>

                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                            <h4 className="font-medium text-blue-800">Ahorro Total</h4>
                                            <p className="text-2xl font-bold text-blue-900">
                                                ${(clienteData.kpisPersonales?.ahorroServicioMovil || 0).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-blue-600">en transporte este año</p>
                                        </div>

                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                            <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                            <h4 className="font-medium text-purple-800">Nivel de Satisfacción</h4>
                                            <p className="text-2xl font-bold text-purple-900">
                                                {clienteData.kpisPersonales?.satisfaccionHistorica || 4.7}/5
                                            </p>
                                            <p className="text-sm text-purple-600">excelente historial</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab: Comparación */}
                        <TabsContent value="comparacion" className="mt-6">
                            <div className="space-y-6">
                                {metricasComparativas.map((metrica, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{metrica.categoria}</CardTitle>
                                            <p className="text-sm text-gray-600">{metrica.descripcion}</p>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {/* Mi valor */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">Tu rendimiento</span>
                                                    <span className="text-lg font-bold text-teal-600">
                            {metrica.miValor} {metrica.unidad}
                          </span>
                                                </div>
                                                <Progress
                                                    value={(metrica.miValor / metrica.mejorPosible) * 100}
                                                    className="h-3"
                                                />

                                                {/* Comparaciones */}
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Promedio general:</span>
                                                        <span className="font-medium">{metrica.promedioGeneral} {metrica.unidad}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Mejor posible:</span>
                                                        <span className="font-medium">{metrica.mejorPosible} {metrica.unidad}</span>
                                                    </div>
                                                </div>

                                                {/* Indicador de rendimiento */}
                                                <div className="flex items-center">
                                                    {metrica.miValor > metrica.promedioGeneral ? (
                                                        <>
                                                            <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                                                            <span className="text-green-600 text-sm">
                                {((metrica.miValor / metrica.promedioGeneral - 1) * 100).toFixed(0)}% mejor que el promedio
                              </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-4 w-4 bg-yellow-400 rounded-full mr-2" />
                                                            <span className="text-yellow-600 text-sm">
                                En el promedio general
                              </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Tab: Estado de Servicios */}
                        <TabsContent value="servicios" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {estadoServicios.map((servicio, index) => {
                                    const IconComponent = servicio.icono
                                    return (
                                        <Card key={index} className={`border-2 ${getEstadoColor(servicio.estado)}`}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <IconComponent className="h-5 w-5 mr-2" />
                                                        {servicio.servicio}
                                                    </div>
                                                    {getEstadoIcono(servicio.estado)}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Estado:</span>
                                                        <Badge className={getEstadoColor(servicio.estado)}>
                                                            {servicio.estado.charAt(0).toUpperCase() + servicio.estado.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Tiempo:</span>
                                                        <span className="text-sm font-medium">{servicio.tiempo}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-2">{servicio.descripcion}</p>

                                                    {servicio.estado === "disponible" && servicio.servicio === "Servicio Móvil" && (
                                                        <Button size="sm" className="w-full mt-3 bg-teal-600 hover:bg-teal-700">
                                                            Agendar Ahora
                                                        </Button>
                                                    )}

                                                    {servicio.estado === "ocupado" && servicio.servicio === "Sucursal" && (
                                                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                                                            💡 Tip: Use el servicio móvil para evitar esperas
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* Consejos basados en estado */}
                            <Card className="mt-6 border-blue-200 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-blue-900">
                                        <Zap className="h-5 w-5 mr-2" />
                                        Recomendaciones Inteligentes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-blue-800">
                                        {estadoServicios.find(s => s.estado === "ocupado") && (
                                            <div className="flex items-start">
                                                <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-blue-600" />
                                                <p className="text-sm">
                                                    <strong>Alta demanda detectada:</strong> El servicio móvil está disponible sin esperas.
                                                    Ahorre tiempo agendando a domicilio.
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-start">
                                            <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-blue-600" />
                                            <p className="text-sm">
                                                <strong>Cliente preferente:</strong> Tiene {clienteData.kpisPersonales?.descuentosDisponibles || 15}%
                                                de descuento disponible en su próxima visita.
                                            </p>
                                        </div>

                                        <div className="flex items-start">
                                            <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-blue-600" />
                                            <p className="text-sm">
                                                <strong>Optimización de tiempo:</strong> Su tiempo promedio de {clienteData.kpisPersonales?.tiempoPromedioEspera || 25}
                                                minutos es 40% mejor que el promedio. ¡Excelente elección de horarios!
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    )
}