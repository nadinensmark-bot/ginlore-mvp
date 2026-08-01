import { useState } from 'react'
import { useStore } from '../state'
import { Chip } from '../components'

// Feed — komunitní vrstva je dle researche fáze 2 (nejžádanější chybějící funkce segmentu).
// V MVP je to ukázka podoby s demo obsahem + sběr zájmu.
const DEMO_POSTS = [
  {
    who: 'Klára M.',
    when: 'před 20 minutami · Praha',
    rating: '4,5',
    gin: 'Monkey 47',
    text: 'Čtyřicet sedm botanicals a chová se to jako parfém. S Fever-Tree a brusinkou nádhera.',
  },
  {
    who: 'Tomáš K.',
    when: 'před 2 hodinami',
    milestone: 'dosáhl úrovně Znalec',
    text: 'Prošel kapitolu Sedm stylů.',
  },
  {
    who: 'Ginfest Praha',
    when: 'včera · ověřený profil',
    event: true,
    text: 'Na festivalu si u každého stánku načteš QR a rovnou zapíšeš ochutnávku. Letos 34 palíren.',
  },
]

export default function Feed() {
  const { say } = useStore()
  const [tab, setTab] = useState('pratele')
  const [liked, setLiked] = useState({})

  return (
    <>
      <div className="row between">
        <h1 className="h1">Feed</h1>
        <button className="backlink" onClick={() => say('Hledání přátel přijde s komunitou ve fázi 2.')}>
          Najít přátele
        </button>
      </div>

      <div className="card gold" style={{ gap: 6 }}>
        <span className="overline" style={{ color: 'var(--gold)' }}>
          Ukázka · fáze 2
        </span>
        <span className="sub">
          Sociální vrstva je to, co žádné gin appce nechybí víc — a přesně proto je další na řadě.
          Tohle je ukázka, jak bude feed vypadat.
        </span>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <Chip on={tab === 'pratele'} onClick={() => setTab('pratele')}>
          Přátelé
        </Chip>
        <Chip on={tab === 'cesko'} onClick={() => setTab('cesko')}>
          Česko
        </Chip>
        <Chip on={tab === 'trendy'} onClick={() => setTab('trendy')}>
          Trendy
        </Chip>
      </div>

      {DEMO_POSTS.map((p, i) => (
        <div key={i} className="card" style={{ gap: 8 }}>
          <div className="row between">
            <span style={{ fontWeight: 600, fontSize: 14 }}>
              {p.who}
              {p.milestone ? ` ${p.milestone}` : ''}
            </span>
            <span className="tiny">{p.when}</span>
          </div>
          {p.gin && (
            <div className="row">
              <span
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}
              >
                {p.rating}
              </span>
              <span style={{ fontWeight: 600 }}>{p.gin}</span>
            </div>
          )}
          {p.event && <div className="illus" style={{ minHeight: 70 }}>foto z akce</div>}
          <span className="sub">{p.text}</span>
          <div className="row" style={{ gap: 14 }}>
            <button
              className="tiny"
              style={{ color: liked[i] ? 'var(--accent)' : undefined, fontWeight: 600 }}
              onClick={() => setLiked((m) => ({ ...m, [i]: !m[i] }))}
            >
              {liked[i] ? '♥ Líbí se' : '♡ Líbí se'}
            </button>
            <button className="tiny" onClick={() => say('Komentáře přijdou s komunitou.')}>
              💬 Komentovat
            </button>
          </div>
        </div>
      ))}

      <div className="card soft">
        <span className="h2" style={{ fontSize: 15 }}>
          Týdenní výzva
        </span>
        <span className="sub">Vyzkoušej gin ze země, kterou ještě nemáš.</span>
      </div>
    </>
  )
}
