import styles from './ClientWork.module.css'

/**
 * Route network diagram for Yagci Sons Logistics, built from the cities the
 * real site actually names (Wien, Salzburg, München, Frankfurt, Hamburg).
 * The path draw is scrubbed by scroll in ClientWork.tsx via [data-route-path].
 *
 * TODO(content): replace/augment with a live capture of yagcisons.at once a
 * browser is available for screenshots — the frame slot is this SVG's parent.
 */

const STOPS = [
  { x: 320, y: 250, label: 'WIEN', anchor: 'end' },
  { x: 210, y: 214, label: 'SALZBURG', anchor: 'end' },
  { x: 150, y: 232, label: 'MÜNCHEN', anchor: 'start' },
  { x: 96, y: 130, label: 'FRANKFURT', anchor: 'end' },
  { x: 148, y: 38, label: 'HAMBURG', anchor: 'start' },
] as const

const PATH = `M ${STOPS.map((s) => `${s.x} ${s.y}`).join(' L ')}`

export function RouteDiagram() {
  return (
    <figure className={styles.diagramFrame}>
      <svg
        viewBox="0 0 360 290"
        className={styles.diagramSvg}
        role="img"
        aria-label="Freight route diagram connecting Vienna, Salzburg, Munich, Frankfurt and Hamburg"
      >
        {/* backdrop graticule */}
        <g stroke="currentColor" strokeOpacity="0.07">
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`v${i}`} x1={45 * (i + 1)} y1="0" x2={45 * (i + 1)} y2="290" />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={48 * (i + 1)} x2="360" y2={48 * (i + 1)} />
          ))}
        </g>

        {/* ghost of the full route */}
        <path d={PATH} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />

        {/* scroll-drawn route */}
        <path
          data-route-path
          d={PATH}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="1.6"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        />

        {STOPS.map((s, i) => (
          <g key={s.label}>
            <rect
              x={s.x - 3.5}
              y={s.y - 3.5}
              width="7"
              height="7"
              fill={i === 0 || i === STOPS.length - 1 ? 'var(--signal)' : 'var(--ink)'}
              stroke="currentColor"
              strokeWidth="1"
            />
            <text
              x={s.anchor === 'end' ? s.x - 10 : s.x + 10}
              y={s.y + 3}
              textAnchor={s.anchor}
              className={styles.diagramText}
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* corner registration marks */}
        <g stroke="currentColor" strokeOpacity="0.4">
          <path d="M2 10 V2 H10" fill="none" />
          <path d="M350 2 H358 V10" fill="none" />
          <path d="M358 280 V288 H350" fill="none" />
          <path d="M10 288 H2 V280" fill="none" />
        </g>
      </svg>
      <figcaption className={styles.diagramCaption}>
        <span>Route manifest — YSL</span>
        <span>AT → DE</span>
      </figcaption>
    </figure>
  )
}
