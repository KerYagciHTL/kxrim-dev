import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scrollState.ts'

const BONE = new THREE.Color('#e8e4da')
const SIGNAL = new THREE.Color('#ff4d00')

interface FragmentsProps {
  count: number
}

interface FragmentData {
  scatterPos: THREE.Vector3
  orderPos: THREE.Vector3
  scatterQuat: THREE.Quaternion
  orderQuat: THREE.Quaternion
  scale: THREE.Vector3
  stagger: number
  drift: number
}

/**
 * The raw material. A cloud of instanced slabs scattered around the camera
 * path that assembles into an ordered lattice wall as the page is scrolled —
 * the site's thesis ("small ideas into stable building blocks") made literal.
 * One InstancedMesh, matrices composed on the CPU each frame.
 */
export function Fragments({ count }: FragmentsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const assembleRef = useRef(0)

  const data = useMemo<FragmentData[]>(() => {
    const rng = mulberry32(41) // deterministic: same cloud every visit
    const items: FragmentData[] = []
    const cols = 14
    const rows = Math.ceil(count / cols)
    const latticeOrigin = new THREE.Vector3(-4.6, -2.6, -5.5)
    const e = new THREE.Euler()

    for (let i = 0; i < count; i++) {
      // scattered: a loose torus of debris around the corridor
      const theta = rng() * Math.PI * 2
      const radius = 5 + rng() * 7
      const scatterPos = new THREE.Vector3(
        Math.cos(theta) * radius,
        (rng() - 0.5) * 11,
        -3 + Math.sin(theta) * radius - rng() * 9,
      )

      // ordered: a lattice wall, column by column, with hand-placed jitter
      const col = i % cols
      const row = Math.floor(i / cols)
      const orderPos = new THREE.Vector3(
        latticeOrigin.x + col * 0.62 + (rng() - 0.5) * 0.05,
        latticeOrigin.y + row * 0.34 + (rng() - 0.5) * 0.04,
        latticeOrigin.z + Math.sin(col * 0.8) * 0.5,
      )

      const scatterQuat = new THREE.Quaternion().setFromEuler(
        e.set(rng() * Math.PI * 2, rng() * Math.PI * 2, rng() * Math.PI * 2),
      )
      const orderQuat = new THREE.Quaternion().setFromEuler(
        e.set(0, Math.sin(col * 0.8) * 0.16, 0),
      )

      const s = 0.7 + rng() * 0.9
      items.push({
        scatterPos,
        orderPos,
        scatterQuat,
        orderQuat,
        scale: new THREE.Vector3(0.5 * s, 0.09 * s, 0.28 * s),
        stagger: (row / rows) * 0.55 + rng() * 0.25,
        drift: rng() * Math.PI * 2,
      })
    }
    return items
  }, [count])

  const colors = useMemo(() => {
    const rng = mulberry32(7)
    const arr = new Float32Array(count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      // most slabs are bone knocked toward ink; ~7% carry the signal
      if (rng() < 0.07) c.copy(SIGNAL)
      else c.copy(BONE).multiplyScalar(0.32 + rng() * 0.45)
      c.toArray(arr, i * 3)
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    // assembly window: 12% → 68% of page scroll, damped so it settles
    const raw = THREE.MathUtils.clamp((scrollState.progress - 0.12) / 0.56, 0, 1)
    assembleRef.current = THREE.MathUtils.damp(assembleRef.current, raw, 4.5, delta)
    const assemble = assembleRef.current
    const t = state.clock.elapsedTime

    for (let i = 0; i < data.length; i++) {
      const d = data[i]!
      // per-instance stagger: lower rows lock in first
      const local = THREE.MathUtils.clamp((assemble - d.stagger * 0.6) / 0.4, 0, 1)
      const k = local * local * (3 - 2 * local) // smoothstep

      _p.lerpVectors(d.scatterPos, d.orderPos, k)
      // unassembled slabs breathe; locked slabs hold still
      const breathe = (1 - k) * 0.18
      _p.y += Math.sin(t * 0.5 + d.drift) * breathe
      _p.x += Math.cos(t * 0.35 + d.drift * 1.7) * breathe

      _q.slerpQuaternions(d.scatterQuat, d.orderQuat, k)
      _m.compose(_p, _q, d.scale)
      mesh.setMatrixAt(i, _m)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshLambertMaterial vertexColors />
    </instancedMesh>
  )
}

// module-scope scratch objects: reused every frame, never re-allocated
const _m = new THREE.Matrix4()
const _p = new THREE.Vector3()
const _q = new THREE.Quaternion()

/** tiny deterministic PRNG so the composition is identical on every load */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
