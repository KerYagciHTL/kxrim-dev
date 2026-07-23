import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scrollState.ts'

/**
 * The camera is the spine of the page: scroll progress maps to a position on
 * a Catmull-Rom dolly path with a matching look-target path. Position is
 * double-damped so the ride has mass; scroll velocity adds a slight roll.
 */

const POSITIONS = [
  new THREE.Vector3(0.2, 0.5, 7.2), // hero — monolith right of frame
  new THREE.Vector3(-1.6, 0.2, 4.6), // drifting toward the corridor
  new THREE.Vector3(-2.6, -0.4, 1.4), // client work — passing the field
  new THREE.Vector3(-3.4, 0.4, -1.8), // projects — inside the lattice line
  new THREE.Vector3(-1.8, 1.6, -3.2), // record — rising above it
  new THREE.Vector3(2.6, 2.2, 4.8), // contact — wide pull-back reveal
]

const TARGETS = [
  new THREE.Vector3(2.3, 0.3, 0), // the monolith
  new THREE.Vector3(0.4, 0, -2.5),
  new THREE.Vector3(-3.6, -0.6, -5.0), // the assembling wall
  new THREE.Vector3(-4.2, 0.2, -5.5),
  new THREE.Vector3(-3.8, -0.4, -5.5),
  new THREE.Vector3(-1.2, 0.1, -2.4), // the whole settled composition
]

interface CameraRigProps {
  started: boolean
}

export function CameraRig({ started }: CameraRigProps) {
  const posPath = useMemo(() => new THREE.CatmullRomCurve3(POSITIONS, false, 'centripetal'), [])
  const targetPath = useMemo(() => new THREE.CatmullRomCurve3(TARGETS, false, 'centripetal'), [])

  const state = useRef({
    pos: POSITIONS[0]!.clone().add(new THREE.Vector3(0, -0.3, 2.4)), // intro dolly-in start
    target: TARGETS[0]!.clone(),
    look: new THREE.Matrix4(),
    p: new THREE.Vector3(),
    t: new THREE.Vector3(),
    roll: 0,
  })

  useFrame(({ camera }, delta) => {
    const s = state.current
    const progress = THREE.MathUtils.clamp(scrollState.progress, 0, 1)

    posPath.getPoint(progress, s.p)
    targetPath.getPoint(progress, s.t)

    // heavier damping before the intro finishes = the slow initial dolly-in
    const lambda = started ? 3.4 : 1.1
    dampV3(s.pos, s.p, lambda, delta)
    dampV3(s.target, s.t, lambda * 1.25, delta)

    camera.position.copy(s.pos)
    camera.lookAt(s.target)

    // velocity leans the frame — felt, not seen
    const targetRoll = THREE.MathUtils.clamp(-scrollState.velocity * 0.00045, -0.02, 0.02)
    s.roll = THREE.MathUtils.damp(s.roll, targetRoll, 4, delta)
    camera.rotation.z += s.roll
  })

  return null
}

/** frame-rate-independent exponential damping, per component */
function dampV3(current: THREE.Vector3, target: THREE.Vector3, lambda: number, delta: number) {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, delta)
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, delta)
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, delta)
}
