export interface SiteConfig {
  siteName: string
  siteDescription: string
  logoUrl: string
  backgroundUrl: string // ✅ 加这一行
  apiBaseUrl: string
  enableRegistration: boolean
  enableEmailVerification: boolean
  enableInviteCode: boolean
  enableGoogleLogin: boolean
  enableGithubLogin: boolean
}

export const siteConfig: SiteConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "青鸟",
  siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "更便捷连接全世界",
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || "/placeholder.svg?height=32&width=32",
  backgroundUrl: process.env.NEXT_PUBLIC_BACKGROUND_URL || "https://stb.haitunt.org/uploads/20250609/mbozhclr408qsid3o7j.jpg", // ✅ 加这一行
  apiBaseUrl: process.env.NEXT_PUBLIC_V2BOARD_API_URL || "https://api.smlz.cloud",
  enableRegistration: true,
  enableEmailVerification: true,
  enableInviteCode: true,
  enableGoogleLogin: false,
  enableGithubLogin: false,
}

export function getConfig(): SiteConfig {
  return siteConfig
}