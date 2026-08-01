import { useState } from 'react'
import { useNav } from '../nav'
import { useStore, useDerived, todayStr } from '../state'
import { STYLES } from '../data/styles'
import { cardForDate } from '../data/cards'
import { StreakPill, Section, RatingBadge } from '../components'

export default function Objevuj() {
  const nav = useNav()
  const { s, say } = useStore()
  const d = useDerived()
  const [q, setQ] = useState('')

  const card = cardForDate(todayStr())
  const query = q.trim().toLowerCase()
  const results = query
    ? d.allGins.filter((g) =>
        (g.name + ' ' + g.distillery + ' ' + g.country + ' ' + (STYLES[g.style]?.n || ''))
          .toLowerCase()
          .includes(query)
      )
    : []

  const czech = d.allGins.filter((g) => g.country === 'Česko')

  return (
    <>
      <div className="row between">
        <span className="brand">ginlore</span>
        <StreakPill />
      </div>

      <div className="searchbar">
        <span>🔍</span>
        <input
          placeholder="Hledat gin, palírnu, botanical…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q && (
          <button onClick={() => setQ('')} style={{ color: 'var(--muted)' }}>
            ✕
          </button>
        )}
      </div>

      {query ? (
        <Section title={`Výsledky (${results.length})`}>
          {results.map((g) => {
            const c = d.communityFor(g)
            return (
              <button
                key={g.id}
                className="card"
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onClick={() => nav.push('lahev', { ginId: g.id })}
              >
                <div className="col" style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{g.name}</span>
                  <span className="tiny">
                    {g.country} · {STYLES[g.style]?.n || g.style}
                  </span>
                </div>
                <RatingBadge value={c.median} />
              </button>
            )
          })}
          {!results.length && (
            <div className="card soft">
              <span className="sub">Nic jsme nenašli.</span>
              <button
                className="btn secondary"
                onClick={() => nav.push('zapis', { addNew: true, prefillName: q.trim() })}
              >
                Přidat „{q.trim()}" do databáze
              </button>
            </div>
          )}
        </Section>
      ) : (
        <>
          <div className="grid2">
            <button
              className="card accent"
              onClick={() => {
                say('Rozpoznávání etikety přijde ve fázi 2 (potřebuje data z fáze 1) — zatím vyber gin ručně.')
                nav.push('zapis')
              }}
            >
              <span style={{ fontSize: 22 }}>📷</span>
              <span className="h2" style={{ color: 'inherit' }}>
                Naskenuj etiketu
              </span>
              <span className="tiny" style={{ color: 'rgba(241,239,230,.75)' }}>
                fáze 2
              </span>
            </button>
            <button className="card" onClick={() => nav.push('zapis')}>
              <span style={{ fontSize: 22 }}>✍️</span>
              <span className="h2">Zapsat ochutnávku</span>
              <span className="tiny">za 15 sekund</span>
            </button>
          </div>

          <button className="card tinted" onClick={() => nav.push('karta')}>
            <span className="overline" style={{ color: 'var(--accent)' }}>
              {card.kind} · 1 minuta čtení
            </span>
            <span className="h2">{card.t}</span>
            <span className="tiny" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Přečíst {s.cardsRead[card.id] === todayStr() ? '· přečteno ✓' : '›'}
            </span>
          </button>

          {d.recommendations.length > 0 && (
            <Section title="Trefí to tvůj profil">
              <div className="scroll-x">
                {d.recommendations.map(({ gin, match }) => (
                  <button
                    key={gin.id}
                    className="card"
                    style={{ width: 168 }}
                    onClick={() => nav.push('lahev', { ginId: gin.id })}
                  >
                    <div
                      style={{
                        height: 64,
                        borderRadius: 10,
                        background: 'var(--accent-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 26,
                      }}
                    >
                      🍸
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.3 }}>
                      {gin.name}
                    </span>
                    <span className="tiny">
                      {gin.country} · {STYLES[gin.style]?.n || gin.style}
                    </span>
                    <span
                      className="tiny"
                      style={{
                        color: d.missingStyles.includes(gin.style) ? 'var(--gold)' : 'var(--accent)',
                        fontWeight: 600,
                      }}
                    >
                      {d.missingStyles.includes(gin.style) ? 'chybí ti styl' : match + ' % pro tebe'}
                    </span>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {d.recommendations.length === 0 && (
            <div className="card soft">
              <span className="h2">Zapiš první gin</span>
              <span className="sub">
                Doporučení se učí z tvých hodnocení. Zapiš, co piješ, a tahle sekce začne fungovat.
              </span>
            </div>
          )}

          <Section title="Česká scéna" action={<span className="tiny">{czech.length} ginů</span>}>
            <div className="scroll-x">
              {czech.map((g) => (
                <button
                  key={g.id}
                  className="chip"
                  onClick={() => nav.push('lahev', { ginId: g.id })}
                >
                  {g.name.replace(' Gin', '').replace('Gin ', '')}
                </button>
              ))}
            </div>
          </Section>
        </>
      )}
    </>
  )
}
