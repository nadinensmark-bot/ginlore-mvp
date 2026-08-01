import { useNav } from './nav'
import { useStore, useDerived } from './state'
import { STYLES } from './data/styles'
import { bandFor } from './data/cards'

export function BackBar({ label = 'Zpět', right = null }) {
  const nav = useNav()
  return (
    <div className="row between">
      <button className="backlink" onClick={nav.pop}>
        ‹ {label}
      </button>
      {right}
    </div>
  )
}

export function StreakPill() {
  const { streak } = useDerived()
  if (!streak) return null
  return (
    <span className="pill" title="Dny v řadě s aktivitou">
      🔥 <strong>{streak} dní</strong>
    </span>
  )
}

export function XpBar() {
  const { s } = useStore()
  const { level } = useDerived()
  return (
    <div className="card tinted" style={{ gap: 10 }}>
      <div className="row between">
        <span className="h2">
          Úroveň {level.no} — {level.name}
        </span>
        <span className="tiny" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          {s.xp} / {level.nextXp} XP
        </span>
      </div>
      <div className="progressbar">
        <div style={{ width: level.pct + '%' }} />
      </div>
      {level.missing > 0 && (
        <span className="tiny">
          Do {level.nextGen} ti chybí {level.missing} XP.
        </span>
      )}
    </div>
  )
}

export function RatingBadge({ value }) {
  if (value == null) return <span className="tiny">málo hodnocení</span>
  return (
    <span
      style={{
        fontFamily: 'var(--serif)',
        fontSize: 19,
        fontWeight: 600,
        color: 'var(--accent)',
      }}
    >
      {Number(value).toFixed(1).replace('.', ',')}
    </span>
  )
}

export function GinRow({ gin, meta, right, onClick }) {
  const nav = useNav()
  return (
    <button
      className="card"
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
      onClick={onClick || (() => nav.push('lahev', { ginId: gin.id }))}
    >
      <div
        style={{
          width: 42,
          height: 54,
          borderRadius: 9,
          background: 'var(--accent-soft)',
          border: '1px solid var(--line-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        🍸
      </div>
      <div className="col" style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 600, fontSize: 14.5 }}>{gin.name}</span>
        <span className="tiny">
          {meta || `${gin.country} · ${STYLES[gin.style]?.n || gin.style}`}
        </span>
      </div>
      {right}
    </button>
  )
}

// Větvička jalovce — vlastní ikona místo hvězdičky. frac: 0 / 0.5 / 1.
export function JuniperTwig({ frac = 1, size = 40 }) {
  const clipId = 'twigclip-' + Math.round(frac * 100) + '-' + size
  const shape = (color, berry) => (
    <g stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none">
      {/* větvička */}
      <path d="M5 20 L19 5" />
      {/* jehličky */}
      <path d="M8.5 16.5 L5.5 14" />
      <path d="M8.5 16.5 L12 18.5" />
      <path d="M12 13 L9 10.5" />
      <path d="M12 13 L15.5 15" />
      <path d="M15.5 9.5 L12.8 7.2" />
      <path d="M15.5 9.5 L18.6 11.2" />
      {/* bobule */}
      <circle cx="6.5" cy="9" r="2.1" fill={berry} stroke={color} strokeWidth="1.4" />
      <circle cx="18" cy="17.5" r="1.7" fill={berry} stroke={color} strokeWidth="1.4" />
    </g>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {frac < 1 && shape('#C9C6B6', 'none')}
      {frac > 0 && (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width={24 * (frac >= 1 ? 1 : 0.5)} height="24" />
            </clipPath>
          </defs>
          <g clipPath={frac < 1 ? `url(#${clipId})` : undefined}>
            {shape('var(--accent, #5A764E)', 'var(--accent, #5A764E)')}
          </g>
        </>
      )}
    </svg>
  )
}

// Hodnocení 1–5 větviček jalovce, po půlkách. Táhni nebo ťukni.
export function JuniperRating({ value, onChange }) {
  const set = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const frac = Math.max(0.01, Math.min(1, (clientX - r.left) / r.width))
    onChange(Math.max(0.5, Math.ceil(frac * 10) / 2))
  }
  return (
    <div className="col" style={{ gap: 8 }}>
      <div className="row between" style={{ alignItems: 'baseline' }}>
        <span className="rating-num">{value.toFixed(1).replace('.', ',')}</span>
        <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 16 }}>
          {bandFor(value)}
        </span>
      </div>
      <div
        className="row"
        style={{ gap: 6, justifyContent: 'center', touchAction: 'none', cursor: 'pointer', padding: '4px 0' }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          set(e)
        }}
        onPointerMove={(e) => {
          if (e.buttons) set(e)
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <JuniperTwig key={i} frac={Math.max(0, Math.min(1, value - (i - 1)))} />
        ))}
      </div>
      <div className="row between tiny">
        <span>1 slabý</span>
        <span>3 dobrý</span>
        <span>5 skvost</span>
      </div>
    </div>
  )
}

export function Chip({ on, children, onClick, gold }) {
  return (
    <button className={'chip' + (on ? ' on' : '') + (gold ? ' gold' : '')} onClick={onClick}>
      {children}
    </button>
  )
}

export function Section({ title, action, children }) {
  return (
    <div className="col" style={{ gap: 9 }}>
      <div className="row between">
        <span className="overline">{title}</span>
        {action}
      </div>
      {children}
    </div>
  )
}
