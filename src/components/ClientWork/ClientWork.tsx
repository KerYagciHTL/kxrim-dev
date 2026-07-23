import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { clients } from '../../content/content.ts'
import { RouteDiagram } from './RouteDiagram.tsx'
import { MoeSchematic } from './MoeSchematic.tsx'
import styles from './ClientWork.module.css'

gsap.registerPlugin(ScrollTrigger)

interface ClientWorkProps {
  reducedMotion: boolean
}

const ysl = clients[0]
const moe = clients[1]

export function ClientWork({ reducedMotion }: ClientWorkProps) {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      // Section header: hard horizontal wipe — a different voice than the
      // hero's vertical masks.
      gsap.from(`.${styles.header}`, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.1,
        ease: 'kx-mask',
        scrollTrigger: { trigger: `.${styles.header}`, start: 'top 80%' },
      })

      // Each entry: name wipes, manifest rows follow with their own stagger.
      gsap.utils.toArray<HTMLElement>(`.${styles.entry}`).forEach((entry, i) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: entry, start: 'top 72%' },
        })
        tl.from(entry.querySelectorAll(`.${styles.clientName}`), {
          clipPath: i % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
          duration: 1.0,
          ease: 'kx-mask',
        }).from(
          entry.querySelectorAll(`.${styles.row}`),
          { y: 22, autoAlpha: 0, duration: 0.75, stagger: 0.06, ease: 'kx-drift' },
          0.25,
        )
      })

      // YSL route draws with scroll — scrubbed, not triggered.
      gsap.to('[data-route-path]', {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: `.${styles.entry}`,
          start: 'top 70%',
          end: 'bottom 45%',
          scrub: 0.8,
        },
      })

      // MOE lane line crawls slowly while its entry is in view.
      gsap.to('[data-lane-line]', {
        attr: { x1: -8, x2: 432 },
        ease: 'none',
        scrollTrigger: {
          trigger: `.${styles.entryAlt}`,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  if (!ysl || !moe) return null

  return (
    <section className={styles.root} id="work" ref={rootRef} aria-labelledby="work-title">
      <header className={styles.header}>
        <span className={styles.sectionIndex} aria-hidden="true">
          01
        </span>
        <h2 id="work-title" className={styles.sectionTitle}>
          Client work
        </h2>
        <p className={styles.lead}>
          Production sites for two real companies — designed and built solo, live today.
        </p>
      </header>

      {/* Entry 1 — YSL: diagram bleeds off the right edge, on purpose. */}
      <article className={styles.entry}>
        <div className={styles.entryText}>
          <h3 className={styles.clientName}>{ysl.name}</h3>
          <div className={styles.rows}>
            <p className={`${styles.row} ${styles.tags}`}>
              <span>{ysl.sector}</span>
              <span>{ysl.location}</span>
            </p>
            <p className={`${styles.row} ${styles.built}`}>{ysl.built}</p>
            <ul className={styles.detailList}>
              {ysl.details.map((d) => (
                <li key={d} className={styles.row}>
                  {d}
                </li>
              ))}
            </ul>
            <p className={`${styles.row} ${styles.note}`}>{ysl.note}</p>
            {/* TODO(content): request testimonial quote from client (YSL) */}
            <a
              className={`${styles.row} ${styles.visit}`}
              href={ysl.url}
              target="_blank"
              rel="noreferrer"
            >
              {ysl.urlLabel} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className={`${styles.entryVisual} ${styles.bleedRight}`}>
          <RouteDiagram />
        </div>
      </article>

      {/* Entry 2 — MOE: mirrored, index numeral cropped off the left edge. */}
      <article className={`${styles.entry} ${styles.entryAlt}`}>
        <span className={styles.croppedIndex} aria-hidden="true">
          02
        </span>
        <div className={styles.entryVisual}>
          <MoeSchematic />
        </div>
        <div className={styles.entryText}>
          <h3 className={styles.clientName}>{moe.name}</h3>
          <div className={styles.rows}>
            <p className={`${styles.row} ${styles.tags}`}>
              <span>{moe.sector}</span>
              <span>{moe.location}</span>
            </p>
            <p className={`${styles.row} ${styles.built}`}>{moe.built}</p>
            <ul className={styles.detailList}>
              {moe.details.map((d) => (
                <li key={d} className={styles.row}>
                  {d}
                </li>
              ))}
            </ul>
            <p className={`${styles.row} ${styles.note}`}>{moe.note}</p>
            {/* TODO(content): request testimonial quote from client (MOE) */}
            <a
              className={`${styles.row} ${styles.visit}`}
              href={moe.url}
              target="_blank"
              rel="noreferrer"
            >
              {moe.urlLabel} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </article>
    </section>
  )
}
