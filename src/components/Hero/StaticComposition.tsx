import styles from './StaticComposition.module.css'

/**
 * The reduced-motion / no-WebGL hero: a measured elevation drawing of the
 * monolith instead of the live scene. Same object, same language — drawn,
 * not simulated. Rendered in place of the Canvas, not alongside it.
 */
export function StaticComposition() {
  return (
    <div className={styles.root} aria-hidden="true">
      <svg viewBox="0 0 420 560" className={styles.svg}>
        <defs>
          <pattern
            id="mono-hatch"
            width="7"
            height="7"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* elevation: the monolith at rest */}
        <g>
          <rect
            x="150"
            y="90"
            width="120"
            height="330"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          {/* section cut, hatched */}
          <rect x="150" y="90" width="120" height="64" fill="url(#mono-hatch)" fillOpacity="0.5" />
          <line x1="150" y1="154" x2="270" y2="154" stroke="currentColor" strokeWidth="1" />
          {/* face split line */}
          <line
            x1="210"
            y1="90"
            x2="210"
            y2="420"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="0.8"
          />
        </g>

        {/* dimension lines */}
        <g stroke="currentColor" strokeOpacity="0.55" strokeWidth="0.8">
          <line x1="120" y1="90" x2="120" y2="420" />
          <line x1="114" y1="90" x2="150" y2="90" />
          <line x1="114" y1="420" x2="150" y2="420" />
          <line x1="150" y1="450" x2="270" y2="450" />
          <line x1="150" y1="426" x2="150" y2="456" />
          <line x1="270" y1="426" x2="270" y2="456" />
        </g>
        <text x="104" y="260" className={styles.dim} transform="rotate(-90 104 260)">
          3600
        </text>
        <text x="210" y="470" className={styles.dim} textAnchor="middle">
          1550
        </text>

        {/* accent: the one signal mark */}
        <rect x="262" y="382" width="8" height="38" fill="var(--signal)" />

        {/* ground line */}
        <line
          x1="60"
          y1="420"
          x2="360"
          y2="420"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="1.2"
        />
        <g stroke="currentColor" strokeOpacity="0.35">
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={64 + i * 22} y1="420" x2={54 + i * 22} y2="432" />
          ))}
        </g>

        <text x="150" y="66" className={styles.label}>
          FIG. 01 — MONOLITH, AT REST
        </text>
      </svg>
    </div>
  )
}
