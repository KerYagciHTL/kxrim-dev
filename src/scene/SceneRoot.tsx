import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Monolith } from './Monolith.tsx'
import { Fragments } from './Fragments.tsx'
import { CameraRig } from './CameraRig.tsx'
import { Effects } from './Effects.tsx'

interface SceneRootProps {
  onReady: () => void
  started: boolean
}

/** Fires onReady after the first real rendered frame — the preloader's
 *  scene-readiness signal is a frame on screen, not a module import. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const fired = useRef(false)
  useFrame(() => {
    if (!fired.current) {
      fired.current = true
      onReady()
    }
  })
  return null
}

export default function SceneRoot({ onReady, started }: SceneRootProps) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 48rem), (pointer: coarse)').matches,
  )

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 48rem), (pointer: coarse)')
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // deliberately reduced treatment on mobile: fewer slabs, coarser monolith,
  // lower dpr ceiling — same composition, cheaper frame
  const config = useMemo(
    () => ({
      fragmentCount: isMobile ? 240 : 680,
      monolithSegments: isMobile ? 28 : 52,
      dpr: [1, isMobile ? 1.5 : 1.75] as [number, number],
    }),
    [isMobile],
  )

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: started ? 1 : 0,
        transition: 'opacity 1.2s cubic-bezier(0.34, 0.04, 0.14, 1)',
      }}
    >
      <Canvas
        dpr={config.dpr}
        camera={{ fov: 42, near: 0.1, far: 40, position: [0.2, 0.2, 9.6] }}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0e0f0c')
        }}
      >
        <fog attach="fog" args={['#0e0f0c', 5, 17]} />
        <ambientLight intensity={0.28} color="#e8e4da" />
        <directionalLight position={[-4, 6, 4]} intensity={0.75} color="#e8e4da" />
        <pointLight position={[-3, -1, -3]} intensity={2} color="#ff4d00" distance={9} decay={2} />

        <CameraRig started={started} />
        <Monolith segments={config.monolithSegments} />
        <Fragments count={config.fragmentCount} />
        <Effects isMobile={isMobile} />
        <ReadySignal onReady={onReady} />
      </Canvas>
    </div>
  )
}
