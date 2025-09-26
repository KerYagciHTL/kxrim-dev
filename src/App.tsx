import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Github, Mail, School, Sun, Moon, ExternalLink, MapPin, Terminal, Code2, Zap, Star, GitBranch, Calendar } from "lucide-react";

const PROFILE = {
  name: "Kerimcan Yagci",
  glitchName: "kxrim",
  displayName: "Kerimcan",
  tag: "Student • HTL Leonding • Software Development",
  location: "Ansfelden, AT",
  bio: "C, C++, C#, Java, JavaScript/TypeScript, Python. Linux-first. Focus: Tools, Games, DBI.",
  github: "KerYagciHTL",
  email: "k.yagci@students.htl-leonding.ac.at",
  cvUrl: "cv.pdf",
  featured: ["Kerlib", "KCY-Accounting", "kxrim-dev"],
  skills: [
    "C", "C++", ".NET/C#", "Java", "JavaScript", "TypeScript", "Node.js", "React", "SQL/Oracle XE", "Linux", "Git/GitHub"
  ],
};

// ----- Types -----
interface Repo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  topics?: string[];
  archived: boolean;
  pushed_at: string;
}

// ----- App -----
export default function App() {
  const [dark, setDark] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black text-white selection:bg-cyan-400 selection:text-black overflow-x-hidden relative">
      <MouseFollower mousePosition={mousePosition} />
      <BackgroundGrid />
      <ProgressBar />
      <Navbar dark={dark} setDark={setDark} />
      <Hero />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}

// ----- UI Parts -----
function MouseFollower({ mousePosition }: { mousePosition: { x: number, y: number } }) {
  return (
    <motion.div
      className="fixed w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 pointer-events-none z-50 mix-blend-difference"
      style={{
        left: mousePosition.x - 12,
        top: mousePosition.y - 12,
      }}
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    />
  );
}

function BackgroundGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03]">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}

