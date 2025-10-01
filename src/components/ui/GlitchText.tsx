import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PROFILE } from "../../constants/profile";

export function GlitchText() {
  const [currentText, setCurrentText] = useState(PROFILE.displayName);
  const [isGlitching, setIsGlitching] = useState(false);

  const corruptChars = ['█', '▓', '▒', '░', 'X', '#', '@', '0', '1'];

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      
      // Create some corrupted text
      const createCorruption = (original: string) => {
        return original.split('').map(char => 
          Math.random() < 0.3 ? corruptChars[Math.floor(Math.random() * corruptChars.length)] : char
        ).join('');
      };
      
      const sequence = [
        createCorruption(PROFILE.displayName),
        PROFILE.glitchName,
        createCorruption(PROFILE.glitchName),
        PROFILE.displayName,
        createCorruption(PROFILE.displayName),
        PROFILE.glitchName,
        PROFILE.displayName
      ];
      
      sequence.forEach((text, index) => {
        setTimeout(() => {
          setCurrentText(text);
          
          if (index === sequence.length - 1) {
            setIsGlitching(false);
          }
        }, index * 80);
      });
    };

    const scheduleGlitch = () => {
      setTimeout(() => {
        triggerGlitch();
        scheduleGlitch();
      }, 4000 + Math.random() * 4000);
    };

    // Start first glitch after 1 second
    setTimeout(() => {
      triggerGlitch();
      scheduleGlitch();
    }, 1000);
  }, []);

  return (
    <motion.div className="relative">
      <motion.h1
        className="text-6xl md:text-8xl font-black leading-none bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent relative z-10"
        style={{ fontFamily: 'monospace' }}
        animate={{
          x: isGlitching ? [0, -2, 2, -1, 1, 0] : 0,
          y: isGlitching ? [0, -1, 1, 0] : 0,
        }}
        transition={{
          duration: 0.05,
          repeat: isGlitching ? 3 : 0,
        }}
      >
        {currentText}
      </motion.h1>

      {isGlitching && (
        <>
          <motion.h1
            className="absolute inset-0 text-6xl md:text-8xl font-black leading-none text-red-500 mix-blend-multiply"
            style={{ fontFamily: 'monospace' }}
            animate={{
              x: [-2, -3, -1],
              opacity: [0.7, 0.5, 0.8]
            }}
            transition={{
              duration: 0.05,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {currentText}
          </motion.h1>

          <motion.h1
            className="absolute inset-0 text-6xl md:text-8xl font-black leading-none text-cyan-400 mix-blend-multiply"
            style={{ fontFamily: 'monospace' }}
            animate={{
              x: [2, 3, 1],
              opacity: [0.6, 0.8, 0.4]
            }}
            transition={{
              duration: 0.08,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
            {currentText}
          </motion.h1>
        </>
      )}

      {isGlitching && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full bg-white mix-blend-difference"
              style={{
                height: '2px',
                top: `${20 + i * 30}%`,
              }}
              animate={{
                x: [-100, 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 0.15,
                delay: i * 0.05,
                repeat: 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}

      {isGlitching && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 255, 0.05) 2px,
              rgba(0, 255, 255, 0.05) 4px
            )`
          }}
          animate={{
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 0.3,
          }}
        />
      )}

      {isGlitching && (
        <motion.div
          className="absolute -right-4 top-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 0.2,
            delay: 0.1
          }}
        />
      )}
    </motion.div>
  );
}