import { useNav } from '../nav'
import { useStore, useDerived, todayStr } from '../state'
import { STYLES } from '../data/styles'
import { cardForDate } from '../data/cards'
import { TOTAL_LESSONS_PLANNED } from '../data/lessons'
import { BOTANICALS_TOTAL_TARGET, BOTANICALS } from '../data/botanicals'
import { StreakPill, XpBar } from '../components'

export default function Uceni() {
  const nav = useNav()
  const { s } = useStore()
  const d = useDerived()
  const card = cardForDate(todayStr())

  return (
    <>
      <div className="row between">
        <h1 className="h1">Učení</h1>
        <StreakPill />
      </div>

      <XpBar />

      <button className="card" onClick={() => nav.push('karta')}>
        <span className="overline">Dnes · {card.kind.toLowerCase()}</span>
        <span className="h2">{card.t}</span>
        <span className="sub">{card.p.split('\n')[0].slice(0, 110)}…</span>
        <span className="tiny" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          Přečíst — 1 minuta {s.cardsRead[card.id] === todayStr() ? '· přečteno ✓' : ''}
        </span>
      </button>

      {d.nextLesson && (
        <button
          className="card accent"
          onClick={() => nav.push('lekce', { lessonId: d.nextLesson.id })}
        >
          <span className="overline" style={{ color: 'rgba(241,239,230,.7)' }}>
            Pokračovat
          </span>
          <div className="row between">
            <span className="h2" style={{ color: 'inherit', fontSize: 20 }}>
              {d.nextLesson.t}
            </span>
            <span className="tiny" style={{ color: 'rgba(241,239,230,.75)' }}>
              3 min
            </span>
          </div>
          <span className="tiny" style={{ color: 'rgba(241,239,230,.75)' }}>
            Kapitola {d.nextLesson.chapterNum} · {d.nextLesson.chapterT}
          </span>
        </button>
      )}

      <div className="grid2">
        <Tile ico="🗺️" t="Cesta" s={`${d.doneCount} / ${TOTAL_LESSONS_PLANNED} lekcí`} onClick={() => nav.push('cesta')} />
        <Tile ico="👃" t="Degustace" s="průvodce 4 kroky" onClick={() => nav.push('degustace')} />
        <Tile
          ico="📗"
          t="Almanach"
          s={`${Object.keys(BOTANICALS).length} z ${BOTANICALS_TOTAL_TARGET} botanicals · 7 stylů`}
          onClick={() => nav.push('almanach')}
        />
        <Tile ico="🏅" t="Odznaky" s={`${d.badgeCount} z ${d.badgeTotal}`} onClick={() => nav.push('odznaky')} />
      </div>

      <div className="card soft">
        <span className="overline">Tvoje mapa</span>
        <span className="sub">
          {d.tastedGins.length} ginů zapsaných · {d.stylesTasted.length} stylů ze 7 ·{' '}
          {d.botsMet.size} botanicals z {BOTANICALS_TOTAL_TARGET}
        </span>
        {d.stylesTasted.length > 0 && (
          <div className="chiprow">
            {d.stylesTasted.map((k) => (
              <span key={k} className="pill">
                {STYLES[k]?.n || k} ✓
              </span>
            ))}
          </div>
        )}
      </div>

      {d.missingStyles.length > 0 && (
        <div className="card gold">
          <span className="overline" style={{ color: 'var(--gold)' }}>
            Bílé místo
          </span>
          <span className="h2">{STYLES[d.missingStyles[0]].n} ti chybí</span>
          <span className="sub">{STYLES[d.missingStyles[0]].short}</span>
          <div className="row">
            <button
              className="backlink"
              style={{ color: 'var(--gold)' }}
              onClick={() => {
                const lesson = { 'old-tom': 'old-tom', plymouth: 'plymouth', sloe: 'sloe', navy: 'navy', genever: 'genever', 'new-western': 'new-western', 'london-dry': 'london-dry' }[d.missingStyles[0]]
                nav.push('lekce', { lessonId: lesson })
              }}
            >
              Přečíst lekci ›
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Tile({ ico, t, s, onClick }) {
  return (
    <button className="card" onClick={onClick}>
      <span style={{ fontSize: 22 }}>{ico}</span>
      <span className="h2">{t}</span>
      <span className="tiny">{s}</span>
    </button>
  )
}
