import { motion } from "framer-motion";
import { Github, Mail, ExternalLink, Code2, Zap } from "lucide-react";
import { PROFILE } from "../../constants/profile";

export function Contact() {
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