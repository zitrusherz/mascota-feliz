
"use client"

// Tipos para el sistema de sincronización
interface SyncEvent {
    id: string
    type: 'admin_to_client' | 'client_to_admin'
    action: string
    data: any
    timestamp: string
    sourceUser: string
    targetUser?: string
}

interface AdminAction {
    type: 'agenda_cita' | 'actualiza_kri' | 'movil_en_ruta' | 'confirma_cita' | 'cancela_cita'
    data: any
    clienteEmail: string
}

interface ClientAction {
    type: 'agenda_cita' | 'califica_servicio' | 'cancela_cita' | 'confirma_asistencia'
    data: any
    clienteEmail: string
}

// 🔄 GESTOR DE SINCRONIZACIÓN
class SyncManager {
    private events: SyncEvent[] = []
    private listeners: Map<string, Function[]> = new Map()

    // Registrar listener para eventos
    subscribe(eventType: string, callback: Function) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, [])
        }
        this.listeners.get(eventType)?.push(callback)
    }

    // Desregistrar listener
    unsubscribe(eventType: string, callback: Function) {
        const callbacks = this.listeners.get(eventType)
        if (callbacks) {
            const index = callbacks.indexOf(callback)
            if (index > -1) {
                callbacks.splice(index, 1)
            }
        }
    }

    // Emitir evento
    emit(eventType: string, data: any) {
        const callbacks = this.listeners.get(eventType) || []
        callbacks.forEach(callback => callback(data))
    }

    // ADMIN → CLIENTE: Procesar acciones del admin
    processAdminAction(action: AdminAction) {
        const event: SyncEvent = {
            id: `sync_${Date.now()}`,
            type: 'admin_to_client',
            action: action.type,
            data: action.data,
            timestamp: new Date().toISOString(),
            sourceUser: 'admin',
            targetUser: action.clienteEmail
        }

        this.events.push(event)
        this.syncToClient(event)
    }

    // CLIENTE → ADMIN: Procesar acciones del cliente
    processClientAction(action: ClientAction) {
        const event: SyncEvent = {
            id: `sync_${Date.now()}`,
            type: 'client_to_admin',
            action: action.type,
            data: action.data,
            timestamp: new Date().toISOString(),
            sourceUser: action.clienteEmail
        }

        this.events.push(event)
        this.syncToAdmin(event)
    }

    // Sincronizar hacia el cliente
    private syncToClient(event: SyncEvent) {
        switch (event.action) {
            case 'agenda_cita':
                this.notifyClient(event.targetUser!, {
                    type: 'cita_agendada',
                    titulo: '🎉 Cita agendada por administrador',
                    mensaje: `Su cita para ${event.data.mascota} ha sido programada para ${event.data.fecha} a las ${event.data.hora}`,
                    data: event.data
                })
                break

            case 'confirma_cita':
                this.notifyClient(event.targetUser!, {
                    type: 'cita_confirmada',
                    titulo: '✅ Cita confirmada',
                    mensaje: `Su cita para ${event.data.mascota} ha sido confirmada por nuestro equipo`,
                    data: event.data
                })
                break

            case 'movil_en_ruta':
                this.notifyClient(event.targetUser!, {
                    type: 'veterinario_camino',
                    titulo: '🚐 Veterinario en camino',
                    mensaje: `${event.data.veterinario} está en camino. Llegada estimada: ${event.data.tiempoEstimado} minutos`,
                    data: event.data
                })
                break

            case 'actualiza_kri':
                this.notifyClient(event.targetUser!, {
                    type: 'alerta_kri',
                    titulo: '⚠️ ' + event.data.titulo,
                    mensaje: event.data.mensaje,
                    data: event.data
                })
                break

            case 'cancela_cita':
                this.notifyClient(event.targetUser!, {
                    type: 'cita_cancelada',
                    titulo: '❌ Cita cancelada',
                    mensaje: `Su cita para ${event.data.mascota} del ${event.data.fecha} ha sido cancelada. Motivo: ${event.data.motivo}`,
                    data: event.data
                })
                break
        }
    }

    // Sincronizar hacia el admin
    private syncToAdmin(event: SyncEvent) {
        switch (event.action) {
            case 'agenda_cita':
                this.updateAdminDashboard({
                    type: 'nueva_reserva',
                    mensaje: `Nueva cita agendada por ${event.sourceUser}`,
                    data: event.data,
                    timestamp: event.timestamp
                })
                this.updateKPI('total_reservas', +1)
                break

            case 'califica_servicio':
                this.updateAdminDashboard({
                    type: 'nueva_calificacion',
                    mensaje: `Nueva calificación: ${event.data.calificacion}/5 estrellas`,
                    data: event.data,
                    timestamp: event.timestamp
                })
                this.updateKPI('satisfaccion_promedio', event.data.calificacion)
                break

            case 'cancela_cita':
                this.updateAdminDashboard({
                    type: 'cita_cancelada',
                    mensaje: `Cita cancelada por ${event.sourceUser}`,
                    data: event.data,
                    timestamp: event.timestamp
                })
                this.updateKPI('cancelaciones', +1)
                this.liberateSlot(event.data.fecha, event.data.hora)
                break

            case 'confirma_asistencia':
                this.updateAdminDashboard({
                    type: 'confirmacion_cliente',
                    mensaje: `${event.sourceUser} confirmó asistencia`,
                    data: event.data,
                    timestamp: event.timestamp
                })
                break
        }
    }

    // Notificar al cliente (actualizar su localStorage y emitir evento)
    private notifyClient(clienteEmail: string, notification: any) {
        // En un sistema real, esto sería WebSocket o Server-Sent Events
        // Para la demo, usamos localStorage y eventos del navegador

        const clienteSession = localStorage.getItem('cliente_session')
        if (clienteSession) {
            const session = JSON.parse(clienteSession)
            if (session.email === clienteEmail) {
                // Agregar notificación a la sesión del cliente
                const notificaciones = session.notificaciones || []
                notificaciones.unshift({
                    id: `notif_${Date.now()}`,
                    ...notification,
                    timestamp: new Date().toISOString(),
                    leida: false
                })

                session.notificaciones = notificaciones.slice(0, 50) // Mantener últimas 50
                localStorage.setItem('cliente_session', JSON.stringify(session))

                // Emitir evento para actualizar UI en tiempo real
                this.emit('client_notification', notification)
            }
        }
    }

    // Actualizar dashboard del admin
    private updateAdminDashboard(update: any) {
        // Obtener datos actuales del admin
        const adminData = JSON.parse(localStorage.getItem('admin_dashboard_data') || '{}')

        // Agregar nueva actividad
        if (!adminData.recentActivity) {
            adminData.recentActivity = []
        }

        adminData.recentActivity.unshift(update)
        adminData.recentActivity = adminData.recentActivity.slice(0, 20) // Últimas 20 actividades

        // Actualizar timestamp de última sincronización
        adminData.lastSync = new Date().toISOString()

        localStorage.setItem('admin_dashboard_data', JSON.stringify(adminData))

        // Emitir evento para actualizar UI del admin
        this.emit('admin_dashboard_update', update)
    }

    // Actualizar KPIs en tiempo real
    private updateKPI(kpiName: string, value: number) {
        const adminData = JSON.parse(localStorage.getItem('admin_dashboard_data') || '{}')

        if (!adminData.kpis) {
            adminData.kpis = {}
        }

        switch (kpiName) {
            case 'total_reservas':
                adminData.kpis.totalReservas = (adminData.kpis.totalReservas || 156) + value
                break
            case 'satisfaccion_promedio':
                // Calcular nuevo promedio (simplificado)
                const currentAvg = adminData.kpis.satisfaccionPromedio || 4.5
                const totalRatings = adminData.kpis.totalCalificaciones || 100
                const newAvg = ((currentAvg * totalRatings) + value) / (totalRatings + 1)
                adminData.kpis.satisfaccionPromedio = Math.round(newAvg * 10) / 10
                adminData.kpis.totalCalificaciones = totalRatings + 1
                break
            case 'cancelaciones':
                adminData.kpis.cancelaciones = (adminData.kpis.cancelaciones || 5) + value
                break
        }

        localStorage.setItem('admin_dashboard_data', JSON.stringify(adminData))
        this.emit('kpi_update', { kpiName, value: adminData.kpis[kpiName] })
    }

    // Liberar slot cuando se cancela una cita
    private liberateSlot(fecha: string, hora: string) {
        const slotsData = JSON.parse(localStorage.getItem('available_slots') || '{}')

        if (!slotsData[fecha]) {
            slotsData[fecha] = []
        }

        // Agregar slot liberado
        slotsData[fecha].push(hora)
        slotsData[fecha].sort()

        localStorage.setItem('available_slots', JSON.stringify(slotsData))
        this.emit('slot_available', { fecha, hora })
    }

    // Obtener eventos recientes
    getRecentEvents(limit: number = 10): SyncEvent[] {
        return this.events.slice(-limit).reverse()
    }

    // Limpiar eventos antiguos (mantener solo últimos 100)
    cleanup() {
        if (this.events.length > 100) {
            this.events = this.events.slice(-100)
        }
    }
}

