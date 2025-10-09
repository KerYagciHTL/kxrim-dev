import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MouseFollowerProps {
  mousePosition: { x: number; y: number };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export function MouseFollower({ mousePosition }: MouseFollowerProps) {
  const { width } = useWindowDimensions();
  if (width < 768) return null; // Hide on small screens like mobile phones

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
        ease: "easeOut",
      }}
    />
  );
}
