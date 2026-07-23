import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { identity, projects } from '../../content/content.ts'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

interface ProjectsProps {
  reducedMotion: boolean
}

export function Projects({ reducedMotion }: ProjectsProps) {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      // Different entrance voice than Client work: rows unclip from the left
      // edge, sliding in with a slightly longer, lazier stagger.
      gsap.from(`.${styles.headerBlock}`, {
        y: 26,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'kx-drift',
        scrollTrigger: { trigger: `.${styles.headerBlock}`, start: 'top 82%' },
      })
      gsap.utils.toArray<HTMLElement>(`.${styles.rowItem}`).forEach((row, i) => {
        gsap.from(row, {
          clipPath: 'inset(0 100% 0 0)',
          x: -18,
          duration: 0.9,
          delay: (i % projects.length) * 0.04,
          ease: 'kx-settle',
          scrollTrigger: { trigger: row, start: 'top 88%' },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section className={styles.root} id="projects" ref={rootRef} aria-labelledby="projects-title">
      <div className={styles.inner}>
        <header className={styles.headerBlock}>
          <span className={styles.sectionIndex} aria-hidden="true">
            02
          </span>
          <h2 id="projects-title" className={styles.sectionTitle}>
            Projects
          </h2>
          <p className={styles.lead}>Open source, built to be used — not to pad a grid.</p>
        </header>

        <ul className={styles.list}>
          {projects.map((p) => (
            <li key={p.name} className={styles.rowItem}>
              <a className={styles.rowLink} href={p.url} target="_blank" rel="noreferrer">
                <span className={styles.projIndex}>{p.index}</span>
                <span className={styles.projName}>{p.name}</span>
                <span className={styles.projDesc}>{p.description}</span>
                <span className={styles.projTech}>{p.tech.join(' · ')}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a className={styles.more} href={identity.githubUrl} target="_blank" rel="noreferrer">
          Full record on GitHub — @{identity.github}
        </a>
      </div>
    </section>
  )
}
