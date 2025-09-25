# Kerim Yagci - Modern Portfolio

Ein modernes, responsives Portfolio mit React, TypeScript, Tailwind CSS und Framer Motion.

## Features

- **Modernes Design**: Glassmorphism, Gradient-Hintergründe, coole Animationen
- **Performance**: Optimiert für schnelle Ladezeiten
- **Responsive**: Perfekte Darstellung auf allen Geräten
- **Animationen**: Smooth Framer Motion Animationen
- **Glitch Effect**: Cooler Name-Wechsel-Effekt zwischen "KerYagciHTL" und "Kerimcan"
- **Dark Mode**: Elegantes dunkles Theme
- **GitHub Integration**: Automatisches Laden der GitHub Repositories
- **Smooth Scrolling**: Flüssige Navigation zwischen Sektionen

## Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animationen
- **Vite** - Build Tool
- **Lucide React** - Icons

## Projektstruktur

```
kerim-portfolio/
├── public/
│   ├── cv.pdf                 # Dein Lebenslauf (optional)
│   └── favicon.svg           # Favicon
├── src/
│   ├── App.tsx              # Haupt-App-Komponente
│   ├── main.tsx             # App Entry Point
│   └── index.css            # Global Styles
├── index.html               # HTML Template
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind Konfiguration
├── vite.config.ts          # Vite Konfiguration
├── tsconfig.json           # TypeScript Konfiguration
└── postcss.config.js       # PostCSS Konfiguration
```

## Installation & Setup

1. **Repository klonen**
   ```bash
   git clone <your-repo-url>
   cd kerim-portfolio
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Build für Production**
   ```bash
   npm run build
   ```

5. **Preview Build**
   ```bash
   npm run preview
   ```

## Konfiguration

### Persönliche Daten anpassen

Bearbeite die `PROFILE` Konstante in `src/App.tsx`:

```typescript
const PROFILE = {
  name: "Kerim Yagci",
  glitchName: "Kerimcan",        // Name für Glitch-Effekt
  displayName: "KerYagciHTL",    // Standard-Display-Name
  tag: "Schüler • HTL Leonding • Softwareentwicklung",
  location: "Leonding, AT",
  bio: "Deine Bio hier...",
  github: "KerYagciHTL",         // GitHub Username
  email: "deine@email.com",      // Optional
  cvUrl: "cv.pdf",               // Optional - CV in public/ Ordner
  featured: ["Kerlib", "KCY-Accounting"], // Featured Repos
  skills: ["C", "C++", "JavaScript", "..."] // Deine Skills
};
```

### GitHub Integration

Die App lädt automatisch deine GitHub Repositories über die GitHub API. Stelle sicher, dass:
- Dein GitHub Username korrekt in `PROFILE.github` eingetragen ist
- Deine Repositories public sind
- Die Featured Repositories in `PROFILE.featured` existieren

### Lebenslauf hinzufügen

1. Platziere deine PDF-Datei in den `public/` Ordner
2. Benenne sie `cv.pdf` oder passe `PROFILE.cvUrl` entsprechend an

## Design Features

### Glitch Text Animation
- Automatischer Wechsel zwischen "KerYagciHTL" und "Kerimcan"
- Coole Glitch-Effekte mit Farbverschiebungen
- Läuft alle 4 Sekunden

### Code Window Animation
- Typewriter-Effekt für Code
- Syntax-Highlighting
- Terminal-ähnliches Design

### Particle System
- Floating Particles im Hintergrund
- Mouse-Following Cursor
- Gradient-Partikel

### Responsive Design
- Mobile-First Approach
- Perfekte Darstellung auf allen Bildschirmgrößen
- Touch-optimierte Interaktionen

## 🔧 Anpassungen

### Farbschema ändern
Bearbeite `tailwind.config.js` für Custom Colors:

```javascript
colors: {
  primary: {
    // Deine Primary Colors
  },
  secondary: {
    // Deine Secondary Colors  
  }
}
```

### Animationen anpassen
Alle Framer Motion Animationen sind in der `App.tsx` konfiguriert. Du kannst:
- Timing ändern (`duration`, `delay`)
- Easing-Funktionen anpassen
- Neue Animationen hinzufügen

### Neue Sektionen hinzufügen
1. Erstelle eine neue Funktion-Komponente
2. Füge sie zur App-Komponente hinzu
3. Erweitere die Navigation entsprechend

## Performance

- **Lighthouse Score**: 90+
- **Bundle Size**: Optimiert durch Code-Splitting
- **Loading Time**: < 2s auf schneller Verbindung
- **SEO**: Meta-Tags und strukturierte Daten

## Deployment

### Vercel (Empfohlen)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ Ordner zu Netlify
```

### GitHub Pages
```bash
npm run build
# Push dist/ Inhalt zu gh-pages branch
```

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Öffne einen Pull Request

## 📝 License

Dieses Projekt steht unter der MIT License.

## 🔗 Links

- **Live Demo**: [https://kxrim-dev.is-a.dev](kxrim-dev.is-a.dev)
- **GitHub**: [https://github.com/KerYagciHTL](https://github.com/KerYagciHTL)

---

**Made with ❤️ and lots of ☕ by Kerimcan Yagci**