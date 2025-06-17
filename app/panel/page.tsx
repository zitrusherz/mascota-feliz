"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PanelLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validación del dominio de correo
    if (!email.endsWith("@mascotafeliz.cl")) {
      setError("Solo personal autorizado puede acceder al panel administrativo")
      setLoading(false)
      return
    }

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña")
      setLoading(false)
      return
    }

    // Simulación de autenticación
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular usuarios autorizados
      const authorizedUsers = [
        "admin@mascotafeliz.cl",
        "veterinario@mascotafeliz.cl",
        "recepcion@mascotafeliz.cl"
      ]

      if (authorizedUsers.includes(email) && password.length >= 6) {
        // Guardar sesión simulada
        localStorage.setItem("admin_session", JSON.stringify({
          email,
          role: email.includes("admin") ? "admin" : email.includes("veterinario") ? "veterinario" : "recepcion",
          loginTime: new Date().toISOString()
        }))
        
        router.push("/panel/dashboard")
      } else {
        setError("Credenciales incorrectas")
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 text-teal-600 hover:text-teal-700">
            <ChevronLeft className="h-5 w-5" />
            <span>Volver al sitio web</span>
          </Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Mascota Feliz Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
            <p className="mt-2 text-gray-600">
              Acceso exclusivo para personal autorizado
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center text-xl font-medium">Iniciar Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Corporativo</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@mascotafeliz.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Acceder al Panel
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                  <p className="text-xs text-blue-600">
                    <strong>Para pruebas:</strong><br />
                    admin@mascotafeliz.cl / 123456<br />
                    veterinario@mascotafeliz.cl / 123456<br />
                    recepcion@mascotafeliz.cl / 123456
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}