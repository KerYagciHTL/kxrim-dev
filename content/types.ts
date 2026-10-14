// Shapes of everything the site says. Content files hold data only, never layout.
export type Locale = 'de' | 'en'

/** One string per language. */
export type Text = Record<Locale, string>

/** Key into content/media.json, written by `npm run images`. */
export type MediaKey = string

export interface Link {
  label: Text
  href: string
}

export interface Shot {
  media: MediaKey
  alt: Text
  caption?: Text
}

/** A sorting run from the SortingVisualizer README: a still poster that plays on click. */
export interface Demo {
  label: string
  media: MediaKey
}

/** One sheet in the deck about a piece of work: a public project or a client site. */
export interface Work {
  id: string
  type: 'project' | 'client'
  name: string
  /** the client's company name, for clients */
  company?: string
  kind: Text
  summary: Text
  part?: Text
  /** a closing remark in a narration box */
  note?: Text
  facts: Text[]
  shot?: Shot
  demos?: Demo[]
  links: Link[]
  /** for schema.org: the repository and its main language */
  repo?: string
  language?: string
  url?: string
}

export interface Station {
  when: Text
  what: string
  text: Text
}

/** A sheet on the "Was ich baue" page. */
export interface Area {
  id: string
  title: Text
  kind: Text
  text: Text
  tags: string[]
  examples?: Link[]
  shot?: Shot
  flow?: Text[]
}

export interface Step {
  title: Text
  text: Text
}
