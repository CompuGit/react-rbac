"use client"

import type React from "react"
import { useRBAC } from "../hooks/use-rbac"
import type { ProtectedElementProps } from "../types/rbac"

export const ProtectedElement: React.FC<ProtectedElementProps> = ({
  children,
  fallback = null,
  roles = [],
  permissions = [],
  groups = [],
  mode = "any",
}) => {
  const { hasAccess, isAuthenticated } = useRBAC()

  if (roles.length === 0 && permissions.length === 0 && groups.length === 0) {
    return isAuthenticated() ? <>{children}</> : <>{fallback}</>
  }

  const authorized = hasAccess({ roles, permissions, groups, mode })

  return authorized ? <>{children}</> : <>{fallback}</>
}
