import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";
import { PROFILE } from "../../constants/profile";
import { useLanguage } from "../../contexts/LanguageContext";
import { FloatingParticles } from "../ui/FloatingParticles";
import { GlitchText } from "../ui/GlitchText";
import { CodeWindow } from "../ui/CodeWindow";

export function Hero() {
  const { t } = useLanguage();
  
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return t("hero.greeting.morning");
    if (h < 18) return t("hero.greeting.afternoon");
    return t("hero.greeting.evening");
  }, [t]);

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
            {t("hero.description")}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.a
              href="#projects"
              className="group relative overflow-hidden rounded-2xl px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-2xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <ExternalLink size={20} />
                <span>{t("hero.viewProjects")}</span>
              </div>
            </motion.a>
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