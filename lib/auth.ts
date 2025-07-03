import { v2boardAPI, type UserInfo } from "./v2board-api"

export interface AuthState {
  user: UserInfo | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

// 通用响应成功判断
function isApiSuccess(response: any): boolean {
  return (
    response?.status === "success" ||
    response?.status === true ||
    response?.code === 200 ||
    response?.data === true ||
    response?.message === "ok"
  )
}

class AuthManager {
  private static instance: AuthManager
  private state: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
  }
  private listeners: Array<(state: AuthState) => void> = []

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("v2board_token")
      const user = localStorage.getItem("v2board_user")
      if (token && user) {
        this.state.token = token
        this.state.user = JSON.parse(user)
        this.state.isAuthenticated = true
        v2boardAPI.setToken(token)
      }
    }
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state))
  }

  private setState(updates: Partial<AuthState>) {
    this.state = { ...this.state, ...updates }
    this.notify()
  }

  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    this.setState({ isLoading: true })
    try {
      const response = await v2boardAPI.login({ email, password })

      if (response?.data?.token && response?.data?.auth_data) {
        const { token, auth_data } = response.data

        localStorage.setItem("v2board_token", token)
        localStorage.setItem("v2board_user", JSON.stringify(auth_data))
        v2boardAPI.setToken(token)

        this.setState({
          user: auth_data,
          token,
          isAuthenticated: true,
        })

        return { success: true, message: "登录成功" }
      } else {
        return { success: false, message: response.message || "登录失败" }
      }
    } catch (error: any) {
      if (error?.data?.message) {
        return { success: false, message: error.data.message }
      }

      if (error.message) {
        return { success: false, message: error.message }
      }

      return { success: false, message: "网络错误，请稍后重试" }
    } finally {
      this.setState({ isLoading: false })
    }
  }

  async register(data: {
    email: string
    password: string
    password_confirmation: string
    email_code?: string
    invite_code?: string
  }): Promise<{ success: boolean; message: string }> {
    this.setState({ isLoading: true })

    try {
      const response = await v2boardAPI.register(data)

      const { token, auth_data } = response.data || {}

      if (token && auth_data) {
        localStorage.setItem("v2board_token", token)
        localStorage.setItem("v2board_user", JSON.stringify(auth_data))
        v2boardAPI.setToken(token)

        this.setState({
          user: auth_data,
          token,
          isAuthenticated: true,
        })

        return { success: true, message: "注册成功，已自动登录" }
      } else {
        return { success: false, message: extractErrorMessage(response) }
      }
    } catch (error: any) {
      return {
        success: false,
        message: extractErrorMessage(error),
      }
    } finally {
      this.setState({ isLoading: false })
    }
  }


  async sendEmailCode(
    email: string,
    type: "register" | "reset_password" = "register",
  ): Promise<{ success: boolean; message: string }> {
    this.setState({ isLoading: true })

    try {
      const response = await v2boardAPI.sendEmailCode({ email, type })

      if (isApiSuccess(response)) {
        return { success: true, message: response.message || "验证码已发送" }
      } else {
        return { success: false, message: response.message || "发送失败" }
      }
    } catch (error: any) {
      if (error?.data?.message) {
        return { success: false, message: error.data.message }
      }
      return { success: false, message: "网络错误，请稍后重试" }
    } finally {
      this.setState({ isLoading: false })
    }
  }

  async logout(): Promise<void> {
    try {
      await v2boardAPI.logout()
    } catch (error) {
      // ignore
    } finally {
      localStorage.removeItem("v2board_token")
      localStorage.removeItem("v2board_user")
      v2boardAPI.clearToken()
      this.setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  getState(): AuthState {
    return this.state
  }

  async refreshUser(): Promise<void> {
    if (!this.state.isAuthenticated) return
    try {
      const response = await v2boardAPI.getUserInfo()
      if (isApiSuccess(response)) {
        this.setState({ user: response.data })
        localStorage.setItem("v2board_user", JSON.stringify(response.data))
      }
    } catch {}
  }

  async resetPassword(
    data: {
      email: string
      password: string
      password_confirmation: string
      email_code: string
    }
  ): Promise<{ success: boolean; message: string }> {
    this.setState({ isLoading: true })

    try {
      const response = await v2boardAPI.resetPassword(data)

      if (isApiSuccess(response)) {
        return { success: true, message: "密码重置成功" }
      } else {
        return { success: false, message: response.message || "重置失败" }
      }
    } catch (e: any) {
      if (e?.data?.message) {
        return { success: false, message: e.data.message }
      }
      return { success: false, message: "网络错误，请稍后重试" }
    } finally {
      this.setState({ isLoading: false })
    }
  }
}

export const authManager = AuthManager.getInstance()