import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function RegistroExitosoPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-6">
          <Image
            src="/placeholder.svg?height=64&width=64"
            alt="Mascota Feliz Logo"
            width={64}
            height={64}
            className="h-16 w-16"
          />

          <CheckCircle className="h-16 w-16 text-teal-600" />

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">¡Registro Exitoso!</h1>
            <p className="text-muted-foreground">
              Tu cuenta ha sido creada correctamente. Ahora puedes acceder a todos nuestros servicios veterinarios.
            </p>
          </div>

          <div className="flex flex-col w-full space-y-3">
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/iniciar-sesion">Iniciar Sesión</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
