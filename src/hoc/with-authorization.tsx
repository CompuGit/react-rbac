"use client"

import type React from "react"
import { useRBAC } from "../hooks/use-rbac"
import type { AuthorizationMode } from "../types/rbac"

interface WithAuthorizationOptions {
  roles?: string[]
  permissions?: string[]
  groups?: string[]
  mode?: AuthorizationMode
  fallback?: React.ComponentType
  loading?: React.ComponentType
}

export function withAuthorization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthorizationOptions = {},
) {
  const {
    roles = [],
    permissions = [],
    groups = [],
    mode = "any",
    fallback: FallbackComponent,
    loading: LoadingComponent,
  } = options

  const AuthorizedComponent: React.FC<P> = (props) => {
    const { hasAccess, loading, initialized } = useRBAC()

    if (loading || !initialized) {
      return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>
    }

    const authorized = hasAccess({ roles, permissions, groups, mode })

    if (!authorized) {
      return FallbackComponent ? <FallbackComponent /> : <div>Access Denied</div>
    }

    return <WrappedComponent {...props} />
  }

  AuthorizedComponent.displayName = `withAuthorization(${WrappedComponent.displayName || WrappedComponent.name})`

  return AuthorizedComponent
}
