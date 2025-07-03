import type { User, Permission, Role, Group } from "../types/rbac"

export class RBACUtils {
  static getAllUserPermissions(user: User): Permission[] {
    const directPermissions = user.permissions || []
    const rolePermissions = user.roles?.flatMap((role) => role.permissions) || []
    const groupPermissions =
      user.groups?.flatMap((group) => [
        ...(group.permissions || []),
        ...(group.roles?.flatMap((role) => role.permissions) || []),
      ]) || []

    const allPermissions = [...directPermissions, ...rolePermissions, ...groupPermissions]
    return allPermissions.filter((permission, index, self) => index === self.findIndex((p) => p.id === permission.id))
  }

  static getAllUserRoles(user: User): Role[] {
    const directRoles = user.roles || []
    const groupRoles = user.groups?.flatMap((group) => group.roles) || []

    const allRoles = [...directRoles, ...groupRoles]
    return allRoles.filter((role, index, self) => index === self.findIndex((r) => r.id === role.id))
  }

  static hasPermission(user: User, permissionName: string): boolean {
    const permissions = this.getAllUserPermissions(user)
    return permissions.some((p) => p.name === permissionName)
  }

  static hasRole(user: User, roleName: string): boolean {
    const roles = this.getAllUserRoles(user)
    return roles.some((r) => r.name === roleName)
  }

  static hasGroup(user: User, groupName: string): boolean {
    return user.groups?.some((g) => g.name === groupName) || false
  }

  static canAccessResource(user: User, resource: string, action: string): boolean {
    const permissions = this.getAllUserPermissions(user)
    return permissions.some((p) => p.resource === resource && p.action === action)
  }

  static createPermission(
    id: string,
    name: string,
    resource: string,
    action: string,
    description?: string,
  ): Permission {
    return { id, name, resource, action, description }
  }

  static createRole(id: string, name: string, permissions: Permission[], description?: string): Role {
    return { id, name, permissions, description }
  }

  static createGroup(id: string, name: string, roles: Role[], permissions: Permission[], description?: string): Group {
    return { id, name, roles, permissions, description }
  }
}
