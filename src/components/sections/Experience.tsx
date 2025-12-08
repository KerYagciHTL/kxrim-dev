import { motion } from "framer-motion";
import { School, Zap, Code2, Terminal } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function Experience() {
  const { t } = useLanguage();
  
  const experiences = [
    {
      icon: <School size={24} />,
      title: t("experience.htl.title"),
      subtitle: t("experience.htl.subtitle"),
      period: t("experience.htl.period"),
      description: t("experience.htl.description"),
      skills: ["C", "C#", "Java", "JS/TS", "Oracle XE", "Testing","Linux"],
      highlights: [
        t("experience.htl.highlight1"),
        t("experience.htl.highlight2"),
        t("experience.htl.highlight3")
      ]
    },
    {
      icon: <Zap size={24} />,
      title: t("experience.projects.title"),
      subtitle: t("experience.projects.subtitle"),
      period: t("experience.projects.period"),
      description: t("experience.projects.description"),
      skills: ["C++", "GitHub", "CI/CD", "batch","Documentation"],
      highlights: [
        t("experience.projects.highlight1"),
        t("experience.projects.highlight2"),
        t("experience.projects.highlight3")
      ]
    }
  ];

  return (
    <section id="experience" className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {t("experience.title")}
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
            {t("experience.subtitle")}
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
                  <h4 className="text-white font-semibold mb-3">{t("experience.highlights")}</h4>
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
                  <h4 className="text-white font-semibold mb-3">{t("experience.technologies")}</h4>
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
            <h3 className="text-2xl font-bold text-white mb-4">{t("experience.goals")}</h3>
            <div className="grid md:grid-cols-3 gap-6 text-white/80">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Code2 size={24} className="text-cyan-400" />
                </div>
                <p className="font-medium">{t("experience.goal1")}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Zap size={24} className="text-purple-400" />
                </div>
                <p className="font-medium">{t("experience.goal2")}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Terminal size={24} className="text-cyan-400" />
                </div>
                <p className="font-medium">{t("experience.goal3")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}