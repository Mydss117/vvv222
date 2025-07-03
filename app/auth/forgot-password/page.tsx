"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useConfig } from "@/hooks/use-config"
import { ModeToggle } from "@/components/mode-toggle"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const config = useConfig()
  const { sendEmailCode, resetPassword, isLoading } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCodeLoading, setIsCodeLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSendCode = async () => {
    if (!formData.email) {
      setError("请先输入邮箱")
      return
    }
    setIsCodeLoading(true)
    setError("")
    const result = await sendEmailCode(formData.email, "reset_password")
    if (result.success) {
      setIsCodeSent(true)
      setCountdown(60)
      setSuccess("验证码已发送，请查收邮箱")
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setError(result.message)
    }
    setIsCodeLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!formData.email || !formData.code || !formData.password || !formData.confirmPassword) {
      setError("请填写完整信息")
      return
    }
    if (formData.password.length < 6) {
      setError("密码长度至少6位")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }
    const result = await resetPassword({
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      email_code: formData.code,
    })
    if (result.success) {
      setSuccess("密码重置成功！请登录")
      setTimeout(() => {
        router.push("/auth/login")
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="relative w-full h-screen">
      {/* 背景图 */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${config.backgroundUrl})` }}
      />
      {/* 顶部 LOGO+标题+主题切换 */}
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center px-4 pt-4 pointer-events-none select-none">
        <Link
          href="/"
          className="flex items-center gap-2 pointer-events-auto select-none hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={config.logoUrl}
              alt={config.siteName}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <span className="text-white dark:text-gray-900 text-lg font-semibold">{config.siteName}</span>
        </Link>
        <div className="pointer-events-auto flex items-center h-10 opacity-30">
          <ModeToggle />
        </div>
      </div>
      {/* 内容卡片 */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
          <CardHeader className="text-center space-y-2 pt-8 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <span role="img" aria-label="lock">🔒</span>
              重置您的密码
            </CardTitle>
            <div className="text-base text-gray-600 dark:text-gray-300">
              请填写您的邮箱来重置您的密码。
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              {/* 邮箱 */}
              <div className="space-y-1">
                <Label htmlFor="email">邮箱</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入您的邮箱"
                    className="pl-10 h-11"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading || isCodeLoading}
                  />
                </div>
              </div>
              {/* 验证码行 */}
              <div className="space-y-1">
                <Label htmlFor="code">验证码</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder="点击发送后查看邮箱"
                    className="h-11"
                    maxLength={6}
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.replace(/\D/g, "") })}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    className="h-11 px-5"
                    onClick={handleSendCode}
                    disabled={!formData.email || countdown > 0 || isCodeLoading || isLoading}
                  >
                    {isCodeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      countdown > 0 ? `${countdown}s` : "发送"
                    )}
                  </Button>
                </div>
              </div>
              {/* 新密码 */}
              <div className="space-y-1">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入您的密码"
                    className="pl-10 pr-10 h-11"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11 text-gray-400 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {/* 确认新密码 */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">再次输入密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="请再次输入密码"
                    className="pl-10 pr-10 h-11"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11 text-gray-400 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
            <div className="flex flex-col gap-4 px-6 pb-8 pt-4">
              <Button
                type="submit"
                className="w-full h-11 bg-teal-500 hover:bg-teal-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    重置中...
                  </>
                ) : (
                  <>
                    重置密码
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  想起密码了？{" "}
                  <Link
                    href="/auth/login"
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    登录账号
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
