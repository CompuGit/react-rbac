"use client"

import { useRBAC } from "./use-rbac"

export const useAuth = () => {
  const rbac = useRBAC()

  return {
    user: rbac.user,
    loading: rbac.loading,
    error: rbac.error,
    initialized: rbac.initialized,
    isAuthenticated: rbac.isAuthenticated,
    login: rbac.setUser,
    logout: rbac.clearAuth,
    refresh: rbac.refreshUser,
  }
}
