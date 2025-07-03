"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Send, Loader2, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useConfig } from "@/hooks/use-config"
import { ModeToggle } from "@/components/mode-toggle"

const EMAIL_SUFFIXES = [
  "qq.com",
  "gmail.com",
  "163.com",
  "126.com",
  "outlook.com",
  "139.com",
  "foxmail.com",
  "hotmail.com"
]

export default function RegisterPage() {
  const router = useRouter()
  const { register, sendEmailCode, isLoading } = useAuth()
  const config = useConfig()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isCodeLoading, setIsCodeLoading] = useState(false)

  const [formData, setFormData] = useState({
    emailPrefix: "",
    emailSuffix: EMAIL_SUFFIXES[0],
    verificationCode: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
    agreeToTerms: false,
  })

  const email = formData.emailPrefix && formData.emailSuffix
    ? `${formData.emailPrefix}@${formData.emailSuffix}`
    : ""

  const handleSendCode = async () => {
    if (!formData.emailPrefix) {
      setError("请先输入邮箱地址")
      return
    }

    setIsCodeLoading(true)
    setError("")
    const result = await sendEmailCode(email, "register")
    if (result.success) {
      setIsCodeSent(true)
      setSuccess("验证码已发送到您的邮箱")
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
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
    if (!formData.emailPrefix || !formData.password || !formData.confirmPassword) {
      setError("请填写完整的注册信息")
      return
    }
    if (config.enableEmailVerification && !formData.verificationCode) {
      setError("请输入邮箱验证码")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }
    if (formData.password.length < 6) {
      setError("密码长度至少为6位")
      return
    }
    if (!formData.agreeToTerms) {
      setError("请同意服务条款和隐私政策")
      return
    }

    const registerData = {
      email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      ...(config.enableEmailVerification && { email_code: formData.verificationCode }),
      ...(config.enableInviteCode && formData.inviteCode && { invite_code: formData.inviteCode }),
    }

    const result = await register(registerData)
    if (result.success) {
      setSuccess("注册成功！正在跳转到登录页面...")
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
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

      {/* 居中卡片 */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
          <CardHeader className="text-center space-y-2 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              创建您的账户
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-300">
              加入 {config.siteName}，开始您的旅程
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-600 text-green-800 dark:text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              {/* 邮箱输入+后缀 */}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="text"
                      placeholder="请输入邮箱"
                      className="pl-10 h-11"
                      value={formData.emailPrefix}
                      onChange={(e) =>
                        setFormData({ ...formData, emailPrefix: e.target.value })
                      }
                      disabled={isLoading || isCodeLoading}
                    />
                  </div>
                  <select
                    className="rounded-md border border-gray-300 h-11 px-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    value={formData.emailSuffix}
                    onChange={e =>
                      setFormData({ ...formData, emailSuffix: e.target.value })
                    }
                    disabled={isLoading || isCodeLoading}
                  >
                    {EMAIL_SUFFIXES.map((suffix) => (
                      <option value={suffix} key={suffix}>
                        @{suffix}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* 验证码输入 & 发送验证码 */}
              {config.enableEmailVerification && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="请输入6位验证码"
                      maxLength={6}
                      className="h-11 text-center tracking-widest"
                      value={formData.verificationCode}
                      onChange={e =>
                        setFormData({ ...formData, verificationCode: e.target.value.replace(/\D/g, "") })
                      }
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 px-4 whitespace-nowrap border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 bg-transparent"
                      onClick={handleSendCode}
                      disabled={!formData.emailPrefix || countdown > 0 || isLoading || isCodeLoading}
                    >
                      {isCodeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                      {countdown > 0 ? `${countdown}s` : "发送验证码"}
                    </Button>
                  </div>
                  {isCodeSent && (
                    <div className="text-xs text-gray-500 mt-1">
                      验证码已发送至 {email}
                    </div>
                  )}
                </div>
              )}
              {/* 密码 */}
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="创建一个强密码（至少6位）"
                    className="pl-10 pr-10 h-11"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
              {/* 确认密码 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="再次输入密码"
                    className="pl-10 pr-10 h-11"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
              {/* 邀请码 */}
              {config.enableInviteCode && (
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">
                    邀请码 <span className="text-gray-500">（选填）</span>
                  </Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    placeholder="请输入邀请码（选填）"
                    className="h-11"
                    value={formData.inviteCode}
                    onChange={e => setFormData({ ...formData, inviteCode: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              )}
              {/* 协议 */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={checked => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  我同意 <Link href="#" className="text-teal-600 hover:text-teal-700 font-medium">服务条款</Link> 和 <Link href="#" className="text-teal-600 hover:text-teal-700 font-medium">隐私政策</Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-8">
              <Button
                type="submit"
                className="w-full h-11 bg-teal-500 hover:bg-teal-600 text-white"
                disabled={isLoading || (config.enableEmailVerification && (!isCodeSent || !formData.verificationCode))}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    注册中...
                  </>
                ) : (
                  <>
                    创建账户
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">已有账户？ </span>
                <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">立即登录</Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
