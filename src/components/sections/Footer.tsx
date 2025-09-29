import { motion } from "framer-motion";
import { Github, Mail } from "lucide-react";
import { PROFILE } from "../../constants/profile";

export function Footer() {
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