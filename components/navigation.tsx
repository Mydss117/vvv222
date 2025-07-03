"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useConfig } from "@/hooks/use-config"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const config = useConfig()
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-700 transition-colors">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo（动态渲染） */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img
                src={config.logoUrl}
                alt={config.siteName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">{config.siteName}</span>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-teal-500" : "text-gray-700 dark:text-white hover:text-gray-900"}`}>
              首页
            </Link>
            <Link href="/shop" className={`text-sm font-medium transition-colors ${pathname === "/shop" ? "text-teal-500" : "text-gray-700 dark:text-white hover:text-gray-900"}`}>
              商店
            </Link>
            <Link href="/faq" className={`text-sm font-medium transition-colors ${pathname === "/faq" ? "text-teal-500" : "text-gray-700 dark:text-white hover:text-gray-900"}`}>
              常见问题
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.email} />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">余额: ¥{user?.balance || 0}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      <span>用户中心</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/register">
                  <Button size="sm" className="text-sm bg-teal-800 hover:bg-teal-700 text-white dark:bg-teal-900 dark:hover:bg-teal-800">
                    注册
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm" className="text-sm bg-teal-500 hover:bg-teal-600 text-white">
                    登录
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="h-9 w-9 text-gray-700">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                href="/shop"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                商店
              </Link>
              <Link
                href="/faq"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                常见问题
              </Link>
              <div className="flex flex-col space-y-2 px-3 pt-4 border-t border-gray-200 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.email} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                        <span className="text-xs text-gray-500">余额: ¥{user?.balance || 0}</span>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-gray-700">
                        <User className="mr-2 h-4 w-4" />
                        用户中心
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start text-gray-700" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      退出登录
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-gray-700">
                        注册
                      </Button>
                    </Link>
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-teal-500 hover:bg-teal-600">登录</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
