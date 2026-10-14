// "Was ich baue" / "What I build": presents the work, offers nothing.
// No prices, no "hosting included", no inquiry wording (keeps the site out of §5 ECG).
import type { Area, Step, Text } from './types'

export const buildIntro = {
  title: { de: 'Was ich baue', en: 'What I build' } satisfies Text,
  lead: {
    de: 'Websites, Web-Apps und kleine Desktop-Tools. Alles allein, vom ersten Entwurf bis zum Betrieb. Die Web-Apps laufen auf meinem eigenen Server, hinter Cloudflare.',
    en: 'Websites, web apps and small desktop tools. All on my own, from the first draft to running them. The web apps run on my own server, behind Cloudflare.',
  } satisfies Text,
}

export const areas: Area[] = [
  {
    id: 'websites',
    kind: { de: 'Gestaltung und Entwicklung', en: 'Design and development' },
    title: { de: 'Websites', en: 'Websites' },
    text: {
      de: 'Firmenwebsites, von Grund auf gestaltet und gebaut, vom ersten Entwurf bis zum Launch. Zwei davon sind online: eine Spedition in Österreich und eine Firma für Verkehrstechnik in Berlin.',
      en: 'Company websites, designed and built from scratch, from the first draft to launch. Two of them are live: a freight forwarder in Austria and a traffic engineering company in Berlin.',
    },
    tags: [],
    examples: [
      { label: { de: 'yagcisons.at', en: 'yagcisons.at' }, href: 'https://yagcisons.at' },
      { label: { de: 'moe-v.de', en: 'moe-v.de' }, href: 'https://moe-v.de' },
    ],
    shot: {
      media: 'moe-v-home',
      alt: {
        de: 'Startseite von moe-v.de: weiß und grün, Überschrift „Baustellenabsicherung, Verkehrstechnik & Sicherheitstechnik“, daneben ein Foto einer abgesicherten Baustelle',
        en: 'Start page of moe-v.de: white and green, headline about construction site safety and traffic engineering, next to a photo of a secured site',
      },
    },
  },
  {
    id: 'web-apps',
    kind: { de: 'Gebaut und betrieben von mir', en: 'Built and run by me' },
    title: { de: 'Web-Apps und interne Tools', en: 'Web apps and internal tools' },
    text: {
      de: 'Web-Anwendungen für den Arbeitsalltag, etwa eine Auftragsverwaltung. Sie laufen auf meinem eigenen Server hinter Cloudflare.',
      en: 'Web applications for everyday work, like an order management system. They run on my own server behind Cloudflare.',
    },
    tags: [],
    flow: [
      { de: 'Browser', en: 'Browser' },
      { de: 'Cloudflare', en: 'Cloudflare' },
      { de: 'mein Server', en: 'my server' },
    ],
  },
  {
    id: 'desktop-tools',
    kind: { de: 'Weniger Handarbeit', en: 'Less manual work' },
    title: { de: 'Desktop-Tools und Automatisierung', en: 'Desktop tools and automation' },
    text: {
      de: 'Kleine Programme für Windows und macOS, die wiederkehrende Arbeit abnehmen. Eines überträgt zum Beispiel Sendungsdaten automatisch von einer Excel-Datei in eine andere.',
      en: 'Small programs for Windows and macOS that take repetitive work off people’s hands. One of them, for example, moves shipment data from one Excel file to another automatically.',
    },
    tags: ['Windows', 'macOS'],
    flow: [
      { de: 'Excel A', en: 'Excel A' },
      { de: 'mein Tool', en: 'my tool' },
      { de: 'Excel B', en: 'Excel B' },
    ],
  },
]

export const steps = {
  title: { de: 'So baue ich', en: 'How I build' } satisfies Text,
  list: [
    {
      title: { de: 'Das Problem verstehen', en: 'Understand the problem' },
      text: {
        de: 'Zuerst kläre ich, was die Software können muss, wer sie nutzt und was es schon gibt.',
        en: 'First I find out what the software has to do, who uses it and what already exists.',
      },
    },
    {
      title: { de: 'Bauen', en: 'Build it' },
      text: {
        de: 'Dann entwerfe und entwickle ich sie, in der Sprache, die passt, etwa C#, Java oder TypeScript.',
        en: 'Then I design and build it, in the language that fits, like C#, Java or TypeScript.',
      },
    },
    {
      title: { de: 'Betreiben', en: 'Run it' },
      text: {
        de: 'Web-Apps gehen auf meinem eigenen Server live, hinter Cloudflare.',
        en: 'Web apps go live on my own server, behind Cloudflare.',
      },
    },
  ] satisfies Step[],
}

export const buildContact = {
  text: {
    de: 'Fragen zu meiner Arbeit? Schreiben Sie mir eine E-Mail.',
    en: 'Questions about my work? Send me an e-mail.',
  } satisfies Text,
}
