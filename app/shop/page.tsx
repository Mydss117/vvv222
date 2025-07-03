"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export default function ShopPage() {
  const plans = [
    {
      name: "基础版",
      price: "¥19",
      period: "/月",
      description: "适合轻度使用用户",
      features: ["100GB 月流量", "5个设备同时在线", "全球节点访问", "7x24小时客服支持"],
      popular: false,
    },
    {
      name: "专业版",
      price: "¥39",
      period: "/月",
      description: "适合重度使用用户",
      features: ["500GB 月流量", "10个设备同时在线", "全球节点访问", "优先客服支持", "流媒体解锁"],
      popular: true,
    },
    {
      name: "企业版",
      price: "¥99",
      period: "/月",
      description: "适合团队和企业用户",
      features: ["2TB 月流量", "无限设备同时在线", "全球节点访问", "专属客服支持", "流媒体解锁", "专线加速"],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">选择适合您的套餐</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">我们提供灵活的定价方案，满足不同用户的需求</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white/80 dark:bg-white/10 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${
                  plan.popular ? "ring-2 ring-teal-500" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-teal-500 hover:bg-teal-600">
                    最受欢迎
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-teal-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full h-11 ${
                      plan.popular
                        ? "bg-teal-500 hover:bg-teal-600 text-white"
                        : "bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700"
                    }`}
                  >
                    选择套餐
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
