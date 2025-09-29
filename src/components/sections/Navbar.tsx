import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Languages } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface NavbarProps {
  dark: boolean;
  setDark: (value: boolean) => void;
}

export function Navbar({ dark, setDark }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

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
        <nav className="flex items-center gap-4 md:gap-8 text-sm">
          {['projects', 'experience', 'contact'].map((section) => (
            <motion.a
              key={section}
              className="relative text-white/70 hover:text-white transition-colors duration-300 capitalize hidden sm:block"
              href={`#${section}`}
              whileHover={{ y: -2 }}
            >
              {t(`nav.${section}`)}
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
          
          {/* Mobile navigation menu - simplified */}
          <div className="sm:hidden flex items-center gap-2">
            <motion.select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  document.querySelector(e.target.value)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-transparent border border-white/20 rounded-lg px-2 py-1 text-xs text-white/70"
              whileHover={{ scale: 1.05 }}
            >
              <option value="" className="bg-slate-800">Menu</option>
              <option value="#projects" className="bg-slate-800">{t('nav.projects')}</option>
              <option value="#experience" className="bg-slate-800">{t('nav.experience')}</option>
              <option value="#contact" className="bg-slate-800">{t('nav.contact')}</option>
            </motion.select>
          </div>
          
          {/* Language toggle button */}
          <motion.button
            onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
            className="p-2 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={language === 'en' ? 'Switch to German' : 'Switch to English'}
          >
            <Languages size={16} className="md:hidden" />
            <span className="hidden md:block text-xs font-semibold">
              {language === 'en' ? 'DE' : 'EN'}
            </span>
            <span className="md:hidden text-xs font-semibold">
              {language === 'en' ? 'DE' : 'EN'}
            </span>
          </motion.button>
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