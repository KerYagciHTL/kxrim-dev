import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'

interface EffectsProps {
  isMobile: boolean
}

/**
 * Post chain, dialled back until each effect is felt rather than noticed:
 * bloom only above a high threshold (the signal-orange sparks), chromatic
 * aberration pushed to the frame edges via radial modulation, and a mild
 * vignette. Film grain lives in the DOM overlay, not here — one grain, cheap.
 * Mobile drops CA and multisampling to protect the frame budget.
 */
export function Effects({ isMobile }: EffectsProps) {
  return (
    <EffectComposer multisampling={isMobile ? 0 : 4}>
      <Bloom intensity={0.35} luminanceThreshold={0.7} luminanceSmoothing={0.3} mipmapBlur />
      {isMobile ? (
        <></>
      ) : (
        <ChromaticAberration offset={[0.0009, 0.0006]} radialModulation modulationOffset={0.42} />
      )}
      <Vignette offset={0.26} darkness={0.62} eskil={false} />
    </EffectComposer>
  )
}
