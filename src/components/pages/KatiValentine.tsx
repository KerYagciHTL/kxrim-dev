import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
}

export function KatiValentine() {
  const [ambientParticles, setAmbientParticles] = useState<Particle[]>([]);
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [showBurst, setShowBurst] = useState(false);

  // Generate ambient particles on mount
  useEffect(() => {
    const particles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setAmbientParticles(particles);
  }, []);

  // Handle flower click - create burst effect
  const handleFlowerClick = () => {
    const burst: BurstParticle[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: 50,
      y: 50,
      angle: (360 / 20) * i,
      distance: Math.random() * 150 + 100,
      size: Math.random() * 6 + 3,
    }));
    
    setBurstParticles(burst);
    setShowBurst(true);
    
    setTimeout(() => {
      setShowBurst(false);
      setBurstParticles([]);
    }, 1000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] flex items-center justify-center">
      {/* Ambient Particles */}
      <div className="absolute inset-0">
        {ambientParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-red-500/30 blur-[2px]"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Burst Particles */}
      <AnimatePresence>
        {showBurst && (
          <div className="absolute inset-0 pointer-events-none">
            {burstParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-gradient-to-br from-red-400 via-pink-400 to-rose-500"
                style={{
                  left: '50%',
                  top: '50%',
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
                  y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
                  opacity: 0,
                  scale: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        {/* Flower Container */}
        <motion.div
          className="relative cursor-pointer select-none"
          onClick={handleFlowerClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow Effect Background */}
          <motion.div
            className="absolute inset-0 blur-3xl bg-gradient-to-r from-red-500/30 via-pink-500/30 to-rose-500/30 rounded-full"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* SVG Flower */}
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            className="relative drop-shadow-2xl"
          >
            <defs>
              {/* Gradient Definitions */}
              <linearGradient id="petalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ff1a75" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ff0066" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="petalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff0066" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#e6005c" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#cc0052" stopOpacity="1" />
              </linearGradient>
              <radialGradient id="centerGradient">
                <stop offset="0%" stopColor="#ffff99" stopOpacity="1" />
                <stop offset="50%" stopColor="#ffcc00" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff9900" stopOpacity="1" />
              </radialGradient>
              
              {/* Filter for glow effect */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Container for all petals */}
            <motion.g
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              {/* 8 Petals arranged in a circle */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (360 / 8) * i;
                const gradient = i % 2 === 0 ? 'url(#petalGradient1)' : 'url(#petalGradient2)';
                
                return (
                  <motion.g
                    key={i}
                    variants={{
                      hidden: {
                        scale: 0,
                        opacity: 0,
                        rotate: angle - 90,
                      },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        rotate: angle,
                        transition: {
                          duration: 0.8,
                          ease: [0.34, 1.56, 0.64, 1], // Elastic ease
                        },
                      },
                    }}
                    style={{
                      transformOrigin: '200px 200px',
                    }}
                  >
                    {/* Petal Path - elegant heart-shaped petal */}
                    <path
                      d="M 200 200 Q 200 140, 240 120 Q 260 110, 270 130 Q 280 150, 270 170 Q 260 185, 200 200 Z"
                      fill={gradient}
                      stroke={gradient}
                      strokeWidth="2"
                      filter="url(#glow)"
                      opacity="0.95"
                    />
                  </motion.g>
                );
              })}
            </motion.g>

            {/* Center of flower - appears last */}
            <motion.circle
              cx="200"
              cy="200"
              r="35"
              fill="url(#centerGradient)"
              stroke="#ffaa00"
              strokeWidth="3"
              filter="url(#glow)"
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: 1.5,
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />

            {/* Inner center details */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (360 / 12) * i;
              const x = 200 + Math.cos((angle * Math.PI) / 180) * 20;
              const y = 200 + Math.sin((angle * Math.PI) / 180) * 20;
              
              return (
                <motion.circle
                  key={`center-${i}`}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="#ff6600"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 1.7 + i * 0.05,
                    duration: 0.3,
                  }}
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Text with Blur-to-Focus Effect */}
        <motion.div
          className="text-center"
          initial={{
            opacity: 0,
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
          }}
          transition={{
            delay: 2.8,
            duration: 1.2,
            ease: "easeOut",
          }}
        >
          <h1
            className="text-5xl md:text-6xl font-serif tracking-wide"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: 'linear-gradient(135deg, #ff4d4d 0%, #ff1a75 50%, #ff0066 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(255, 77, 77, 0.3)',
            }}
          >
            Frohes Valentinstag, Kati
          </h1>
          
          {/* Subtle tagline */}
          <motion.p
            className="mt-4 text-rose-300/70 text-lg tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 3.5,
              duration: 1,
            }}
          >
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom hint text */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-rose-300/40 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 4,
          duration: 1,
        }}
      >
        Klicke auf die Blume ✨
      </motion.div>
    </div>
  );
}
