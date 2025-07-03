"use client"

import { useState, useEffect } from "react"
import { authManager, type AuthState } from "@/lib/auth"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authManager.getState())

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState)
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    return authManager.login(email, password)
  }

  const register = async (data: {
    email: string
    password: string
    password_confirmation: string
    email_code?: string
    invite_code?: string
  }) => {
    return authManager.register(data)
  }

  const sendEmailCode = async (email: string, type: "register" | "reset_password" = "register") => {
    return authManager.sendEmailCode(email, type)
  }

  // 明确返回类型，修正 TS 报错
const resetPassword = async (data: {
  email: string
  password: string
  password_confirmation: string
  email_code: string
}): Promise<{ success: boolean; message: string }> => {
  // 明确类型断言（仅类型问题时可以用 as，最好还是实现一致！）
  return authManager.resetPassword(data) as Promise<{ success: boolean; message: string }>
}

  const logout = async () => {
    await authManager.logout()
  }

  const refreshUser = async () => {
    await authManager.refreshUser()
  }

  return {
    ...authState,
    login,
    register,
    sendEmailCode,
    resetPassword,
    logout,
    refreshUser,
  }
}
