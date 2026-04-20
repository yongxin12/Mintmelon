import type { Locale } from "../lib/i18n/config"
import type { Manifesto } from "../lib/content/manifesto"

export type SiteData = {
  brand: string
  locale: Locale
  nav: {
    work: string
    about: string
    resume: string
    contact: string
  }
  hero: {
    command: string
    title: string
    accent: string
    subtitle: string
    terminal: readonly string[]
  }
  manifesto: Manifesto
  facts: readonly {
    code: string
    label: string
    title: string
    body: string
  }[]
  about: {
    title: string
    body: readonly string[]
  }
  work: {
    eyebrow: string
    range: string
    all: string
  }
  resume: {
    eyebrow: string
    title: string
  }
  contact: {
    title: string
    email: string
    location: string
    github: string
    linkedin: string
  }
  ui: {
    menu: string
    systemStatus: string
    manifestoRail: string
    aboutImageLabel: string
    contactRail: string
    project: {
      type: string
      status: string
      role: string
      repository: string
      liveDemo: string
      openDetails: string
      closeDetails: string
    }
    resume: {
      education: string
      experience: string
      skills: string
      languages: string
      frameworks: string
      tools: string
    }
    footer: {
      backToTop: string
    }
  }
}

const sharedContact = {
  email: "rz@turingplanet.org",
  location: "Vancouver",
  github: "https://github.com/rexzheng",
  linkedin: "https://www.linkedin.com/",
}

const englishManifesto = {
  mode: "easter-egg",
  text:
    "Actions speak louder than words, and I live by both with passion.\n" +
    "I strive not just to achieve, but to love and believe.",
  highlights: [
    [0, 1],
    [37, 38],
    [66, 69],
    [79, 83],
    [88, 89],
    [104, 105],
    [110, 111],
    [113, 114],
  ],
  reveal: "ai is just code",
} as const satisfies Manifesto

const site = {
  en: {
    brand: "Mintmelon",
    locale: "en",
    nav: {
      work: "Work",
      about: "About",
      resume: "Resume",
      contact: "Contact",
    },
    hero: {
      command: "./personal-site --mode engineered --identity mintmelon",
      title: "Systems, interfaces, and",
      accent: "useful code",
      subtitle:
        "A compact record of software projects, interface experiments, and the small systems behind them.",
      terminal: [
        "profile.loaded RZ",
        "stack.scan TypeScript / Python / C++ / Web",
        "assets.keep about1.png + main2 series",
        "route.map /en /zh /work",
        'manifesto.hidden "ai is just code"',
      ],
    },
    manifesto: englishManifesto,
    facts: [
      {
        code: "01",
        label: "CORE",
        title: "Engineering first.",
        body:
          "Strong visual design, organized like a system: routes, typed content, static export, and reliable performance.",
      },
      {
        code: "02",
        label: "SIGNAL",
        title: "Personal material.",
        body:
          "Retained images, project notes, bilingual content, and small interactions make the site specific to this archive.",
      },
      {
        code: "03",
        label: "MOTION",
        title: "Fast and smooth.",
        body:
          "Reveal motion, hover feedback, expanding project cards, and reduced-motion support keep the interface responsive.",
      },
    ],
    about: {
      title: "About RZ.",
      body: [
        "I build software with a systems mindset and a visual sense for interfaces. Mintmelon is the personal mark: technical, quiet, and intentionally a little cryptic.",
        "The preserved photography from the old site stays in the new one as memory, not decoration. It keeps the archive connected to earlier work while the interface moves into a cleaner technical system.",
      ],
    },
    work: {
      eyebrow: "SELECTED_WORKS",
      range: "2020..2026",
      all: "All",
    },
    resume: {
      eyebrow: "PROFILE_INDEX",
      title: "Resume",
    },
    contact: {
      title: "Let's build something useful.",
      ...sharedContact,
    },
    ui: {
      menu: "Menu",
      systemStatus: "Status / Building / Vancouver",
      manifestoRail: "Manifesto / Highlight trace / 08 ranges",
      aboutImageLabel: "Image stream / about1.png",
      contactRail: "Contact / Direct channel",
      project: {
        type: "Type",
        status: "Status",
        role: "Role",
        repository: "Repository",
        liveDemo: "Live demo",
        openDetails: "View details",
        closeDetails: "Hide details",
      },
      resume: {
        education: "Education",
        experience: "Experience",
        skills: "Skills",
        languages: "Languages",
        frameworks: "Frameworks",
        tools: "Tools",
      },
      footer: {
        backToTop: "Back to top",
      },
    },
  },
  zh: {
    brand: "Mintmelon",
    locale: "zh",
    nav: {
      work: "作品",
      about: "关于",
      resume: "简历",
      contact: "联系",
    },
    hero: {
      command: "./personal-site --mode engineered --identity mintmelon",
      title: "系统、界面，以及",
      accent: "有用的代码",
      subtitle:
        "这里记录我做过的软件项目、界面实验，以及一些保留下来的个人痕迹。",
      terminal: [
        "profile.loaded RZ",
        "stack.scan TypeScript / Python / C++ / Web",
        "assets.keep about1.png + main2 series",
        "route.map /en /zh /work",
        "manifesto.zh plain_text",
      ],
    },
    manifesto: {
      mode: "plain",
      text: "行动胜于言辞，我带着热情同时践行两者。\n我不仅追求成就，更心怀热爱与信念。",
    },
    facts: [
      {
        code: "01",
        label: "CORE",
        title: "工程优先。",
        body: "视觉要有风格，但结构仍然像系统一样清楚：路由、类型化内容、静态导出和稳定性能。",
      },
      {
        code: "02",
        label: "SIGNAL",
        title: "来自真实项目。",
        body: "保留旧站图片、项目记录、双语内容和小交互，让站点围绕个人经历展开。",
      },
      {
        code: "03",
        label: "MOTION",
        title: "流畅但不吵。",
        body: "滚动入场、悬停反馈、展开项目卡和 reduced-motion 支持，让界面顺滑但不喧宾夺主。",
      },
    ],
    about: {
      title: "关于 RZ。",
      body: [
        "我用系统思维构建软件，也关注界面的视觉判断。Mintmelon 是一个个人符号：技术、安静，并且保留一点隐秘感。",
        "旧站保留下来的摄影会继续存在，但不作为装饰堆砌，而是作为个人痕迹进入新的技术化界面。",
      ],
    },
    work: {
      eyebrow: "SELECTED_WORKS",
      range: "2020..2026",
      all: "全部",
    },
    resume: {
      eyebrow: "PROFILE_INDEX",
      title: "简历",
    },
    contact: {
      title: "来做点有用的东西。",
      ...sharedContact,
    },
    ui: {
      menu: "菜单",
      systemStatus: "状态 / 构建中 / 温哥华",
      manifestoRail: "宣言 / 中文文本",
      aboutImageLabel: "图像流 / about1.png",
      contactRail: "联系 / 直接通道",
      project: {
        type: "类型",
        status: "状态",
        role: "角色",
        repository: "代码仓库",
        liveDemo: "在线演示",
        openDetails: "查看详情",
        closeDetails: "收起详情",
      },
      resume: {
        education: "教育",
        experience: "经历",
        skills: "技能",
        languages: "语言",
        frameworks: "框架",
        tools: "工具",
      },
      footer: {
        backToTop: "回到顶部",
      },
    },
  },
} as const satisfies Record<Locale, SiteData>

export function getSiteData(locale: Locale): SiteData {
  return site[locale]
}
