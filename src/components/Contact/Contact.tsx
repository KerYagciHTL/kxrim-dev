import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { identity } from '../../content/content.ts'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

interface ContactProps {
  reducedMotion: boolean
}

export function Contact({ reducedMotion }: ContactProps) {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      // Closing voice: the email surfaces from below with a slight skew that
      // straightens as it settles — a heavy plate dropped into place.
      gsap.from(`.${styles.emailInner}`, {
        yPercent: 108,
        skewY: 4,
        duration: 1.3,
        ease: 'kx-settle',
        scrollTrigger: { trigger: `.${styles.email}`, start: 'top 78%' },
      })
      gsap.from(`.${styles.fade}`, {
        autoAlpha: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.09,
        ease: 'kx-drift',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section className={styles.root} id="contact" ref={rootRef} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <header className={styles.headerBlock}>
          <span className={styles.sectionIndex} aria-hidden="true">
            04
          </span>
          <h2 id="contact-title" className={styles.sectionTitle}>
            Contact
          </h2>
        </header>

        <p className={`${styles.avail} ${styles.fade}`}>{identity.availability}</p>

        <a className={styles.email} href={`mailto:${identity.email}`}>
          <span className={styles.emailMask}>
            <span className={styles.emailInner}>
              k.yagci<span className={styles.at}>@</span>students.htl-leonding.ac.at
            </span>
          </span>
        </a>

        <div className={`${styles.links} ${styles.fade}`}>
          <a href={identity.githubUrl} target="_blank" rel="noreferrer">
            GitHub — @{identity.github}
          </a>
        </div>

        <footer className={styles.colophon}>
          <span className={styles.fade}>
            © 2026 {identity.name} — {identity.location}. All rights reserved.
          </span>
          <span className={styles.fade}>Typeset in Archivo &amp; IBM Plex Mono. No template.</span>
        </footer>
      </div>
    </section>
  )
}
