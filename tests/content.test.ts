import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { getProjects } from "../data/projects.ts"
import { getResume } from "../data/resume.ts"
import { getSiteData } from "../data/site.ts"
import { collectManifestoReveal } from "../lib/content/manifesto.ts"

describe("site content", () => {
  it("loads bilingual site data with the retained Mintmelon identity", () => {
    const en = getSiteData("en")
    const zh = getSiteData("zh")

    assert.equal(en.brand, "Mintmelon")
    assert.equal(zh.brand, "Mintmelon")
    assert.match(en.hero.title, /Systems/)
    assert.match(zh.hero.title, /系统/)
    assert.equal(en.contact.email, zh.contact.email)
  })

  it("keeps project cards sorted by order and hidden drafts out of the list", () => {
    const projects = getProjects("en")

    assert.deepEqual(
      projects.map((project) => project.slug),
      [
        "mintmelon",
        "qr-go",
        "social-distribution-webapp",
        "stoxnews",
        "resume-editor-deployment",
        "luxoraliving",
        "turing-community",
        "veryloving-react-native",
        "pdfmask",
        "japanese-match-3-rpg",
        "silicon-valley-ai-mvp",
      ],
    )
    assert.equal(projects.some((project) => project.draft), false)
  })

  it("exposes repository links and detail bullets for every project", () => {
    const projects = getProjects("en")

    assert.equal(projects.length, 11)
    projects.forEach((project) => {
      assert.match(project.repo, /^https:\/\/github\.com\//)
      assert.ok(project.details.length >= 3, `${project.slug} needs enough detail`)
      assert.ok(project.tech.length >= 2, `${project.slug} needs a useful stack`)
    })
    assert.equal(
      projects.find((project) => project.slug === "luxoraliving")?.demo,
      "https://luxoraliving.mintmelon.ca",
    )
    assert.equal(
      projects.find((project) => project.slug === "turing-community")?.demo,
      "https://turing-community.mintmelon.ca",
    )
    assert.equal(
      projects.find((project) => project.slug === "silicon-valley-ai-mvp")?.repo,
      "https://github.com/yongxin12/silicon-valley-ai-mvp",
    )
    assert.equal(
      projects.find((project) => project.slug === "silicon-valley-ai-mvp")?.demo,
      "https://silicon-valley-ai-mvp.vercel.app/hub",
    )
    assert.equal(
      projects.find((project) => project.slug === "resume-editor-deployment")?.demo,
      "https://resume.mintmelon.ca",
    )
    assert.equal(projects.find((project) => project.slug === "pdfmask")?.demo, "https://www.pdfmask.cn")
    assert.equal(
      projects.find((project) => project.slug === "japanese-match-3-rpg")?.demo,
      "https://msk.mintmelon.ca",
    )
  })

  it("collects the English manifesto highlight ranges into the reveal phrase", () => {
    const manifesto = getSiteData("en").manifesto

    assert.equal(manifesto.mode, "easter-egg")
    if (manifesto.mode === "easter-egg") {
      assert.equal(collectManifestoReveal(manifesto), "ai is just code")
    }
  })

  it("keeps resume skills available in both locales", () => {
    const en = getResume("en")
    const zh = getResume("zh")

    assert.ok(en.skills.languages.includes("TypeScript"))
    assert.ok(zh.skills.languages.includes("TypeScript"))
    assert.ok(en.skills.languages.includes("Python"))
  })

  it("provides localized interface labels for repeated UI controls", () => {
    const en = getSiteData("en")
    const zh = getSiteData("zh")

    assert.equal(en.ui.project.type, "Type")
    assert.equal(en.ui.project.repository, "Repository")
    assert.equal(en.ui.project.openDetails, "View details")
    assert.equal(zh.ui.project.type, "类型")
    assert.equal(zh.ui.project.repository, "代码仓库")
    assert.equal(zh.ui.project.openDetails, "查看详情")
    assert.equal(zh.ui.resume.education, "教育")
    assert.equal(zh.ui.footer.backToTop, "回到顶部")
  })

  it("keeps public copy away from defensive AI or template language", () => {
    const forbidden = /generic AI|AI gloss|template feel|AI 模板|模板感|authored feel|real person/i
    const payload = JSON.stringify({
      site: [getSiteData("en"), getSiteData("zh")],
      projects: [getProjects("en"), getProjects("zh")],
      resume: [getResume("en"), getResume("zh")],
    })

    assert.doesNotMatch(payload, forbidden)
  })
})
