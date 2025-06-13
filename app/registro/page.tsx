"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Card, CardContent } from "@/components/ui/card"
import { PetForm } from "@/components/pet-form"

interface Pet {
  id: string
  name: string
  species: string
  age: string
  breed: string
}

export default function RegistroPage() {
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "1",
      name: "",
      species: "",
      age: "",
      breed: "",
    },
  ])

  const addPet = () => {
    setPets([
      ...pets,
      {
        id: `${pets.length + 1}`,
        name: "",
        species: "",
        age: "",
        breed: "",
      },
    ])
  }

  const removePet = (id: string) => {
    if (pets.length > 1) {
      setPets(pets.filter((pet) => pet.id !== id))
    }
  }

  const updatePet = (id: string, field: keyof Pet, value: string) => {
    setPets(
      pets.map((pet) => {
        if (pet.id === id) {
          return { ...pet, [field]: value }
        }
        return pet
      }),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar los datos al servidor
    console.log("Formulario enviado")
    // Redirigir al usuario a la página principal o de confirmación
    router.push("/registro-exitoso")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ChevronLeft className="h-5 w-5" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </header>

      <div className="container py-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-4">
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="Mascota Feliz Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Crea tu cuenta en Mascota Feliz</h1>
          <p className="mt-2 text-muted-foreground">Regístrate para acceder a todos nuestros servicios veterinarios</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Información Personal</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombres">Nombres</Label>
                      <Input id="nombres" placeholder="Ingresa tus nombres" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos</Label>
                      <Input id="apellidos" placeholder="Ingresa tus apellidos" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rut">RUT</Label>
                    <Input id="rut" placeholder="12.345.678-9" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" type="email" placeholder="tu@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Número de Teléfono</Label>
                      <Input id="telefono" type="tel" placeholder="+56 9 1234 5678" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <Input id="confirmPassword" type="password" required />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Información de Mascotas</h2>
                <Button type="button" onClick={addPet} variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Agregar otra mascota</span>
                </Button>
              </div>

              {pets.map((pet, index) => (
                <Card key={pet.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Mascota {index + 1}</h3>
                      {pets.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removePet(pet.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span>Eliminar</span>
                        </Button>
                      )}
                    </div>
                    <PetForm pet={pet} updatePet={updatePet} />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col space-y-4">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Crear Cuenta
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/iniciar-sesion" className="text-teal-600 hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
