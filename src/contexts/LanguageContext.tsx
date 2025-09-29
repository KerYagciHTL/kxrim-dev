import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type TranslationKeys = {
  [key: string]: string;
};

type Translations = {
  [K in Language]: TranslationKeys;
};

const translations: Translations = {
  en: {
    // Navbar
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',
    
    // Hero section
    'hero.greeting.morning': 'Good morning',
    'hero.greeting.afternoon': 'Good afternoon',
    'hero.greeting.evening': 'Good evening',
    'hero.intro': 'I\'m',
    'hero.description': 'A passionate software developer from Austria, specializing in modern web technologies and system programming.',
    'hero.viewProjects': 'View Projects',
    'hero.downloadCV': 'Download CV',
    'hero.location': 'Ansfelden, AT',
    
    // Projects section
    'projects.title': 'Featured Projects',
    'projects.subtitle': 'Some of my recent work',
    'projects.viewAll': 'View All Projects',
    'projects.liveDemo': 'Live Demo',
    'projects.sourceCode': 'Source Code',
    
    // Experience section
    'experience.title': 'Experience & Education',
    'experience.subtitle': 'My journey in software development',
    
    // Contact section
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Let\'s build something amazing together',
    'contact.email': 'Send Email',
    'contact.github': 'GitHub Profile',
    
    // Footer
    'footer.madeWith': 'Made with',
    'footer.by': 'by',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
  },
  de: {
    // Navbar
    'nav.projects': 'Projekte',
    'nav.experience': 'Erfahrung',
    'nav.contact': 'Kontakt',
    
    // Hero section
    'hero.greeting.morning': 'Guten Morgen',
    'hero.greeting.afternoon': 'Guten Tag',
    'hero.greeting.evening': 'Guten Abend',
    'hero.intro': 'Ich bin',
    'hero.description': 'Ein leidenschaftlicher Softwareentwickler aus Österreich, spezialisiert auf moderne Webtechnologien und Systemprogrammierung.',
    'hero.viewProjects': 'Projekte Ansehen',
    'hero.downloadCV': 'Lebenslauf Herunterladen',
    'hero.location': 'Ansfelden, AT',
    
    // Projects section
    'projects.title': 'Ausgewählte Projekte',
    'projects.subtitle': 'Einige meiner neuesten Arbeiten',
    'projects.viewAll': 'Alle Projekte Ansehen',
    'projects.liveDemo': 'Live Demo',
    'projects.sourceCode': 'Quellcode',
    
    // Experience section
    'experience.title': 'Erfahrung & Bildung',
    'experience.subtitle': 'Mein Weg in der Softwareentwicklung',
    
    // Contact section
    'contact.title': 'Kontakt Aufnehmen',
    'contact.subtitle': 'Lass uns etwas Großartiges zusammen bauen',
    'contact.email': 'Email Senden',
    'contact.github': 'GitHub Profil',
    
    // Footer
    'footer.madeWith': 'Erstellt mit',
    'footer.by': 'von',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Etwas ist schief gelaufen',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[language];
    return translation[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}