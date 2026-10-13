// Facts about Kerimcan. Only what he confirmed; ask him before adding anything.
import type { Station, Text } from './types'

export const profile = {
  name: 'Kerimcan Yagci',
  givenName: 'Kerimcan',
  familyName: 'Yagci',
  // he goes by Kerim too; "Kerim Yagci" alone belongs to a Turkish actor in search
  alternateName: 'Kerim Yagci',
  handle: 'kxrim',
  email: 'kerimcan41@icloud.com',
  locality: 'Ansfelden',
  country: 'AT',
  github: 'https://github.com/KerYagciHTL',
  linkedin: 'https://www.linkedin.com/in/kerimcan-yagci-872a2143a/',
  avatar: '/img/avatar.webp',
  school: { name: 'HTL Leonding', url: 'https://www.htl-leonding.at' },
  languages: ['C', 'C++', 'C#', 'Java', 'TypeScript', 'Python'],
  tools: ['.NET', 'Avalonia UI', 'React', 'Vite', 'Tailwind', 'Git', 'Linux'],
}

export const intro = {
  lead: {
    de: 'Ich schreibe Software, meistens in C#, Java und TypeScript. Ich gehe in die HTL Leonding, Abteilung Informatik, und wohne in Ansfelden bei Linz.',
    en: 'I write software, mostly in C#, Java and TypeScript. I go to HTL Leonding, department of computer science, and live in Ansfelden near Linz.',
  } satisfies Text,
  why: {
    title: { de: 'Warum Sasuke?', en: 'Why Sasuke?' } satisfies Text,
    text: {
      de: 'Er zieht sein Ding allein durch. Meine Kundenprojekte auch.',
      en: 'He gets things done on his own. Same with my client projects.',
    } satisfies Text,
  },
  note: {
    de: 'Zwei Firmen-Websites habe ich allein gebaut, dazu Web-Apps und kleine Tools, die Leuten Arbeit abnehmen. Das meiste davon ist privat. Was öffentlich ist, steht auf den nächsten Seiten.',
    en: 'I built two company websites on my own, plus web apps and small tools that take work off people’s hands. Most of it is private. The public part is on the next pages.',
  } satisfies Text,
  avatarAlt: {
    de: 'Mein GitHub-Avatar: Sasuke als Manga-Zeichnung in Schwarz und Weiß',
    en: 'My GitHub avatar: Sasuke as a black and white manga drawing',
  } satisfies Text,
}

export const record = {
  title: { de: 'Schule und Praxis', en: 'School and work' } satisfies Text,
  stations: [
    {
      when: { de: 'bis 2028', en: 'until 2028' },
      what: 'HTL Leonding',
      text: {
        de: 'Höhere Abteilung für Informatik, mit den Schwerpunkten Softwareentwicklung, Datenbanken und Betriebssysteme.',
        en: 'Higher department of computer science, focused on software development, databases and operating systems.',
      },
    },
    {
      when: { de: 'Sommer 2026', en: 'Summer 2026' },
      what: 'SlideLizard',
      text: {
        de: 'Ferialpraktikum, ein Monat, beim österreichischen Unternehmen hinter der gleichnamigen Präsentationssoftware.',
        en: 'Summer internship, one month, at the Austrian company behind the presentation software of the same name.',
      },
    },
  ] satisfies Station[],
  languagesLabel: { de: 'Sprachen', en: 'Languages' } satisfies Text,
  toolsLabel: { de: 'Frameworks und Tools', en: 'Frameworks and tools' } satisfies Text,
  private: {
    de: 'Das meiste, woran ich arbeite, ist für die Schule, für Firmen oder für andere Leute und liegt deshalb in privaten Repositories. Auf GitHub sieht man nur den öffentlichen Teil.',
    en: 'Most of what I work on is for school, for companies or for other people, so it lives in private repositories. GitHub only shows the public part.',
  } satisfies Text,
  offline: {
    de: 'Wenn ich nicht programmiere, zocke ich.',
    en: 'When I’m not programming, I’m gaming.',
  } satisfies Text,
}

export const contact = {
  title: { de: 'Kontakt', en: 'Contact' } satisfies Text,
  text: {
    de: 'Fragen zu meiner Arbeit oder zu einem Praktikum? Schreiben Sie mir eine E-Mail.',
    en: 'Questions about my work or an internship? Send me an e-mail.',
  } satisfies Text,
  footer: {
    de: '© 2026 Kerimcan Yagci, Ansfelden, Österreich',
    en: '© 2026 Kerimcan Yagci, Ansfelden, Austria',
  } satisfies Text,
}
