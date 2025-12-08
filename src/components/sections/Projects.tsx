import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Repo } from "../../types/repo";
import { PROFILE } from "../../constants/profile";
import { useLanguage } from "../../contexts/LanguageContext";
import { RepoCard } from "../ui/RepoCard";
import { RepoSkeletonGrid } from "../ui/RepoSkeletonGrid";
import { fetchOrganizedRepositories } from "../../utils/github-api";

export function Projects() {
  const { t } = useLanguage();
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setErr(null);
        const organizedRepos = await fetchOrganizedRepositories();
        setRepos(organizedRepos);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setErr(errorMessage);
        console.error('Failed to fetch repositories:', error);
      }
    })();

    return () => controller.abort();
  }, []);

  const displayRepos = repos ? repos.filter(r => PROFILE.featured.includes(r.name)) : [];

  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {t("projects.title")}
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.a
            href="https://github.com/KerYagciHTL?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:from-cyan-600 hover:to-purple-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("projects.allProjects")}
          </motion.a>
        </motion.div>

        {err && (
          <motion.div
            className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-red-400">{t("projects.error")}</p>
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