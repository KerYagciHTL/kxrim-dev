import { motion } from "framer-motion";

interface MouseFollowerProps {
  mousePosition: { x: number; y: number };
}

export function MouseFollower({ mousePosition }: MouseFollowerProps) {
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