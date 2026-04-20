"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties, MouseEvent, ReactNode } from "react"
import type { Locale } from "@/lib/i18n/config"
import type { Project } from "@/data/projects"
import type { ResumeData } from "@/data/resume"
import type { SiteData } from "@/data/site"

type HomePageProps = {
  locale: Locale
  site: SiteData
  projects: Project[]
  resume: ResumeData
}

export function HomePage({ locale, site, projects, resume }: HomePageProps) {
  const [activeTech, setActiveTech] = useState(site.work.all)
  const [openProjects, setOpenProjects] = useState<ReadonlySet<string>>(new Set())
  const [manifestoHint, setManifestoHint] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [clickState, setClickState] = useState({ key: "", count: 0 })

  const localeSwitch = locale === "en" ? "/zh/" : "/en/"
  const techFilters = useMemo(() => {
    const tech = new Set<string>()
    projects.forEach((project) => project.tech.forEach((item) => tech.add(item)))
    return [site.work.all, ...tech]
  }, [projects, site.work.all])

  const visibleProjects =
    activeTech === site.work.all
      ? projects
      : projects.filter((project) => project.tech.includes(activeTech))

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [activeTech])

  useEffect(() => {
    if (!overlayOpen) return

    const close = () => setOverlayOpen(false)
    const timer = window.setTimeout(close, 5000)
    window.addEventListener("keydown", close)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("keydown", close)
    }
  }, [overlayOpen])

  function toggleProject(slug: string) {
    setOpenProjects((current) => {
      const next = new Set(current)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  function toggleProjectFromCard(event: MouseEvent<HTMLElement>, slug: string) {
    const target = event.target as HTMLElement
    if (target.closest("a, button")) return
    toggleProject(slug)
  }

  function touchManifesto(key: string) {
    setManifestoHint(true)
    window.setTimeout(() => setManifestoHint(false), 2200)

    if (site.manifesto.mode !== "easter-egg") return
    if (window.localStorage.getItem("manifesto-seen") === "true") return

    setClickState((current) => {
      const nextCount = current.key === key ? current.count + 1 : 1
      if (nextCount >= 3) {
        window.localStorage.setItem("manifesto-seen", "true")
        setOverlayOpen(true)
        return { key, count: 0 }
      }
      return { key, count: nextCount }
    })
  }

  return (
    <main className="site-shell" id="top">
      <div className="scan-layer" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href={`/${locale}/`} aria-label="Mintmelon home">
          Mintmelon::RZ
        </a>
        <span className="system-status">{site.ui.systemStatus}</span>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">{site.nav.work}</a>
          <a href="#about">{site.nav.about}</a>
          <a href="#resume">{site.nav.resume}</a>
          <a href="#contact">{site.nav.contact}</a>
          <a href={localeSwitch}>{locale === "en" ? "中文" : "EN"}</a>
        </nav>
        <details className="mobile-nav">
          <summary>{site.ui.menu}</summary>
          <div>
            <a href="#work">{site.nav.work}</a>
            <a href="#about">{site.nav.about}</a>
            <a href="#resume">{site.nav.resume}</a>
            <a href="#contact">{site.nav.contact}</a>
            <a href={localeSwitch}>{locale === "en" ? "中文" : "EN"}</a>
          </div>
        </details>
      </header>

      <section className="hero-section" data-reveal>
        <div className="hero-copy">
          <p className="command-line">{site.hero.command}</p>
          <h1>
            {site.hero.title} <span>{site.hero.accent}</span>.
          </h1>
          <p className="hero-subtitle">{site.hero.subtitle}</p>
        </div>
        <aside className="terminal-panel" aria-label="Site system status">
          {site.hero.terminal.map((line, index) => (
            <p key={line}>
              <span className={index === 0 ? "dot-ok" : "arrow-blue"}>
                {index === 0 ? "●" : "→"}
              </span>{" "}
              {line}
            </p>
          ))}
        </aside>
      </section>

      <section className="manifesto-section" data-reveal>
        <div className="section-rail">
          {site.ui.manifestoRail}
        </div>
        <div>
          <ManifestoText site={site} onTouch={touchManifesto} />
          <p className={`manifesto-reveal ${manifestoHint ? "is-active" : ""}`} aria-live="polite">
            {site.manifesto.mode === "easter-egg" ? `→ ${site.manifesto.reveal}` : ""}
          </p>
        </div>
      </section>

      <section className="facts-grid" aria-label="Design principles">
        {site.facts.map((fact, index) => (
          <article className="fact-card" data-reveal style={{ "--delay": `${index * 80}ms` } as CSSProperties} key={fact.code}>
            <div className="fact-meta">
              <span>{fact.code}</span>
              <span>{fact.label}</span>
            </div>
            <div>
              <h2>{fact.title}</h2>
              <p>{fact.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section id="work" className="work-section">
        <div className="section-heading" data-reveal>
          <span>{site.work.eyebrow}</span>
          <span>{site.work.range}</span>
        </div>
        <div className="filter-row" data-reveal>
          {techFilters.map((tech) => (
            <button
              type="button"
              className={tech === activeTech ? "is-active" : ""}
              onClick={() => setActiveTech(tech)}
              key={tech}
            >
              {tech}
            </button>
          ))}
        </div>
        <div className="project-grid">
          {visibleProjects.map((project, index) => {
            const isOpen = openProjects.has(project.slug)

            return (
              <article
                className={`project-card ${isOpen ? "is-open" : ""}`}
                data-letter={project.letter}
                data-reveal
                style={{ "--delay": `${index * 70}ms` } as CSSProperties}
                onClick={(event) => toggleProjectFromCard(event, project.slug)}
                key={project.slug}
              >
                <div className="project-meta">
                  <span>[{project.phonetic}]</span>
                  <button
                    type="button"
                    onClick={() => toggleProject(project.slug)}
                    aria-expanded={isOpen}
                    aria-controls={`project-details-${project.slug}`}
                    aria-label={`${isOpen ? site.ui.project.closeDetails : site.ui.project.openDetails}: ${project.title}`}
                  >
                    {project.code} {isOpen ? "-" : "+"}
                  </button>
                </div>
                <div>
                  <p className="project-tagline">{project.tagline}</p>
                  <h3>{project.title}</h3>
                  <p className="project-tech">
                    {project.tech.join(" / ")} · {project.year}
                  </p>
                  <div className="project-details" id={`project-details-${project.slug}`}>
                    <div>
                      <div className="project-detail-grid">
                        <dl>
                          <div>
                            <dt>{site.ui.project.type}</dt>
                            <dd>{project.kind}</dd>
                          </div>
                          <div>
                            <dt>{site.ui.project.status}</dt>
                            <dd>{project.status}</dd>
                          </div>
                          <div>
                            <dt>{site.ui.project.role}</dt>
                            <dd>{project.role}</dd>
                          </div>
                        </dl>
                        <ul>
                          {project.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="project-links">
                        <a href={project.repo}>{site.ui.project.repository} ↗</a>
                        {project.demo ? <a href={project.demo}>{site.ui.project.liveDemo} ↗</a> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section id="about" className="about-section" data-reveal>
        <div className="portrait-frame" aria-label="Portrait from retained site assets" />
        <div>
          <p className="command-line">{site.ui.aboutImageLabel}</p>
          <h2>{site.about.title}</h2>
          {site.about.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="resume" className="resume-section" data-reveal>
        <div className="section-heading">
          <span>{site.resume.eyebrow}</span>
          <span>{site.resume.title}</span>
        </div>
        <div className="resume-grid">
          <ResumeColumn title={site.ui.resume.education}>
            {resume.education.map((item) => (
              <p key={`${item.school}-${item.period}`}>
                {item.school} · {item.degree} / {item.field} · {item.period} · {item.location}
              </p>
            ))}
          </ResumeColumn>
          <ResumeColumn title={site.ui.resume.experience}>
            {resume.experience.map((item) => (
              <div key={`${item.company}-${item.period}`}>
                <p>
                  {item.company} · {item.role} · {item.period} · {item.location}
                </p>
                {item.bullets.map((bullet) => (
                  <p className="resume-bullet" key={bullet}>
                    {bullet}
                  </p>
                ))}
              </div>
            ))}
          </ResumeColumn>
          <ResumeColumn title={site.ui.resume.skills}>
            <SkillSet title={site.ui.resume.languages} items={resume.skills.languages} />
            <SkillSet title={site.ui.resume.frameworks} items={resume.skills.frameworks} />
            <SkillSet title={site.ui.resume.tools} items={resume.skills.tools} />
          </ResumeColumn>
        </div>
      </section>

      <section id="contact" className="contact-section" data-reveal>
        <p className="command-line">{site.ui.contactRail}</p>
        <h2>{site.contact.title}</h2>
        <a className="email-link" href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
        <div className="social-row">
          <a href={site.contact.github}>GitHub</a>
          <a href={site.contact.linkedin}>LinkedIn</a>
          <span>{site.contact.location}</span>
        </div>
      </section>

      <footer className="footer">
        <span>Mintmelon · © 2026</span>
        <a href="#top">↑ {site.ui.footer.backToTop}</a>
      </footer>

      {overlayOpen ? (
        <button className="manifesto-overlay" type="button" onClick={() => setOverlayOpen(false)}>
          ai is just code.
        </button>
      ) : null}
    </main>
  )
}

function ManifestoText({
  site,
  onTouch,
}: {
  site: SiteData
  onTouch: (key: string) => void
}) {
  const manifesto = site.manifesto

  if (manifesto.mode === "plain") {
    return (
      <p className="manifesto-text">
        {manifesto.text.split("\n").map((line) => (
          <span className="manifesto-line" key={line}>
            {line}
          </span>
        ))}
      </p>
    )
  }

  const pieces: { text: string; highlight: boolean; key: string }[] = []
  let cursor = 0
  manifesto.highlights.forEach(([start, end], index) => {
    if (start > cursor) {
      pieces.push({ text: manifesto.text.slice(cursor, start), highlight: false, key: `text-${index}` })
    }
    pieces.push({ text: manifesto.text.slice(start, end), highlight: true, key: `highlight-${index}` })
    cursor = end
  })
  if (cursor < manifesto.text.length) {
    pieces.push({ text: manifesto.text.slice(cursor), highlight: false, key: "text-end" })
  }

  return (
    <p className="manifesto-text">
      {pieces.map((piece) => {
        if (!piece.highlight) {
          return piece.text.split("\n").map((line, index, lines) => (
            <span key={`${piece.key}-${index}`}>
              {line}
              {index < lines.length - 1 ? <br /> : null}
            </span>
          ))
        }

        return (
          <button
            className="manifesto-highlight"
            type="button"
            onMouseEnter={() => onTouch(piece.key)}
            onClick={() => onTouch(piece.key)}
            key={piece.key}
          >
            {piece.text}
          </button>
        )
      })}
    </p>
  )
}

function ResumeColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="resume-column">
      <h3>{title}</h3>
      {children}
    </article>
  )
}

function SkillSet({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="skill-set">
      <h4>{title}</h4>
      <div>
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  )
}
