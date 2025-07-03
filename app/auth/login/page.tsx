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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useConfig } from "@/hooks/use-config"
import { ModeToggle } from "@/components/mode-toggle"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const config = useConfig()

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError("请填写完整的登录信息")
      return
    }
    const result = await login(formData.email, formData.password)
    if (result.success) router.push("/")
    else setError(result.message)
  }

  return (
    <div className="relative w-full h-screen">
      {/* 背景图 */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${config.backgroundUrl})` }}
      />

      {/* 顶部 LOGO+标题+主题切换（严格水平对齐） */}
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center px-4 pt-4 pointer-events-none select-none">
        {/* 左上 LOGO+标题 */}
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
        {/* 右上主题切换 - 加透明 */}
        <div className="pointer-events-auto flex items-center h-10 opacity-30">
          <ModeToggle />
        </div>
      </div>

      {/* 登录卡片内容居中 */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
          <CardHeader className="text-center space-y-2 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              👋 欢迎回来
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-300">
              登录您的 {config.siteName} 账户
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱"
                    className="pl-10 h-11"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    className="pl-10 pr-10 h-11"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  忘记密码？
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pb-8">
              <Button
                type="submit"
                className="w-full h-11 bg-teal-500 hover:bg-teal-600 text-white"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                登录
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  还没有账户？{" "}
                </span>
                <Link
                  href="/auth/register"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  立即注册
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
