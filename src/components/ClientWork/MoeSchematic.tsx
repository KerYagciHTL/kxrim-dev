import styles from './ClientWork.module.css'

/**
 * Traffic-zone schematic for MOE Verkehrs- und Sicherheitstechnik: a plan
 * view of a road with a hatched restricted zone and a no-stopping sign —
 * the firm's actual line of work (no-parking zones, site securing, markings).
 *
 * TODO(content): replace/augment with a live capture of moe-v.de once a
 * browser is available for screenshots — the frame slot is this SVG's parent.
 */
export function MoeSchematic() {
  return (
    <figure className={styles.diagramFrame}>
      <svg
        viewBox="0 0 360 290"
        className={styles.diagramSvg}
        role="img"
        aria-label="Road plan schematic with a hatched restricted parking zone and a no-stopping sign"
      >
        <defs>
          <pattern
            id="moe-hatch"
            width="8"
            height="8"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--signal)" strokeWidth="1.4" />
          </pattern>
        </defs>

        {/* road body */}
        <rect x="0" y="96" width="360" height="110" fill="currentColor" fillOpacity="0.05" />
        <line x1="0" y1="96" x2="360" y2="96" stroke="currentColor" strokeOpacity="0.45" />
        <line x1="0" y1="206" x2="360" y2="206" stroke="currentColor" strokeOpacity="0.45" />

        {/* centre line, dashed — animated by scroll (data-lane-line) */}
        <line
          data-lane-line
          x1="-40"
          y1="151"
          x2="400"
          y2="151"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeDasharray="18 14"
        />

        {/* hatched no-stopping zone */}
        <g>
          <rect x="216" y="160" width="120" height="46" fill="url(#moe-hatch)" fillOpacity="0.8" />
          <rect
            x="216"
            y="160"
            width="120"
            height="46"
            fill="none"
            stroke="var(--signal)"
            strokeWidth="1.2"
          />
        </g>

        {/* no-stopping sign: blue-field circle abstracted to line work */}
        <g>
          <line x1="276" y1="160" x2="276" y2="118" stroke="currentColor" strokeOpacity="0.6" />
          <circle
            cx="276"
            cy="98"
            r="20"
            fill="var(--ink)"
            stroke="var(--signal)"
            strokeWidth="2.5"
          />
          <line x1="262" y1="84" x2="290" y2="112" stroke="var(--signal)" strokeWidth="2.5" />
          <line x1="290" y1="84" x2="262" y2="112" stroke="var(--signal)" strokeWidth="2.5" />
        </g>

        {/* measurement ticks under the zone */}
        <g stroke="currentColor" strokeOpacity="0.5">
          <line x1="216" y1="226" x2="216" y2="234" />
          <line x1="336" y1="226" x2="336" y2="234" />
          <line x1="216" y1="230" x2="336" y2="230" />
        </g>
        <text x="276" y="248" textAnchor="middle" className={styles.diagramText}>
          ZONE — 15M
        </text>

        {/* corner registration marks */}
        <g stroke="currentColor" strokeOpacity="0.4">
          <path d="M2 10 V2 H10" fill="none" />
          <path d="M350 2 H358 V10" fill="none" />
          <path d="M358 280 V288 H350" fill="none" />
          <path d="M10 288 H2 V280" fill="none" />
        </g>
      </svg>
      <figcaption className={styles.diagramCaption}>
        <span>Site plan — MOE</span>
        <span>Berlin, DE</span>
      </figcaption>
    </figure>
  )
}
