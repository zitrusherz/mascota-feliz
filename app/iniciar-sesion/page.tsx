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

export default function IniciarSesionPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para validar las credenciales
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña")
      return
    }

    // Simulación de inicio de sesión exitoso
    console.log("Inicio de sesión con:", { email, password })
    router.push("/") // Redirigir al usuario a la página principal
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
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  Iniciar Sesión
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
        </div>
      </div>
    </div>
  )
}
