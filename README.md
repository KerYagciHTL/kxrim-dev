# Kerimcan Yagci — Modern Portfolio

A modern, responsive portfolio built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Modern design**: Glassmorphism, gradient backgrounds, refined animations  
- **Performance**: Optimized for fast load times  
- **Responsive**: Looks great on all devices  
- **Animations**: Smooth Framer Motion transitions  
- **Glitch effect**: Name flips between "kxrim" and “Kerimcan”  
- **Dark mode**: Elegant dark theme  
- **GitHub integration**: Automatically loads GitHub repositories  
- **Smooth scrolling**: Fluid navigation between sections
- **Custom 404 Page**: Try searching some random directory on the site

## Language Support

The portfolio features a complete bilingual experience:

- **English/German Toggle**: Click the EN/DE button in the navbar to switch languages
- **Real-time Updates**: All content translates instantly
- **Mobile Responsive**: Language toggle works seamlessly on all devices
- **Comprehensive Coverage**: Every section supports both languages including:
  - Navigation menu
  - Hero section with dynamic greetings
  - Project descriptions and labels
  - Experience timeline ("My Journey")
  - Contact information
  - Footer text

## Tech Stack

- **React 18** — UI framework  
- **TypeScript** — Type safety  
- **Tailwind CSS** — Styling  
- **Framer Motion** — Animations  
- **Vite** — Build tool  
- **Lucide React** — Icons

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KerYagciHTL/kxrim-dev.git
   cd kxrim-dev
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Rate Limiting Considerations

The portfolio uses GitHub's public API to fetch repository information and comments. The API has a rate limit of 60 requests per hour per IP address for unauthenticated requests. To mitigate this:

- **Caching**: The app caches API responses for 5 minutes to reduce requests
- **Request delays**: Small delays between API calls prevent rapid-fire requests
- **Fallback data**: Repository data falls back to a static JSON file if API is unavailable
- **Graceful errors**: Rate limit errors show user-friendly messages with retry options

## Project Structure

```
kerim-portfolio/
├── public/
│   ├── 404.html
│   └── favicon.svg            # Favicon
├── src/
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # App entry point
│   ├── index.css              # Global styles
│   ├── components/            # React components
│   │   ├── sections/          # Page sections (Hero, Projects, etc.)
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # React contexts
│   │   └── LanguageContext.tsx  # Language toggle system
│   ├── constants/            # App constants
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind config
├── vite.config.ts             # Vite config
├── tsconfig.json              # TypeScript config
└── postcss.config.js          # PostCSS config
```

## License

This project is licensed under the MIT License.

## Links

- **Live Demo**: [kxrim.is-a.dev](https://kxrim.is-a.dev)  
- **GitHub**: [github.com/KerYagciHTL](https://github.com/KerYagciHTL)
- **Try 404 error**: [kxrim.is-a.dev/uhhh](https://kxrim.is-a.dev/uhhh)

---

**Made with ❤️ and lots of ☕ by Kerimcan Yagci**
