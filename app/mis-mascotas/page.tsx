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
    Eye,
    Syringe,
    Heart,
    Activity,
    Home,
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    X,
    Save,
    Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Textarea } from "@/components/ui/form/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"

// Datos simulados más completos para mascotas
const historialMedicoSimulado = {
    "P001": [
        {
            id: "HM001",
            fecha: "2024-06-15",
            tipo: "Consulta General",
            veterinario: "Dr. González",
            diagnostico: "Excelente estado general",
            tratamiento: "Ninguno requerido",
            observaciones: "Paciente muy dócil, peso ideal",
            proximoControl: "2024-12-15"
        },
        {
            id: "HM002",
            fecha: "2024-03-10",
            tipo: "Vacunación",
            veterinario: "Dra. Martínez",
            diagnostico: "Saludable",
            tratamiento: "Vacuna múltiple",
            observaciones: "Vacunación anual completada",
            proximoControl: "2025-03-10"
        }
    ],
    "P002": [
        {
            id: "HM003",
            fecha: "2024-06-10",
            tipo: "Control Post-Operatorio",
            veterinario: "Dr. Silva",
            diagnostico: "Recuperación exitosa",
            tratamiento: "Antibióticos por 5 días",
            observaciones: "Herida sanando correctamente",
            proximoControl: "2024-07-10"
        }
    ]
}

const citasPorMascota = {
    "P001": [
        {
            id: "C001",
            fecha: "2024-07-20",
            hora: "10:00",
            servicio: "Control rutinario",
            tipo: "Sucursal",
            estado: "confirmada"
        },
        {
            id: "C002",
            fecha: "2024-08-15",
            hora: "15:30",
            servicio: "Vacunación",
            tipo: "Móvil",
            estado: "pendiente"
        }
    ],
    "P002": [
        {
            id: "C003",
            fecha: "2024-07-25",
            hora: "11:00",
            servicio: "Control post-operatorio",
            tipo: "Sucursal",
            estado: "confirmada"
        }
    ]
}

const vacunasPorMascota = {
    "P001": [
        {
            nombre: "Rabia",
            ultimaAplicacion: "2024-03-10",
            proximaAplicacion: "2025-03-10",
            estado: "vigente"
        },
        {
            nombre: "Múltiple (DHPP)",
            ultimaAplicacion: "2024-03-10",
            proximaAplicacion: "2025-03-10",
            estado: "vigente"
        }
    ],
    "P002": [
        {
            nombre: "Triple Felina",
            ultimaAplicacion: "2024-02-15",
            proximaAplicacion: "2024-08-15",
            estado: "proxima"
        }
    ]
}

