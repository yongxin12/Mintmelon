# Mintmelon 个人站重做设计文档

- **日期**：2026-04-20
- **作者**：RZ (`rz@turingplanet.org`)
- **状态**：Draft — 待 User 审阅
- **参考站（视觉致敬对象）**：<https://abetkaua.com/en/>
- **仓库**：`/Users/rexzheng/project/personal/Mintmelon`（GitHub Pages 部署至 `www.mintmelon.ca`）

---

## 0. 背景与目标

当前 Mintmelon 站基于 2015 年代的 "iclick" 摄影 Bootstrap 模板（jQuery + Bootstrap 3 + wow.js + isotope + fancybox），与 RZ 的 "Mintmelon = 个人符号" 定位已脱节。本次**整体重做**的目标：

1. 视觉上**复刻 abetkaua 的极简气质**——editorial 大字体、大留白、中性色底、字母/符号网格、低动效、可展开卡片——但内容完全替换为 RZ 自己的作品集与简历。
2. 技术上从"静态 HTML + jQuery"升级到 **Next.js 15 App Router + Tailwind + MDX + 静态导出**，以支撑 10+ 代码项目 + 双语维护。
3. 保留域名 `www.mintmelon.ca` 与 GitHub Pages 部署模式。

**不在本次 scope**：Umami analytics 实例的运维搭建（代码侧留集成位）、博客系统、加密/隐私项目详情。

---

## 1. 信息架构 & 路由

### 顶级路由

| 路径 | 行为 |
|---|---|
| `/` | 静态导出下用 HTML `<meta http-equiv="refresh">` + 一段内联跳转脚本双兜底，跳 `/en/` |
| `/en/` | 英文首页（单页长滚动，§4.1 结构） |
| `/zh/` | 中文首页（同结构，中文文案） |
| `/en/work/[slug]/` | 英文作品详情页 |
| `/zh/work/[slug]/` | 中文作品详情页 |
| `/404.html` | 静态 fallback（`not-found.tsx` 生成） |

`trailingSlash: true` 保证 GH Pages 下 URL 一致性。

### 语言切换

- NAV 右上 `EN / 中文` 纯文字切换按钮。
- 切语言时保持当前路径的语言无关部分：`/en/work/foo` ↔ `/zh/work/foo`。
- `<html lang>` 跟随路由段。
- 根 `/` **一律**跳 `/en/`（不做浏览器语言检测）。

### 主导航

Sticky top bar：

```
[Mintmelon]        Work · About · Resume · Contact        [EN|中]  [🌙]
```

- Logo 文字 `Mintmelon`。
- Work / About / Resume / Contact 为锚点跳转首页对应 section。
- 语言切换与主题切换在最右。
- 手机端折为 hamburger，用 `<details>/<summary>` 原生实现（JS 禁用也能开合）。

### Footer

```
Mintmelon · © 2026 · GitHub · LinkedIn · Email · ↑ Back to top
```

---

## 2. 内容模型

### 2.1 作品项目（MDX）

目录：

```
content/projects/<slug>/
  en.mdx
  zh.mdx
  cover.jpg        # 可选
  gallery/*.jpg    # 可选
```

Frontmatter schema（非翻译字段以 `en.mdx` 为准；翻译字段两份独立）：

```yaml
---
slug: "mintmelon-site"             # 必填，与文件夹同名
title: "Mintmelon"                 # 必填（可译）
tagline: "Personal symbol site"    # 必填（可译）
summary: "Short description..."    # 必填（可译），卡片展开时显示的一段
year: 2026                         # 必填
tech: ["Next.js", "TypeScript"]    # 必填
repo: "https://github.com/..."     # 可选
demo: "https://..."                # 可选
featured: true                     # 可选，是否进 Featured Work
order: 1                           # 可选，在 featured / 网格里的排序
cover: "./cover.jpg"               # 可选
status: "live" | "wip" | "archived" # 可选
draft: false                       # 可选；true 时构建期被过滤，不上线
---
```

### 2.2 简历数据

路线：**TS 数据文件**（结构化信息，不走 MDX）。

```
data/resume.en.ts
data/resume.zh.ts
```

