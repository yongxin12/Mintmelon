import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { locales, isLocale, type Locale } from "@/lib/i18n/config"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const typed: Locale = locale

  return (
    <div lang={typed} style={{ minHeight: "100dvh" }}>
      {children}
    </div>
  )
}