export default function MisMascotasPage() {
    const router = useRouter()
    const [clienteData, setClienteData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedMascota, setSelectedMascota] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState<'view' | 'edit' | 'add'>('view')
    const [editingMascota, setEditingMascota] = useState<any>(null)

    useEffect(() => {
        // Verificar sesión del cliente
        const session = localStorage.getItem("cliente_session")
        if (!session) {
            router.push("/iniciar-sesion")
            return
        }

        try {
            const sessionData = JSON.parse(session)

            // Agregar datos adicionales a las mascotas
            const mascotasEnriquecidas = sessionData.mascotas?.map((mascota: any) => ({
                ...mascota,
                foto: "/placeholder.svg?height=150&width=150",
                historialMedico: historialMedicoSimulado[mascota.id] || [],
                proximasCitas: citasPorMascota[mascota.id] || [],
                vacunas: vacunasPorMascota[mascota.id] || [],
                tratamientosActivos: mascota.estadoSalud !== "Saludable" ? [
                    {
                        id: "T001",
                        nombre: "Control de peso",
                        descripcion: "Dieta específica y ejercicio diario",
                        fechaInicio: "2024-06-12",
                        duracion: "30 días"
                    }
                ] : []
            })) || []

            setClienteData({
                usuario: sessionData,
                mascotas: mascotasEnriquecidas
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

    const openModal = (type: 'view' | 'edit' | 'add', mascota?: any) => {
        setModalType(type)
        setSelectedMascota(mascota || null)
        setEditingMascota(mascota ? {...mascota} : {
            nombre: "",
            especie: "",
            raza: "",
            edad: "",
            peso: "",
            color: "",
            sexo: "",
            estadoSalud: "Saludable"
        })
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedMascota(null)
        setEditingMascota(null)
    }

    const saveMascota = () => {
        if (modalType === 'add') {
            // Agregar nueva mascota
            const nuevaMascota = {
                ...editingMascota,
                id: `P${String(Date.now()).slice(-3)}`,
                foto: "/placeholder.svg?height=150&width=150",
                proximaVacuna: "2024-12-31",
                historialMedico: [],
                proximasCitas: [],
                vacunas: [],
                tratamientosActivos: []
            }

            setClienteData({
                ...clienteData,
                mascotas: [...clienteData.mascotas, nuevaMascota]
            })
        } else if (modalType === 'edit') {
            // Editar mascota existente
            setClienteData({
                ...clienteData,
                mascotas: clienteData.mascotas.map((m: any) =>
                    m.id === editingMascota.id ? editingMascota : m
                )
            })
        }
        closeModal()
    }

    const getEstadoVacuna = (estado: string) => {
        switch (estado) {
            case "vigente":
                return <Badge className="bg-green-100 text-green-800">Vigente</Badge>
            case "proxima":
                return <Badge className="bg-yellow-100 text-yellow-800">Próxima</Badge>
            case "vencida":
                return <Badge className="bg-red-100 text-red-800">Vencida</Badge>
            default:
                return <Badge variant="outline">{estado}</Badge>
        }
    }

    const getEstadoCita = (estado: string) => {
        switch (estado) {
            case "confirmada":
                return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
            case "pendiente":
                return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
            case "cancelada":
                return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
            default:
                return <Badge variant="outline">{estado}</Badge>
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
                                <h1 className="text-2xl font-bold text-gray-900">Mis Mascotas</h1>
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
                                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md hover:bg-gray-100"
                                >
                                    <Home className="h-5 w-5" />
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mis-mascotas"
                                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md bg-teal-50 text-teal-700 font-medium"
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
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Mis Mascotas</h2>
                                <p className="text-gray-600">Gestiona la información y cuidados de tus mascotas</p>
                            </div>
                            <Button
                                onClick={() => openModal('add')}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Mascota
                            </Button>
                        </div>
                    </div>

                    {/* Grid de Mascotas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clienteData.mascotas.map((mascota: any) => (
                            <Card key={mascota.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    <Image
                                        src={mascota.foto}
                                        alt={mascota.nombre}
                                        width={300}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge className={
                                            mascota.estadoSalud === "Saludable"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }>
                                            {mascota.estadoSalud}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <div className="mb-3">
                                        <h3 className="text-xl font-bold">{mascota.nombre}</h3>
                                        <p className="text-gray-600">{mascota.especie} • {mascota.raza}</p>
                                        <p className="text-sm text-gray-500">{mascota.edad} • {mascota.peso}</p>
                                    </div>

                                    {/* Indicadores rápidos */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                        <div className="p-2 bg-blue-50 rounded">
                                            <Calendar className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                                            <p className="text-xs text-blue-800">{mascota.proximasCitas.length} citas</p>
                                        </div>
                                        <div className="p-2 bg-green-50 rounded">
                                            <Syringe className="h-4 w-4 text-green-600 mx-auto mb-1" />
                                            <p className="text-xs text-green-800">{mascota.vacunas.length} vacunas</p>
                                        </div>
                                        <div className="p-2 bg-purple-50 rounded">
                                            <Heart className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                                            <p className="text-xs text-purple-800">{mascota.historialMedico.length} visitas</p>
                                        </div>
                                    </div>

                                    {/* Próxima vacuna */}
                                    <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Próxima vacuna:</span>
                                            <span className="font-medium">{mascota.proximaVacuna}</span>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => openModal('view', mascota)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            Ver
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => openModal('edit', mascota)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Editar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Mensaje si no hay mascotas */}
                    {clienteData.mascotas.length === 0 && (
                        <Card className="text-center py-12">
                            <CardContent>
                                <PawPrint className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes mascotas registradas</h3>
                                <p className="text-gray-600 mb-4">Agrega tu primera mascota para comenzar a gestionar su cuidado</p>
                                <Button
                                    onClick={() => openModal('add')}
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Primera Mascota
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold">
                                    {modalType === 'add' ? 'Agregar Nueva Mascota' :
                                        modalType === 'edit' ? `Editar ${selectedMascota?.nombre}` :
                                            `Perfil de ${selectedMascota?.nombre}`}
                                </h3>
                                <Button variant="outline" size="sm" onClick={closeModal}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {modalType === 'view' && selectedMascota ? (
                                <Tabs defaultValue="general" className="w-full">
                                    <TabsList className="grid w-full grid-cols-5">
                                        <TabsTrigger value="general">General</TabsTrigger>
                                        <TabsTrigger value="historial">Historial</TabsTrigger>
                                        <TabsTrigger value="citas">Citas</TabsTrigger>
                                        <TabsTrigger value="vacunas">Vacunas</TabsTrigger>
                                        <TabsTrigger value="tratamientos">Tratamientos</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="general" className="mt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-1">
                                                <Image
                                                    src={selectedMascota.foto}
                                                    alt={selectedMascota.nombre}
                                                    width={300}
                                                    height={300}
                                                    className="w-full rounded-lg object-cover"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm text-gray-600">Nombre</Label>
                                                        <p className="font-medium text-lg">{selectedMascota.nombre}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm text-gray-600">Especie</Label>
                                                        <p className="font-medium">{selectedMascota.especie}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm text-gray-600">Raza</Label>
                                                        <p className="font-medium">{selectedMascota.raza}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm text-gray-600">Edad</Label>
                                                        <p className="font-medium">{selectedMascota.edad}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm text-gray-600">Peso</Label>
                                                        <p className="font-medium">{selectedMascota.peso}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm text-gray-600">Estado de Salud</Label>
                                                        <div className="mt-1">
                                                            <Badge className={
                                                                selectedMascota.estadoSalud === "Saludable"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }>
                                                                {selectedMascota.estadoSalud}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="historial" className="mt-6">
                                        <div className="space-y-4">
                                            {selectedMascota.historialMedico.map((registro: any) => (
                                                <Card key={registro.id}>
                                                    <CardContent className="pt-4">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h4 className="font-semibold text-lg">{registro.tipo}</h4>
                                                            <Badge variant="outline">{registro.fecha}</Badge>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <Label className="text-sm font-medium text-gray-600">Veterinario</Label>
                                                                <p className="mt-1">{registro.veterinario}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-gray-600">Próximo Control</Label>
                                                                <p className="mt-1">{registro.proximoControl}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-gray-600">Diagnóstico</Label>
                                                                <p className="mt-1">{registro.diagnostico}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-gray-600">Tratamiento</Label>
                                                                <p className="mt-1">{registro.tratamiento}</p>
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <Label className="text-sm font-medium text-gray-600">Observaciones</Label>
                                                                <p className="mt-1">{registro.observaciones}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            {selectedMascota.historialMedico.length === 0 && (
                                                <p className="text-center text-gray-500">No hay historial médico registrado</p>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="citas" className="mt-6">
                                        <div className="space-y-4">
                                            {selectedMascota.proximasCitas.map((cita: any) => (
                                                <Card key={cita.id}>
                                                    <CardContent className="pt-4">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h4 className="font-semibold">{cita.servicio}</h4>
                                                                <p className="text-gray-600">{cita.fecha} - {cita.hora}</p>
                                                                <p className="text-sm text-gray-500">Tipo: {cita.tipo}</p>
                                                            </div>
                                                            <div>
                                                                {getEstadoCita(cita.estado)}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            {selectedMascota.proximasCitas.length === 0 && (
                                                <p className="text-center text-gray-500">No hay citas programadas</p>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="vacunas" className="mt-6">
                                        <div className="space-y-4">
                                            {selectedMascota.vacunas.map((vacuna: any, index: number) => (
                                                <Card key={index}>
                                                    <CardContent className="pt-4">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h4 className="font-semibold">{vacuna.nombre}</h4>
                                                                <p className="text-gray-600">Última: {vacuna.ultimaAplicacion}</p>
                                                                <p className="text-gray-600">Próxima: {vacuna.proximaAplicacion}</p>
                                                            </div>
                                                            <div>
                                                                {getEstadoVacuna(vacuna.estado)}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            {selectedMascota.vacunas.length === 0 && (
                                                <p className="text-center text-gray-500">No hay vacunas registradas</p>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="tratamientos" className="mt-6">
                                        <div className="space-y-4">
                                            {selectedMascota.tratamientosActivos.map((tratamiento: any) => (
                                                <Card key={tratamiento.id}>
                                                    <CardContent className="pt-4">
                                                        <h4 className="font-semibold">{tratamiento.nombre}</h4>
                                                        <p className="text-gray-600 mt-2">{tratamiento.descripcion}</p>
                                                        <div className="flex justify-between mt-3 text-sm text-gray-500">
                                                            <span>Inicio: {tratamiento.fechaInicio}</span>
                                                            <span>Duración: {tratamiento.duracion}</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            {selectedMascota.tratamientosActivos.length === 0 && (
                                                <p className="text-center text-gray-500">No hay tratamientos activos</p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            ) : (
                                // Formulario de edición/agregar
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="nombre">Nombre de la mascota</Label>
                                            <Input
                                                id="nombre"
                                                value={editingMascota?.nombre || ""}
                                                onChange={(e) => setEditingMascota({...editingMascota, nombre: e.target.value})}
                                                placeholder="Ej: Max"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="especie">Especie</Label>
                                            <Select
                                                value={editingMascota?.especie || ""}
                                                onValueChange={(value) => setEditingMascota({...editingMascota, especie: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona especie" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Perro">Perro</SelectItem>
                                                    <SelectItem value="Gato">Gato</SelectItem>
                                                    <SelectItem value="Ave">Ave</SelectItem>
                                                    <SelectItem value="Roedor">Roedor</SelectItem>
                                                    <SelectItem value="Reptil">Reptil</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="raza">Raza</Label>
                                            <Input
                                                id="raza"
                                                value={editingMascota?.raza || ""}
                                                onChange={(e) => setEditingMascota({...editingMascota, raza: e.target.value})}
                                                placeholder="Ej: Golden Retriever"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="edad">Edad</Label>
                                            <Input
                                                id="edad"
                                                value={editingMascota?.edad || ""}
                                                onChange={(e) => setEditingMascota({...editingMascota, edad: e.target.value})}
                                                placeholder="Ej: 3 años"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="peso">Peso</Label>
                                            <Input
                                                id="peso"
                                                value={editingMascota?.peso || ""}
                                                onChange={(e) => setEditingMascota({...editingMascota, peso: e.target.value})}
                                                placeholder="Ej: 25 kg"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="color">Color</Label>
                                            <Input
                                                id="color"
                                                value={editingMascota?.color || ""}
                                                onChange={(e) => setEditingMascota({...editingMascota, color: e.target.value})}
                                                placeholder="Ej: Dorado"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="sexo">Sexo</Label>
                                            <Select
                                                value={editingMascota?.sexo || ""}
                                                onValueChange={(value) => setEditingMascota({...editingMascota, sexo: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona sexo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Macho">Macho</SelectItem>
                                                    <SelectItem value="Hembra">Hembra</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="estadoSalud">Estado de Salud</Label>
                                            <Select
                                                value={editingMascota?.estadoSalud || ""}
                                                onValueChange={(value) => setEditingMascota({...editingMascota, estadoSalud: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Saludable">Saludable</SelectItem>
                                                    <SelectItem value="Control rutinario">Control rutinario</SelectItem>
                                                    <SelectItem value="En tratamiento">En tratamiento</SelectItem>
                                                    <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t">
                                        <Button variant="outline" onClick={closeModal}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={saveMascota}
                                            className="bg-teal-600 hover:bg-teal-700"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {modalType === 'add' ? 'Agregar Mascota' : 'Guardar Cambios'}
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