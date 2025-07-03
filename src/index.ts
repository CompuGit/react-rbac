// Main exports
export { RBACProvider, useRBACContext } from "./context/rbac-context"
export { useRBAC } from "./hooks/use-rbac"
export { useAuth } from "./hooks/use-auth"

// Components
export { ProtectedRoute } from "./components/protected-route"
export { ProtectedElement } from "./components/protected-element"
export { ConditionalRender } from "./components/conditional-render"

// HOC
export { withAuthorization } from "./hoc/with-authorization"

// Utils
export { RBACUtils } from "./utils/rbac-utils"

// Types
export type {
  User,
  Group,
  Role,
  Permission,
  RBACConfig,
  AuthorizationOptions,
  AuthorizationMode,
  ProtectedElementProps,
} from "./types/rbac"
