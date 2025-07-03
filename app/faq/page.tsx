"use client"

import { Navigation } from "@/components/navigation"
import { useConfig } from "@/hooks/use-config"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import config from "@/lib/config" // ✅ 解决 undefined 报错

export default function FAQPage() {
  const config = useConfig()
  const faqs = [
    { question: "如何开始使用服务？", answer: "注册账户后，选择适合您的套餐，完成支付即可开始使用。我们会为您提供详细的配置指南。" },
    { question: "支持哪些设备？", answer: "我们支持 Windows、macOS、iOS、Android 等主流操作系统，以及各种路由器设备。" },
    { question: "如何联系客服？", answer: "您可以通过工单系统、在线客服或邮件联系我们，我们提供 7x24 小时技术支持。" },
    { question: "是否支持退款？", answer: "我们提供 7 天无理由退款保证，如果您对服务不满意，可以申请全额退款。" },
    { question: "流量用完了怎么办？", answer: "当月流量用完后，您可以购买流量包或升级到更高级的套餐。" },
    { question: "服务稳定性如何？", answer: "我们承诺 99.9% 的服务可用性，拥有多个备用节点确保服务稳定运行。" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <Navigation />
      <div className="pt-32 pb-20 px-4 flex-grow">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">常见问题</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">这里是一些用户经常询问的问题，希望能帮助到您</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/80 dark:bg-white/10 backdrop-blur-sm border-0 shadow-lg rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

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
