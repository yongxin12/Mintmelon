import type { Locale } from "../lib/i18n/config"

export type ResumeData = {
  education: readonly {
    school: string
    degree: string
    field: string
    period: string
    location: string
  }[]
  experience: readonly {
    company: string
    role: string
    period: string
    location: string
    bullets: readonly string[]
  }[]
  skills: {
    languages: readonly string[]
    frameworks: readonly string[]
    tools: readonly string[]
  }
}

const sharedSkills = {
  languages: ["TypeScript", "Python", "C/C++", "JavaScript", "HTML/CSS"],
  frameworks: ["Next.js", "React", "Tailwind CSS"],
  tools: ["Git", "GitHub Pages", "Static Export", "Linux"],
} as const

const resume = {
  en: {
    education: [
      {
        school: "University of Alberta",
        degree: "BSc",
        field: "Computing Science",
        period: "2020 - 2025",
        location: "Vancouver",
      },
    ],
    experience: [
      {
        company: "Mintmelon",
        role: "Personal software work",
        period: "2020 - 2026",
        location: "Remote / Vancouver",
        bullets: [
          "Builds web interfaces, static sites, mobile prototypes, and small document-processing tools.",
          "Works across content structure, frontend implementation, deployment, and maintenance.",
        ],
      },
    ],
    skills: sharedSkills,
  },
  zh: {
    education: [
      {
        school: "University of Alberta",
        degree: "BSc",
        field: "Computing Science",
        period: "2020 - 2025",
        location: "Vancouver",
      },
    ],
    experience: [
      {
        company: "Mintmelon",
        role: "个人软件工作",
        period: "2020 - 2026",
        location: "Remote / Vancouver",
        bullets: [
          "构建网页界面、静态站点、移动端原型和小型文档处理工具。",
          "负责内容结构、前端实现、部署和后续维护。",
        ],
      },
    ],
    skills: sharedSkills,
  },
} as const satisfies Record<Locale, ResumeData>

export function getResume(locale: Locale): ResumeData {
  return resume[locale]
}
