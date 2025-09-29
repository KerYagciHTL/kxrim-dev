# Components Structure

This directory contains all the React components used in the application, organized for better maintainability and reusability.

## Directory Structure

```
src/components/
├── index.ts                 # Barrel exports for easy imports
├── ui/                      # Reusable UI components
│   ├── MouseFollower.tsx    # Mouse cursor effect
│   ├── BackgroundGrid.tsx   # Background grid pattern
│   ├── ProgressBar.tsx      # Scroll progress indicator
│   ├── FloatingParticles.tsx # Animated particles effect
│   ├── GlitchText.tsx       # Animated glitch text effect
│   ├── CodeWindow.tsx       # Code editor mockup
│   ├── RepoCard.tsx         # GitHub repository card
│   └── RepoSkeletonGrid.tsx # Loading skeleton for repos
└── sections/                # Page section components
    ├── Navbar.tsx           # Navigation header
    ├── Hero.tsx             # Hero/landing section
    ├── Projects.tsx         # Projects showcase section
    ├── Experience.tsx       # Experience timeline section
    ├── Contact.tsx          # Contact information section
    └── Footer.tsx           # Page footer

src/constants/
└── profile.ts               # Profile data constants

src/types/
└── repo.ts                  # TypeScript type definitions
```

## Component Categories

### UI Components (`/ui`)
These are reusable, presentational components that can be used across different sections:

- **MouseFollower**: Creates a custom cursor that follows mouse movement
- **BackgroundGrid**: Renders a subtle grid pattern background
- **ProgressBar**: Shows scroll progress at the top of the page
- **FloatingParticles**: Animated particles for visual effects
- **GlitchText**: Text with glitch animation effects
- **CodeWindow**: Simulates a code editor window with syntax highlighting  
- **RepoCard**: Displays GitHub repository information in a card format
- **RepoSkeletonGrid**: Loading placeholders for repository cards

### Section Components (`/sections`)
These are larger components that represent complete page sections:

- **Navbar**: Main navigation with theme toggle
- **Hero**: Landing section with profile info and animated elements
- **Projects**: GitHub repositories showcase with filtering
- **Experience**: Education and work experience timeline
- **Contact**: Contact information and social links
- **Footer**: Site footer with additional links

## Usage

Components can be imported individually or through the barrel export:

```tsx
// Individual import
import { Hero } from './components/sections/Hero';

// Barrel import (recommended)
import { Hero, Projects, Contact } from './components';
```

## Benefits of This Structure

1. **Separation of Concerns**: UI components are separate from business logic
2. **Reusability**: UI components can be reused across different sections
3. **Maintainability**: Each component has a single responsibility
4. **Type Safety**: Proper TypeScript types for all components
5. **Easy Testing**: Components can be tested in isolation
6. **Better Organization**: Clear structure makes the codebase easier to navigate