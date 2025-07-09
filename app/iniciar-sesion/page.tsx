// app/iniciar-sesion/page.tsx - ACTUALIZADO
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// USUARIOS SIMULADOS
const usuariosSimulados = [
  {
    email: "carlos.garcia@email.com",
    password: "123456",
    tipo: "cliente",
    nombre: "Carlos García",
    telefono: "+56 9 1234 5678",
    direccion: "Las Condes 123, Santiago",
    fechaRegistro: "2020-03-15",
    mascotas: [
      {
        id: "P001",
        nombre: "Max",
        especie: "Perro",
        raza: "Golden Retriever",
        edad: "5 años",
        peso: "32 kg",
        proximaVacuna: "2024-12-15",
        estadoSalud: "Saludable"
      }
    ],
    kpisPersonales: {
      tiempoPromedioEspera: 15,
      satisfaccionHistorica: 4.8,
      ahorroServicioMovil: 125000,
      visitasEsteAno: 8,
      vacunasAlDia: true,
      descuentosDisponibles: 15
    }
  },
  {
    email: "maria.lopez@email.com",
    password: "123456",
    tipo: "cliente",
    nombre: "María López",
    telefono: "+56 9 2345 6789",
    direccion: "Providencia 456, Santiago",
    fechaRegistro: "2021-08-20",
    mascotas: [
      {
        id: "P002",
        nombre: "Luna",
        especie: "Gato",
        raza: "Persa",
        edad: "3 años",
        peso: "4.5 kg",
        proximaVacuna: "2024-08-20",
        estadoSalud: "Control rutinario"
      },
      {
        id: "P003",
        nombre: "Simba",
        especie: "Gato",
        raza: "Siamés",
        edad: "1 año",
        peso: "3.2 kg",
        proximaVacuna: "2024-09-15",
        estadoSalud: "Saludable"
      }
    ],
    kpisPersonales: {
      tiempoPromedioEspera: 22,
      satisfaccionHistorica: 4.6,
      ahorroServicioMovil: 89000,
      visitasEsteAno: 12,
      vacunasAlDia: false,
      descuentosDisponibles: 10
    }
  },
  {
    email: "ana.martinez@email.com",
    password: "123456",
    tipo: "cliente",
    nombre: "Ana Martínez",
    telefono: "+56 9 3456 7890",
    direccion: "Ñuñoa 789, Santiago",
    fechaRegistro: "2018-05-10",
    mascotas: [
      {
        id: "P004",
        nombre: "Rocky",
        especie: "Perro",
        raza: "Bulldog",
        edad: "7 años",
        peso: "25 kg",
        proximaVacuna: "2024-07-12",
        estadoSalud: "Seguimiento"
      }
    ],
    kpisPersonales: {
      tiempoPromedioEspera: 18,
      satisfaccionHistorica: 4.9,
      ahorroServicioMovil: 156000,
      visitasEsteAno: 15,
      vacunasAlDia: true,
      descuentosDisponibles: 20
    }
  }
]

export default function IniciarSesionPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña")
      setLoading(false)
      return
    }

    // Simular delay de red
    setTimeout(() => {
      // Buscar usuario en la lista simulada
      const usuario = usuariosSimulados.find(
          u => u.email === email && u.password === password
      )

      if (usuario) {
        // Guardar sesión del cliente
        const sesionCliente = {
          email: usuario.email,
          nombre: usuario.nombre,
          tipo: usuario.tipo,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          fechaRegistro: usuario.fechaRegistro,
          mascotas: usuario.mascotas,
          kpisPersonales: usuario.kpisPersonales,
          loginTime: new Date().toISOString()
        }

        localStorage.setItem("cliente_session", JSON.stringify(sesionCliente))

        // Redirigir al portal del cliente
        router.push("/mi-cuenta")
      } else {
        setError("Credenciales incorrectas")
      }

      setLoading(false)
    }, 1000)
  }

  const usarCuentaDemo = (emailDemo: string) => {
    setEmail(emailDemo)
    setPassword("123456")
  }

  return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <ChevronLeft className="h-5 w-5" />
              <span>Volver al inicio</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center text-center">
              <Link href="/" className="mb-4">
                <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Mascota Feliz Logo"
                    width={64}
                    height={64}
                    className="h-16 w-16"
                />
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Iniciar Sesión</h1>
              <p className="mt-2 text-muted-foreground">
                Accede a tu cuenta para gestionar tus citas y ver el historial médico de tus mascotas
              </p>
            </div>

            <Card>
              <form onSubmit={handleSubmit}>
                <CardContent className="pt-6 space-y-4">
                  {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                      <Link href="/recuperar-contrasena" className="text-sm text-teal-600 hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      disabled={loading}
                  >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/registro" className="text-teal-600 hover:underline">
                      Regístrate
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>

            {/* Cuentas de Demo */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="font-medium text-blue-900 mb-3">🧪 Cuentas de Prueba</h3>
                <div className="space-y-2">
                  <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => usarCuentaDemo("carlos.garcia@email.com")}
                  >
                    <div>
                      <p className="font-medium">Carlos García</p>
                      <p className="text-xs text-muted-foreground">1 mascota • Cliente desde 2020</p>
                    </div>
                  </Button>

                  <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => usarCuentaDemo("maria.lopez@email.com")}
                  >
                    <div>
                      <p className="font-medium">María López</p>
                      <p className="text-xs text-muted-foreground">2 mascotas • Cliente desde 2021</p>
                    </div>
                  </Button>

                  <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => usarCuentaDemo("ana.martinez@email.com")}
                  >
                    <div>
                      <p className="font-medium">Ana Martínez</p>
                      <p className="text-xs text-muted-foreground">1 mascota • Cliente VIP desde 2018</p>
                    </div>
                  </Button>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  Todas las cuentas usan la contraseña: <strong>123456</strong>
                </p>
              </CardContent>
            </Card>

            {/* Acceso Admin */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-6 text-center">
                <h3 className="font-medium text-purple-900 mb-2">👨‍⚕️ ¿Eres del equipo?</h3>
                <Button asChild variant="outline" className="text-purple-700">
                  <Link href="/panel">Acceder al Panel Administrativo</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}