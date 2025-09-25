# Kerim Yagci — Modern Portfolio

A modern, responsive portfolio built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Modern design**: Glassmorphism, gradient backgrounds, refined animations  
- **Performance**: Optimized for fast load times  
- **Responsive**: Looks great on all devices  
- **Animations**: Smooth Framer Motion transitions  
- **Glitch effect**: Name flips between “KerYagciHTL” and “Kerimcan”  
- **Dark mode**: Elegant dark theme  
- **GitHub integration**: Automatically loads GitHub repositories  
- **Smooth scrolling**: Fluid navigation between sections

## Tech Stack

- **React 18** — UI framework  
- **TypeScript** — Type safety  
- **Tailwind CSS** — Styling  
- **Framer Motion** — Animations  
- **Vite** — Build tool  
- **Lucide React** — Icons

## Project Structure

```
kerim-portfolio/
├── public/
│   ├── cv.pdf                 # Your résumé (optional)
│   └── favicon.svg            # Favicon
├── src/
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # App entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind config
├── vite.config.ts             # Vite config
├── tsconfig.json              # TypeScript config
└── postcss.config.js          # PostCSS config
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kerim-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```

4. **Production build**
   ```bash
   npm run build
   ```

5. **Preview build**
   ```bash
   npm run preview
   ```

## Configuration

### Customize personal data

Edit the `PROFILE` constant in `src/App.tsx`:

```typescript
const PROFILE = {
  name: "Kerim Yagci",
  glitchName: "Kerimcan",        // Name for glitch effect
  displayName: "KerYagciHTL",    // Default display name
  tag: "Student • HTL Leonding • Software Engineering",
  location: "Leonding, AT",
  bio: "Your bio here...",
  github: "KerYagciHTL",         // GitHub username
  email: "your@email.com",       // Optional
  cvUrl: "cv.pdf",               // Optional - CV in public/
  featured: ["Kerlib", "KCY-Accounting"], // Featured repos
  skills: ["C", "C++", "JavaScript", "..."] // Your skills
};
```

### GitHub integration

The app fetches your public repositories via the GitHub API. Ensure:
- `PROFILE.github` is set to your username  
- Repositories are public  
- Entries in `PROFILE.featured` exist

### Add your résumé

1. Place your PDF in the `public/` folder.  
2. Name it `cv.pdf` or adjust `PROFILE.cvUrl`.

## Design Features

### Glitch text animation
- Automatically flips between “KerYagciHTL” and “Kerimcan”  
- Glitch effect with color shifts  
- Runs every 4 seconds

### Code window animation
- Typewriter effect for code  
- Syntax-like styling  
- Terminal-styled UI

### Particle system
- Floating background particles  
- Cursor follow behavior  
- Gradient particles

### Responsive design
- Mobile-first  
- Scales across all screen sizes  
- Touch-friendly interactions

## Customization

### Change color scheme
Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your primary colors
  },
  secondary: {
    // Your secondary colors
  }
}
```

### Adjust animations
All Framer Motion variants live in `App.tsx`. You can modify:
- Timing (`duration`, `delay`)  
- Easing functions  
- Add new animations

### Add new sections
1. Create a new functional component.  
2. Import and render it in `App.tsx`.  
3. Extend navigation as needed.

## Performance

- **Lighthouse**: 90+  
- **Bundle size**: Code-splitting applied  
- **Load time**: < 2 s on fast networks  
- **SEO**: Meta tags and structured data

## Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Push the dist/ contents to the gh-pages branch
```

## Contributing

1. Fork the repository.  
2. Create a feature branch.  
3. Commit your changes.  
4. Push the branch.  
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Links

- **Live Demo**: [kxrim-dev.is-a.dev](https://kxrim-dev.is-a.dev)  
- **GitHub**: [github.com/KerYagciHTL](https://github.com/KerYagciHTL)

---

**Made with ❤️ and lots of ☕ by Kerimcan Yagci**