// 🌐 INSTANCIA GLOBAL DEL SINCRONIZADOR
export const syncManager = new SyncManager()

// 🔧 HOOKS PARA REACT

export function useAdminSync() {
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [kpis, setKpis] = useState<any>({})

    useEffect(() => {
        // Cargar datos iniciales
        const adminData = JSON.parse(localStorage.getItem('admin_dashboard_data') || '{}')
        setRecentActivity(adminData.recentActivity || [])
        setKpis(adminData.kpis || {})

        // Suscribirse a actualizaciones
        const handleDashboardUpdate = (update: any) => {
            setRecentActivity(prev => [update, ...prev.slice(0, 19)])
        }

        const handleKpiUpdate = (data: any) => {
            setKpis(prev => ({ ...prev, [data.kpiName]: data.value }))
        }

        syncManager.subscribe('admin_dashboard_update', handleDashboardUpdate)
        syncManager.subscribe('kpi_update', handleKpiUpdate)

        return () => {
            syncManager.unsubscribe('admin_dashboard_update', handleDashboardUpdate)
            syncManager.unsubscribe('kpi_update', handleKpiUpdate)
        }
    }, [])

    // Funciones para que el admin ejecute acciones
    const agendarCita = (citaData: any, clienteEmail: string) => {
        syncManager.processAdminAction({
            type: 'agenda_cita',
            data: citaData,
            clienteEmail
        })
    }

    const confirmarCita = (citaData: any, clienteEmail: string) => {
        syncManager.processAdminAction({
            type: 'confirma_cita',
            data: citaData,
            clienteEmail
        })
    }

    const movilEnRuta = (rutaData: any, clienteEmail: string) => {
        syncManager.processAdminAction({
            type: 'movil_en_ruta',
            data: rutaData,
            clienteEmail
        })
    }

    const actualizarKRI = (kriData: any, clienteEmail: string) => {
        syncManager.processAdminAction({
            type: 'actualiza_kri',
            data: kriData,
            clienteEmail
        })
    }

    return {
        recentActivity,
        kpis,
        agendarCita,
        confirmarCita,
        movilEnRuta,
        actualizarKRI
    }
}

