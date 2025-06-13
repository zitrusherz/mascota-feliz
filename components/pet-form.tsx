"use client"

import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"

interface Pet {
  id: string
  name: string
  species: string
  age: string
  breed: string
}

interface PetFormProps {
  pet: Pet
  updatePet: (id: string, field: keyof Pet, value: string) => void
}

export function PetForm({ pet, updatePet }: PetFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`pet-name-${pet.id}`}>Nombre de la Mascota</Label>
          <Input
            id={`pet-name-${pet.id}`}
            value={pet.name}
            onChange={(e) => updatePet(pet.id, "name", e.target.value)}
            placeholder="Nombre de tu mascota"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`pet-species-${pet.id}`}>Especie</Label>
          <Select value={pet.species} onValueChange={(value) => updatePet(pet.id, "species", value)} required>
            <SelectTrigger id={`pet-species-${pet.id}`}>
              <SelectValue placeholder="Selecciona una especie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perro">Perro</SelectItem>
              <SelectItem value="gato">Gato</SelectItem>
              <SelectItem value="ave">Ave</SelectItem>
              <SelectItem value="roedor">Roedor</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`pet-age-${pet.id}`}>Edad (años)</Label>
          <Input
            id={`pet-age-${pet.id}`}
            value={pet.age}
            onChange={(e) => updatePet(pet.id, "age", e.target.value)}
            placeholder="Edad de tu mascota"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`pet-breed-${pet.id}`}>Raza (si aplica)</Label>
          <Input
            id={`pet-breed-${pet.id}`}
            value={pet.breed}
            onChange={(e) => updatePet(pet.id, "breed", e.target.value)}
            placeholder="Raza de tu mascota"
          />
        </div>
      </div>
    </div>
  )
}
