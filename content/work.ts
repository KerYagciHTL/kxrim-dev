// Public projects and client sites, one sheet each, in this order.
// Sources: the GitHub READMEs, the live sites and Kerimcan's own answers.
import type { Work } from './types'

export const work: Work[] = [
  {
    id: 'sortingvisualizer',
    type: 'project',
    name: 'SortingVisualizer',
    kind: { de: 'Projekt in C#', en: 'Project in C#' },
    summary: {
      de: 'Eine raylib-App, die eine Reihe Balken sortiert und jeden Schritt mitzeichnet, damit man sieht, wie ein Algorithmus wirklich arbeitet. Bubble Sort, Selection Sort und Insertion Sort sind dabei, jeder andere Sortieralgorithmus lässt sich einstecken.',
      en: 'A raylib app that sorts a row of bars and draws every step, so you can watch how an algorithm really works. Bubble sort, selection sort and insertion sort are included, and any other sorting algorithm can be plugged in.',
    },
    facts: [{ de: 'C# · .NET · Raylib-cs', en: 'C# · .NET · Raylib-cs' }, { de: 'Dependency Injection mit Microsoft.Extensions', en: 'Dependency injection with Microsoft.Extensions' }],
    demos: [
      { label: 'Bubble Sort', media: 'sortingvisualizer-bubble-sort' },
      { label: 'Selection Sort', media: 'sortingvisualizer-selection-sort' },
      { label: 'Insertion Sort', media: 'sortingvisualizer-insertion-sort' },
    ],
    links: [{ label: { de: 'Code auf GitHub', en: 'Code on GitHub' }, href: 'https://github.com/KerYagciHTL/SortingVisualizer' }],
    repo: 'https://github.com/KerYagciHTL/SortingVisualizer',
    language: 'C#',
  },
  {
    id: 'afterfall',
    type: 'project',
    name: 'Afterfall',
    kind: { de: 'Schulprojekt im Dreierteam', en: 'School project, team of three' },
    summary: {
      de: 'Ein U-Bahn-Spiel. Man baut Stationen und Strecken, kauft drei Arten von Zügen, legt Ticketpreise fest und versucht die Stadt zufrieden zu halten, während sie wächst. Wer am meisten wert ist, steht oben in der Online-Rangliste.',
      en: 'A subway game. You build stations and tracks, buy three kinds of trains, set ticket prices and try to keep the city happy while it grows. Whoever is worth the most tops the online ranking.',
    },
    part: {
      de: 'Projektleitung, dazu Server und Simulation. Die ganze Spiellogik läuft im Spring-Boot-Backend, der JavaFX-Client zeichnet nur, was er bekommt.',
      en: 'Project lead, plus the server and the simulation. All game logic runs in the Spring Boot backend; the JavaFX client only draws what it receives.',
    },
    facts: [{ de: 'Java · JavaFX · Spring Boot', en: 'Java · JavaFX · Spring Boot' }, { de: '98 von 172 Commits', en: '98 of 172 commits' }],
    shot: {
      media: 'afterfall-game',
      alt: {
        de: 'Afterfall im Spiel: ein U-Bahn-Netz mit roten und lila Linien, rechts die Liste der Stationen einer Linie',
        en: 'Afterfall in game: a metro network with red and purple lines, the stations of one line listed on the right',
      },
      caption: { de: 'Im Spiel: Linien, Auslastung der Stationen, rechts die Route.', en: 'In game: lines, station load, the route on the right.' },
    },
    links: [{ label: { de: 'Code auf GitHub', en: 'Code on GitHub' }, href: 'https://github.com/KerYagciHTL/Afterfall' }],
    repo: 'https://github.com/KerYagciHTL/Afterfall',
    language: 'Java',
  },
  {
    id: 'kerlib',
    type: 'project',
    name: 'Kerlib',
    kind: { de: 'Projekt in C#', en: 'Project in C#' },
    summary: {
      de: 'Eine kleine Fensterbibliothek für C#, die direkt mit der Win32-API spricht. Sie öffnet Fenster, betreibt die Message-Loop und zeichnet Formen und Eingabefelder. Vom Aufbau her ist sie an Avalonia angelehnt, und außer .NET 8 braucht sie nichts.',
      en: 'A small windowing library for C# that talks to the Win32 API directly. It opens windows, runs the message loop and draws shapes and input fields. Its design borrows from Avalonia, and it needs nothing besides .NET 8.',
    },
    facts: [{ de: 'C# · Win32 · .NET 8', en: 'C# · Win32 · .NET 8' }, { de: 'GDI mit Double-Buffering', en: 'Double-buffered GDI' }, { de: 'keine Abhängigkeiten', en: 'no dependencies' }],
    shot: {
      media: 'kerlib-window',
      alt: {
        de: 'Ein Kerlib-Fenster in Dunkelblau: links die Features, oben Laufzeit, gezeichnete Frames und Mausposition, in der Mitte drei farbige Wellen, unten ein Eingabefeld mit Greet-Knopf und ein Event-Log',
        en: 'A Kerlib window in dark blue: features on the left, uptime, rendered frames and mouse position on top, three coloured waves in the middle, an input field with a Greet button and an event log below',
      },
      caption: {
        de: 'Ein Demo-Fenster: Wellen, die sich mit der Maus biegen, ein Eingabefeld, ein Event-Log. Jeder Pixel ist reines GDI.',
        en: 'A demo window: waves that bend with the mouse, an input field, an event log. Every pixel is plain GDI.',
      },
    },
    links: [{ label: { de: 'Code auf GitHub', en: 'Code on GitHub' }, href: 'https://github.com/KerYagciHTL/Kerlib' }],
    repo: 'https://github.com/KerYagciHTL/Kerlib',
    language: 'C#',
  },
  {
    id: 'yagcisons',
    type: 'client',
    name: 'yagcisons.at',
    company: 'Yagci Sons Logistics',
    kind: { de: 'Kundenprojekt · Spedition, Österreich und EU-weit', en: 'Client work · freight forwarding, Austria and EU-wide' },
    summary: {
      de: 'Die komplette Firmenseite von Yagci Sons Logistics, allein gestaltet und gebaut, auf Deutsch und Englisch, mit einem Konzept für einen Live-Sendungsstatus.',
      en: 'The complete company site of Yagci Sons Logistics, designed and built on my own, in German and English, with a concept for live shipment status.',
    },
    facts: [{ de: 'Alleinentwickler', en: 'Sole developer' }, { de: 'Deutsch und Englisch', en: 'German and English' }],
    shot: {
      media: 'yagcisons-home',
      alt: {
        de: 'Startseite von yagcisons.at: dunkelblau, Überschrift „Ihre Ladung. In besten Händen.“, dazu eine Route über Hamburg, Frankfurt und München',
        en: 'Start page of yagcisons.at: dark blue, headline “Ihre Ladung. In besten Händen.”, with a route via Hamburg, Frankfurt and Munich',
      },
    },
    links: [{ label: { de: 'yagcisons.at ansehen', en: 'Visit yagcisons.at' }, href: 'https://yagcisons.at' }],
    url: 'https://yagcisons.at',
  },
  {
    id: 'moe-v',
    type: 'client',
    name: 'moe-v.de',
    company: 'MOE Verkehrs- und Sicherheitstechnik',
    kind: { de: 'Kundenprojekt · Verkehrstechnik, Berlin', en: 'Client work · traffic engineering, Berlin' },
    summary: {
      de: 'Der ganze Webauftritt von MOE, einer Berliner Firma für Baustellenabsicherung und Verkehrstechnik, allein gebaut: Leistungskatalog, Akkreditierungen, Kontakt.',
      en: 'The whole web presence of MOE, a Berlin company for construction site safety and traffic engineering, built on my own: service catalogue, accreditations, contact.',
    },
    note: {
      de: 'Beide Kunden waren mit dem Ergebnis zufrieden. Referenzen gibt es auf Anfrage.',
      en: 'Both clients were happy with the result. References are available on request.',
    },
    facts: [{ de: 'Alleinentwickler', en: 'Sole developer' }],
    shot: {
      media: 'moe-v-home',
      alt: {
        de: 'Startseite von moe-v.de: weiß und grün, Überschrift „Baustellenabsicherung, Verkehrstechnik & Sicherheitstechnik“, daneben ein Foto einer abgesicherten Baustelle',
        en: 'Start page of moe-v.de: white and green, headline about construction site safety and traffic engineering, next to a photo of a secured site',
      },
    },
    links: [{ label: { de: 'moe-v.de ansehen', en: 'Visit moe-v.de' }, href: 'https://moe-v.de' }],
    url: 'https://moe-v.de',
  },
]
