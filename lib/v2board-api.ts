import { siteConfig } from "./config"

export interface V2BoardResponse<T = any> {
  data: T
  message: string
  status?: "success" | "fail"
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  password_confirmation: string
  email_code?: string
  invite_code?: string
}

export interface SendEmailCodeRequest {
  email: string
  type: "register" | "reset_password"
}

export interface UserInfo {
  id: number
  email: string
  avatar_url?: string
  created_at: string
  updated_at: string
  balance: number
  commission_balance: number
  plan_id?: number
  expired_at?: string
}

class V2BoardAPI {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = siteConfig.apiBaseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<V2BoardResponse<T>> {
    let base = this.baseUrl.replace(/\/+$/, "")
    if (!base.endsWith("/api/v1")) {
      base += "/api/v1"
    }
    const url = `${base}${endpoint}`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // ✅ 抛出更完整的错误对象，便于调用方解析 message
        const error: any = new Error(data.message || "请求失败")
        error.status = response.status
        error.data = data
        throw error
      }

      return data
    } catch (error) {
      console.error("V2Board API Error:", error)
      throw error
    }
  }

  // 发送邮箱验证码
  async sendEmailCode(data: SendEmailCodeRequest): Promise<V2BoardResponse> {
    return this.request("/passport/comm/sendEmailVerify", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // 用户注册
  async register(data: RegisterRequest): Promise<V2BoardResponse<{ token: string }>> {
    return this.request("/passport/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // 用户登录
  async login(data: LoginRequest): Promise<V2BoardResponse<{ token: string; auth_data: UserInfo }>> {
    return this.request("/passport/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // 获取用户信息
  async getUserInfo(): Promise<V2BoardResponse<UserInfo>> {
    return this.request("/user/info")
  }

  // 用户登出
  async logout(): Promise<V2BoardResponse> {
    const result = await this.request("/user/logout", {
      method: "POST",
    })
    this.token = null
    return result
  }

  // 设置认证令牌
  setToken(token: string) {
    this.token = token
  }

  // 清除认证令牌
  clearToken() {
    this.token = null
  }

  // 检查邮箱是否已注册
  async checkEmail(email: string): Promise<V2BoardResponse<{ is_exist: boolean }>> {
    return this.request(`/passport/comm/checkEmail?email=${encodeURIComponent(email)}`)
  }

  // 重置密码
  async resetPassword(data: {
    email: string
    password: string
    password_confirmation: string
    email_code: string
  }): Promise<V2BoardResponse> {
    return this.request("/passport/auth/forget", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const v2boardAPI = new V2BoardAPI()
