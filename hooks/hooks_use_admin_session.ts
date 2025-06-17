import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdminSession {
  email: string
  role: 'admin' | 'veterinario' | 'recepcion'
  loginTime: string
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionData = localStorage.getItem('admin_session')
        if (!sessionData) {
          setLoading(false)
          return
        }

        const parsedSession = JSON.parse(sessionData)
        
        // Verificar que el email termine con @mascotafeliz.cl
        if (!parsedSession.email?.endsWith('@mascotafeliz.cl')) {
          localStorage.removeItem('admin_session')
          setLoading(false)
          return
        }

        // Verificar que la sesión no haya expirado (24 horas)
        const loginTime = new Date(parsedSession.loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 3600)
        
        if (hoursDiff > 24) {
          localStorage.removeItem('admin_session')
          setLoading(false)
          return
        }

        setSession(parsedSession)
      } catch (error) {
        localStorage.removeItem('admin_session')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const logout = () => {
    localStorage.removeItem('admin_session')
    setSession(null)
    router.push('/panel')
  }

  const login = (email: string, role: AdminSession['role']) => {
    const sessionData: AdminSession = {
      email,
      role,
      loginTime: new Date().toISOString()
    }
    localStorage.setItem('admin_session', JSON.stringify(sessionData))
    setSession(sessionData)
  }

  const hasPermission = (requiredRole?: AdminSession['role']) => {
    if (!session) return false
    if (!requiredRole) return true
    
    const roleHierarchy = {
      'admin': 3,
      'veterinario': 2,
      'recepcion': 1
    }

    return roleHierarchy[session.role] >= roleHierarchy[requiredRole]
  }

  return {
    session,
    loading,
    isAuthenticated: !!session,
    login,
    logout,
    hasPermission
  }
}