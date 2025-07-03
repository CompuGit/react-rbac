"use client"

import type React from "react"
import { useRBAC } from "../hooks/use-rbac"
import type { AuthorizationMode } from "../types/rbac"

interface ConditionalRenderProps {
  children: React.ReactNode
  show?: {
    roles?: string[]
    permissions?: string[]
    groups?: string[]
    mode?: AuthorizationMode
  }
  hide?: {
    roles?: string[]
    permissions?: string[]
    groups?: string[]
    mode?: AuthorizationMode
  }
  fallback?: React.ReactNode
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({ children, show, hide, fallback = null }) => {
  const { hasAccess } = useRBAC()

  let shouldShow = true

  if (show) {
    shouldShow = hasAccess({
      roles: show.roles || [],
      permissions: show.permissions || [],
      groups: show.groups || [],
      mode: show.mode || "any",
    })
  }

  if (hide && shouldShow) {
    const shouldHide = hasAccess({
      roles: hide.roles || [],
      permissions: hide.permissions || [],
      groups: hide.groups || [],
      mode: hide.mode || "any",
    })
    shouldShow = !shouldHide
  }

  return shouldShow ? <>{children}</> : <>{fallback}</>
}
