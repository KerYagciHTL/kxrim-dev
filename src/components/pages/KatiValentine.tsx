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

// Generate particles immediately to avoid loading delay
const generateAmbientParticles = (): Particle[] => 
  Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
  }));

export function KatiValentine() {
  const [ambientParticles] = useState<Particle[]>(generateAmbientParticles());
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [showBurst, setShowBurst] = useState(false);

  // Remove any loading screens
  useEffect(() => {
    // Hide any existing progress bars or loading screens
    const progressBars = document.querySelectorAll('[class*="progress"]');
    progressBars.forEach(bar => {
      (bar as HTMLElement).style.display = 'none';
    });
    
    return () => {
      progressBars.forEach(bar => {
        (bar as HTMLElement).style.display = '';
      });
    };
  }, []);

  // Handle flower click - create burst effect
  const handleFlowerClick = () => {
    const burst: BurstParticle[] = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: 50,
      y: 50,
      angle: (360 / 30) * i,
      distance: Math.random() * 200 + 150,
      size: Math.random() * 8 + 4,
    }));
    
    setBurstParticles(burst);
    setShowBurst(true);
    
    setTimeout(() => {
      setShowBurst(false);
      setBurstParticles([]);
    }, 1200);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] flex items-center justify-center">
      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
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
              y: [0, -30, 0],
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

      {/* Background Decorative Flowers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left Flower */}
        <motion.div
          className="absolute top-[10%] left-[8%]"
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
          transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <radialGradient id="bgFlower1">
                <stop offset="0%" stopColor="#ff6b8a" />
                <stop offset="100%" stopColor="#ff1744" />
              </radialGradient>
            </defs>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ellipse
                key={i}
                cx="60"
                cy="30"
                rx="12"
                ry="22"
                fill="url(#bgFlower1)"
                opacity="0.6"
                transform={`rotate(${i * 60} 60 60)`}
              />
            ))}
            <circle cx="60" cy="60" r="12" fill="#ffd700" opacity="0.8" />
          </svg>
        </motion.div>

        {/* Top Right Flower */}
        <motion.div
          className="absolute top-[15%] right-[12%]"
          initial={{ opacity: 0, scale: 0, rotate: 45 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 1.8, duration: 1.5, ease: "easeOut" }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="bgFlower2">
                <stop offset="0%" stopColor="#ff4d6d" />
                <stop offset="100%" stopColor="#c9184a" />
              </radialGradient>
            </defs>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ellipse
                key={i}
                cx="50"
                cy="25"
                rx="10"
                ry="18"
                fill="url(#bgFlower2)"
                opacity="0.7"
                transform={`rotate(${i * 60} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="10" fill="#ffaa00" opacity="0.8" />
          </svg>
        </motion.div>

        {/* Bottom Left Flower */}
        <motion.div
          className="absolute bottom-[12%] left-[15%]"
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 0.28, scale: 1, rotate: 0 }}
          transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
        >
          <svg width="130" height="130" viewBox="0 0 130 130">
            <defs>
              <radialGradient id="bgFlower3">
                <stop offset="0%" stopColor="#ff758c" />
                <stop offset="100%" stopColor="#ff4d6d" />
              </radialGradient>
            </defs>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <ellipse
                key={i}
                cx="65"
                cy="35"
                rx="13"
                ry="24"
                fill="url(#bgFlower3)"
                opacity="0.6"
                transform={`rotate(${i * 45} 65 65)`}
              />
            ))}
            <circle cx="65" cy="65" r="14" fill="#ffc107" opacity="0.8" />
          </svg>
        </motion.div>

        {/* Bottom Right Flower */}
        <motion.div
          className="absolute bottom-[18%] right-[10%]"
          initial={{ opacity: 0, scale: 0, rotate: 60 }}
          animate={{ opacity: 0.32, scale: 1, rotate: 0 }}
          transition={{ delay: 2.2, duration: 1.5, ease: "easeOut" }}
        >
          <svg width="110" height="110" viewBox="0 0 110 110">
            <defs>
              <radialGradient id="bgFlower4">
                <stop offset="0%" stopColor="#ff6b9d" />
                <stop offset="100%" stopColor="#e63946" />
              </radialGradient>
            </defs>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ellipse
                key={i}
                cx="55"
                cy="28"
                rx="11"
                ry="20"
                fill="url(#bgFlower4)"
                opacity="0.65"
                transform={`rotate(${i * 60} 55 55)`}
              />
            ))}
            <circle cx="55" cy="55" r="11" fill="#ffb700" opacity="0.85" />
          </svg>
        </motion.div>

        {/* Middle Right Small Flower */}
        <motion.div
          className="absolute top-[45%] right-[5%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 2.5, duration: 1.2 }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={i}
                cx="40"
                cy="22"
                rx="8"
                ry="14"
                fill="#ff4d6d"
                opacity="0.5"
                transform={`rotate(${i * 72} 40 40)`}
              />
            ))}
            <circle cx="40" cy="40" r="8" fill="#ffd700" opacity="0.7" />
          </svg>
        </motion.div>

        {/* Middle Left Small Flower */}
        <motion.div
          className="absolute top-[40%] left-[6%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.22, scale: 1 }}
          transition={{ delay: 2.7, duration: 1.2 }}
        >
          <svg width="90" height="90" viewBox="0 0 90 90">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ellipse
                key={i}
                cx="45"
                cy="24"
                rx="9"
                ry="16"
                fill="#ff6b8a"
                opacity="0.55"
                transform={`rotate(${i * 60} 45 45)`}
              />
            ))}
            <circle cx="45" cy="45" r="9" fill="#ffcc00" opacity="0.75" />
          </svg>
        </motion.div>
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
                  duration: 1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        {/* Main Flower Container */}
        <motion.div
          className="relative cursor-pointer select-none"
          onClick={handleFlowerClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          {/* Glow Effect Background */}
          <motion.div
            className="absolute inset-0 blur-[80px] bg-gradient-to-r from-red-500/40 via-pink-500/40 to-rose-500/40 rounded-full"
            style={{ transform: 'translate(-20%, -20%)', width: '140%', height: '140%' }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Main Rose Flower - Centered and Clear */}
          <svg
            width="400"
            height="400"
            viewBox="0 0 200 200"
            className="relative drop-shadow-2xl"
          >
            <defs>
              {/* Petal Gradients */}
              <radialGradient id="mainPetalGrad">
                <stop offset="0%" stopColor="#ff6b9d" />
                <stop offset="50%" stopColor="#ff1744" />
                <stop offset="100%" stopColor="#c41e3a" />
              </radialGradient>

              <radialGradient id="innerPetalGrad">
                <stop offset="0%" stopColor="#ff8fab" />
                <stop offset="100%" stopColor="#ff4d6d" />
              </radialGradient>

              <radialGradient id="centerGrad">
                <stop offset="0%" stopColor="#fff9c4" />
                <stop offset="40%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#ffa000" />
              </radialGradient>

              <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4a7c2c" />
                <stop offset="50%" stopColor="#3d6624" />
                <stop offset="100%" stopColor="#2d5016" />
              </linearGradient>

              <radialGradient id="leafGrad">
                <stop offset="0%" stopColor="#6ba83a" />
                <stop offset="100%" stopColor="#3a6620" />
              </radialGradient>

              <filter id="softGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stem */}
            <motion.path
              d="M 100 105 Q 98 130, 96 155 L 95 180"
              fill="none"
              stroke="url(#stemGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />

            {/* Leaves */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <ellipse
                cx="88"
                cy="145"
                rx="12"
                ry="20"
                fill="url(#leafGrad)"
                transform="rotate(-45 88 145)"
                filter="url(#softGlow)"
              />
              <ellipse
                cx="104"
                cy="165"
                rx="10"
                ry="18"
                fill="url(#leafGrad)"
                transform="rotate(35 104 165)"
                filter="url(#softGlow)"
              />
            </motion.g>

            {/* Outer Layer - 8 Large Petals */}
            <motion.g
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (360 / 8) * i;
                return (
                  <motion.g
                    key={`outer-${i}`}
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
                      },
                    }}
                  >
                    <ellipse
                      cx="100"
                      cy="60"
                      rx="18"
                      ry="28"
                      fill="url(#mainPetalGrad)"
                      transform={`rotate(${angle} 100 100)`}
                      filter="url(#softGlow)"
                      opacity="0.95"
                    />
                  </motion.g>
                );
              })}
            </motion.g>

            {/* Middle Layer - 8 Medium Petals (offset) */}
            <motion.g
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.8,
                  },
                },
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (360 / 8) * i + 22.5;
                return (
                  <motion.g
                    key={`mid-${i}`}
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                      },
                    }}
                  >
                    <ellipse
                      cx="100"
                      cy="72"
                      rx="14"
                      ry="22"
                      fill="url(#innerPetalGrad)"
                      transform={`rotate(${angle} 100 100)`}
                      filter="url(#softGlow)"
                      opacity="0.92"
                    />
                  </motion.g>
                );
              })}
            </motion.g>

            {/* Inner Layer - 6 Small Petals */}
            <motion.g
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.06,
                    delayChildren: 1.3,
                  },
                },
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (360 / 6) * i;
                return (
                  <motion.g
                    key={`inner-${i}`}
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                      },
                    }}
                  >
                    <ellipse
                      cx="100"
                      cy="82"
                      rx="10"
                      ry="16"
                      fill="#ff6b8a"
                      transform={`rotate(${angle} 100 100)`}
                      opacity="0.9"
                    />
                  </motion.g>
                );
              })}
            </motion.g>

            {/* Center */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <circle
                cx="100"
                cy="100"
                r="16"
                fill="url(#centerGrad)"
                filter="url(#softGlow)"
              />

              {/* Center details */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (360 / 12) * i;
                const x = 100 + Math.cos((angle * Math.PI) / 180) * 10;
                const y = 100 + Math.sin((angle * Math.PI) / 180) * 10;
                return (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="#d97706"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.8 + i * 0.04, duration: 0.2 }}
                  />
                );
              })}

              <circle cx="100" cy="100" r="4" fill="#fbbf24" />
            </motion.g>
          </svg>
        </motion.div>

        {/* Text with Blur-to-Focus Effect */}
        <motion.div
          className="text-center px-4"
          initial={{
            opacity: 0,
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
          }}
          transition={{
            delay: 2.2,
            duration: 1.2,
            ease: "easeOut",
          }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-wide"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: 'linear-gradient(135deg, #ff6b8a 0%, #ff1744 50%, #c41e3a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(255, 77, 77, 0.4))',
            }}
          >
            Frohes Valentinstag, Kati
          </h1>
          
          {/* Subtle tagline */}
          <motion.p
            className="mt-6 text-rose-200/60 text-base sm:text-lg tracking-[0.3em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 3.2,
              duration: 1,
            }}
          >
            Mit Liebe gemacht
          </motion.p>

          {/* Heart emoji animation */}
          <motion.div
            className="mt-4 text-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 3.8,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              💕
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom hint text */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-rose-300/50 text-sm text-center px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 4,
          duration: 1,
        }}
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Klicke auf die Blume ✨
        </motion.div>
      </motion.div>
    </div>
  );
}
