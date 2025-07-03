"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useEffect } from "react"
import type { User, RBACConfig, Permission, Role, Group } from "../types/rbac"

interface RBACState extends RBACConfig {
  initialized: boolean
}

type RBACAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_INITIALIZED"; payload: boolean }
  | { type: "UPDATE_USER_PERMISSIONS"; payload: Permission[] }
  | { type: "UPDATE_USER_ROLES"; payload: Role[] }
  | { type: "UPDATE_USER_GROUPS"; payload: Group[] }

interface RBACContextType extends RBACState {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUserPermissions: (permissions: Permission[]) => void
  updateUserRoles: (roles: Role[]) => void
  updateUserGroups: (groups: Group[]) => void
  clearAuth: () => void
  refreshUser: () => Promise<void>
}

const RBACContext = createContext<RBACContextType | undefined>(undefined)

const rbacReducer = (state: RBACState, action: RBACAction): RBACState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        error: null,
        initialized: true,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "SET_INITIALIZED":
      return {
        ...state,
        initialized: action.payload,
      }
    case "UPDATE_USER_PERMISSIONS":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              permissions: action.payload,
            }
          : null,
      }
    case "UPDATE_USER_ROLES":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              roles: action.payload,
            }
          : null,
      }
    case "UPDATE_USER_GROUPS":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              groups: action.payload,
            }
          : null,
      }
    default:
      return state
  }
}

interface RBACProviderProps {
  children: React.ReactNode
  onUserLoad?: () => Promise<User | null>
  onRefreshUser?: () => Promise<User | null>
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children, onUserLoad, onRefreshUser }) => {
  const [state, dispatch] = useReducer(rbacReducer, {
    user: null,
    loading: true,
    error: null,
    initialized: false,
  })

  const setUser = useCallback((user: User | null) => {
    dispatch({ type: "SET_USER", payload: user })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error })
  }, [])

  const updateUserPermissions = useCallback((permissions: Permission[]) => {
    dispatch({ type: "UPDATE_USER_PERMISSIONS", payload: permissions })
  }, [])

  const updateUserRoles = useCallback((roles: Role[]) => {
    dispatch({ type: "UPDATE_USER_ROLES", payload: roles })
  }, [])

  const updateUserGroups = useCallback((groups: Group[]) => {
    dispatch({ type: "UPDATE_USER_GROUPS", payload: groups })
  }, [])

  const clearAuth = useCallback(() => {
    dispatch({ type: "SET_USER", payload: null })
    dispatch({ type: "SET_ERROR", payload: null })
    dispatch({ type: "SET_LOADING", payload: false })
  }, [])

  const refreshUser = useCallback(async () => {
    if (!onRefreshUser) return

    try {
      setLoading(true)
      const user = await onRefreshUser()
      setUser(user)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to refresh user")
    } finally {
      setLoading(false)
    }
  }, [onRefreshUser, setLoading, setUser, setError])

  useEffect(() => {
    const loadUser = async () => {
      if (!onUserLoad) {
        dispatch({ type: "SET_INITIALIZED", payload: true })
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const user = await onUserLoad()
        setUser(user)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load user")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [onUserLoad, setUser, setError, setLoading])

  const value: RBACContextType = {
    ...state,
    setUser,
    setLoading,
    setError,
    updateUserPermissions,
    updateUserRoles,
    updateUserGroups,
    clearAuth,
    refreshUser,
  }

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>
}

export const useRBACContext = (): RBACContextType => {
  const context = useContext(RBACContext)
  if (context === undefined) {
    throw new Error("useRBACContext must be used within a RBACProvider")
  }
  return context
}
