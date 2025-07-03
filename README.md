# React RBAC

A comprehensive Role-Based Access Control (RBAC) library for React applications with TypeScript support.

## Features

- 🔐 **Complete RBAC System** - Users, Groups, Roles, and Permissions
- 🎯 **Protected Components** - Route and element-level protection
- 🪝 **Custom Hooks** - Easy-to-use React hooks for authorization
- 🔧 **TypeScript Support** - Fully typed for better development experience
- 🎨 **Flexible Authorization** - Multiple authorization modes (any/all)
- 🚀 **Performance Optimized** - Memoized computations and efficient re-renders
- 📦 **Zero Dependencies** - Only requires React as peer dependency

## Installation

\`\`\`bash
npm install @your-username/react-rbac
# or
yarn add @your-username/react-rbac
# or
pnpm add @your-username/react-rbac
\`\`\`

## Quick Start

### 1. Wrap your app with RBACProvider

\`\`\`tsx
import { RBACProvider } from '@your-username/react-rbac'

const loadUser = async () => {
  const response = await fetch('/api/user')
  return response.json()
}

function App() {
  return (
    <RBACProvider onUserLoad={loadUser}>
      <YourApp />
    </RBACProvider>
  )
}
\`\`\`

### 2. Use protected components

\`\`\`tsx
import { ProtectedRoute, ProtectedElement, useRBAC } from '@your-username/react-rbac'

function Dashboard() {
  const { hasPermission, hasRole } = useRBAC()

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Protected by role */}
      <ProtectedElement roles={['admin']}>
        <AdminPanel />
      </ProtectedElement>

      {/* Protected by permission */}
      <ProtectedElement permissions={['write_posts']}>
        <CreatePostButton />
      </ProtectedElement>

      {/* Protected by group */}
      <ProtectedElement groups={['moderators']}>
        <ModerationTools />
      </ProtectedElement>
    </div>
  )
}

// Protected routes
function App() {
  return (
    <ProtectedRoute roles={['user']} fallback={<LoginPage />}>
      <Dashboard />
    </ProtectedRoute>
  )
}
\`\`\`

### 3. Use authorization hooks

\`\`\`tsx
import { useRBAC, useAuth } from '@your-username/react-rbac'

function MyComponent() {
  const { 
    user, 
    hasPermission, 
    hasRole, 
    hasGroup, 
    canAccess 
  } = useRBAC()
  
  const { isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated()) {
    return <LoginForm onLogin={login} />
  }

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      
      {hasRole('admin') && <AdminControls />}
      {hasPermission('create_post') && <CreatePostButton />}
      {canAccess('users', 'read') && <UsersList />}
    </div>
  )
}
\`\`\`

## API Reference

### Components

#### `<RBACProvider>`
The main provider component that manages RBAC state.

\`\`\`tsx
<RBACProvider 
  onUserLoad={() => Promise<User | null>}
  onRefreshUser={() => Promise<User | null>}
>
  {children}
</RBACProvider>
\`\`\`

#### `<ProtectedRoute>`
Protects entire routes based on authorization rules.

\`\`\`tsx
<ProtectedRoute
  roles={['admin', 'user']}
  permissions={['read_content']}
  groups={['staff']}
  mode="any" // or "all"
  fallback={<AccessDenied />}
  loadingComponent={<Loading />}
>
  <Dashboard />
</ProtectedRoute>
\`\`\`

#### `<ProtectedElement>`
Protects individual UI elements.

\`\`\`tsx
<ProtectedElement
  roles={['admin']}
  permissions={['delete_user']}
  fallback={<span>Access Denied</span>}
>
  <DeleteButton />
</ProtectedElement>
\`\`\`

### Hooks

#### `useRBAC()`
Main hook providing all RBAC functionality.

\`\`\`tsx
const {
  // State
  user,
  loading,
  error,
  initialized,
  
  // Computed values
  userPermissions,
  userRoles,
  userGroups,
  
  // Authorization methods
  hasPermission,
  hasRole,
  hasGroup,
  hasAccess,
  canAccess,
  isAuthenticated,
  
  // Actions
  setUser,
  clearAuth,
  refreshUser
} = useRBAC()
\`\`\`

#### `useAuth()`
Simplified authentication hook.

\`\`\`tsx
const {
  user,
  loading,
  isAuthenticated,
  login,
  logout,
  refresh
} = useAuth()
\`\`\`

### Higher-Order Components

#### `withAuthorization()`
HOC for protecting components.

\`\`\`tsx
const ProtectedComponent = withAuthorization(MyComponent, {
  roles: ['admin'],
  fallback: AccessDenied,
  loading: LoadingSpinner
})
\`\`\`

### Types

\`\`\`tsx
interface User {
  id: string
  email: string
  name: string
  groups: Group[]
  roles: Role[]
  permissions: Permission[]
}

interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
}

interface Group {
  id: string
  name: string
  description?: string
  roles: Role[]
  permissions: Permission[]
}

interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description?: string
}
\`\`\`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
