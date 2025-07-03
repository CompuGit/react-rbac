import type React from "react"
export interface User {
  id: string
  email: string
  name: string
  groups: Group[]
  roles: Role[]
  permissions: Permission[]
}

export interface Group {
  id: string
  name: string
  description?: string
  roles: Role[]
  permissions: Permission[]
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description?: string
}

export interface RBACConfig {
  user: User | null
  loading: boolean
  error: string | null
}

export interface AuthorizationOptions {
  requireAll?: boolean // If true, user must have ALL specified items, if false, ANY
  strict?: boolean // If true, exact match required
}

export type AuthorizationMode = "any" | "all"

export interface ProtectedElementProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  roles?: string[]
  permissions?: string[]
  groups?: string[]
  mode?: AuthorizationMode
  requireAll?: boolean
}
