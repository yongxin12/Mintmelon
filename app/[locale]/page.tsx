import { isLocale } from "@/lib/i18n/config"
import { notFound } from "next/navigation"
import { HomePage } from "@/components/home/HomePage"
import { getProjects } from "@/data/projects"
import { getResume } from "@/data/resume"
import { getSiteData } from "@/data/site"

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return <HomePage locale={locale} site={getSiteData(locale)} projects={getProjects(locale)} resume={getResume(locale)} />
}