```ts
export default {
  education: [
    { school, degree, field, start, end, location, notes? }
  ],
  experience: [
    { company, role, start, end, location, bullets: string[] }
  ],
  skills: {
    languages: string[],    // e.g. TypeScript, Go, Python
    frameworks: string[],   // e.g. Next.js, React
    tools: string[],        // e.g. Docker, AWS
  },
}
```

首次种子（从旧站抽取 + 留空给 User 补全）：`skills.languages = ["Python", "C/C++", "JavaScript", "HTML/CSS"]`；education / experience 条目留空模板。

### 2.3 站点全局文案 & 元信息

```
data/site.en.ts
data/site.zh.ts
```

内含：

- `hero`：name, roleLine（`I build ...`）
- `manifesto`：见 §4.5
- `numberedFacts`：3 条 `{ number, title, body }`
- `about`：bio（长段）+ portrait 路径
- `contact`：email, location, social: { github, linkedin, x? }
- 其它 UI 微字符串见 `lib/i18n/dictionary.ts`

`site.en.ts` 和 `site.zh.ts` 都导出同一个 `SiteData` 类型；非翻译字段（email、URL、social handle）**只在 `site.en.ts` 定义**，`site.zh.ts` 从 `site.en.ts` `import` 非翻译字段并与自己的翻译字段合并后 export。这样避免双份维护。

### 2.4 Schema 校验

- `lib/content/project-schema.ts`：zod，运行于构建期每个 MDX。
- `lib/content/site-schema.ts`：zod，运行于 `site.*.ts / resume.*.ts`。
- Manifesto 彩蛋专项校验（见 §4.5）。
- 任一失败 → `next build` failfast。

---

## 3. 视觉系统

### 3.1 字体（全部 `next/font/google` self-host）

| 用途 | 英文 | 中文 |
|---|---|---|
| Display / Hero 大标题（editorial） | **Fraunces**（Variable Serif） | 默认不混中文 display；若必要用 Noto Serif SC |
| UI / Body | **Inter**（Variable Sans） | **Noto Sans SC**（思源黑体） |
| Mono（编号事实 01 02 03 / 代码） | **JetBrains Mono** | 同英文 |

CSS 变量：`--font-display / --font-sans / --font-mono`，Tailwind `fontFamily` 读变量。

### 3.2 色板（默认深色 + 浅色可切）

```
# Dark (默认)
--bg         : #0B0B0B      # 纸黑
--bg-raised  : #141414      # 卡片底
--fg         : #F2F2F0      # 米白
--fg-muted   : #8A8A85
--border     : #222220
--accent     : #9FE6C3      # 薄荷（Mintmelon 暗示）
--accent-fg  : #0B0B0B

# Light
--bg         : #F5F4EE
--bg-raised  : #FFFFFF
--fg         : #141414
--fg-muted   : #5F5F58
--border     : #E3E1D7
--accent     : #2FB07A
--accent-fg  : #FFFFFF
```

薄荷绿严格用于：链接下划线 hover、`+` 展开图标 hover、Manifesto 高亮字母、"featured" 徽章、外链箭头。**禁止**大面积背景块、按钮填色。按钮统一 outline + fg 色。

### 3.3 间距 & 栅格

- 最大内容宽 **1440px**，左右 padding 桌面 `clamp(24px, 4vw, 80px)`。
- 垂直 section 间距 `clamp(96px, 12vh, 180px)`。
- All Work 网格：桌面 3 列 / 平板 2 列 / 手机 1 列；卡片 `aspect-ratio: 3/4`。
- Featured Work：桌面 2 列大卡。
- 三条编号事实：桌面 3 列 / 手机 1 列堆叠。

### 3.4 动效

- 入场：`IntersectionObserver` hook（`lib/motion/reveal.ts`）触发 `translateY(24px) → 0 + opacity 0 → 1`，600ms，`cubic-bezier(.2,.8,.2,1)`，headings / 编号事实 / 卡片逐项 stagger。
- 卡片 hover：封面 `scale(1.02)`，标题 fg → accent，200ms。
- 卡片就地展开（见 §4.1 AllWork）：用 `grid-template-rows: 0fr → 1fr` 过渡，300ms。
- 页面切换：无自定义过渡。
- **完全尊重** `prefers-reduced-motion: reduce`——全部动画降为瞬时切换。

