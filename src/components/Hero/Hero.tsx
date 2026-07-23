import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { identity } from '../../content/content.ts'
import styles from './Hero.module.css'

interface HeroProps {
  introDone: boolean
  reducedMotion: boolean
}

export function Hero({ introDone, reducedMotion }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      tl.from(`.${styles.line}`, {
        yPercent: 112,
        duration: 1.15,
        stagger: 0.11,
        ease: 'kx-settle',
      })
        .from(
          `.${styles.ruler}`,
          { scaleY: 0, transformOrigin: 'top', duration: 1.3, ease: 'kx-settle' },
          0.15,
        )
        .from(
          `.${styles.metaRow}`,
          { x: -14, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: 'kx-drift' },
          0.5,
        )
        .from(
          [`.${styles.intro}`, `.${styles.thesis}`],
          { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: 'kx-drift' },
          0.65,
        )
        .from(`.${styles.scrollCue}`, { autoAlpha: 0, duration: 0.8, ease: 'kx-drift' }, 1.1)
      tlRef.current = tl
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (introDone) tlRef.current?.play()
  }, [introDone])

  return (
    <section className={styles.hero} id="top" ref={rootRef} aria-label="Introduction">
      <div className={styles.ruler} aria-hidden="true" />

      <h1 className={styles.title}>
        <span className={styles.lineWrap}>
          <span className={styles.line}>Kerimcan</span>
        </span>
        <span className={styles.lineWrap}>
          <span className={`${styles.line} ${styles.lineIndent}`}>
            Yagci
            <span className={styles.handleTag} aria-hidden="true">
              /{identity.handle}
            </span>
          </span>
        </span>
      </h1>

      <aside className={styles.metaCol} aria-label="Profile summary">
        <p className={styles.metaRow}>Software developer</p>
        <p className={styles.metaRow}>Ansfelden, AT — 48.21°N 14.29°E</p>
        <p className={styles.metaRow}>HTL Leonding — Informatics</p>
        <p className={styles.metaRow}>{identity.languages.join(' / ')}</p>
      </aside>

      <p className={styles.intro}>{identity.intro}</p>
      <p className={styles.thesis}>{identity.thesis}</p>

      <div className={styles.scrollCue} aria-hidden="true">
        <span>Scroll</span>
        <span className={styles.cueLine} />
      </div>
    </section>
  )
}