export function useClientSync() {
    const [notifications, setNotifications] = useState<any[]>([])

    useEffect(() => {
        // Cargar notificaciones iniciales
        const clienteSession = localStorage.getItem('cliente_session')
        if (clienteSession) {
            const session = JSON.parse(clienteSession)
            setNotifications(session.notificaciones || [])
        }

        // Suscribirse a nuevas notificaciones
        const handleClientNotification = (notification: any) => {
            setNotifications(prev => [notification, ...prev.slice(0, 49)])
        }

        syncManager.subscribe('client_notification', handleClientNotification)

        return () => {
            syncManager.unsubscribe('client_notification', handleClientNotification)
        }
    }, [])

    // Funciones para que el cliente ejecute acciones
    const agendarCita = (citaData: any) => {
        const clienteSession = localStorage.getItem('cliente_session')
        if (clienteSession) {
            const session = JSON.parse(clienteSession)
            syncManager.processClientAction({
                type: 'agenda_cita',
                data: citaData,
                clienteEmail: session.email
            })
        }
    }

    const calificarServicio = (calificacionData: any) => {
        const clienteSession = localStorage.getItem('cliente_session')
        if (clienteSession) {
            const session = JSON.parse(clienteSession)
            syncManager.processClientAction({
                type: 'califica_servicio',
                data: calificacionData,
                clienteEmail: session.email
            })
        }
    }

    const cancelarCita = (citaData: any) => {
        const clienteSession = localStorage.getItem('cliente_session')
        if (clienteSession) {
            const session = JSON.parse(clienteSession)
            syncManager.processClientAction({
                type: 'cancela_cita',
                data: citaData,
                clienteEmail: session.email
            })
        }
    }

    const confirmarAsistencia = (citaData: any) => {
        const clienteSession = localStorage.getItem('cliente_session')
        if (clienteSession) {
            const session = JSON.parse(clienteSession)
            syncManager.processClientAction({
                type: 'confirma_asistencia',
                data: citaData,
                clienteEmail: session.email
            })
        }
    }

    return {
        notifications,
        agendarCita,
        calificarServicio,
        cancelarCita,
        confirmarAsistencia
    }
}

