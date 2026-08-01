import { useStore, useDerived } from '../state'
import { BackBar, XpBar } from '../components'

export default function Odznaky() {
  const d = useDerived()

  return (
    <>
      <BackBar label="Učení" />
      <h1 className="h1">Odznaky</h1>
      <XpBar />

      <span className="overline">Za šíři</span>
      <div className="grid2">
        {d.badges.breadth.map((b) => (
          <Badge key={b.n} b={b} />
        ))}
      </div>

      <div className="col" style={{ gap: 4 }}>
        <span className="overline">Za hloubku</span>
        <span className="tiny">
          Polovina odznaků se nedá vyfarmit počtem. Za tyhle musíš zpomalit.
        </span>
      </div>
      <div className="grid2">
        {d.badges.depth.map((b) => (
          <Badge key={b.n} b={b} />
        ))}
      </div>
    </>
  )
}

function Badge({ b }) {
  const done = b.c >= b.max
  return (
    <div
      className="card"
      style={{
        alignItems: 'center',
        textAlign: 'center',
        gap: 6,
        borderColor: done ? (b.gold ? 'rgba(181,118,58,.5)' : 'var(--accent)') : undefined,
        opacity: done ? 1 : 0.85,
      }}
    >
      <span style={{ fontSize: 26, filter: done ? 'none' : 'grayscale(1) opacity(.5)' }}>
        {b.gold ? '🥇' : '🏅'}
      </span>
      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{b.n}</span>
      {b.d && <span className="tiny">{b.d}</span>}
      <span
        className="tiny"
        style={{ color: done ? 'var(--accent)' : undefined, fontWeight: done ? 700 : 400 }}
      >
        {done ? 'hotovo ✓' : `${b.c} / ${b.max}`}
      </span>
    </div>
  )
}