### 3.5 深色 / 浅色

- 默认深色。
- 一段**内联初始化脚本**在 React hydrate 之前执行（避免首屏 flash）：读 `localStorage['theme']`；若空则读 `prefers-color-scheme`；给 `<html data-theme="dark|light">` 打属性；异常时兜底深色。
- 该脚本全部内容是本仓库内写死的字面量，**不注入任何用户或外部内容**，无 XSS 面。
- `ThemeToggle.tsx` client 组件写 `localStorage` + 切 attribute。
- CSS 变量在 `[data-theme="dark"]` / `[data-theme="light"]` 下分别定义。

---

## 4. 页面线框

### 4.1 首页 `/[locale]/`（长滚动组合 C）

顺序：**NAV → Hero → Manifesto（§4.5） → NumberedFacts → FeaturedWork → About → AllWork → Resume → Contact → Footer**。

各 section 结构：

- **Hero**：
  - `Hi, I'm <Name>.` + 一行自我描述（"I build ..."，editorial 大字 serif，2–3 行，允许一个词用 accent 色）。
  - 副标题一行 sans 小字。
  - 末尾 `↓ Scroll` 指示。
  - 纯文字，不放头像。

- **NumberedFacts**（三条编号事实）：
  - 三列并排；每列：`01` 大 mono 数字 / 水平分隔线 / 短标题 serif 中号 / 正文 2–4 行 sans。

- **FeaturedWork**：
  - Section heading：`Featured Work — 2026` + 分隔线。
  - 2 列大卡，最多 3 项（来自 `featured: true` 按 `order` 排）。
  - 卡片：封面（3:4） / 标题 + 右下 `+` / tagline / `tech · year`。

- **About**：
  - 左 portrait（`about1.png`）右正文 2–3 段 bio。
  - Section heading `About` + 分隔线。

- **AllWork**：
  - Section heading：`Selected Works — 2020‒2026` + 分隔线。
  - Filter chips：**基于所有项目 `tech` 字段自动聚合**（不引入单独 `category` 字段），第一项 `All`。
  - 3 列网格（全部非 draft 项目）。
  - **卡片点 `+` 就地展开**：展开区显示 summary 段 + "View project →" 链接（跳 `/[locale]/work/<slug>/`）。同一时刻可多张展开。
  - 展开动画：`grid-template-rows` 0fr → 1fr。

- **Resume**（三栏）：
  - Education / Experience / Skills 三列。
  - Education：`• school · degree / field · start–end · location`。
  - Experience：`• company · role · start–end`，下方 bullet list。
  - Skills：三组标签（languages / frameworks / tools），每组子标题 + 行内胶囊标签。
  - 不提供 PDF 下载（先留位，占位文案略）。

- **Contact（兼 Footer 上半）**：
  - 大字 `Let's talk.`（serif）
  - `<your email>` 大号链接（`mailto:`）
  - 一行 `GitHub  LinkedIn  X` 链接。

- **Footer**：
  - `Mintmelon · © {year} · ↑ Back to top`。

### 4.2 作品详情页 `/[locale]/work/[slug]/`

```
← Back to Work
<Project Title>         [Display serif 大字]
<tagline>
year · tech chips · [GitHub ↗] [Live ↗]

[cover.jpg（如果有）, full-width contained]

[MDX body：小标题 / 段落 / 代码块 / 截图 / 列表；
 自定义组件 <Callout> <Figure> <Gallery> <TechStack> <LinkCard>]

← Prev Project                     Next Project →
```

Cover 可选，没 cover 则省略该行。Prev/Next 按 `order` → 发布年 → slug 字母序决定。

### 4.3 移动端

- NAV 折成 hamburger（`<details>` 原生）。
- Hero 大字用 `clamp()` 自动缩放。
- 三条编号事实堆叠为 1 列。
- Featured 2 列 → 1 列；All Work 3 列 → 1 列。
- 卡片就地展开在窄屏保留。

---

## 4.5 Manifesto & 彩蛋（核心差异化设计）

### 4.5.1 放置

独立 section，介于 Hero 和 NumberedFacts 之间。该 section 占接近一整屏，大留白。

### 4.5.2 文本 & 高亮

原文（源自旧站 `<strong>` 标签的位置，与 User 设定一致）：

