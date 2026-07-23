import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scrollState.ts'
import { monolithFragment, monolithVertex } from './monolith.glsl.ts'

const BONE = new THREE.Color('#e8e4da')
const INK = new THREE.Color('#0e0f0c')
const SIGNAL = new THREE.Color('#ff4d00')

interface MonolithProps {
  segments: number
}

/**
 * The hero object. Chaos (noise amplitude) starts at 1 and settles as the
 * visitor scrolls through the first third of the page; fast scrolling
 * re-agitates the surface slightly — the scene answers scroll velocity.
 */
export function Monolith({ segments }: MonolithProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: 1 },
      uBone: { value: BONE },
      uInk: { value: INK },
      uSignal: { value: SIGNAL },
      uCameraPos: { value: new THREE.Vector3() },
    }),
    [],
  )

  useFrame((state, delta) => {
    const mat = matRef.current
    if (!mat) return
    mat.uniforms.uTime!.value = state.clock.elapsedTime
    mat.uniforms.uCameraPos!.value.copy(state.camera.position)

    // settle: 1 at page top → 0.14 by 40% scroll, agitated by velocity.
    // The floor stays above zero so the facets never fully smooth out.
    const settled = THREE.MathUtils.clamp(1 - scrollState.progress / 0.4, 0, 1)
    const agitation = Math.min(Math.abs(scrollState.velocity) * 0.012, 0.35)
    const target = 0.14 + settled * 0.86 + agitation
    const current = mat.uniforms.uChaos!.value as number
    mat.uniforms.uChaos!.value = THREE.MathUtils.damp(current, target, 3.2, delta)
  })

  return (
    <mesh position={[2.9, -0.35, -0.3]} rotation={[0, -0.35, 0]}>
      <boxGeometry args={[1.55, 3.6, 1.55, segments, segments, segments]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={monolithVertex}
        fragmentShader={monolithFragment}
        uniforms={uniforms}
      />
    </mesh>
  )
}
