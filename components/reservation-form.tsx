"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Textarea } from "@/components/ui/form/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlay/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReservationForm() {
  const [date, setDate] = useState<Date>()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <div className="text-teal-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">¡Reserva Recibida!</h3>
        <p className="text-muted-foreground mb-6">
          Hemos recibido tu solicitud de reserva. Te contactaremos pronto para confirmar tu cita.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Hacer otra reserva
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="service-type">Tipo de Servicio</Label>
          <Select required>
            <SelectTrigger id="service-type">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="branch">Atención en Sucursal</SelectItem>
              <SelectItem value="mobile">Veterinaria Móvil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Servicio</Label>
          <Select required>
            <SelectTrigger id="service">
              <SelectValue placeholder="Selecciona un servicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consulta General</SelectItem>
              <SelectItem value="vaccination">Vacunación</SelectItem>
              <SelectItem value="grooming">Peluquería</SelectItem>
              <SelectItem value="dental">Limpieza Dental</SelectItem>
              <SelectItem value="xray">Radiografía</SelectItem>
              <SelectItem value="surgery">Cirugía</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner-name">Nombre del Dueño</Label>
          <Input id="owner-name" placeholder="Tu nombre completo" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" type="tel" placeholder="+56 9 1234 5678" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pet-name">Nombre de la Mascota</Label>
          <Input id="pet-name" placeholder="Nombre de tu mascota" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pet-type">Tipo de Mascota</Label>
          <Select required>
            <SelectTrigger id="pet-type">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Perro</SelectItem>
              <SelectItem value="cat">Gato</SelectItem>
              <SelectItem value="bird">Ave</SelectItem>
              <SelectItem value="rodent">Roedor</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fecha Preferida</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => {
                  // Disable past dates and Sundays
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today || date.getDay() === 0
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Hora Preferida</Label>
          <Select required>
            <SelectTrigger id="time">
              <SelectValue placeholder="Selecciona una hora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="09:00">09:00</SelectItem>
              <SelectItem value="10:00">10:00</SelectItem>
              <SelectItem value="11:00">11:00</SelectItem>
              <SelectItem value="12:00">12:00</SelectItem>
              <SelectItem value="15:00">15:00</SelectItem>
              <SelectItem value="16:00">16:00</SelectItem>
              <SelectItem value="17:00">17:00</SelectItem>
              <SelectItem value="18:00">18:00</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notas Adicionales</Label>
          <Textarea
            id="notes"
            placeholder="Información adicional sobre tu mascota o el servicio requerido"
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="mt-6">
        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
          Solicitar Reserva
        </Button>
      </div>
    </form>
  )
}