function Navbar({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'backdrop-blur-xl bg-black/20 dark:bg-black/40 border-b border-white/10' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <motion.a 
          href="#top" 
          className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          kxrim.dev
        </motion.a>
        <nav className="flex items-center gap-8 text-sm">
          {['projects', 'experience', 'contact'].map((section) => (
            <motion.a
              key={section}
              className="relative text-white/70 hover:text-white transition-colors duration-300 capitalize"
              href={`#${section}`}
              whileHover={{ y: -2 }}
            >
              {section === 'projects' ? 'Projects' : section === 'experience' ? 'Experience' : 'Contact'}
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
          <motion.button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {dark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </div>
    </motion.header>
  );
}

function GlitchText() {
  const [currentText, setCurrentText] = useState(PROFILE.displayName);
  const [isGlitching, setIsGlitching] = useState(false);

  const corruptChars = ['█', '▓', '▒', '░', 'X', '#', '@', '0', '1'];

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      
      // Create some corrupted text
      const createCorruption = (original: string) => {
        return original.split('').map(char => 
          Math.random() < 0.3 ? corruptChars[Math.floor(Math.random() * corruptChars.length)] : char
        ).join('');
      };
      
      // More dramatic flicker sequence
      const sequence = [
        createCorruption(PROFILE.displayName),
        PROFILE.glitchName,
        createCorruption(PROFILE.glitchName),
        PROFILE.displayName,
        createCorruption(PROFILE.displayName),
        PROFILE.glitchName,
        PROFILE.displayName
      ];
      
      sequence.forEach((text, index) => {
        setTimeout(() => {
          setCurrentText(text);
          
          if (index === sequence.length - 1) {
            setIsGlitching(false);
          }
        }, index * 80);
      });
    };

    const scheduleGlitch = () => {
      setTimeout(() => {
        triggerGlitch();
        scheduleGlitch();
      }, 4000 + Math.random() * 4000);
    };

    // Start first glitch after 1 second
    setTimeout(() => {
      triggerGlitch();
      scheduleGlitch();
    }, 1000);
  }, []);

  return (
    <motion.div className="relative">
      <motion.h1
        className="text-6xl md:text-8xl font-black leading-none bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent relative z-10"
        style={{ fontFamily: 'monospace' }}
        animate={{
          x: isGlitching ? [0, -2, 2, -1, 1, 0] : 0,
          y: isGlitching ? [0, -1, 1, 0] : 0,
        }}
        transition={{
          duration: 0.05,
          repeat: isGlitching ? 3 : 0,
        }}
      >
        {currentText}
      </motion.h1>

      {isGlitching && (
        <>
          <motion.h1
            className="absolute inset-0 text-6xl md:text-8xl font-black leading-none text-red-500 mix-blend-multiply"
            style={{ fontFamily: 'monospace' }}
            animate={{
              x: [-2, -3, -1],
              opacity: [0.7, 0.5, 0.8]
            }}
            transition={{
              duration: 0.05,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {currentText}
          </motion.h1>

          <motion.h1
            className="absolute inset-0 text-6xl md:text-8xl font-black leading-none text-cyan-400 mix-blend-multiply"
            style={{ fontFamily: 'monospace' }}
            animate={{
              x: [2, 3, 1],
              opacity: [0.6, 0.8, 0.4]
            }}
            transition={{
              duration: 0.08,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
            {currentText}
          </motion.h1>
        </>
      )}

      {isGlitching && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full bg-white mix-blend-difference"
              style={{
                height: '2px',
                top: `${20 + i * 30}%`,
              }}
              animate={{
                x: [-100, 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 0.15,
                delay: i * 0.05,
                repeat: 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}

      {isGlitching && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 255, 0.05) 2px,
              rgba(0, 255, 255, 0.05) 4px
            )`
          }}
          animate={{
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 0.3,
          }}
        />
      )}

      {isGlitching && (
        <motion.div
          className="absolute -right-4 top-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 0.2,
            delay: 0.1
          }}
        />
      )}
    </motion.div>
  );
}

function Hero() {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
  }, []);

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FloatingParticles />
      
      <div className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            className="text-sm uppercase tracking-widest text-cyan-400 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {greeting} 👋
          </motion.p>
          
          <GlitchText />
          
          <motion.p
            className="mt-6 text-xl text-white/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {PROFILE.tag}
          </motion.p>
          
          <motion.p
            className="mt-4 text-lg text-white/70 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {PROFILE.bio}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.a
              href={`https://github.com/${PROFILE.github}`}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-2xl px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-2xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <Github size={20} />
                <span>GitHub Profile</span>
                <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.a>

            {/* Lebenslauf button removed as requested */}
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {PROFILE.skills.map((skill, index) => (
              <motion.span
                key={skill}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="mt-6 flex items-center gap-2 text-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <MapPin size={18} className="text-cyan-400" />
            <span>{PROFILE.location}</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <CodeWindow />
        </motion.div>
      </div>
    </section>
  );
}

function CodeWindow() {
  const [currentLine, setCurrentLine] = useState(0);
  const codeLines = [
    "class Developer {",
    "  constructor() {",
    "    this.name = 'KerYagciHTL';",
    "    this.school = 'HTL Leonding';",
    "    this.languages = [",
    "      'C', 'C++', 'C#', 'Java',",
    "      'JavaScript', 'TypeScript'",
    "    ];",
    "    this.passion = 'Clean Code';",
    "  }",
    "",
    "  async buildFuture() {",
    "    return 'Amazing Projects';",
    "  }",
    "}",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % (codeLines.length + 2));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Terminal size={16} />
          <span>developer.ts</span>
        </div>
      </div>
      
      <div className="p-6 font-mono text-sm">
        {codeLines.map((line, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-4 py-1 ${
              index <= currentLine ? 'text-white' : 'text-white/20'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: index <= currentLine ? 1 : 0.2,
              x: 0 
            }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="text-white/30 text-xs w-6 text-right">{index + 1}</span>
            <span className={
              line.includes('class') || line.includes('constructor') || line.includes('async') ? 'text-purple-400' :
              line.includes("'") || line.includes('"') ? 'text-green-400' :
              line.includes('this.') ? 'text-cyan-400' :
              line.includes('{') || line.includes('}') || line.includes('[') || line.includes(']') ? 'text-yellow-400' :
              'text-white'
            }>
              {line}
            </span>
            {index === currentLine && (
              <motion.div
                className="w-2 h-5 bg-cyan-400"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            y: [null, -20, -40],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function Projects() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured'>('featured');

  useEffect(() => {
    const c = new AbortController();
    (async () => {
      try {
        const r = await fetch(`https://api.github.com/users/${PROFILE.github}/repos?per_page=100&sort=updated`, { signal: c.signal });
        if (!r.ok) throw new Error(`GitHub API ${r.status}`);
        const all: Repo[] = await r.json();
        const byName = new Map(all.map(x => [x.name, x] as const));
        const feat = PROFILE.featured.map(n => byName.get(n)).filter(Boolean) as Repo[];
        const rest = all.filter(x => !PROFILE.featured.includes(x.name) && !x.archived).sort((a,b)=>new Date(b.pushed_at).getTime()-new Date(a.pushed_at).getTime());
        setRepos([...feat, ...rest]);
      } catch (e:any) { if (e.name !== 'AbortError') setErr(e.message || String(e)); }
    })();
    return () => c.abort();
  }, []);

  const displayRepos = repos ? (filter === 'featured' ? repos.filter(r => PROFILE.featured.includes(r.name)) : repos.slice(0, 12)) : [];

  return (
    <section id="projects" className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            My Projects
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
            A selection of my best work and open source contributions
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            key="featured"
            onClick={() => setFilter('featured')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === 'featured'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/5 border border-white/20 text-white/70 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            All Projects
          </motion.button>
        </motion.div>

        {err && (
          <motion.div
            className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-red-400">{err}</p>
          </motion.div>
        )}

        {!repos && !err && <RepoSkeletonGrid />}
        
        {displayRepos.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {displayRepos.map((repo, index) => (
              <RepoCard key={repo.html_url} repo={repo} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const isFeatured = PROFILE.featured.includes(repo.name);
  
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110" />
      
      <motion.a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        className="relative block p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 h-full"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />
            <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors duration-300">
              {repo.name}
            </h3>
          </div>
          
          {isFeatured && (
            <motion.div
              className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              <Star size={12} className="inline mr-1" />
              Featured
            </motion.div>
          )}
          
          {repo.archived && (
            <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded-full border border-amber-400/30">
              Archived
            </span>
          )}
        </div>

        {repo.description && (
          <p className="text-white/70 text-sm mb-4 line-clamp-3 leading-relaxed">
            {repo.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {repo.language && (
            <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 text-white/80">
              <Code2 size={12} className="inline mr-1" />
              {repo.language}
            </span>
          )}
          
          <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 text-white/80">
            <Star size={12} className="inline mr-1" />
            {repo.stargazers_count}
          </span>
          
          <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 text-white/80">
            <GitBranch size={12} className="inline mr-1" />
            {repo.forks_count}
          </span>

          {repo.topics?.slice(0, 2).map(topic => (
            <span key={topic} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
              #{topic}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Updated {new Date(repo.pushed_at).toLocaleDateString()}</span>
          </div>
          
          <motion.div
            className="flex items-center gap-1 group-hover:text-cyan-400 transition-colors duration-300"
            whileHover={{ x: 3 }}
          >
            <ExternalLink size={12} />
            <span>View</span>
          </motion.div>
        </div>
      </motion.a>
    </motion.div>
  );
}

function RepoSkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="h-48 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function Experience() {
  const experiences = [
    {
      icon: <School size={24} />,
      title: "HTL Leonding",
      subtitle: "Higher Department of Computer Science",
      period: "2022 - 2027",
      description: "Focus: Software development, databases, operating systems.",
      skills: ["C", "C#", "Java", "JS/TS", "Oracle XE", "Testing","Linux"],
      highlights: [
        "KCY-Accounting - Modern accounting software with C# and Avalonia",
        "Clean code standards and documentation",
        "Linux workflow and Git integration in all projects"
      ]
    },
    {
      icon: <Zap size={24} />,
      title: "Personal Projects",
      subtitle: "Open Source & Experiments",
      period: "2023 - Present",
      description: "Focus on clean, testable tools and innovative solutions.",
      skills: ["C++", "GitHub", "CI/CD", "batch","Documentation"],
      highlights: [
        "10+ Open Source Repositories",
        "Development of Kerlib - comprehensive C# graphic library",
        "Community building and collaboration"
      ]
    }
  ];

  return (
    <section id="experience" className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            My Journey
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
            From education to personal projects
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <div className="relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 h-full">
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {exp.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-white/80 font-medium">{exp.subtitle}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-sm bg-white/10 text-white/70 rounded-full">
                      {exp.period}
                    </span>
                  </div>
                </div>

                <p className="text-white/70 mb-6">{exp.description}</p>

                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Highlights:</h4>
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2 text-white/80 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                        {highlight}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Technologien:</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 text-white/80"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-block p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-white mb-4">My Goals</h3>
            <div className="grid md:grid-cols-3 gap-6 text-white/80">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Code2 size={24} className="text-cyan-400" />
                </div>
                <p className="font-medium">Clean, testable tools and libraries</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Zap size={24} className="text-purple-400" />
                </div>
                <p className="font-medium">Performance and reliability in development</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Terminal size={24} className="text-cyan-400" />
                </div>
                <p className="font-medium">Practice in controlling/accounting apps</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  // ...existing code...

  return (
    <section id="contact" className="relative py-20">
      <div className="mx-auto max-w-2xl px-6 flex flex-col items-center">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Let's talk
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
            Open for internships, side projects, and exciting collaborations
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-xl flex flex-col gap-8 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl w-full">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Why work with me?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Code2 size={16} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Clean Code Philosophy</p>
                  <p className="text-white/70 text-sm">Clean repos, clear readmes, structured code</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Github size={16} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Open Source Mindset</p>
                  <p className="text-white/70 text-sm">Transparency and community-oriented development</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Fast Implementation</p>
                  <p className="text-white/70 text-sm">Turning small ideas into stable, usable building blocks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <motion.a
              href={`https://github.com/${PROFILE.github}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 w-full"
              whileHover={{ x: 5 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-800 to-black flex items-center justify-center">
                <Github size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">GitHub</p>
                <p className="text-white/70 text-sm">github.com/{PROFILE.github}</p>
              </div>
              <ExternalLink size={16} className="text-white/40 group-hover:text-white transition-colors" />
            </motion.a>

            {PROFILE.email && (
              <motion.a
                href={`mailto:${PROFILE.email}`}
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 w-full"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                  <Mail size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">E-Mail</p>
                  <p className="text-white/70 text-sm">{PROFILE.email}</p>
                </div>
                <ExternalLink size={16} className="text-white/40 group-hover:text-white transition-colors" />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative py-12 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <p className="text-white/60">
              © {new Date().getFullYear()} {PROFILE.name}. 
              <span className="ml-2">Built with React, Tailwind, and Framer Motion.</span>
            </p>
            <p className="text-white/40 text-sm mt-1">
              Developed with ❤️ and lots of ☕
            </p>
          </motion.div>
          
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.a
              href={`https://github.com/${PROFILE.github}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <Github size={20} className="text-white/70 hover:text-white" />
            </motion.a>
            
            {PROFILE.email && (
              <motion.a
                href={`mailto:${PROFILE.email}`}
                className="p-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Mail size={20} className="text-white/70 hover:text-white" />
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });
  
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 h-1 origin-left bg-gradient-to-r from-cyan-400 to-purple-500 z-50 shadow-lg"
    />
  );
}