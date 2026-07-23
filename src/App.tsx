import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Preloader } from './components/Preloader/Preloader.tsx'
import { Nav } from './components/Nav/Nav.tsx'
import { Hero } from './components/Hero/Hero.tsx'
import { ClientWork } from './components/ClientWork/ClientWork.tsx'
import { Projects } from './components/Projects/Projects.tsx'
import { Record } from './components/Record/Record.tsx'
import { Contact } from './components/Contact/Contact.tsx'
import { useReducedMotion } from './lib/useReducedMotion.ts'
import { initNativeScrollTracking, initSmoothScroll } from './lib/smoothScroll.ts'

// The 3D bundle (three + fiber + drei) only loads when this resolves — the
// first paint never waits on it.
const SceneRoot = lazy(() => import('./scene/SceneRoot.tsx'))

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const [fontsReady, setFontsReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [webgl] = useState(supportsWebGL)

  const sceneEnabled = !reducedMotion && webgl

  useEffect(() => {
    let alive = true
    document.fonts.ready.then(() => {
      if (alive) setFontsReady(true)
    })
    return () => {
      alive = false
    }
  }, [])

  // Real load progress feeding the preloader counter.
  const loadProgress = useMemo(() => {
    let p = 0
    if (fontsReady) p += 0.45
    if (sceneEnabled) {
      if (sceneReady) p += 0.55
    } else {
      p += 0.55
    }
    return p
  }, [fontsReady, sceneReady, sceneEnabled])

  // Scroll systems start only once the intro mask has revealed the page.
  useEffect(() => {
    if (!introDone) return
    return reducedMotion ? initNativeScrollTracking() : initSmoothScroll()
  }, [introDone, reducedMotion])

  const handleSceneReady = useCallback(() => setSceneReady(true), [])
  const handleIntroDone = useCallback(() => setIntroDone(true), [])

  return (
    <>
      {!introDone && (
        <Preloader
          progress={loadProgress}
          reducedMotion={reducedMotion}
          onComplete={handleIntroDone}
        />
      )}

      {sceneEnabled && (
        <Suspense fallback={null}>
          <SceneRoot onReady={handleSceneReady} started={introDone} />
        </Suspense>
      )}

      <Nav />

      <main id="content">
        <Hero introDone={introDone} reducedMotion={reducedMotion} staticScene={!sceneEnabled} />
        <ClientWork reducedMotion={reducedMotion} />
        <Projects reducedMotion={reducedMotion} />
        <Record reducedMotion={reducedMotion} />
        <Contact reducedMotion={reducedMotion} />
      </main>

      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