```
Actions speak louder than words, and I live by both with passion.
I strive not just to achieve, but to love and believe.
```

`text` 总长 120（上下两行之间为单个 `\n`）。8 段 range 高亮（已按实际字符串验证，可直接使用）：

| # | Range (start–end) | 高亮字符 |
|---|---|---|
| 1 | `[0, 1]` | `A` |
| 2 | `[37, 38]` | `I` |
| 3 | `[66, 69]` | `I s` |
| 4 | `[79, 83]` | `just` |
| 5 | `[88, 89]` | `c` |
| 6 | `[104, 105]` | `o` |
| 7 | `[110, 111]` | `d` |
| 8 | `[113, 114]` | `e` |

按顺序拼接高亮字符、移除空格、小写：`AIIsjustcode` → `aiisjustcode` ≡ `ai is just code` ✓

### 4.5.3 Schema

Manifesto 数据用 discriminated union——只有 English 版本走 easter-egg 模式、跑高亮校验；Chinese 版本是直译朴素文本，没有 highlights/reveal。

```ts
// lib/content/site-schema.ts
export type Manifesto =
  | { mode: "easter-egg"; text: string; highlights: [number, number][]; reveal: string }
  | { mode: "plain";      text: string }
```

```ts
// data/site.en.ts
manifesto: {
  mode: "easter-egg",
  text: "Actions speak louder than words, and I live by both with passion.\n"
      + "I strive not just to achieve, but to love and believe.",
  highlights: [
    [0, 1], [37, 38], [66, 69], [79, 83],
    [88, 89], [104, 105], [110, 111], [113, 114],
  ],
  reveal: "ai is just code",
}
```

```ts
// data/site.zh.ts
manifesto: {
  mode: "plain",
  text: "行动胜于言辞，我带着热情同时践行两者。\n我不仅追求成就，更心怀热爱与信念。",
}
```

构建期校验（`lib/content/validate-all.ts`）—— **仅对 `mode === "easter-egg"` 跑**，`plain` 模式跳过：

```ts
if (m.mode !== "easter-egg") return
const { text, highlights, reveal } = m
const collected = highlights
  .map(([s, e]) => text.slice(s, e))
  .join("")
  .replace(/\s/g, "")
  .toLowerCase()
const target = reveal.replace(/\s/g, "").toLowerCase()
if (collected !== target) throw new Error("manifesto highlights mismatch")
```

### 4.5.4 视觉（向参考站 "33 字母 33 字体" 致敬）

- 12 个高亮字符按字符序列分配 12 款不同 Google 字体（serif / mono / display 混合），CSS 变量 `--ego-font-01 … --ego-font-12`。
- 全部高亮字符用 `accent` 色。
- 每个高亮字符下方渲染极细 `baseline` 线（`border-bottom: 1px solid var(--accent)`，半透明）。

### 4.5.5 交互彩蛋（渐进揭示）

- **默认**：高亮字符就以不同字体 + accent 色显示。未触发任何交互。
- **悬停任一高亮字符**：
  - 全部 12 字符一起 fade 到更亮 accent，300ms。
  - 段末 `aria-live="polite"` 区域 fade-in 一行 mono 小字：`→ ai is just code`，2s 后自动消失（鼠标移开也立即消失）。
- **连击同一高亮字符 3 次**（或键盘按同一位置 Enter 3 次）：
  - 触发全屏覆盖层：纯黑背景、居中 Display serif 巨字 `ai is just code.`。
  - 5s 自动消失或任意键消失。
  - `localStorage['manifesto-seen'] = true` 记录，之后每次悬停揭示保留、全屏不再重复触发。
- **移动端 / `prefers-reduced-motion`**：
  - 悬停逻辑改为**单击高亮字符 → 段末气泡显示 `ai is just code`**。
  - 全屏动画改为瞬时显示或直接禁用。

### 4.5.6 中文版

`/zh/` 下 Manifesto 块**直接直译原文，不带彩蛋**（隐语是英文短语，中译会丢梗）。视觉上用黑体排版，保持大字留白气质。

---

## 5. 技术栈与实现

### 5.1 依赖

