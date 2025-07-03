"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { useConfig } from "@/hooks/use-config"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Play, Shield, Zap, Globe, Code, Bot, MoreHorizontal } from "lucide-react"

export default function HomePage() {
  const config = useConfig()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <Navigation />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              更便捷
              <br />
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                连接全世界
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              {config.siteName} 是一个追求更可靠、安全、高效且性价比的互联网
              <br />
              接入方案。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/shop">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 text-lg">
                  新用户购买
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/faq">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-gray-300 text-gray-700 bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                了解更多
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative py-16 px-4 overflow-hidden bg-transparent">
        <div className="container mx-auto">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 text-lg">我们的合作伙伴</p>

          {/* 渐变遮罩 */}
          <div className="relative overflow-hidden">
            {/* 滚动容器 */}
            <div className="whitespace-nowrap animate-scroll flex gap-12">
              {[
                "spotify",
                "google",
                "microsoft",
                "amazon",
                "netflix",
                "youtube",
                "instagram",
                "uber",
              ].map((name, index) => (
                <img
                  key={index}
                  src={`/images/${name}.svg`}
                  alt={name}
                  className="h-10 inline-block"
                />
              ))}
              {/* 复制一份用于无缝滚动 */}
              {[
                "spotify",
                "google",
                "microsoft",
                "amazon",
                "netflix",
                "youtube",
                "instagram",
                "uber",
              ].map((name, index) => (
                <img
                  key={`clone-${index}`}
                  src={`/images/${name}.svg`}
                  alt={name}
                  className="h-10 inline-block"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-12">特色功能</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">我们将尽最大努力为您提供最好的服务</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/70 dark:bg-white/10 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">流媒体解锁</h3>
                <p className="text-gray-600 leading-relaxed">
                  我们与全球个大流媒体服务商合作，包括 Netflix、YouTube、Disney+等， 最大程度地提高您的观看体验。
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-white/10 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">专线级传输</h3>
                <p className="text-gray-600 leading-relaxed">
                  我们的网络采用了高效的传输专线传输协议，以确保您的连接稳定可靠， 让您体验到最高的网络体验。
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-white/10 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI 平台支持</h3>
                <p className="text-gray-600 leading-relaxed">
                  我们的网络完美支持各种主流 AI 平台，包含ChatGPT、Claude、Gemini 等，为您的生活日常提供高效率。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-zinc-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-12">使用案例</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">为您的需求提供更多的帮助</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="bg-white dark:bg-zinc-800/70 border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">程序开发</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  我们提供了最优秀的网络传输服务，为您的开发环境提供最大的便利。
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-800/70 border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">追剧帮手</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">我们提供最稳定的，拒绝卡顿大幅。</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-800/70 border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI 平台</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">最大化的提高您的日常生活效率。</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-800/70 border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <MoreHorizontal className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">更多功能</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">我们还提供了更多的功能，期待您的使用。</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src={config.logoUrl}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {config.siteName}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              All systems operational
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 {config.siteName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
