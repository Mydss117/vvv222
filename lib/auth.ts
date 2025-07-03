import { v2boardAPI, type UserInfo } from "./v2board-api"

export interface AuthState {
  user: UserInfo | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
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

      if (response.status === "success") {
        const { token, auth_data } = response.data

        localStorage.setItem("v2board_token", token)
        localStorage.setItem("v2board_user", JSON.stringify(auth_data))
        v2boardAPI.setToken(token)

        this.setState({
          user: auth_data,
          token,
          isAuthenticated: true,
          isLoading: false,
        })

        return { success: true, message: "登录成功" }
      } else {
        this.setState({ isLoading: false })
        return { success: false, message: response.message || "登录失败" }
      }

    } catch (error: any) {
      this.setState({ isLoading: false })

      // ✅ 如果服务器返回了错误信息（如邮箱或密码错误）
      if (error.data?.message) {
        return { success: false, message: error.data.message }
      }

      // 否则 fallback 为默认提示
      return { success: false, message: "网络错误，请稍后重试" }
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
      if (response.status === "success") {
        this.setState({ isLoading: false })
        return { success: true, message: "注册成功，请登录" }
      } else {
        this.setState({ isLoading: false })
        return { success: false, message: response.message || "注册失败" }
      }
    } catch (error: any) {
      this.setState({ isLoading: false })
      if (error.data?.message) {
        return { success: false, message: error.data.message }
      }
      return { success: false, message: "网络错误，请稍后重试" }
    }
  }

  async sendEmailCode(
    email: string,
    type: "register" | "reset_password" = "register",
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await v2boardAPI.sendEmailCode({ email, type })
      if (response.status === "success") {
        return { success: true, message: "验证码已发送" }
      } else {
        return { success: false, message: response.message || "发送失败" }
      }
    } catch (error: any) {
      if (error.data?.message) {
        return { success: false, message: error.data.message }
      }
      return { success: false, message: "网络错误，请稍后重试" }
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
      if (response.status === "success") {
        this.setState({ user: response.data })
        localStorage.setItem("v2board_user", JSON.stringify(response.data))
      }
    } catch {}
  }

  // 重点！重置密码，类型直接声明好
  async resetPassword(
    data: {
      email: string;
      password: string;
      password_confirmation: string;
      email_code: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await v2boardAPI.resetPassword(data)
      if (response.status === "success") {
        return { success: true, message: "密码重置成功" }
      } else {
        return { success: false, message: response.message || "重置失败" }
      }
    } catch (e: any) {
      if (e.data?.message) {
        return { success: false, message: e.data.message }
      }
      return { success: false, message: "网络错误，请稍后重试" }
    }
  }
}

export const authManager = AuthManager.getInstance()
