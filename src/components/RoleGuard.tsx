'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/lib/auth'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
  loading?: React.ReactNode
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null,
  loading = <div>Loading...</div>
}: RoleGuardProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setUserRole(null)
          setIsLoading(false)
          return
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setUserRole(profile?.role || 'user')
      } catch (error) {
        console.error('Error checking user role:', error)
        setUserRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserRole()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          checkUserRole()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (isLoading) {
    return <>{loading}</>
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Specific role guards for common use cases
export function AdminOnly({ 
  children, 
  fallback,
  loading 
}: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard 
      allowedRoles={['admin']} 
      fallback={fallback}
      loading={loading}
    >
      {children}
    </RoleGuard>
  )
}

export function AuthenticatedOnly({ 
  children, 
  fallback,
  loading 
}: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard 
      allowedRoles={['user', 'admin']} 
      fallback={fallback}
      loading={loading}
    >
      {children}
    </RoleGuard>
  )
}
