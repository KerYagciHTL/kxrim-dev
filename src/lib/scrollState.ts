/**
 * Mutable scroll state shared between the DOM world (Lenis/GSAP) and the
 * WebGL world (read inside useFrame). Mutation instead of React state keeps
 * the scene free of per-scroll re-renders.
 */
export const scrollState = {
  /** 0..1 progress through the full document */
  progress: 0,
  /** Lenis velocity (px/frame, signed) */
  velocity: 0,
}