```
next@15
react@19  react-dom@19
typescript@5
tailwindcss@3.4  postcss  autoprefixer
next-mdx-remote  gray-matter  # 所有 MDX 走 RSC 运行时编译（不装 @next/mdx）
zod
framer-motion                # Manifesto 彩蛋全屏覆盖层（卡片展开走纯 CSS grid-template-rows）
clsx
satori + @resvg/resvg-js     # §7.3 OG 图生成
```

包管理：**pnpm**。

### 5.2 目录结构

```
Mintmelon/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                   # / → meta refresh 到 /en/
│  ├─ not-found.tsx
│  └─ [locale]/
│     ├─ layout.tsx              # 字体、NAV、语言/主题切换
│     ├─ page.tsx                # 首页 §4.1
│     ├─ not-found.tsx
│     └─ work/[slug]/page.tsx    # 详情页 §4.2
│
├─ components/
│  ├─ nav/{TopNav,LanguageToggle,ThemeToggle}.tsx
│  ├─ sections/{Hero,Manifesto,NumberedFacts,FeaturedWork,
│                About,AllWork,Resume,Contact,Footer}.tsx
│  ├─ work/{ProjectCard,ProjectFilter,ProjectDetailHeader}.tsx
│  └─ mdx/{Callout,Figure,Gallery,TechStack,LinkCard}.tsx
│
├─ lib/
│  ├─ content/{project-schema,site-schema,validate-all,
│               read-projects,read-site-data}.ts
│  ├─ i18n/{config,dictionary}.ts
│  └─ motion/reveal.ts
│
├─ content/projects/<slug>/{en.mdx,zh.mdx,cover.jpg,gallery/}
│
├─ data/{site.en.ts,site.zh.ts,resume.en.ts,resume.zh.ts}
│
├─ public/
│  ├─ favicon.png                # 保留
│  ├─ CNAME                      # 保留 www.mintmelon.ca
│  ├─ og.png                     # 由 scripts/gen-og.mjs 在 prebuild 时生成；.gitignore 排除
│  └─ img/{about1.png,main2.jpg,main2_eva1.jpg,main2_landscape.jpg}
│
├─ styles/{globals.css,tokens.css}
├─ scripts/gen-og.mjs            # 构建前生成 public/og.png
├─ next.config.mjs
├─ tsconfig.json
├─ tailwind.config.ts
├─ postcss.config.mjs
├─ package.json
├─ pnpm-lock.yaml
└─ .github/workflows/deploy.yml
```

### 5.3 Next 配置

```js
// next.config.mjs
export default {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
}
```

MDX **不作为 Next 的 page 扩展**——所有 `.mdx` 都是 `content/` 下的数据文件，构建期由 `next-mdx-remote/rsc` 动态编译进 RSC 组件。因此不需要 `@next/mdx` 与 `pageExtensions`。

### 5.4 i18n（路由段驱动）

```ts
// lib/i18n/config.ts
export const locales = ["en", "zh"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "en"
```

```ts
// app/[locale]/layout.tsx
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
```

作品详情页 `generateStaticParams` 穷举 `locales × slugs`。

根 `/` 的实现方式：`app/page.tsx` 导出一个极简页面，`<head>` 只含 `<meta http-equiv="refresh" content="0; url=/en/" />`；body 内一段兜底跳转脚本。内容为写死字面量，无用户输入。

### 5.5 MDX 管道

- `read-projects.ts` 在 RSC 里 `fs.readdir('content/projects')`；每个 slug 读 `en.mdx/zh.mdx`。
- `gray-matter` 解析 frontmatter；zod 校验。
- body 编译用 `next-mdx-remote/rsc`，传入 `components` map（自定义 MDX 组件）。
- 对外接口：
  ```ts
  export async function getAllProjects(locale): Promise<Project[]>
  export async function getProjectBySlug(locale, slug): Promise<Project | null>
  ```
- **Draft 隔离**（三道闸）：
  1. `getAllProjects(locale)` 过滤掉 `draft: true`。
  2. `getProjectBySlug(locale, slug)` 对 `draft: true` 返回 `null`——即使有人直接调用也读不到。
  3. 详情页 `app/[locale]/work/[slug]/page.tsx` 导出 `export const dynamicParams = false`，在 `generateStaticParams` 之外的 slug 自动 404；页面内再拿到 null 时调 `notFound()` 兜底。
  这样开发环境预览、未来改部署目标（比如迁 Cloudflare Pages 带动态路由）都不会泄漏 draft 内容。

