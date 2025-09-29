import { motion } from "framer-motion";

export function RepoSkeletonGrid() {
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