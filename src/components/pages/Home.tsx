import { useEffect, useState } from "react";
import { initializeAnalytics, trackPageView } from "../../utils/analytics";
import {
  MouseFollower,
  BackgroundGrid,
  ProgressBar,
  Navbar,
  Hero,
  Projects,
  Experience,
  Contact,
  Footer
} from "../index";

export function Home() {
  const [dark, setDark] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize analytics tracking
  useEffect(() => {
    initializeAnalytics();
    trackPageView('/');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black text-white selection:bg-cyan-400 selection:text-black overflow-x-hidden relative">
      <MouseFollower mousePosition={mousePosition} />
      <BackgroundGrid />
      <ProgressBar />
      <Navbar dark={dark} setDark={setDark} />
      <Hero />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}