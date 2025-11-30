import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Languages, Star, Menu, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  dark: boolean;
  setDark: (value: boolean) => void;
}

export function Navbar({ dark, setDark }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

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
          
          <div className="sm:hidden flex items-center gap-2">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
          
          <motion.a
            href="/reviews"
            onClick={(e) => { e.preventDefault(); navigate('/reviews'); }}
            className="p-2 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            title={t('nav.reviews')}
          >
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="hidden lg:block text-xs font-semibold text-yellow-400">
              {t('nav.reviews')}
            </span>
          </motion.a>

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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sm:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden h-screen"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 pb-20">
              {['projects', 'experience', 'contact'].map((section) => (
                <motion.a
                  key={section}
                  href={`#${section}`}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-white/80 hover:text-white capitalize"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(`nav.${section}`)}
                </motion.a>
              ))}
              <motion.a
                href="/reviews"
                onClick={(e) => { e.preventDefault(); setIsOpen(false); navigate('/reviews'); }}
                className="text-2xl font-bold text-white/80 hover:text-white capitalize flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('nav.reviews')} <Star size={20} className="text-yellow-400 fill-yellow-400" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}