import { useEffect, useState } from 'react'
import { nav } from '../../content/content.ts'
import styles from './Nav.module.css'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.root} ${scrolled ? styles.scrolled : ''}`}>
      <a className={styles.skip} href="#content">
        Skip to content
      </a>
      <a className={styles.name} href="#top" aria-label="Back to top">
        K.YAGCI<span className={styles.slash}>/</span>KXRIM
      </a>
      <nav aria-label="Sections">
        <ul className={styles.links}>
          {nav.map((item) => (
            <li key={item.href}>
              <a className={styles.link} href={item.href}>
                <span className={styles.idx}>{item.index}</span>
                <span className={styles.label}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
