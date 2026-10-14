// What the README pages show, all from public GitHub data, no token needed: the contribution
// calendar of the profile page, the user, the own public repositories with their languages, and
// the public events.
export const USER = 'KerYagciHTL'

export interface Day {
  date: string
  count: number
  /** GitHub's own 0..4 level, by quartiles of the year */
  level: number
  /** week column and weekday row of the calendar */
  col: number
  row: number
}

export interface Happening {
  date: string
  repo: string
  what: string
  kind: 'push' | 'create' | 'review' | 'merge' | 'pr' | 'issue' | 'release' | 'other'
}

export interface Data {
  days: Day[]
  total: number
  repos: number
  stars: number
  followers: number
  languages: { name: string; share: number }[]
  lately: Happening[]
}

async function get(url: string, json = true) {
  const res = await fetch(url, { headers: { 'User-Agent': 'yagci.cc readme', Accept: json ? 'application/vnd.github+json' : 'text/html' } })
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return json ? res.json() : res.text()
}

/** The calendar from the profile page: one cell per day, the count in its tooltip. */
async function calendar(): Promise<{ days: Day[]; total: number }> {
  const html: string = await get(`https://github.com/users/${USER}/contributions`, false)
  const tips = new Map<string, number>()
  for (const [, id, tip] of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    tips.set(id!, Number(tip!.match(/^(\d+) contribution/)?.[1] ?? 0))
  }
  const days: Day[] = []
  for (const [, date, id, row, col, level] of html.matchAll(/data-date="([\d-]+)" id="(contribution-day-component-(\d+)-(\d+))" data-level="(\d)"/g)) {
    days.push({ date: date!, count: tips.get(id!) ?? 0, level: Number(level), row: Number(row), col: Number(col) })
  }
  if (days.length < 300) throw new Error(`calendar: only ${days.length} days found, the page changed`)
  days.sort((a, b) => a.date.localeCompare(b.date))
  const total = Number(html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1]?.replace(/,/g, '') ?? days.reduce((s, d) => s + d.count, 0))
  return { days, total }
}

function describe(e: any): Pick<Happening, 'what' | 'kind'> | null {
  const p = e.payload ?? {}
  switch (e.type) {
    case 'PushEvent':
      return { kind: 'push', what: `Pushed to ${String(p.ref ?? '').replace('refs/heads/', '') || 'a branch'}` }
    case 'CreateEvent':
      return p.ref_type === 'repository' ? { kind: 'create', what: 'Created the repository' } : { kind: 'create', what: `Created a ${p.ref_type ?? 'branch'}` }
    case 'PullRequestEvent':
      if (p.action === 'closed' && p.pull_request?.merged) return { kind: 'merge', what: 'Merged a pull request' }
      if (p.action === 'merged') return { kind: 'merge', what: 'Merged a pull request' }
      if (p.action === 'opened') return { kind: 'pr', what: 'Opened a pull request' }
      return null
    case 'PullRequestReviewEvent':
      return { kind: 'review', what: 'Reviewed a pull request' }
    case 'PullRequestReviewCommentEvent':
      return { kind: 'review', what: 'Commented on a review' }
    case 'IssuesEvent':
      return p.action === 'opened' ? { kind: 'issue', what: 'Opened an issue' } : null
    case 'ReleaseEvent':
      return { kind: 'release', what: `Released ${p.release?.tag_name ?? 'a version'}` }
    default:
      return null
  }
}

/** The newest public happenings, one per repository and kind, at most four. */
async function lately(): Promise<Happening[]> {
  const events: any[] = await get(`https://api.github.com/users/${USER}/events/public?per_page=60`)
  const out: Happening[] = []
  const seen = new Set<string>()
  for (const e of events) {
    const d = describe(e)
    if (!d) continue
    const key = `${e.repo.name}|${d.what}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ ...d, date: e.created_at, repo: e.repo.name })
    if (out.length === 4) break
  }
  return out
}

export async function load(): Promise<Data> {
  const [cal, user, repos, recent] = await Promise.all([
    calendar(),
    get(`https://api.github.com/users/${USER}`),
    get(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`),
    lately(),
  ])
  const own = (repos as any[]).filter((r) => !r.fork)
  const bytes = new Map<string, number>()
  for (const r of own) {
    const langs: Record<string, number> = await get(r.languages_url)
    for (const [name, n] of Object.entries(langs)) bytes.set(name, (bytes.get(name) ?? 0) + n)
  }
  const sum = [...bytes.values()].reduce((a, b) => a + b, 0) || 1
  const languages = [...bytes.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, n]) => ({ name, share: n / sum }))
  return {
    days: cal.days,
    total: cal.total,
    repos: user.public_repos,
    stars: own.reduce((s, r) => s + r.stargazers_count, 0),
    followers: user.followers,
    languages,
    lately: recent,
  }
}