// 🚀 FUNCIONES DE UTILIDAD PARA DEMO

export function simulateAdminActions() {
    // Simular acciones del admin para demo
    const demoActions = [
        {
            action: () => syncManager.processAdminAction({
                type: 'agenda_cita',
                data: {
                    mascota: 'Luna',
                    fecha: '2024-07-20',
                    hora: '10:30',
                    servicio: 'Vacunación',
                    veterinario: 'Dr. González'
                },
                clienteEmail: 'maria.lopez@email.com'
            }),
            delay: 2000
        },
        {
            action: () => syncManager.processAdminAction({
                type: 'movil_en_ruta',
                data: {
                    veterinario: 'Dr. García',
                    tiempoEstimado: 15,
                    ubicacion: 'A 2 km de su domicilio'
                },
                clienteEmail: 'carlos.garcia@email.com'
            }),
            delay: 5000
        },
        {
            action: () => syncManager.processAdminAction({
                type: 'actualiza_kri',
                data: {
                    titulo: 'Alta demanda detectada',
                    mensaje: 'Recomendamos usar servicio móvil para evitar esperas',
                    urgencia: 'media'
                },
                clienteEmail: 'ana.martinez@email.com'
            }),
            delay: 8000
        }
    ]

    demoActions.forEach(({ action, delay }) => {
        setTimeout(action, delay)
    })
}

export function simulateClientActions() {
    // Simular acciones del cliente para demo
    setTimeout(() => {
        syncManager.processClientAction({
            type: 'agenda_cita',
            data: {
                mascota: 'Max',
                fecha: '2024-07-22',
                hora: '14:00',
                servicio: 'Control rutinario',
                tipo: 'Móvil'
            },
            clienteEmail: 'carlos.garcia@email.com'
        })
    }, 3000)

    setTimeout(() => {
        syncManager.processClientAction({
            type: 'califica_servicio',
            data: {
                calificacion: 5,
                comentario: 'Excelente atención a domicilio',
                servicio: 'Vacunación móvil',
                veterinario: 'Dra. Martínez'
            },
            clienteEmail: 'maria.lopez@email.com'
        })
    }, 6000)
}