### 5.6 字体自托管

```ts
import { Inter, Fraunces, JetBrains_Mono, Noto_Sans_SC } from "next/font/google"
// + 12 款 Manifesto 高亮字体
```

每个 `variable: "--font-xxx"`，`<body className={all.variable}>`。Tailwind `fontFamily` 从变量读取。

### 5.7 主题切换 & 防 flash

见 §3.5。关键点：

- 主题初始化是一段**内联到 HTML 的短脚本**，但内容完全是本仓库的静态字面量，无外部 / 用户输入，没有 XSS 面。
- 挂在 `<html>` 的 `data-theme` 属性上，CSS 变量分支即切主题。
- 客户端切换按钮写 `localStorage`，下次刷新由初始化脚本读到。

### 5.8 代码质量

- `tsconfig.json`：`strict: true`, `noUncheckedIndexedAccess: true`。
- ESLint: `next/core-web-vitals` + `@typescript-eslint`；禁 `any`、禁未使用 import、禁裸 `<img>`（强制 `next/image`）。
- Prettier 默认。

---

## 6. 迁移 & 回滚

### 6.1 从旧站抽取的真实数据（种子进新结构）

| 来源 | 新位置 |
|---|---|
| 旧 `<h2>` 中 Slogan + 8 段 `<strong>` 高亮 | `data/site.en.ts → manifesto` |
| PROFESSIONAL SUMMARY 段 | `data/site.en.ts → about.bio`（可改写） |
| Skills: Python / C/C++ / JavaScript / HTML/CSS | `data/resume.en.ts → skills.languages/...`（User 补全） |
| Email `worexow@gmail.com` | `data/site.en.ts → contact.email` |
| Address `Canada` | `data/site.en.ts → contact.location` |
| GitHub user `yongxin12` | 构造默认 GitHub URL |
| 5 个现有项目 repo | 种子 5 个 MDX（见 6.2） |
| `favicon.png, about1.png, main2*.jpg` | `public/favicon.png` + `public/img/` |

### 6.2 种子 MDX 项目

```
content/projects/
  resume-editor/              # repo: yongxin12/Resume-Editor-Deployment
  stox-news/                  # repo: yongxin12/StoxNews
  social-distribution/        # repo: yongxin12/Social-Distribution-Webapp
  qr-go/                      # repo: CMPUT301W23T20/QR-GO
  mintmelon/                  # repo: yongxin12/Mintmelon
  _draft-06/ ... _draft-10/   # draft: true 占位（凑 10+ 目标）
```

每个生成 `en.mdx/zh.mdx`：`title` 按 repo 名驼峰 → 空格拆分填写；`repo` 字段填完整 URL；其余 `tagline / summary / body` 填 TODO 占位，User 后续补全。

### 6.3 要丢弃

- `index.html`
- `css/`, `fonts/`, `js/`, `iclick-photography-bootstrap-free-website-template/`
- 旧 `img/` 下除保留 4 张外的全部文件
- 旧 `README.md`（替换成新的）

保留：`LICENSE`, `CNAME`（移至 `public/CNAME`）。

### 6.4 分支策略（激进版）

- **不**打 `v1-archive` tag。
- **不**开 feature 分支。
- 直接在 `main` 上分若干 commit 推送（`git rm` 旧文件 + 分阶段加新代码）。上线期间会有中间态，接受。
- 出问题**向前修**，不做 revert。git 历史兜底：`git checkout <sha> -- <path>` 极端救援。

### 6.5 分步落地顺序

