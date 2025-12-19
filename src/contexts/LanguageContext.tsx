import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',
    'nav.reviews': 'Comments',
    'nav.toggleLanguage': 'Toggle language',
    'nav.toggleTheme': 'Toggle theme',
    
    'hero.greeting.morning': 'Good morning',
    'hero.greeting.afternoon': 'Good afternoon',
    'hero.greeting.evening': 'Good evening',
    'hero.intro': 'I\'m',
    'hero.description': 'A software developer from Austria, specializing in modern web technologies and system programming.',
    'hero.viewProjects': 'View Projects',
    'hero.reviewsFromClients': 'Comments from visitors',

    'hero.location': 'Ansfelden, AT',
    
    'projects.title': 'My Projects',
    'projects.subtitle': 'A selection of my best work and open source contributions',
    'projects.allProjects': 'All Projects',
    'projects.featured': 'Featured',
    'projects.archived': 'Archived',
    'projects.updated': 'Updated',
    'projects.view': 'View',
    'projects.error': 'Failed to load projects',
    
    'experience.title': 'My Journey',
    'experience.subtitle': 'From education to personal projects',
    'experience.highlights': 'Highlights:',
    'experience.technologies': 'Technologies:',
    'experience.goals': 'My Goals',
    'experience.goal1': 'Clean, testable tools and libraries',
    'experience.goal2': 'Performance and reliability in development',
    'experience.goal3': 'Practice in controlling/accounting apps',
    
    'experience.htl.title': 'HTL Leonding',
    'experience.htl.subtitle': 'Higher Department of Computer Science',
    'experience.htl.period': '2022 - 2027',
    'experience.htl.description': 'Focus: Software development, databases, operating systems.',
    'experience.htl.highlight1': 'KCY-Accounting - Modern accounting software with C# and Avalonia',
    'experience.htl.highlight2': 'Clean code standards and documentation',
    'experience.htl.highlight3': 'Linux workflow and Git integration in all projects',
    
    'experience.projects.title': 'Personal Projects',
    'experience.projects.subtitle': 'Open Source & Experiments',
    'experience.projects.period': '2023 - Present',
    'experience.projects.description': 'Focus on clean, testable tools and innovative solutions.',
    'experience.projects.highlight1': '10+ Open Source Repositories',
    'experience.projects.highlight2': 'Development of Kerlib - comprehensive C# graphic library',
    'experience.projects.highlight3': 'Community building and collaboration',
    
    'contact.title': 'Let\'s talk',
    'contact.subtitle': 'Open for internships, side projects, and exciting collaborations',
    'contact.whyWork': 'Why work with me?',
    'contact.cleanCode': 'Clean Code Philosophy',
    'contact.cleanCodeDesc': 'Clean repos, clear readmes, structured code',
    'contact.openSource': 'Open Source Mindset',
    'contact.openSourceDesc': 'Transparency and community-oriented development',
    'contact.fastImpl': 'Fast Implementation',
    'contact.fastImplDesc': 'Turning small ideas into stable, usable building blocks',
    'contact.github': 'GitHub',
    'contact.email': 'E-Mail',
    
    'footer.builtWith': 'Built with React, Tailwind, and Framer Motion.',
    'footer.developedWith': 'Developed with ❤️ and lots of ☕',
    'footer.githubProfile': 'GitHub Profile',
    'footer.emailContact': 'Email Contact',

    'projects.description.Kerlib': 'A comprehensive C# graphics library for simplified 2D rendering.',
    'projects.description.KCY-Accounting': 'Modern accounting software developed with C# and AvaloniaUI.',
    'projects.description.kxrim-dev': 'My personal portfolio website, built with React and TailwindCSS.',
    'projects.description.K-Chat': 'A real-time chat application for seamless communication.',
    'projects.description.HtmlForge': 'A Java library which programmatically for HTML pages. Styling is handled like Bootstrap. Scripting via a runtime is also soon possible.',

    'reviews.backToPortfolio': 'Back to Portfolio',
    'reviews.title': 'Visitor Comments',
    'reviews.subtitle': 'Share your thoughts, feedback, or just say hello! Connect with GitHub to leave a comment.',
    'reviews.totalComments': 'Total Comments',
    'reviews.uniqueVisitors': 'Unique Visitors',
    'reviews.loading': 'Loading comments...',
    'reviews.recentComments': 'Recent Comments',
    'reviews.noComments.title': 'No comments yet',
    'reviews.noComments.description': 'Be the first to leave a comment via GitHub Issues!',
    'reviews.error.title': 'Unable to Load Comments',
    'reviews.error.retry': 'Try Again',
    'reviews.error.generic': 'Failed to load comments. Please refresh the page.',
    'reviews.error.rateLimit': 'GitHub API rate limit exceeded. This happens when many people visit the site. Please try again in a few minutes.',
    'reviews.error.notFound': 'Comments repository not found. Please check the configuration.',
    
    'reviews.instructions.title': 'Leave a Comment via GitHub Issues',
    'reviews.instructions.description': 'Want to leave a comment? Simply create a GitHub issue. It will be automatically labeled as a portfolio-comment and appear here. Your GitHub profile information will be automatically pulled, and the issue content will be displayed as your comment.',
    'reviews.instructions.howTo.title': 'How to Comment',
    'reviews.instructions.howTo.step1': 'Go to GitHub Issues',
    'reviews.instructions.howTo.step2': 'Write your comment in the issue description',
    'reviews.instructions.howTo.step3': 'Submit the issue - it will be automatically labeled and displayed!',
    'reviews.instructions.example.title': 'Example Comment',
    'reviews.instructions.features.title': 'Automatic Features:',
    'reviews.instructions.features.1': 'Your GitHub profile information (name, avatar, bio, location, company) is automatically fetched',
    'reviews.instructions.features.2': 'The issue content becomes your comment text',
    'reviews.instructions.features.3': 'Comments are sorted by creation date (newest first)',
    'reviews.instructions.features.4': 'Only issues with the portfolio-comment label are displayed',
    'reviews.createIssue': 'Create GitHub Issue',
    
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
  },
  de: {
    'nav.projects': 'Projekte',
    'nav.experience': 'Erfahrung',
    'nav.contact': 'Kontakt',
    'nav.reviews': 'Kommentare',
    'nav.toggleLanguage': 'Sprache wechseln',
    'nav.toggleTheme': 'Design wechseln',
    
    'hero.greeting.morning': 'Guten Morgen',
    'hero.greeting.afternoon': 'Guten Tag',
    'hero.greeting.evening': 'Guten Abend',
    'hero.intro': 'Ich bin',
    'hero.description': 'Ein Softwareentwickler aus Österreich, spezialisiert auf moderne Webtechnologien und Systemprogrammierung.',
    'hero.viewProjects': 'Projekte Ansehen',
    'hero.reviewsFromClients': 'Kommentare von Besuchern',

    'hero.location': 'Ansfelden, AT',
    
    'projects.title': 'Meine Projekte',
    'projects.subtitle': 'Eine Auswahl meiner besten Arbeiten und Open-Source-Beiträge',
    'projects.allProjects': 'Alle Projekte',
    'projects.featured': 'Empfohlen',
    'projects.archived': 'Archiviert',
    'projects.updated': 'Aktualisiert',
    'projects.view': 'Ansehen',
    'projects.error': 'Projekte konnten nicht geladen werden',
    
    'experience.title': 'Mein Weg',
    'experience.subtitle': 'Von der Ausbildung zu persönlichen Projekten',
    'experience.highlights': 'Highlights:',
    'experience.technologies': 'Technologien:',
    'experience.goals': 'Meine Ziele',
    'experience.goal1': 'Saubere, testbare Tools und Bibliotheken',
    'experience.goal2': 'Performance und Zuverlässigkeit in der Entwicklung',
    'experience.goal3': 'Praxis in Controlling/Buchhaltungs-Apps',
    
    'experience.htl.title': 'HTL Leonding',
    'experience.htl.subtitle': 'Höhere Abteilung für Informatik',
    'experience.htl.period': '2022 - 2027',
    'experience.htl.description': 'Schwerpunkt: Softwareentwicklung, Datenbanken, Betriebssysteme.',
    'experience.htl.highlight1': 'KCY-Accounting - Moderne Buchhaltungssoftware mit C# und Avalonia',
    'experience.htl.highlight2': 'Clean Code Standards und Dokumentation',
    'experience.htl.highlight3': 'Linux-Workflow und Git-Integration in allen Projekten',
    
    'experience.projects.title': 'Persönliche Projekte',
    'experience.projects.subtitle': 'Open Source & Experimente',
    'experience.projects.period': '2023 - Heute',
    'experience.projects.description': 'Fokus auf saubere, testbare Tools und innovative Lösungen.',
    'experience.projects.highlight1': '10+ Open Source Repositories',
    'experience.projects.highlight2': 'Entwicklung von Kerlib - umfassende C# Grafik-Bibliothek',
    'experience.projects.highlight3': 'Community-Aufbau und Zusammenarbeit',
    
    'contact.title': 'Lass uns sprechen',
    'contact.subtitle': 'Offen für Praktika, Nebenprojekte und spannende Kollaborationen',
    'contact.whyWork': 'Warum mit mir arbeiten?',
    'contact.cleanCode': 'Clean Code Philosophie',
    'contact.cleanCodeDesc': 'Saubere Repos, klare READMEs, strukturierter Code',
    'contact.openSource': 'Open Source Denkweise',
    'contact.openSourceDesc': 'Transparenz und community-orientierte Entwicklung',
    'contact.fastImpl': 'Schnelle Umsetzung',
    'contact.fastImplDesc': 'Kleine Ideen zu stabilen, nutzbaren Bausteinen machen',
    'contact.github': 'GitHub',
    'contact.email': 'E-Mail',
    
    'footer.builtWith': 'Erstellt mit React, Tailwind und Framer Motion.',
    'footer.developedWith': 'Entwickelt mit ❤️ und viel ☕',
    'footer.githubProfile': 'GitHub Profil',
        'footer.emailContact': 'E-Mail Kontakt',

    'projects.description.Kerlib': 'Eine umfassende C# Grafik-Bibliothek für vereinfachte 2D-Renderings.',
    'projects.description.KCY-Accounting': 'Moderne Buchhaltungssoftware entwickelt mit C# und AvaloniaUI.',
    'projects.description.kxrim-dev': 'Meine persönliche Portfolio-Website, erstellt mit React und TailwindCSS.',
    'projects.description.K-Chat': 'Eine Echtzeit-Chat-Anwendung für nahtlose Kommunikation.',
    'projects.description.HtmlForge': 'Eine Java library bei der HTML-Seiten programmgesteuert erstellt werden können. Styling wird wie Bootstrap gehandhabt. Scripting durch eine RunTime ist ebenfalls bald möglich.',

    'reviews.backToPortfolio': 'Zurück zum Portfolio',
    'reviews.title': 'Besucherkommentare',
    'reviews.subtitle': 'Teile deine Gedanken, Feedback oder sag einfach Hallo! Verbinde dich mit GitHub, um einen Kommentar zu hinterlassen.',
    'reviews.totalComments': 'Kommentare gesamt',
    'reviews.uniqueVisitors': 'Einzigartige Besucher',
    'reviews.loading': 'Lade Kommentare...',
    'reviews.recentComments': 'Neueste Kommentare',
    'reviews.noComments.title': 'Noch keine Kommentare',
    'reviews.noComments.description': 'Sei der Erste, der einen Kommentar über GitHub Issues hinterlässt!',
    'reviews.error.title': 'Kommentare konnten nicht geladen werden',
    'reviews.error.retry': 'Erneut versuchen',
    'reviews.error.generic': 'Kommentare konnten nicht geladen werden. Bitte aktualisiere die Seite.',
    'reviews.error.rateLimit': 'GitHub API-Ratenbegrenzung überschritten. Dies passiert, wenn viele Leute die Seite besuchen. Bitte versuche es in ein paar Minuten erneut.',
    'reviews.error.notFound': 'Kommentar-Repository nicht gefunden. Bitte überprüfe die Konfiguration.',
    
    'reviews.instructions.title': 'Hinterlasse einen Kommentar via GitHub Issues',
    'reviews.instructions.description': 'Möchtest du einen Kommentar hinterlassen? Erstelle einfach ein GitHub Issue. Es wird automatisch als portfolio-comment markiert und hier angezeigt. Deine GitHub-Profilinformationen werden automatisch abgerufen und der Inhalt des Issues wird als dein Kommentar angezeigt.',
    'reviews.instructions.howTo.title': 'Wie man kommentiert',
    'reviews.instructions.howTo.step1': 'Gehe zu GitHub Issues',
    'reviews.instructions.howTo.step2': 'Schreibe deinen Kommentar in die Issue-Beschreibung',
    'reviews.instructions.howTo.step3': 'Sende das Issue ab - es wird automatisch markiert und angezeigt!',
    'reviews.instructions.example.title': 'Beispielkommentar',
    'reviews.instructions.features.title': 'Automatische Funktionen:',
    'reviews.instructions.features.1': 'Deine GitHub-Profilinformationen (Name, Avatar, Bio, Ort, Firma) werden automatisch abgerufen',
    'reviews.instructions.features.2': 'Der Inhalt des Issues wird dein Kommentartext',
    'reviews.instructions.features.3': 'Kommentare werden nach Erstellungsdatum sortiert (neueste zuerst)',
    'reviews.instructions.features.4': 'Nur Issues mit dem Label portfolio-comment werden angezeigt',
    'reviews.createIssue': 'GitHub Issue erstellen',
  }
};


interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'de') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

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