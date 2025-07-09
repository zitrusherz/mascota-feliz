"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    Calendar,
    Settings,
    LogOut,
    PawPrint,
    Bell,
    Plus,
    Edit,
    X,
    Check,
    Clock,
    MapPin,
    Phone,
    Star,
    Home,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    CheckCircle,
    AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Textarea } from "@/components/ui/form/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"

// Servicios disponibles
const serviciosDisponibles = [
    { id: "consulta", nombre: "Consulta General", duracion: "30 min", precio: "$25.000" },
    { id: "vacunacion", nombre: "Vacunación", duracion: "15 min", precio: "$15.000" },
    { id: "peluqueria", nombre: "Peluquería", duracion: "60 min", precio: "$20.000" },
    { id: "radiografia", nombre: "Radiografía", duracion: "45 min", precio: "$35.000" },
    { id: "cirugia", nombre: "Cirugía Menor", duracion: "120 min", precio: "$80.000" },
    { id: "control", nombre: "Control Post-Operatorio", duracion: "20 min", precio: "$15.000" }
]

// Horarios disponibles
const horariosDisponibles = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
]

// Veterinarios disponibles
const veterinariosDisponibles = [
    { id: "dr_gonzalez", nombre: "Dr. González", especialidad: "Medicina General" },
    { id: "dra_martinez", nombre: "Dra. Martínez", especialidad: "Cirugía" },
    { id: "dr_silva", nombre: "Dr. Silva", especialidad: "Dermatología" },
    { id: "dra_lopez", nombre: "Dra. López", especialidad: "Cardiología" }
]

// Datos simulados de citas
const citasSimuladas = [
    {
        id: "C001",
        mascota: "Max",
        mascotaId: "P001",
        fecha: "2024-07-20",
        hora: "10:00",
        servicio: "Consulta General",
        tipo: "Sucursal",
        veterinario: "Dr. González",
        estado: "confirmada",
        notas: "Control rutinario anual",
        precio: "$25.000",
        puedeCalificar: false,
        calificacion: null
    },
    {
        id: "C002",
        mascota: "Luna",
        mascotaId: "P002",
        fecha: "2024-07-25",
        hora: "15:30",
        servicio: "Vacunación",
        tipo: "Móvil",
        veterinario: "Dra. Martínez",
        estado: "confirmada",
        notas: "Vacuna anual múltiple",
        precio: "$20.000",
        puedeCalificar: false,
        calificacion: null
    },
    {
        id: "C003",
        mascota: "Max",
        mascotaId: "P001",
        fecha: "2024-06-15",
        hora: "11:00",
        servicio: "Peluquería",
        tipo: "Sucursal",
        veterinario: "Estilista Ana",
        estado: "completada",
        notas: "Corte y baño completo",
        precio: "$20.000",
        puedeCalificar: true,
        calificacion: 5
    },
    {
        id: "C004",
        mascota: "Luna",
        mascotaId: "P002",
        fecha: "2024-06-10",
        hora: "09:30",
        servicio: "Control Post-Operatorio",
        tipo: "Sucursal",
        veterinario: "Dr. Silva",
        estado: "completada",
        notas: "Revisión post esterilización",
        precio: "$15.000",
        puedeCalificar: true,
        calificacion: null
    },
    {
        id: "C005",
        mascota: "Max",
        mascotaId: "P001",
        fecha: "2024-08-15",
        hora: "14:00",
        servicio: "Radiografía",
        tipo: "Sucursal",
        veterinario: "Dr. González",
        estado: "pendiente",
        notas: "Revisar articulaciones",
        precio: "$35.000",
        puedeCalificar: false,
        calificacion: null
    }
]

