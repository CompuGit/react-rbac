"use client"

import { useMemo } from "react"
import { useRBACContext } from "../context/rbac-context"
import type { AuthorizationMode } from "../types/rbac"

export const useRBAC = () => {
  const context = useRBACContext()

  const userPermissions = useMemo(() => {
    if (!context.user) return []

    const directPermissions = context.user.permissions || []
    const rolePermissions = context.user.roles?.flatMap((role) => role.permissions) || []
    const groupPermissions =
      context.user.groups?.flatMap((group) => [
        ...(group.permissions || []),
        ...(group.roles?.flatMap((role) => role.permissions) || []),
      ]) || []

    const allPermissions = [...directPermissions, ...rolePermissions, ...groupPermissions]
    return allPermissions.filter((permission, index, self) => index === self.findIndex((p) => p.id === permission.id))
  }, [context.user])

  const userRoles = useMemo(() => {
    if (!context.user) return []

    const directRoles = context.user.roles || []
    const groupRoles = context.user.groups?.flatMap((group) => group.roles) || []

    const allRoles = [...directRoles, ...groupRoles]
    return allRoles.filter((role, index, self) => index === self.findIndex((r) => r.id === role.id))
  }, [context.user])

  const userGroups = useMemo(() => {
    return context.user?.groups || []
  }, [context.user])

  const hasPermission = (permissionName: string | string[], mode: AuthorizationMode = "any"): boolean => {
    if (!context.user || userPermissions.length === 0) return false

    const permissions = Array.isArray(permissionName) ? permissionName : [permissionName]
    const userPermissionNames = userPermissions.map((p) => p.name)

    if (mode === "all") {
      return permissions.every((permission) => userPermissionNames.includes(permission))
    }

    return permissions.some((permission) => userPermissionNames.includes(permission))
  }

  const hasRole = (roleName: string | string[], mode: AuthorizationMode = "any"): boolean => {
    if (!context.user || userRoles.length === 0) return false

    const roles = Array.isArray(roleName) ? roleName : [roleName]
    const userRoleNames = userRoles.map((r) => r.name)

    if (mode === "all") {
      return roles.every((role) => userRoleNames.includes(role))
    }

    return roles.some((role) => userRoleNames.includes(role))
  }

  const hasGroup = (groupName: string | string[], mode: AuthorizationMode = "any"): boolean => {
    if (!context.user || userGroups.length === 0) return false

    const groups = Array.isArray(groupName) ? groupName : [groupName]
    const userGroupNames = userGroups.map((g) => g.name)

    if (mode === "all") {
      return groups.every((group) => userGroupNames.includes(group))
    }

    return groups.some((group) => userGroupNames.includes(group))
  }

  const hasAccess = (options: {
    permissions?: string[]
    roles?: string[]
    groups?: string[]
    mode?: AuthorizationMode
  }): boolean => {
    const { permissions = [], roles = [], groups = [], mode = "any" } = options

    const checks = []

    if (permissions.length > 0) {
      checks.push(hasPermission(permissions, mode))
    }

    if (roles.length > 0) {
      checks.push(hasRole(roles, mode))
    }

    if (groups.length > 0) {
      checks.push(hasGroup(groups, mode))
    }

    if (checks.length === 0) return true

    return mode === "all" ? checks.every(Boolean) : checks.some(Boolean)
  }

  const canAccess = (resource: string, action: string): boolean => {
    if (!context.user) return false

    return userPermissions.some((permission) => permission.resource === resource && permission.action === action)
  }

  const isAuthenticated = (): boolean => {
    return !!context.user
  }

  const isInRole = (roleName: string): boolean => {
    return hasRole(roleName)
  }

  const isInGroup = (groupName: string): boolean => {
    return hasGroup(groupName)
  }

  return {
    user: context.user,
    loading: context.loading,
    error: context.error,
    initialized: context.initialized,
    userPermissions,
    userRoles,
    userGroups,
    hasPermission,
    hasRole,
    hasGroup,
    hasAccess,
    canAccess,
    isAuthenticated,
    isInRole,
    isInGroup,
    setUser: context.setUser,
    setLoading: context.setLoading,
    setError: context.setError,
    updateUserPermissions: context.updateUserPermissions,
    updateUserRoles: context.updateUserRoles,
    updateUserGroups: context.updateUserGroups,
    clearAuth: context.clearAuth,
    refreshUser: context.refreshUser,
  }
}
