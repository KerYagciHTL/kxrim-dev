import { useState } from 'react';
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

// Generate particles immediately to avoid loading delay
const generateAmbientParticles = (): Particle[] => 
  Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

export function KatiValentine() {
  const [ambientParticles] = useState<Particle[]>(generateAmbientParticles());
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [showBurst, setShowBurst] = useState(false);

  // Handle flower click - create burst effect
  const handleFlowerClick = () => {
    const burst: BurstParticle[] = Array.from({ length: 24 }, (_, i) => ({
      id: Date.now() + i,
      x: 50,
      y: 50,
      angle: (360 / 24) * i,
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

          {/* SVG Flower - Improved and Aligned */}
          <svg
            width="500"
            height="600"
            viewBox="0 0 500 600"
            className="relative drop-shadow-2xl"
          >
            <defs>
              {/* Enhanced Gradient Definitions */}
              <linearGradient id="petalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b6b" stopOpacity="1" />
                <stop offset="40%" stopColor="#ff3366" stopOpacity="1" />
                <stop offset="100%" stopColor="#cc0044" stopOpacity="0.95" />
              </linearGradient>
              
              <linearGradient id="petalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff1a75" stopOpacity="1" />
                <stop offset="50%" stopColor="#e60055" stopOpacity="1" />
                <stop offset="100%" stopColor="#b3003d" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="petalInner" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ff9999" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff0066" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2d5016" />
                <stop offset="50%" stopColor="#4a7c2c" />
                <stop offset="100%" stopColor="#2d5016" />
              </linearGradient>

              <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5a9e3a" />
                <stop offset="50%" stopColor="#4a7c2c" />
                <stop offset="100%" stopColor="#3a6620" />
              </linearGradient>
              
              <radialGradient id="centerGradient">
                <stop offset="0%" stopColor="#fffacd" stopOpacity="1" />
                <stop offset="30%" stopColor="#ffd700" stopOpacity="1" />
                <stop offset="70%" stopColor="#ffaa00" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff8800" stopOpacity="1" />
              </radialGradient>

              <radialGradient id="centerInner">
                <stop offset="0%" stopColor="#ffee99" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff9900" stopOpacity="0.3" />
              </radialGradient>
              
              {/* Enhanced Filter for glow effect */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="softGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stem with leaves */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {/* Main Stem */}
              <path
                d="M 250 280 Q 245 350, 240 420 Q 238 480, 235 550"
                fill="none"
                stroke="url(#stemGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* Left Leaf */}
              <motion.path
                d="M 240 380 Q 200 390, 180 410 Q 175 415, 180 420 Q 190 420, 240 400"
                fill="url(#leafGradient)"
                stroke="#3a6620"
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: '240px 390px' }}
              />

              {/* Leaf vein */}
              <motion.path
                d="M 240 385 Q 210 395, 185 413"
                fill="none"
                stroke="#2d5016"
                strokeWidth="1.5"
                strokeOpacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.4, duration: 0.4 }}
              />

              {/* Right Leaf */}
              <motion.path
                d="M 238 450 Q 278 460, 298 480 Q 303 485, 298 490 Q 288 490, 238 470"
                fill="url(#leafGradient)"
                stroke="#3a6620"
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: '238px 460px' }}
              />

              {/* Leaf vein */}
              <motion.path
                d="M 238 455 Q 268 465, 293 483"
                fill="none"
                stroke="#2d5016"
                strokeWidth="1.5"
                strokeOpacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
              />
            </motion.g>

            {/* Outer Layer - Larger Petals */}
            <motion.g
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.3,
                  },
                },
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (360 / 8) * i;
                const gradient = i % 2 === 0 ? 'url(#petalGradient1)' : 'url(#petalGradient2)';
                const rotateTransform = `rotate(${angle}, 250, 250)`;
                
                return (
                  <motion.g
                    key={`outer-${i}`}
                    variants={{
                      hidden: {
                        scale: 0,
                        opacity: 0,
                      },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: {
                          duration: 0.8,
                          ease: [0.34, 1.56, 0.64, 1],
                        },
                      },
                    }}
                  >
                    <g transform={rotateTransform}>
                      {/* Main Petal - Perfectly centered and symmetric */}
                      <ellipse
                        cx="250"
                        cy="160"
                        rx="35"
                        ry="55"
                        fill={gradient}
                        stroke={gradient}
                        strokeWidth="1"
                        filter="url(#glow)"
                        opacity="0.98"
                      />
                      
                      {/* Inner highlight */}
                      <ellipse
                        cx="250"
                        cy="155"
                        rx="20"
                        ry="35"
                        fill="url(#petalInner)"
                        opacity="0.6"
                      />

                      {/* Petal veins for detail */}
                      <motion.line
                        x1="250"
                        y1="205"
                        x2="250"
                        y2="120"
                        stroke="#ff0066"
                        strokeWidth="1.5"
                        strokeOpacity="0.3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
                      />
                      <motion.path
                        d="M 250 170 Q 240 150, 235 130"
                        fill="none"
                        stroke="#ff0066"
                        strokeWidth="1"
                        strokeOpacity="0.2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.9 + i * 0.12, duration: 0.4 }}
                      />
                      <motion.path
                        d="M 250 170 Q 260 150, 265 130"
                        fill="none"
                        stroke="#ff0066"
                        strokeWidth="1"
                        strokeOpacity="0.2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.9 + i * 0.12, duration: 0.4 }}
                      />
                    </g>
                  </motion.g>
                );
              })}
            </motion.g>

            {/* Inner Layer - Smaller Petals between the outer ones */}
            <motion.g
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 1.2,
                  },
                },
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (360 / 8) * i + 22.5; // Offset by half
                const rotateTransform = `rotate(${angle}, 250, 250)`;
                
                return (
                  <motion.g
                    key={`inner-${i}`}
                    variants={{
                      hidden: {
                        scale: 0,
                        opacity: 0,
                      },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: {
                          duration: 0.6,
                          ease: [0.34, 1.56, 0.64, 1],
                        },
                      },
                    }}
                  >
                    <g transform={rotateTransform}>
                      <ellipse
                        cx="250"
                        cy="185"
                        rx="25"
                        ry="40"
                        fill="url(#petalGradient2)"
                        stroke="url(#petalGradient1)"
                        strokeWidth="1"
                        filter="url(#softGlow)"
                        opacity="0.95"
                      />
                      
                      <ellipse
                        cx="250"
                        cy="182"
                        rx="15"
                        ry="25"
                        fill="url(#petalInner)"
                        opacity="0.5"
                      />
                    </g>
                  </motion.g>
                );
              })}
            </motion.g>

            {/* Center of flower - Multi-layered */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {/* Outer center ring */}
              <circle
                cx="250"
                cy="250"
                r="45"
                fill="url(#centerGradient)"
                stroke="#ffaa00"
                strokeWidth="3"
                filter="url(#glow)"
              />

              {/* Middle ring with texture */}
              <circle
                cx="250"
                cy="250"
                r="35"
                fill="url(#centerInner)"
                opacity="0.8"
              />

              {/* Inner details - rings of small dots */}
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (360 / 16) * i;
                const radius = 28;
                const x = 250 + Math.cos((angle * Math.PI) / 180) * radius;
                const y = 250 + Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <motion.circle
                    key={`outer-center-${i}`}
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill="#cc6600"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 2.0 + i * 0.03,
                      duration: 0.3,
                    }}
                  />
                );
              })}

              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (360 / 12) * i + 15;
                const radius = 18;
                const x = 250 + Math.cos((angle * Math.PI) / 180) * radius;
                const y = 250 + Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <motion.circle
                    key={`mid-center-${i}`}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#ff8800"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 2.2 + i * 0.04,
                      duration: 0.3,
                    }}
                  />
                );
              })}

              {/* Central dots */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (360 / 8) * i;
                const radius = 8;
                const x = 250 + Math.cos((angle * Math.PI) / 180) * radius;
                const y = 250 + Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <motion.circle
                    key={`inner-center-${i}`}
                    cx={x}
                    cy={y}
                    r="1.8"
                    fill="#ffaa00"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 2.4 + i * 0.05,
                      duration: 0.3,
                    }}
                  />
                );
              })}

              {/* Very center point */}
              <motion.circle
                cx="250"
                cy="250"
                r="4"
                fill="#ffdd66"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.7, duration: 0.3 }}
              />
            </motion.g>
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
