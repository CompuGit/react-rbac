# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of React RBAC library
- RBACProvider context for state management
- useRBAC and useAuth hooks
- ProtectedRoute and ProtectedElement components
- ConditionalRender component
- withAuthorization HOC
- Support for Users, Groups, Roles, and Permissions
- TypeScript support with full type definitions
- Comprehensive test suite
- Documentation and examples

### Features
- Hierarchical permission inheritance
- Flexible authorization modes (any/all)
- Performance optimized with memoization
- Zero external dependencies (except React peer dependency)
- Server-side rendering compatible