1. `git rm -r` 旧模板文件（保留 CNAME / LICENSE / 4 张图 / favicon）。
2. `pnpm init`；装 §5.1 依赖。
3. 生成目录骨架 + 基础配置（`next.config.mjs / tailwind.config.ts / tsconfig.json / .gitignore / README.md`）。
4. `styles/tokens.css + globals.css`：§3 色板 + 字号系统。
5. i18n & layout 框架（`app/layout.tsx` + theme-init 脚本、`app/page.tsx` 跳转、`app/[locale]/layout.tsx`）。
6. 种子 `data/site.{en,zh}.ts` 与 `data/resume.{en,zh}.ts`（填入 §6.1 抽取数据）。
7. 种子 5 个真实项目 + 5 个 draft 占位 MDX。
8. Components 依次实现：NAV / ThemeToggle / LanguageToggle → Hero → Manifesto（含彩蛋）→ NumberedFacts → FeaturedWork → About → AllWork（filter、就地展开）→ Resume → Contact → Footer。
9. 作品详情页 + MDX 自定义组件（Callout / Figure / Gallery / TechStack / LinkCard）。
10. `lib/motion/reveal.ts` + `prefers-reduced-motion` 兜底。
11. SEO / metadata（title / description / OG / hreflang / sitemap / robots / JSON-LD）。
12. `.github/workflows/deploy.yml`；本地 `pnpm build && npx serve out` 全链路验证。
13. Lighthouse 过关键指标（§7.6 目标）。
14. 推送 main 完成上线。

### 6.6 GitHub Actions 部署

```yaml
name: Deploy
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: "pnpm" }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build                 # 含 prebuild(OG 生成) → next build → out/
        env:
          NEXT_PUBLIC_UMAMI_HOST:       ${{ secrets.NEXT_PUBLIC_UMAMI_HOST }}
          NEXT_PUBLIC_UMAMI_WEBSITE_ID: ${{ secrets.NEXT_PUBLIC_UMAMI_WEBSITE_ID }}
      - run: cp public/CNAME out/CNAME
      - run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with: { path: out }
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

仓库设置 → Pages → Source 切到 "GitHub Actions"。

### 6.7 风险 & 应对

| 风险 | 应对 |
|---|---|
| 字体路径在 subpath 下出错 | 根域名无 basePath，天然规避；build 后 grep 验证。 |
| 静态导出不支持 `redirect()` | 用 meta refresh + JS 双兜底（§5.4）。 |
| 图片大小写不一致（macOS 不敏感 / Linux CI 敏感） | 全部小写文件名；CI 多一步 `ls public/img` 断言。 |
| GH Pages 缓存 | workflow `concurrency.cancel-in-progress` + Next 自带文件名 hash。 |
| 项目数暂不足 10 | 内容结构预置 10 个槽位（5 真实 + 5 draft），首发公开 5 个；User 把 draft 依次去掉即逐渐补到 10+。 |

---

## 7. 测试 / 错误处理 / SEO / A11y / 隐私

### 7.1 构建期守卫（替代单测）

1. `tsc --noEmit` 严格编译。
2. Zod 校验所有 `en.mdx/zh.mdx` frontmatter 与 `site.*/resume.*`。
3. Manifesto 彩蛋校验（§4.5.3）。
4. ESLint + 自定义规则。

### 7.2 运行时兜底

- **Slug 不存在**：`app/[locale]/not-found.tsx` 极简 404 + 返回首页 / 回 Work 两个链接。
- **图片加载失败**：父容器给 `background-color: var(--bg-raised)` 占位；`alt` 可读。
- **JS 禁用**：
  - Manifesto 彩蛋：纯 CSS 展示不同字体 + accent 色（无交互，但显式）。
  - 主题切换：CSS `@media (prefers-color-scheme: light)` fallback。
  - NAV 锚点：`<a href="#...">`。
  - Hamburger：`<details>/<summary>` 原生开合。

### 7.3 SEO

- `app/[locale]/layout.tsx` 用 `generateMetadata`：
  - `title`: `Mintmelon — <Name>`
  - `description`: 取 hero roleLine
  - `openGraph.images`: `/og.png`（1200×630）。深色底 `#0B0B0B`、巨字 Fraunces `Mintmelon`、下方小字 `<Name> · <tagline>`，由 `scripts/gen-og.mjs` 用 `satori` + `@resvg/resvg-js` 渲染。**生成路径固定为 `package.json` 的 `prebuild` hook**：`"prebuild": "node scripts/gen-og.mjs"`，每次 `pnpm build` 会先跑这个脚本重新生成 `public/og.png`，workflow 无需额外步骤。`public/og.png` **不 check in**——`.gitignore` 排除它，避免陈旧文件进 git。
  - `alternates.languages`: `{ en: "/en/", zh: "/zh/", "x-default": "/en/" }`
  - `twitter.card`: `summary_large_image`
