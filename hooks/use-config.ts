"use client"

import { siteConfig, type SiteConfig } from "@/lib/config"

export function useConfig(): SiteConfig {
  return siteConfig
}