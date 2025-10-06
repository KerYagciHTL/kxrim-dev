export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Local styles to match public/404.html without modifying global CSS */}
      <style>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          10% { transform: translate(-2px, -1px); }
          20% { transform: translate(2px, 1px); }
          30% { transform: translate(-1px, 2px); }
          40% { transform: translate(1px, -2px); }
          50% { transform: translate(-2px, 1px); }
          60% { transform: translate(2px, -1px); }
          70% { transform: translate(-1px, -2px); }
          80% { transform: translate(1px, 2px); }
          90% { transform: translate(-2px, -1px); }
        }
        @keyframes float404 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-20px) } }
        .bg-grid { background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px; }
        .glitch-text { position: relative; }
        .glitch-text::before, .glitch-text::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .glitch-text::before { color: #06b6d4; z-index: -1; animation: glitch 2s infinite; clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); }
        .glitch-text::after { color: #a855f7; z-index: -2; animation: glitch 2s infinite reverse; clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%); }
      `}</style>

      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid opacity-20" />

      {/* Floating Particles (inline animation to avoid Tailwind config changes) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full" style={{ top: '20%', left: '10%', animation: 'float404 6s ease-in-out infinite' }} />
        <div className="absolute w-1 h-1 bg-purple-400 rounded-full" style={{ top: '60%', left: '20%', animation: 'float404 6s ease-in-out infinite', animationDelay: '1s' }} />
        <div className="absolute w-3 h-3 bg-cyan-300 rounded-full" style={{ top: '30%', left: '80%', animation: 'float404 6s ease-in-out infinite', animationDelay: '2s' }} />
        <div className="absolute w-1 h-1 bg-purple-300 rounded-full" style={{ top: '70%', left: '70%', animation: 'float404 6s ease-in-out infinite', animationDelay: '3s' }} />
        <div className="absolute w-2 h-2 bg-cyan-500 rounded-full" style={{ top: '40%', left: '90%', animation: 'float404 6s ease-in-out infinite', animationDelay: '4s' }} />
        <div className="absolute w-1 h-1 bg-purple-500 rounded-full" style={{ top: '80%', left: '15%', animation: 'float404 6s ease-in-out infinite', animationDelay: '5s' }} />
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="glitch-text text-8xl md:text-9xl font-black bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono select-none" data-text="404">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Page Not Found</h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have wandered into the digital void.
              <br />Don't worry, even the best developers get lost sometimes.
            </p>
          </div>

          {/* Code Block */}
          <div className="mb-12 max-w-lg mx-auto">
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3" />
                  </svg>
                  <span>error.log</span>
                </div>
              </div>
              <div className="p-6 font-mono text-sm text-left">
                <div className="flex items-center gap-4 py-1 text-white/60">
                  <span className="text-white/30 text-xs w-6 text-right">1</span>
                  <span className="text-red-400">Error:</span>
                  <span className="text-white">Resource not found</span>
                </div>
                <div className="flex items-center gap-4 py-1 text-white/60">
                  <span className="text-white/30 text-xs w-6 text-right">2</span>
                  <span className="text-cyan-400">Status:</span>
                  <span className="text-yellow-400">404</span>
                </div>
                <div className="flex items-center gap-4 py-1 text-white/60">
                  <span className="text-white/30 text-xs w-6 text-right">3</span>
                  <span className="text-purple-400">Solution:</span>
                  <span className="text-green-400">Navigate home</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a href="/" className="group relative overflow-hidden rounded-2xl px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Back to Home</span>
              </div>
            </a>
            <button onClick={() => history.back()} className="group px-8 py-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Go Back</span>
              </div>
            </button>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="text-2xl font-bold text-cyan-400 mb-2">∞</div>
              <div className="text-sm text-white/70">Possible paths</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="text-2xl font-bold text-purple-400 mb-2">404</div>
              <div className="text-sm text-white/70">Error code</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="text-2xl font-bold text-cyan-400 mb-2">1</div>
              <div className="text-sm text-white/70">Way home</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
