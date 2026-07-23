/**
 * Single source of truth for every piece of copy on the site.
 * Everything here was extracted from kxrim.is-a.dev, github.com/KerYagciHTL,
 * yagcisons.at, moe-v.de and slidelizard.com — nothing is invented.
 * Missing facts are marked TODO(content) and listed in CONTINUOUS/HANDOFF.md.
 */

export const identity = {
  name: 'Kerimcan Yagci',
  handle: 'kxrim',
  github: 'KerYagciHTL',
  githubUrl: 'https://github.com/KerYagciHTL',
  email: 'k.yagci@students.htl-leonding.ac.at',
  location: 'Ansfelden, Austria',
  // His own line from the current site, kept verbatim:
  intro:
    'A software developer from Austria, specializing in modern web technologies and system programming.',
  // Translated from his own German copy ("Kleine Ideen zu stabilen, nutzbaren Bausteinen machen"):
  thesis: 'Small ideas, made into stable building blocks.',
  languages: ['C', 'C++', 'C#', 'Java', 'TypeScript', 'Python'],
  availability: 'Open for internships, side projects, and collaborations.',
} as const

export interface ClientEntry {
  index: string
  name: string
  short: string
  url: string
  urlLabel: string
  sector: string
  location: string
  built: string
  details: readonly string[]
  note: string
  // TODO(content): request testimonial quote from client — do not invent one.
  quote: null
}

export const clients: readonly ClientEntry[] = [
  {
    index: '01',
    name: 'Yagci Sons Logistics',
    short: 'YSL',
    url: 'https://yagcisons.at',
    urlLabel: 'yagcisons.at',
    sector: 'Freight forwarding',
    location: 'Austria · EU-wide',
    built:
      'Designed and built the complete company site: services, live shipment-status concept, bilingual DE/EN, smooth-scroll front end.',
    details: [
      'Full & partial loads (FTL / LTL)',
      'Express and direct runs',
      'Vehicle transport',
      'Customs & CMR documentation',
    ],
    note: 'Sole developer. The client was satisfied with the result.',
    quote: null,
  },
  {
    index: '02',
    name: 'MOE Verkehrs- und Sicherheitstechnik',
    short: 'MOE',
    url: 'https://moe-v.de',
    urlLabel: 'moe-v.de',
    sector: 'Traffic & safety engineering',
    location: 'Berlin, Germany',
    built:
      'Built the company web presence: service catalogue, accreditations, contact — for an engineering firm handling road safety infrastructure.',
    details: [
      'No-parking zone permits',
      'Construction site securing',
      'Road markings',
      'Traffic signage',
    ],
    note: 'Sole developer. The client was satisfied with the result.',
    quote: null,
  },
] as const

export interface ProjectEntry {
  index: string
  name: string
  description: string
  tech: readonly string[]
  url: string
  todo?: string
}

export const projects: readonly ProjectEntry[] = [
  {
    index: '01',
    name: 'KCY-Accounting',
    description:
      'Cross-platform order and customer management app with TCP-based license validation. Solo project.',
    tech: ['C#', '.NET 10', 'Avalonia UI'],
    url: 'https://github.com/KerYagciHTL/KCY-Accounting',
  },
  {
    index: '02',
    name: 'Kerlib',
    description:
      'A lightweight Win32 windowing library for C# — high performance, low memory overhead, extensible drawing and event handling.',
    tech: ['C#', 'Win32'],
    url: 'https://github.com/KerYagciHTL/Kerlib',
  },
  {
    index: '03',
    name: 'Afterfall',
    // TODO(content): confirm a one-line description for Afterfall (repo has none).
    description: 'Java project — description pending.',
    tech: ['Java'],
    url: 'https://github.com/KerYagciHTL/Afterfall',
    todo: 'TODO(content): confirm what Afterfall is',
  },
] as const

export interface RecordEntry {
  index: string
  title: string
  org: string
  orgUrl: string | null
  period: string
  description: string
  todo?: string
}

export const record: readonly RecordEntry[] = [
  {
    index: '01',
    title: 'Higher Department of Computer Science',
    org: 'HTL Leonding',
    orgUrl: 'https://www.htl-leonding.at',
    period: '2022 — 2027',
    description:
      'Five-year technical secondary education. Focus: software development, databases, operating systems.',
  },
  {
    index: '02',
    title: 'Ferialpraktikum — one-month summer internship',
    org: 'SlideLizard',
    orgUrl: 'https://slidelizard.com',
    // TODO(content): confirm which summer (year) the internship took place.
    period: 'Summer — one month',
    description:
      'Presentation software company from Austria — slide libraries, live audience interaction and analytics for PowerPoint.',
    todo: 'TODO(content): confirm what was actually built at SlideLizard + the year',
  },
] as const

export const nav = [
  { index: '01', label: 'Client work', href: '#work' },
  { index: '02', label: 'Projects', href: '#projects' },
  { index: '03', label: 'Record', href: '#record' },
  { index: '04', label: 'Contact', href: '#contact' },
] as const
