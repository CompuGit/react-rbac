"use client"

import type React from "react"
import { useRBAC } from "../hooks/use-rbac"
import type { AuthorizationMode } from "../types/rbac"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
  unauthorizedComponent?: React.ReactNode
  roles?: string[]
  permissions?: string[]
  groups?: string[]
  mode?: AuthorizationMode
  requireAuth?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  loadingComponent,
  unauthorizedComponent,
  roles = [],
  permissions = [],
  groups = [],
  mode = "any",
  requireAuth = true,
}) => {
  const { loading, initialized, hasAccess, isAuthenticated } = useRBAC()

  if (loading || !initialized) {
    return loadingComponent || <div>Loading...</div>
  }

  if (requireAuth && !isAuthenticated()) {
    return unauthorizedComponent || fallback || <div>Access Denied: Authentication required</div>
  }

  const authorized = hasAccess({ roles, permissions, groups, mode })

  if (!authorized) {
    return unauthorizedComponent || fallback || <div>Access Denied: Insufficient permissions</div>
  }

  return <>{children}</>
}
