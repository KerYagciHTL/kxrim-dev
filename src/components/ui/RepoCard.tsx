import { motion } from "framer-motion";
import { Star, Code2, GitBranch, Calendar, ExternalLink } from "lucide-react";
import { Repo } from "../../types/repo";
import { PROFILE } from "../../constants/profile";

interface RepoCardProps {
  repo: Repo;
  index: number;
}

export function RepoCard({ repo, index }: RepoCardProps) {
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