- `app/sitemap.ts` 穷举 `locales × (首页 + 所有非 draft 项目)`。
- `app/robots.ts` 允许全部，指向 sitemap。
- JSON-LD：
  - 首页 `<Person>`：name / url / sameAs (GitHub, LinkedIn) / jobTitle。
  - 作品详情页 `<CreativeWork>` 或 `<SoftwareSourceCode>`：name / url / codeRepository / programmingLanguage。
- `canonical` + `hreflang` 每页自动注入。

### 7.4 A11y

- `<html lang>` 跟随 locale。
- `focus-visible`: `outline: 2px solid var(--accent); outline-offset: 2px`。
- 语言/主题切换按钮：`<button>` + `aria-label` + `aria-pressed`。
- Manifesto 高亮：每个 `<span>` 加 `aria-describedby` 指向屏读专用 "(highlighted)" 文本；揭示 `aria-live="polite"` region 发出"`ai is just code`"。连击全屏纯视觉对屏读不暴露。
- 对比度：`bg #0B0B0B` vs `fg #F2F2F0` ≥ 18:1；`accent #9FE6C3` 上 `#0B0B0B` ≥ 10:1（WCAG AAA）。
- `prefers-reduced-motion: reduce` → 全部动画退化。
- 图片 `alt`：cover `alt={title + ' cover'}`；about `alt="Portrait of <name>"`；装饰图 `alt=""`。
- 键盘：卡片 `+` 是 `<button>`，Enter/Space 触发展开；prev/next `<a>`。

### 7.5 隐私 & 分析

**Umami 自托管**（代码预留集成位，Umami 实例运维不在本 spec scope 内）：

- `app/[locale]/layout.tsx` 条件注入一个 `<script defer>`，`src = `${UMAMI_HOST}/script.js``，`data-website-id = UMAMI_WEBSITE_ID`。两个值从构建期 `process.env.NEXT_PUBLIC_UMAMI_HOST / NEXT_PUBLIC_UMAMI_WEBSITE_ID` 读取。
- `.env.example` 带两个变量 + 说明。
- 未配置 env → 完全不注入脚本；本地/fork 运行零痕迹。
- GH Actions 在 Secrets 里配置 env；静态导出内联进 `out/`。
- 推荐 Umami 部署在独立子域 `analytics.mintmelon.ca`（User 运维任务，不在本 spec scope）。
- 无 cookie、无 PII、无需同意弹窗。

### 7.6 性能目标

- Lighthouse（移动，GH Pages 环境）：Performance ≥ 95 / Accessibility ≥ 95 / Best Practices ≥ 95 / SEO ≥ 95。
- 首页 JS ≤ 120 KB gzip，LCP < 1.8s。
- 所有图片 lazy + responsive。

### 7.7 验收清单（上线前必过）

- [ ] `/` 自动跳 `/en/`
- [ ] `/en/` 与 `/zh/` 两个首页 8 段齐全（Hero / Manifesto / NumberedFacts / Featured / About / AllWork / Resume / Contact+Footer——Contact+Footer 算一段）
- [ ] Manifesto 彩蛋：zod 校验通过；悬停揭示；连击全屏；`localStorage` 记录
- [ ] 作品卡点 `+` 就地展开 + "View project →" 跳详情页
- [ ] 详情页渲染 MDX；prev/next 导航
- [ ] 深色默认；主题切换；无首屏 flash
- [ ] 400% 放大；键盘 tab 顺序；全部 `alt`
- [ ] 移动端（≤ 390px）无破版
- [ ] Lighthouse 四项 ≥ 95
- [ ] `out/CNAME` 与 `out/.nojekyll` 存在
- [ ] sitemap/robots/JSON-LD 生效
- [ ] 无 Umami env 时无痕；配置 Umami env 后脚本注入

---

## 8. 后续（不在本次 scope）

- 博客 / 长文（`/[locale]/writing/`）
- RSS / JSON Feed
- 项目详情页阅读进度条
- 真·PDF 简历下载
- CSP 头（GH Pages 受限；若迁 Cloudflare Pages 再做）
- Umami 实例自托管运维
- 图片 CDN / 响应式 srcset 生成管线
