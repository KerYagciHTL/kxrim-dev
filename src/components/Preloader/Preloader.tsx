import { useEffect, useRef, useState } from 'react'
import styles from './Preloader.module.css'

const MIN_DURATION = 1400 // ms — the sequence is designed, not skipped
const EXIT_DURATION = 900

interface PreloaderProps {
  /** real asset readiness, 0..1 */
  progress: number
  reducedMotion: boolean
  onComplete: () => void
}

/**
 * The loading sequence is the first designed moment: a mono counter climbing
 * against real asset readiness, hairline rule extending, then a two-panel
 * mask reveal. With reduced motion it resolves immediately.
 */
export function Preloader({ progress, reducedMotion, onComplete }: PreloaderProps) {
  const [exiting, setExiting] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(progress)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    progressRef.current = progress
    onCompleteRef.current = onComplete
  }, [progress, onComplete])

  // Reduced motion: no choreography — wait for readiness, then hand over.
  useEffect(() => {
    if (!reducedMotion) return
    if (progress >= 1) {
      const t = setTimeout(() => onCompleteRef.current(), 120)
      return () => clearTimeout(t)
    }
  }, [reducedMotion, progress])

  useEffect(() => {
    if (reducedMotion) return

    const start = performance.now()
    let shown = 0
    let raf = 0
    let exitTimer = 0

    const frame = (now: number) => {
      const elapsed = now - start
      // The counter chases the lower of real progress and elapsed time, so it
      // never lies about readiness but also never jumps.
      const timeCap = Math.min(1, elapsed / MIN_DURATION)
      const target = Math.min(progressRef.current, timeCap)
      shown += (target - shown) * 0.16
      const pct = Math.round(shown * 100)
      if (counterRef.current) {
        counterRef.current.textContent = String(pct).padStart(3, '0')
      }
      if (ruleRef.current) {
        ruleRef.current.style.transform = `scaleX(${shown})`
      }
      if (shown > 0.995 && progressRef.current >= 1 && elapsed >= MIN_DURATION) {
        if (counterRef.current) counterRef.current.textContent = '100'
        if (ruleRef.current) ruleRef.current.style.transform = 'scaleX(1)'
        setExiting(true)
        exitTimer = window.setTimeout(() => onCompleteRef.current(), EXIT_DURATION)
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(exitTimer)
    }
  }, [reducedMotion])

  return (
    <div
      className={`${styles.root} ${exiting ? styles.exiting : ''}`}
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.panelTop} />
      <div className={styles.panelBottom} />
      <div className={styles.content}>
        <span className={styles.mark}>KXRIM</span>
        <span className={styles.counter}>
          <span ref={counterRef}>000</span>
          <span className={styles.unit}>/100</span>
        </span>
        <div className={styles.ruleTrack}>
          <div ref={ruleRef} className={styles.rule} />
        </div>
        <span className={styles.tag}>ASSEMBLING</span>
      </div>
    </div>
  )
}