export default function MisCitasPage() {
    const router = useRouter()
    const [clienteData, setClienteData] = useState<any>(null)
    const [citas, setCitas] = useState(citasSimuladas)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState<'new' | 'edit' | 'view' | 'cancel' | 'rate'>('new')
    const [selectedCita, setSelectedCita] = useState<any>(null)
    const [nuevaCita, setNuevaCita] = useState({
        mascotaId: "",
        fecha: "",
        hora: "",
        servicio: "",
        tipo: "Sucursal",
        veterinario: "",
        notas: ""
    })
    const [calificacion, setCalificacion] = useState(0)
    const [comentarioCalificacion, setComentarioCalificacion] = useState("")
    const [currentDate, setCurrentDate] = useState(new Date())

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

    const openModal = (type: 'new' | 'edit' | 'view' | 'cancel' | 'rate', cita?: any) => {
        setModalType(type)
        setSelectedCita(cita || null)
        if (type === 'new') {
            setNuevaCita({
                mascotaId: "",
                fecha: "",
                hora: "",
                servicio: "",
                tipo: "Sucursal",
                veterinario: "",
                notas: ""
            })
        } else if (type === 'edit' && cita) {
            const servicioId = serviciosDisponibles.find(s => s.nombre === cita.servicio)?.id || ""
            const veterinarioId = veterinariosDisponibles.find(v => v.nombre === cita.veterinario)?.id || ""

            setNuevaCita({
                mascotaId: cita.mascotaId,
                fecha: cita.fecha,
                hora: cita.hora,
                servicio: servicioId,
                tipo: cita.tipo,
                veterinario: veterinarioId,
                notas: cita.notas
            })
        } else if (type === 'rate') {
            setCalificacion(cita?.calificacion || 0)
            setComentarioCalificacion("")
        }
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedCita(null)
        setCalificacion(0)
        setComentarioCalificacion("")
    }

    const agendarCita = () => {
        const servicio = serviciosDisponibles.find(s => s.id === nuevaCita.servicio)
        const veterinario = veterinariosDisponibles.find(v => v.id === nuevaCita.veterinario)
        const mascota = clienteData.mascotas?.find((m: any) => m.id === nuevaCita.mascotaId)

        const nuevaCitaCompleta = {
            id: `C${Date.now()}`,
            mascota: mascota?.nombre || "Mascota",
            mascotaId: nuevaCita.mascotaId,
            fecha: nuevaCita.fecha,
            hora: nuevaCita.hora,
            servicio: servicio?.nombre || nuevaCita.servicio,
            tipo: nuevaCita.tipo,
            veterinario: veterinario?.nombre || "Veterinario disponible",
            estado: "pendiente",
            notas: nuevaCita.notas,
            precio: servicio?.precio || "$0",
            puedeCalificar: false,
            calificacion: null
        }

        setCitas([...citas, nuevaCitaCompleta])
        closeModal()
    }

    const editarCita = () => {
        const servicio = serviciosDisponibles.find(s => s.id === nuevaCita.servicio)
        const veterinario = veterinariosDisponibles.find(v => v.id === nuevaCita.veterinario)

        setCitas(citas.map(cita =>
            cita.id === selectedCita.id
                ? {
                    ...cita,
                    fecha: nuevaCita.fecha,
                    hora: nuevaCita.hora,
                    servicio: servicio?.nombre || nuevaCita.servicio,
                    tipo: nuevaCita.tipo,
                    veterinario: veterinario?.nombre || nuevaCita.veterinario || "Veterinario disponible",
                    notas: nuevaCita.notas
                }
                : cita
        ))
        closeModal()
    }

    const cancelarCita = () => {
        setCitas(citas.map(cita =>
            cita.id === selectedCita.id
                ? { ...cita, estado: "cancelada" }
                : cita
        ))
        closeModal()
    }

    const confirmarAsistencia = (citaId: string) => {
        setCitas(citas.map(cita =>
            cita.id === citaId
                ? { ...cita, estado: "confirmada" }
                : cita
        ))
    }

    const reprogramarCita = (cita: any) => {
        // Sugerir nueva fecha (una semana después)
        const nuevaFecha = new Date(cita.fecha)
        nuevaFecha.setDate(nuevaFecha.getDate() + 7)

        const servicioId = serviciosDisponibles.find(s => s.nombre === cita.servicio)?.id || ""
        const veterinarioId = veterinariosDisponibles.find(v => v.nombre === cita.veterinario)?.id || ""

        setNuevaCita({
            mascotaId: cita.mascotaId,
            fecha: nuevaFecha.toISOString().split('T')[0],
            hora: cita.hora,
            servicio: servicioId,
            tipo: cita.tipo,
            veterinario: veterinarioId,
            notas: cita.notas
        })
        setSelectedCita(cita)
        setModalType('edit')
        setShowModal(true)
    }

    const calificarServicio = () => {
        setCitas(citas.map(cita =>
            cita.id === selectedCita.id
                ? { ...cita, calificacion: calificacion }
                : cita
        ))
        closeModal()
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
                return <Badge variant="outline">{estado}</Badge>
        }
    }

    const getTipoBadge = (tipo: string) => {
        return tipo === "Móvil" ? (
            <Badge className="bg-blue-100 text-blue-800">{tipo}</Badge>
        ) : (
            <Badge variant="outline">{tipo}</Badge>
        )
    }

    const filtrarCitas = (filtro: string) => {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        return citas.filter(cita => {
            const fechaCita = new Date(cita.fecha)
            fechaCita.setHours(0, 0, 0, 0)

            switch (filtro) {
                case "futuras":
                    return fechaCita >= hoy && cita.estado !== "cancelada"
                case "pasadas":
                    return fechaCita < hoy || cita.estado === "completada"
                case "pendientes":
                    return cita.estado === "pendiente"
                case "completadas":
                    return cita.estado === "completada"
                default:
                    return true
            }
        }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    }

    const renderStars = (rating: number, interactive: boolean = false) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${
                            star <= rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
                        onClick={interactive ? () => setCalificacion(star) : undefined}
                    />
                ))}
            </div>
        )
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
                                <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
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
                                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md bg-teal-50 text-teal-700 font-medium"
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
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Gestión de Citas</h2>
                                <p className="text-gray-600">Programa, modifica y gestiona las citas de tus mascotas</p>
                            </div>
                            <Button
                                onClick={() => openModal('new')}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Agendar Nueva Cita
                            </Button>
                        </div>
                    </div>

                    {/* Resumen rápido */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center">
                                    <Calendar className="h-8 w-8 text-blue-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Próximas Citas</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {filtrarCitas("futuras").length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center">
                                    <Clock className="h-8 w-8 text-yellow-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pendientes</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {filtrarCitas("pendientes").length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center">
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Completadas</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {filtrarCitas("completadas").length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center">
                                    <Star className="h-8 w-8 text-purple-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Sin Calificar</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {citas.filter(c => c.puedeCalificar && !c.calificacion).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lista de citas con tabs */}
                    <Tabs defaultValue="todas" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="todas">Todas</TabsTrigger>
                            <TabsTrigger value="futuras">Próximas</TabsTrigger>
                            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                            <TabsTrigger value="completadas">Completadas</TabsTrigger>
                            <TabsTrigger value="pasadas">Historial</TabsTrigger>
                        </TabsList>

                        {['todas', 'futuras', 'pendientes', 'completadas', 'pasadas'].map((tab) => (
                            <TabsContent key={tab} value={tab} className="mt-6">
                                <div className="space-y-4">
                                    {filtrarCitas(tab === 'todas' ? '' : tab).map((cita) => (
                                        <Card key={cita.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="text-lg font-semibold">{cita.servicio}</h3>
                                                            {getEstadoBadge(cita.estado)}
                                                            {getTipoBadge(cita.tipo)}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-gray-600">Mascota</p>
                                                                <p className="font-medium">{cita.mascota}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-600">Fecha y Hora</p>
                                                                <p className="font-medium">{cita.fecha} - {cita.hora}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-600">Veterinario</p>
                                                                <p className="font-medium">{cita.veterinario}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-600">Precio</p>
                                                                <p className="font-medium">{cita.precio}</p>
                                                            </div>
                                                        </div>

                                                        {cita.tipo === "Móvil" && (
                                                            <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                                                                <MapPin className="h-4 w-4 inline mr-1 text-blue-600" />
                                                                <span className="text-blue-800">Servicio a domicilio</span>
                                                            </div>
                                                        )}

                                                        {cita.notas && (
                                                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                                                                <p className="text-gray-600">{cita.notas}</p>
                                                            </div>
                                                        )}

                                                        {cita.calificacion && (
                                                            <div className="mt-3">
                                                                <p className="text-sm text-gray-600 mb-1">Tu calificación:</p>
                                                                {renderStars(cita.calificacion)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Acciones */}
                                                    <div className="flex flex-col space-y-2 ml-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openModal('view', cita)}
                                                        >
                                                            Ver Detalles
                                                        </Button>

                                                        {cita.estado === "pendiente" && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => confirmarAsistencia(cita.id)}
                                                                    className="text-green-600 hover:text-green-700"
                                                                >
                                                                    <Check className="h-4 w-4 mr-1" />
                                                                    Confirmar
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => openModal('edit', cita)}
                                                                >
                                                                    <Edit className="h-4 w-4 mr-1" />
                                                                    Editar
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => reprogramarCita(cita)}
                                                                    className="text-blue-600 hover:text-blue-700"
                                                                >
                                                                    <RotateCcw className="h-4 w-4 mr-1" />
                                                                    Reprogramar
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => openModal('cancel', cita)}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    <X className="h-4 w-4 mr-1" />
                                                                    Cancelar
                                                                </Button>
                                                            </>
                                                        )}

                                                        {cita.estado === "confirmada" && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => openModal('edit', cita)}
                                                                >
                                                                    <Edit className="h-4 w-4 mr-1" />
                                                                    Editar
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => openModal('cancel', cita)}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    <X className="h-4 w-4 mr-1" />
                                                                    Cancelar
                                                                </Button>
                                                            </>
                                                        )}

                                                        {cita.puedeCalificar && !cita.calificacion && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openModal('rate', cita)}
                                                                className="text-yellow-600 hover:text-yellow-700"
                                                            >
                                                                <Star className="h-4 w-4 mr-1" />
                                                                Calificar
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {filtrarCitas(tab === 'todas' ? '' : tab).length === 0 && (
                                        <Card className="text-center py-12">
                                            <CardContent>
                                                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                                    No hay citas {tab === 'todas' ? '' : `${tab}`}
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    {tab === 'futuras' ? 'Agenda una nueva cita para tu mascota' :
                                                        tab === 'pendientes' ? 'No tienes citas pendientes de confirmación' :
                                                            'No hay citas en esta categoría'}
                                                </p>
                                                {tab === 'futuras' && (
                                                    <Button
                                                        onClick={() => openModal('new')}
                                                        className="bg-teal-600 hover:bg-teal-700"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Agendar Primera Cita
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold">
                                    {modalType === 'new' ? 'Agendar Nueva Cita' :
                                        modalType === 'edit' ? 'Editar Cita' :
                                            modalType === 'view' ? 'Detalles de la Cita' :
                                                modalType === 'cancel' ? 'Cancelar Cita' :
                                                    'Calificar Servicio'}
                                </h3>
                                <Button variant="outline" size="sm" onClick={closeModal}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {modalType === 'view' && selectedCita ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-gray-600">Servicio</Label>
                                            <p className="font-medium text-lg">{selectedCita.servicio}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Estado</Label>
                                            <div className="mt-1">{getEstadoBadge(selectedCita.estado)}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Mascota</Label>
                                            <p className="font-medium">{selectedCita.mascota}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Tipo de Servicio</Label>
                                            <div className="mt-1">{getTipoBadge(selectedCita.tipo)}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Fecha</Label>
                                            <p className="font-medium">{selectedCita.fecha}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Hora</Label>
                                            <p className="font-medium">{selectedCita.hora}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Veterinario</Label>
                                            <p className="font-medium">{selectedCita.veterinario}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Precio</Label>
                                            <p className="font-medium text-lg text-teal-600">{selectedCita.precio}</p>
                                        </div>
                                    </div>

                                    {selectedCita.notas && (
                                        <div>
                                            <Label className="text-sm text-gray-600">Notas</Label>
                                            <p className="mt-1 p-3 bg-gray-50 rounded">{selectedCita.notas}</p>
                                        </div>
                                    )}

                                    {selectedCita.tipo === "Móvil" && (
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <div className="flex items-center text-blue-800 mb-2">
                                                <MapPin className="h-5 w-5 mr-2" />
                                                <span className="font-medium">Servicio a Domicilio</span>
                                            </div>
                                            <p className="text-blue-600 text-sm">
                                                El veterinario se dirigirá a tu domicilio en la fecha y hora programada.
                                                Te contactaremos 30 minutos antes de la llegada.
                                            </p>
                                        </div>
                                    )}

                                    {selectedCita.calificacion && (
                                        <div className="p-4 bg-yellow-50 rounded-lg">
                                            <Label className="text-sm text-gray-600">Tu Calificación</Label>
                                            <div className="mt-2">{renderStars(selectedCita.calificacion)}</div>
                                        </div>
                                    )}
                                </div>
                            ) : modalType === 'cancel' ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-50 rounded-lg">
                                        <div className="flex items-center text-red-800 mb-2">
                                            <AlertCircle className="h-5 w-5 mr-2" />
                                            <span className="font-medium">¿Estás seguro que deseas cancelar esta cita?</span>
                                        </div>
                                        <p className="text-red-600 text-sm">
                                            Esta acción no se puede deshacer. Si cancelas con menos de 24 horas de anticipación,
                                            se aplicará una tarifa de cancelación.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded">
                                        <p><strong>Servicio:</strong> {selectedCita?.servicio}</p>
                                        <p><strong>Fecha:</strong> {selectedCita?.fecha} - {selectedCita?.hora}</p>
                                        <p><strong>Mascota:</strong> {selectedCita?.mascota}</p>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <Button variant="outline" onClick={closeModal}>
                                            No, Mantener Cita
                                        </Button>
                                        <Button
                                            onClick={cancelarCita}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Sí, Cancelar Cita
                                        </Button>
                                    </div>
                                </div>
                            ) : modalType === 'rate' ? (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded">
                                        <p><strong>Servicio:</strong> {selectedCita?.servicio}</p>
                                        <p><strong>Fecha:</strong> {selectedCita?.fecha}</p>
                                        <p><strong>Veterinario:</strong> {selectedCita?.veterinario}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Califica tu experiencia</Label>
                                        <div className="mt-2">{renderStars(calificacion, true)}</div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {calificacion === 0 ? 'Selecciona una calificación' :
                                                calificacion === 1 ? 'Muy malo' :
                                                    calificacion === 2 ? 'Malo' :
                                                        calificacion === 3 ? 'Regular' :
                                                            calificacion === 4 ? 'Bueno' : 'Excelente'}
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="comentario">Comentarios (opcional)</Label>
                                        <Textarea
                                            id="comentario"
                                            value={comentarioCalificacion}
                                            onChange={(e) => setComentarioCalificacion(e.target.value)}
                                            placeholder="Comparte tu experiencia..."
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <Button variant="outline" onClick={closeModal}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={calificarServicio}
                                            disabled={calificacion === 0}
                                            className="bg-yellow-600 hover:bg-yellow-700"
                                        >
                                            <Star className="h-4 w-4 mr-2" />
                                            Enviar Calificación
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                // Formulario para nueva cita o editar
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="mascota">Mascota</Label>
                                            <Select
                                                value={nuevaCita.mascotaId}
                                                onValueChange={(value) => setNuevaCita({...nuevaCita, mascotaId: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una mascota" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {clienteData.mascotas?.map((mascota: any) => (
                                                        <SelectItem key={mascota.id} value={mascota.id}>
                                                            {mascota.nombre} ({mascota.especie})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="servicio">Servicio</Label>
                                            <Select
                                                value={nuevaCita.servicio}
                                                onValueChange={(value) => setNuevaCita({...nuevaCita, servicio: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un servicio" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {serviciosDisponibles.map((servicio) => (
                                                        <SelectItem key={servicio.id} value={servicio.id}>
                                                            {servicio.nombre} - {servicio.precio} ({servicio.duracion})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="fecha">Fecha</Label>
                                            <Input
                                                id="fecha"
                                                type="date"
                                                value={nuevaCita.fecha}
                                                onChange={(e) => setNuevaCita({...nuevaCita, fecha: e.target.value})}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="hora">Hora</Label>
                                            <Select
                                                value={nuevaCita.hora}
                                                onValueChange={(value) => setNuevaCita({...nuevaCita, hora: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una hora" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {horariosDisponibles.map((hora) => (
                                                        <SelectItem key={hora} value={hora}>
                                                            {hora}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="tipo">Tipo de Servicio</Label>
                                            <Select
                                                value={nuevaCita.tipo}
                                                onValueChange={(value) => setNuevaCita({...nuevaCita, tipo: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Sucursal">En Sucursal</SelectItem>
                                                    <SelectItem value="Móvil">Servicio Móvil (a domicilio)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="veterinario">Veterinario (opcional)</Label>
                                            <Select
                                                value={nuevaCita.veterinario}
                                                onValueChange={(value) => setNuevaCita({...nuevaCita, veterinario: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Cualquier veterinario disponible" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Cualquier veterinario disponible</SelectItem>
                                                    {veterinariosDisponibles.map((vet) => (
                                                        <SelectItem key={vet.id} value={vet.id}>
                                                            {vet.nombre} - {vet.especialidad}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="notas">Notas adicionales (opcional)</Label>
                                        <Textarea
                                            id="notas"
                                            value={nuevaCita.notas}
                                            onChange={(e) => setNuevaCita({...nuevaCita, notas: e.target.value})}
                                            placeholder="Información adicional sobre la cita..."
                                        />
                                    </div>

                                    {nuevaCita.tipo === "Móvil" && (
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <div className="flex items-center text-blue-800 mb-2">
                                                <MapPin className="h-5 w-5 mr-2" />
                                                <span className="font-medium">Servicio a Domicilio</span>
                                            </div>
                                            <p className="text-blue-600 text-sm">
                                                El veterinario se dirigirá a tu domicilio registrado.
                                                Si necesitas cambiar la dirección, por favor contáctanos.
                                            </p>
                                            <p className="text-blue-600 text-sm mt-1">
                                                <strong>Dirección:</strong> {clienteData.direccion}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-3 pt-4 border-t">
                                        <Button variant="outline" onClick={closeModal}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={modalType === 'new' ? agendarCita : editarCita}
                                            disabled={!nuevaCita.mascotaId || !nuevaCita.servicio || !nuevaCita.fecha || !nuevaCita.hora}
                                            className="bg-teal-600 hover:bg-teal-700"
                                        >
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {modalType === 'new' ? 'Agendar Cita' : 'Guardar Cambios'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}