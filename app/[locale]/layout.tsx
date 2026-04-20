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
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem clamp(1rem, 4vw, 3rem)",
          fontSize: "0.875rem",
          letterSpacing: "0.02em",
        }}
      >
        <a href={`/${typed}/`} style={{ fontWeight: 600 }}>
          Mintmelon
        </a>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href="/en/" aria-current={typed === "en" ? "page" : undefined}>
            EN
          </a>
          <a href="/zh/" aria-current={typed === "zh" ? "page" : undefined}>
            中文
          </a>
        </div>
      </nav>
      {children}
    </div>
  )
}
