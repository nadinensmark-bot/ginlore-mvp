import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { BOTANICALS } from '../data/botanicals'
import { BackBar } from '../components'

export default function Botanical({ params }) {
  const nav = useNav()
  const { s, markBotRead } = useStore()
  const d = useDerived()
  const bot = BOTANICALS[params.botKey]
  if (!bot) return <BackBar label="Almanach" />

  const read = !!s.botsRead[params.botKey]
  const ginsWithIt = d.allGins.filter((g) => (g.botanicals || []).includes(params.botKey))

  return (
    <>
      <BackBar label="Almanach" />
      <div className="illus" style={{ minHeight: 120 }}>
        ilustrace — {bot.n.toLowerCase()}
      </div>
      <span className="overline">{bot.role}</span>
      <h1 className="h1" style={{ marginTop: -6 }}>
        {bot.n}
      </h1>
      <span className="tiny" style={{ fontStyle: 'italic' }}>
        {bot.lat}
      </span>
      <p className="sub" style={{ fontSize: 14.5 }}>
        {bot.text}
      </p>

      <div className="col" style={{ gap: 7 }}>
        <span className="overline">Jak to voní</span>
        <div className="chiprow">
          {bot.notes.map((n) => (
            <span key={n} className="pill">
              {n}
            </span>
          ))}
        </div>
      </div>

      <div className="card tinted">
        <span className="overline" style={{ color: 'var(--accent)' }}>
          Zkus to poznat
        </span>
        <span className="sub">{bot.try}</span>
      </div>

      {ginsWithIt.length > 0 && (
        <div className="col" style={{ gap: 7 }}>
          <span className="overline">Najdeš v těchto ginech</span>
          <div className="chiprow">
            {ginsWithIt.slice(0, 6).map((g) => (
              <button
                key={g.id}
                className="chip"
                onClick={() => nav.push('lahev', { ginId: g.id })}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />
      <button
        className={'btn' + (read ? ' disabled' : '')}
        onClick={() => markBotRead(params.botKey)}
      >
        {read ? 'Uloženo ✓' : 'Rozumím · +15 XP'}
      </button>
    </>
  )
}
