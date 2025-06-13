"use client"
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";

  import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import { ReservationForm } from "@/components/reservation-form"
import { serviceImages } from "@/lib/service-images";
import pharmacyImageMap from "@/lib/pharmacy-images";
import { useState } from "react";



export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Mascota Feliz Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="hidden font-bold sm:inline-block text-teal-600">Mascota Feliz</span>
            </Link>
            {/* Navegación desktop */}
            <nav className="hidden md:flex gap-6">
              <Link href="#home" className="text-sm font-medium transition-colors hover:text-teal-600">Inicio</Link>
              <Link href="#services" className="text-sm font-medium transition-colors hover:text-teal-600">Servicios</Link>
              <Link href="#about" className="text-sm font-medium transition-colors hover:text-teal-600">Nosotros</Link>
              <Link href="#contact" className="text-sm font-medium transition-colors hover:text-teal-600">Contacto</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Botones desktop */}
            <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
              <Link href="/iniciar-sesion">Iniciar Sesión</Link>
            </Button>
            <Button size="sm" className="hidden sm:flex bg-teal-600 hover:bg-teal-700" asChild>
              <Link href="/registro">Registrarse</Link>
            </Button>

            {/* Menú hamburguesa */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Menú mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white shadow-md">
            <div className="flex flex-col px-4 py-3 space-y-2">
              <Link href="#home" className="text-sm font-medium hover:text-teal-600">Inicio</Link>
              <Link href="#services" className="text-sm font-medium hover:text-teal-600">Servicios</Link>
              <Link href="#about" className="text-sm font-medium hover:text-teal-600">Nosotros</Link>
              <Link href="#contact" className="text-sm font-medium hover:text-teal-600">Contacto</Link>
              <Link href="/iniciar-sesion" className="text-sm font-medium hover:text-teal-600">Iniciar Sesión</Link>
              <Link href="/registro" className="text-sm font-medium hover:text-teal-600">Registrarse</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative h-[500px] md:h-[620px] lg:h-[700px]">
          {/* Fondo oscuro + control del espacio visible */}
          <div className="absolute inset-0 z-0 bg-white flex items-center justify-center">
            {/* Control del tamaño visible mediante padding relativo */}
            <div className="w-full h-full relative p-[10%]">
              <Image
                src="/img/inicio/banner.png"
                alt="Clinica Veterinaria Mascota Feliz"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Capa semitransparente encima de la imagen */}
            <div className="absolute inset-0 bg-black/60 z-10" />
          </div>

          {/* Contenido visible encima de la imagen */}
          <div className="container relative z-20 py-24 md:py-32 lg:py-40">
            <div className="max-w-3xl space-y-5 text-white">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Mascota Feliz</h1>
              <p className="text-xl md:text-2xl">Cuidamos de tus mascotas con amor y profesionalismo desde 1995</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700" asChild>
                  <Link href="#reservations" className="text-sm font-medium transition-colors hover:text-teal-600">
                  Reservar Hora
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/20"
                >
                  Emergencias
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* Quick Access */}
        <section className="bg-white py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-teal-100 hover:border-teal-300 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-teal-600"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Reservas Online</h3>
                  <p className="text-muted-foreground">Agenda una cita para tu mascota de manera rápida y sencilla</p>
                  <Button className="bg-teal-600 hover:bg-teal-700" asChild>
                    <Link href="#reservations" className="text-sm font-medium transition-colors hover:text-teal-600">
                    Reservar Ahora
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-teal-100 hover:border-teal-300 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-teal-600"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Servicios</h3>
                  <p className="text-muted-foreground">Conoce todos nuestros servicios veterinarios disponibles</p>
                  <Button className="bg-teal-600 hover:bg-teal-700" asChild>
                    <Link href="#services" className="text-sm font-medium transition-colors hover:text-teal-600">
                    Ver Servicios
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-teal-100 hover:border-teal-300 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-teal-600"
                    >
                      <path d="m8 14-6 6h9v-3" />
                      <path d="M18.37 3.63 8 14l3 3L21.37 6.63a2.12 2.12 0 1 0-3-3Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Emergencias</h3>
                  <p className="text-muted-foreground">Atención de emergencias veterinarias las 24 horas</p>
                  <Button className="bg-red-600 hover:bg-red-700">Llamar Ahora</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section id="about" className="py-16 bg-slate-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Sobre Nosotros</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Conoce nuestra historia y compromiso con la salud animal
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/img/inicio/nosotros.png"
                  alt="Equipo Veterinario"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Nuestra Historia</h3>
                  <p>
                    Fundada en 1995 en San Bernardo, Mascota Feliz nació con la misión de brindar atención veterinaria
                    de calidad a las mascotas de la comunidad. A lo largo de los años, hemos crecido junto con la
                    ciudad, adaptándonos a las necesidades cambiantes y evolucionando especialmente después de la
                    pandemia para ofrecer servicios más completos y accesibles.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Nuestra Filosofía</h3>
                  <p>
                    En Mascota Feliz creemos que cada animal merece un cuidado excepcional. Nuestro compromiso es
                    proporcionar servicios veterinarios de la más alta calidad con compasión y profesionalismo, tratando
                    a cada mascota como si fuera nuestra.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Nuestro Equipo</h3>
                  <p>
                    Contamos con un equipo de profesionales altamente calificados y apasionados por el bienestar animal.
                    Nuestros veterinarios, técnicos y personal de apoyo trabajan juntos para asegurar que tu mascota
                    reciba la mejor atención posible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Nuestros Servicios</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ofrecemos una amplia gama de servicios veterinarios para el cuidado integral de tu mascota
              </p>
            </div>

            <Tabs defaultValue="branch" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="branch">Servicios en Sucursal</TabsTrigger>
                <TabsTrigger value="mobile">Servicios Móviles</TabsTrigger>
              </TabsList>
              <TabsContent value="branch">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Radiografías",
                      description:
                        "Diagnóstico por imágenes de alta calidad para detectar problemas óseos y orgánicos.",
                      duration: "30 minutos",
                      requirements: "Ayuno de 4 horas en algunos casos",
                      price: "$35.000 - $50.000",
                    },
                    {
                      title: "Centro de Vacunación",
                      description: "Vacunas esenciales y opcionales para perros y gatos de todas las edades.",
                      duration: "15 minutos",
                      requirements: "Mascota en buen estado de salud",
                      price: "$15.000 - $30.000",
                    },
                    {
                      title: "Cirugías",
                      description:
                        "Procedimientos quirúrgicos realizados por especialistas con equipamiento de última generación.",
                      duration: "Variable según procedimiento",
                      requirements: "Evaluación previa y ayuno de 8 horas",
                      price: "Desde $80.000",
                    },
                    {
                      title: "Laboratorio Clínico",
                      description: "Análisis de sangre, orina y otros exámenes para diagnóstico preciso.",
                      duration: "Resultados en 24-48 horas",
                      requirements: "Varía según el examen",
                      price: "$20.000 - $45.000",
                    },
                    {
                      title: "Hospitalización",
                      description:
                        "Cuidados intensivos y monitoreo constante para mascotas que requieren atención especial.",
                      duration: "Según necesidad médica",
                      requirements: "Evaluación veterinaria previa",
                      price: "$35.000 por día",
                    },
                    {
                      title: "Peluquería Canina y Felina",
                      description: "Servicios de baño, corte y cuidado estético para tu mascota.",
                      duration: "1-2 horas",
                      requirements: "Vacunas al día",
                      price: "$15.000 - $35.000",
                    },
                  ].map((service, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative w-full h-[300px] sm:h-[400px] bg-slate-100 flex items-center justify-center">
                        <Image
                          src={serviceImages[service.title] ?? "/placeholder.svg?height=200&width=300"}
                          alt={serviceImages[service.title]}
                          width={300}
                          height={300}
                          loading="lazy"

                          className="w-full h-full object-cover"
                          
                          /*className="object-cover"*/
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                        <p className="text-muted-foreground mb-4">{service.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Duración:</span>
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Requisitos:</span>
                            <span>{service.requirements}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Precio estimado:</span>
                            <span>{service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="mobile">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Vacunación a Domicilio",
                      description: "Servicio de vacunación en la comodidad de tu hogar.",
                      duration: "30 minutos",
                      requirements: "Mascota en buen estado de salud",
                      price: "$25.000 - $40.000",
                    },
                    {
                      title: "Peluquería Básica",
                      description: "Servicios de baño y corte básico a domicilio.",
                      duration: "1-2 horas",
                      requirements: "Espacio adecuado y agua caliente",
                      price: "$25.000 - $45.000",
                    },
                    {
                      title: "Desparasitación",
                      description: "Control de parásitos internos y externos en tu hogar.",
                      duration: "30 minutos",
                      requirements: "Ninguno específico",
                      price: "$15.000 - $25.000",
                    },
                    {
                      title: "Atención de Emergencias",
                      description: "Atención médica de urgencia en tu domicilio.",
                      duration: "Variable según caso",
                      requirements: "Ninguno",
                      price: "$45.000 - $60.000",
                    },
                    {
                      title: "Derivación a Sucursal",
                      description: "Evaluación y traslado a la clínica en casos graves.",
                      duration: "Variable",
                      requirements: "Según evaluación veterinaria",
                      price: "Consultar",
                    },
                  ].map((service, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative w-full h-[300px] sm:h-[400px] bg-slate-100 flex items-center justify-center">
                        <Image
                          src={serviceImages[service.title] ?? "/placeholder.jpg"}
                          alt={service.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"

                          /*className="object-cover"*/
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                        <p className="text-muted-foreground mb-4">{service.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Duración:</span>
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Requisitos:</span>
                            <span>{service.requirements}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Precio estimado:</span>
                            <span>{service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Online Reservations */}
        <section id="reservations" className="py-16 bg-teal-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Reserva Online</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Agenda una cita para tu mascota de manera rápida y sencilla
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <ReservationForm />
            </div>
          </div>
        </section>

        {/* Pharmacy */}
        <section id="pharmacy" className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Farmacia Veterinaria</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Medicamentos y productos de calidad para el cuidado de tu mascota
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Medicamentos",
                "Alimentos Especiales",
                "Suplementos",
                "Accesorios",
                "Antiparasitarios",
                "Vitaminas",
                "Shampoos Especiales",
                "Productos Dentales",
              ].map((category, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative w-full h-[200px] sm:h-[250px] bg-slate-100 flex items-center justify-center">
                    <Image
                      src={pharmacyImageMap[category] || "/placeholder.jpg"}
                      alt={category}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium">{category}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button className="bg-teal-600 hover:bg-teal-700">Ver Catálogo Completo</Button>
            </div>
          </div>
        </section>

        {/* Blog/News */}
        <section id="blog" className="py-16 bg-slate-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Noticias y Consejos</h2>
              <p className="mt-4 text-lg text-muted-foreground">Mantente informado sobre el cuidado de tu mascota</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Campaña de Vacunación 2023",
                  excerpt: "Conoce nuestra nueva campaña de vacunación con precios especiales para perros y gatos.",
                  date: "10 de Junio, 2023",
                },
                {
                  title: "Cuidados para tu mascota en verano",
                  excerpt:
                    "Consejos prácticos para mantener a tu mascota fresca y saludable durante los meses de calor.",
                  date: "5 de Junio, 2023",
                },
                {
                  title: "Nuevas áreas de cobertura",
                  excerpt: "Ampliamos nuestro servicio veterinario móvil a nuevos sectores de San Bernardo.",
                  date: "1 de Junio, 2023",
                },
              ].map((post, index) => (
                <Card key={index}>
                  <div className="h-48 bg-slate-100">
                    <Image
                      src={`/placeholder.svg?height=200&width=400&text=Blog+${index + 1}`}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">{post.date}</div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="mb-4">{post.excerpt}</p>
                    <Button variant="outline">Leer más</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline">Ver Todas las Noticias</Button>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Contacto</h2>
              <p className="mt-4 text-lg text-muted-foreground">Estamos aquí para ayudarte con cualquier consulta</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-teal-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Dirección</p>
                        <p className="text-muted-foreground">Av. Ejemplo 1234, San Bernardo, Santiago, Chile</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-teal-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Teléfono</p>
                        <p className="text-muted-foreground">+56 2 2345 6789</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-teal-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">contacto@mascotafeliz.cl</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-teal-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Horario de Atención</p>
                        <p className="text-muted-foreground">Lunes a Viernes: 9:00 - 19:00</p>
                        <p className="text-muted-foreground">Sábados: 10:00 - 14:00</p>
                        <p className="text-muted-foreground">Emergencias: 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Síguenos</h3>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon">
                      <Facebook className="h-5 w-5" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Envíanos un Mensaje</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nombre
                      </label>
                      <Input id="name" placeholder="Tu nombre" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="tu@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Asunto
                    </label>
                    <Input id="subject" placeholder="Asunto del mensaje" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mensaje
                    </label>
                    <Textarea id="message" placeholder="Tu mensaje" className="min-h-[120px]" />
                  </div>
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Cómo Llegar</h3>
              <div className="h-[400px] w-full bg-slate-100 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53149.14038955556!2d-70.74271565!3d-33.59244765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d7a9f7c6f0c9%3A0x4e0f7a2a2b8b5b6c!2sSan%20Bernardo%2C%20Santiago%20Metropolitan%20Region%2C%20Chile!5e0!3m2!1sen!2s!4v1623456789012!5m2!1sen!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Mascota Feliz"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Mascota Feliz Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 bg-white rounded-full"
                />
                <span className="font-bold text-xl">Mascota Feliz</span>
              </div>
              <p className="text-slate-300">Cuidando de tus mascotas con amor y profesionalismo desde 1995.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#home" className="text-slate-300 hover:text-white">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="text-slate-300 hover:text-white">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-slate-300 hover:text-white">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-slate-300 hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Consultas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Vacunación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Cirugías
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Peluquería
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contacto</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Av. Ejemplo 1234, San Bernardo
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +56 2 2345 6789
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  contacto@mascotafeliz.cl
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} Mascota Feliz. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-slate-400 hover:text-white">
                Términos y Condiciones
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
