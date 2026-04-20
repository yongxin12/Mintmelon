import { isLocale } from "@/lib/i18n/config"
import { notFound } from "next/navigation"

const HEADLINES = {
  en: "Mintmelon",
  zh: "Mintmelon",
} as const

const SUBTITLES = {
  en: "Personal site — redesign in progress.",
  zh: "个人站点 — 正在重做中。",
} as const

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <main
      style={{
        minHeight: "80dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(2rem, 8vw, 6rem)",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(3rem, 12vw, 8rem)",
          lineHeight: 1,
          margin: 0,
          fontWeight: 500,
        }}
      >
        {HEADLINES[locale]}
      </h1>
      <p style={{ marginTop: "1.5rem", fontSize: "1rem", opacity: 0.7 }}>
        {SUBTITLES[locale]}
      </p>
    </main>
  )
}
