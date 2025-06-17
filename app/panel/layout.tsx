"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Solo verificar autenticación si no estamos en la página de login
    if (pathname !== '/panel') {
      const session = localStorage.getItem('admin_session')
      
      if (!session) {
        router.push('/panel')
        return
      }

      try {
        const sessionData = JSON.parse(session)
        
        // Verificar que el email termine con @mascotafeliz.cl
        if (!sessionData.email?.endsWith('@mascotafeliz.cl')) {
          localStorage.removeItem('admin_session')
          router.push('/panel')
          return
        }

        // Verificar que la sesión no haya expirado (24 horas)
        const loginTime = new Date(sessionData.loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 3600)
        
        if (hoursDiff > 24) {
          localStorage.removeItem('admin_session')
          router.push('/panel')
          return
        }
      } catch (error) {
        localStorage.removeItem('admin_session')
        router.push('/panel')
      }
    }
  }, [pathname, router])

  return <>{children}</>
}