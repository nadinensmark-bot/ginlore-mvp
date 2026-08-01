import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { STYLES } from '../data/styles'
import { BOTANICALS } from '../data/botanicals'
import { ALL_LESSONS } from '../data/lessons'
import { bandFor } from '../data/cards'
import { BackBar } from '../components'

export default function Lahev({ params }) {
  const nav = useNav()
  const { s, setBarStatus, say } = useStore()
  const d = useDerived()
  const gin = d.allGins.find((g) => g.id === params.ginId)
  if (!gin) return <BackBar label="Zpět" />

  const community = d.communityFor(gin)
  const style = STYLES[gin.style]
  const styleLesson = ALL_LESSONS.find((l) => l.styleKey === gin.style)
  const barState = s.bar[gin.id]
  const own = barState?.status === 'doma'
  const want = barState?.status === 'chci'
  const myTastings = s.tastings.filter((t) => t.ginId === gin.id)

  return (
    <>
      <BackBar
        right={
          <button
            className="backlink"
            onClick={() => {
              navigator.clipboard?.writeText(`${gin.name} — ${gin.country}, ${style?.n}. Ginlore.`)
              say('Zkopírováno do schránky')
            }}
          >
            Sdílet ↗
          </button>
        }
      />

      <div
        style={{
          height: 150,
          borderRadius: 16,
          background: 'var(--accent-soft)',
          border: '1px solid var(--line-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 52,
        }}
      >
        🍸
      </div>

      <span className="overline">
        {gin.distillery} · {gin.country}
        {gin.pending ? ' · čeká na moderaci' : ''}
      </span>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <h1 className="h1" style={{ flex: 1 }}>
          {gin.name}
        </h1>
        <div className="col" style={{ alignItems: 'flex-end', gap: 2 }}>
          {community.median != null ? (
            <>
              <span className="rating-num" style={{ fontSize: 34, color: 'var(--accent)' }}>
                {String(community.median).replace('.', ',')}
              </span>
              <span className="tiny">medián · {community.count} hodnocení</span>
            </>
          ) : (
            <span className="tiny" style={{ textAlign: 'right' }}>
              zatím málo
              <br />
              hodnocení ({community.count})
            </span>
          )}
        </div>
      </div>

      <div className="row" style={{ gap: 7 }}>
        <span className="pill">{style?.n || gin.style}</span>
        <span className="pill">{String(gin.abv).replace('.', ',')} %</span>
        {myTastings.length > 0 && (
          <span className="pill" style={{ color: 'var(--accent)' }}>
            tvoje: {myTastings[0].rating.toFixed(1).replace('.', ',')} ·{' '}
            {bandFor(myTastings[0].rating)}
          </span>
        )}
      </div>

      {gin.desc && <p className="sub">{gin.desc}</p>}

      <button className="btn" onClick={() => nav.push('zapis', { ginId: gin.id })}>
        Zapsat ochutnávku · +10 XP
      </button>
      <div className="grid2">
        <button
          className={'chip' + (own ? ' on' : '')}
          style={{ justifyContent: 'center', padding: '11px 0' }}
          onClick={() => setBarStatus(gin.id, own ? null : 'doma')}
        >
          {own ? 'Mám doma ✓' : 'Mám doma'}
        </button>
        <button
          className={'chip' + (want ? ' on' : '')}
          style={{ justifyContent: 'center', padding: '11px 0' }}
          onClick={() => setBarStatus(gin.id, want ? null : 'chci')}
        >
          {want ? 'Chci ✓' : 'Chci vyzkoušet'}
        </button>
      </div>

      {style && (
        <div className="card tinted">
          <span className="overline" style={{ color: 'var(--accent)' }}>
            Nauč se u téhle lahve
          </span>
          <span className="h2">Tenhle gin je {style.n}</span>
          <span className="sub">{style.text}</span>
          {styleLesson && (
            <button
              className="backlink"
              onClick={() => nav.push('lekce', { lessonId: styleLesson.id })}
            >
              Lekce: {style.n} zblízka · 3 min ›
            </button>
          )}
        </div>
      )}

      {gin.botanicals?.length > 0 && (
        <div className="col" style={{ gap: 7 }}>
          <span className="overline">Botanicals — ťukni pro vysvětlení</span>
          <div className="chiprow">
            {gin.botanicals.map((b) => {
              const known = s.botsRead[b]
              return (
                <button
                  key={b}
                  className={'chip' + (known ? '' : ' gold')}
                  onClick={() => nav.push('botanical', { botKey: b })}
                >
                  {BOTANICALS[b]?.n.toLowerCase() || b}
                  {!known && ' — nová pro tebe'}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {gin.pairing && (
        <div className="card">
          <span className="overline">Párování z tvého baru</span>
          <span className="h2" style={{ fontSize: 15 }}>
            {gin.pairing.tonic} + {gin.pairing.garnish}
          </span>
          <span className="sub">
            <strong>Proč to funguje:</strong> {gin.pairing.why}
          </span>
        </div>
      )}

      {myTastings.length > 0 && (
        <div className="col" style={{ gap: 8 }}>
          <span className="overline">Tvoje zápisy ({myTastings.length})</span>
          {myTastings.map((t) => (
            <div key={t.id} className="card soft" style={{ gap: 5 }}>
              <div className="row between">
                <span style={{ fontWeight: 600 }}>
                  {t.rating.toFixed(1).replace('.', ',')} · {bandFor(t.rating)}
                </span>
                <span className="tiny">
                  {t.date} · {t.serve}
                </span>
              </div>
              {t.tags?.length > 0 && <span className="tiny">{t.tags.join(' · ')}</span>}
              {t.note && <span className="sub">„{t.note}"</span>}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
