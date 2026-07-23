import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { record } from '../../content/content.ts'
import styles from './Record.module.css'

gsap.registerPlugin(ScrollTrigger)

interface RecordProps {
  reducedMotion: boolean
}

export function Record({ reducedMotion }: RecordProps) {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      // This section's voice: hairlines grow first, text surfaces after —
      // the drawing gets inked before it is labelled.
      gsap.utils.toArray<HTMLElement>(`.${styles.item}`).forEach((item) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 80%' },
        })
        tl.from(item.querySelector(`.${styles.itemRule}`), {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.0,
          ease: 'kx-mask',
        }).from(
          item.querySelectorAll(`.${styles.fade}`),
          { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.08, ease: 'kx-drift' },
          0.35,
        )
      })
      gsap.from(`.${styles.headerBlock}`, {
        autoAlpha: 0,
        y: 20,
        duration: 0.9,
        ease: 'kx-drift',
        scrollTrigger: { trigger: `.${styles.headerBlock}`, start: 'top 84%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section className={styles.root} id="record" ref={rootRef} aria-labelledby="record-title">
      <header className={styles.headerBlock}>
        <span className={styles.sectionIndex} aria-hidden="true">
          03
        </span>
        <h2 id="record-title" className={styles.sectionTitle}>
          Record
        </h2>
      </header>

      <ol className={styles.list}>
        {record.map((r) => (
          <li key={r.org} className={styles.item}>
            <div className={styles.itemRule} aria-hidden="true" />
            <div className={styles.itemGrid}>
              <span className={`${styles.period} ${styles.fade}`}>{r.period}</span>
              <div className={styles.body}>
                <h3 className={`${styles.org} ${styles.fade}`}>
                  {r.orgUrl ? (
                    <a href={r.orgUrl} target="_blank" rel="noreferrer">
                      {r.org}
                    </a>
                  ) : (
                    r.org
                  )}
                </h3>
                <p className={`${styles.role} ${styles.fade}`}>{r.title}</p>
                <p className={`${styles.desc} ${styles.fade}`}>{r.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
