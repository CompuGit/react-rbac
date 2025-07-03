"use client"

import type React from "react"
import { RBACProvider } from "../context/rbac-context"
import { ProtectedRoute } from "../components/protected-route"
import { ProtectedElement } from "../components/protected-element"
import { ConditionalRender } from "../components/conditional-render"
import { useRBAC } from "../hooks/use-rbac"
import { useAuth } from "../hooks/use-auth"
import { withAuthorization } from "../hoc/with-authorization"
import type { User, Permission, Role, Group } from "../types/rbac"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data
const mockPermissions: Permission[] = [
  { id: "1", name: "read_users", resource: "users", action: "read" },
  { id: "2", name: "write_users", resource: "users", action: "write" },
  { id: "3", name: "delete_users", resource: "users", action: "delete" },
  { id: "4", name: "read_posts", resource: "posts", action: "read" },
  { id: "5", name: "write_posts", resource: "posts", action: "write" },
]

const mockRoles: Role[] = [
  { id: "1", name: "admin", permissions: mockPermissions },
  { id: "2", name: "editor", permissions: [mockPermissions[0], mockPermissions[3], mockPermissions[4]] },
  { id: "3", name: "viewer", permissions: [mockPermissions[0], mockPermissions[3]] },
]

const mockGroups: Group[] = [
  { id: "1", name: "administrators", roles: [mockRoles[0]], permissions: [] },
  { id: "2", name: "content_team", roles: [mockRoles[1]], permissions: [] },
  { id: "3", name: "users", roles: [mockRoles[2]], permissions: [] },
]

const mockUser: User = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
  groups: [mockGroups[0]],
  roles: [],
  permissions: [],
}

// Mock auth functions
const loadUser = async (): Promise<User | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockUser
}

const refreshUser = async (): Promise<User | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockUser
}

// Example components
const AdminPanel = withAuthorization(
  () => (
    <Card>
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
        <CardDescription>Only administrators can see this</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Welcome to the admin panel!</p>
      </CardContent>
    </Card>
  ),
  { roles: ["admin"] },
)

const UserInfo: React.FC = () => {
  const { user, userRoles, userPermissions, userGroups } = useRBAC()

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Groups:</h4>
          <div className="flex gap-2 flex-wrap">
            {userGroups.map((group) => (
              <Badge key={group.id} variant="secondary">
                {group.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Roles:</h4>
          <div className="flex gap-2 flex-wrap">
            {userRoles.map((role) => (
              <Badge key={role.id} variant="outline">
                {role.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Permissions:</h4>
          <div className="flex gap-2 flex-wrap">
            {userPermissions.map((permission) => (
              <Badge key={permission.id} variant="default">
                {permission.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const Dashboard: React.FC = () => {
  const { hasPermission, hasRole, canAccess } = useRBAC()
  const { logout } = useAuth()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">RBAC Dashboard</h1>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserInfo />

        <ProtectedElement roles={["admin"]}>
          <AdminPanel />
        </ProtectedElement>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProtectedElement permissions={["read_users"]}>
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p>User management interface</p>
            </CardContent>
          </Card>
        </ProtectedElement>

        <ProtectedElement permissions={["read_posts"]}>
          <Card>
            <CardHeader>
              <CardTitle>Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Content management</p>

              <ConditionalRender show={{ permissions: ["write_posts"] }}>
                <Button className="mt-2">Create Post</Button>
              </ConditionalRender>
            </CardContent>
          </Card>
        </ProtectedElement>

        <ProtectedElement groups={["administrators"]}>
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>System configuration</p>
            </CardContent>
          </Card>
        </ProtectedElement>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Checks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Can read users: {hasPermission("read_users") ? "✅" : "❌"}</p>
          <p>Can write users: {hasPermission("write_users") ? "✅" : "❌"}</p>
          <p>Can delete users: {hasPermission("delete_users") ? "✅" : "❌"}</p>
          <p>Is admin: {hasRole("admin") ? "✅" : "❌"}</p>
          <p>Can access users/read: {canAccess("users", "read") ? "✅" : "❌"}</p>
        </CardContent>
      </Card>
    </div>
  )
}

const LoginPage: React.FC = () => {
  const { setUser } = useRBAC()

  const handleLogin = () => {
    setUser(mockUser)
  }

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Click to login as admin user</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} className="w-full">
            Login as Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <RBACProvider onUserLoad={loadUser} onRefreshUser={refreshUser}>
      <AppContent />
    </RBACProvider>
  )
}

const AppContent: React.FC = () => {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireAuth={true} fallback={<LoginPage />} loadingComponent={<div>Loading...</div>}>
      <Dashboard />
    </ProtectedRoute>
  )
}

export default App
