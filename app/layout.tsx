import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mascota Feliz',
  description: 'Veterinaria mascota feliz ',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="h-full">
      <body>{children}</body>
    </html>
  )
}
