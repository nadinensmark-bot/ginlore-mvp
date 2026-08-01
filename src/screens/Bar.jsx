import { useState } from 'react'
import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { STYLES } from '../data/styles'
import { GinRow, Chip, RatingBadge } from '../components'
import { ginById } from '../data/gins'

const STOCK_ORDER = ['plná', 'půl', 'dochází', 'prázdná']

export default function Bar() {
  const nav = useNav()
  const { s, exportData, setStock } = useStore()
  const d = useDerived()
  const [filter, setFilter] = useState('doma')

  const doma = Object.entries(s.bar)
    .filter(([, v]) => v.status === 'doma')
    .map(([id, v]) => ({ gin: ginById(id, s.userGins), stock: v.stock }))
    .filter((x) => x.gin)
  const chci = Object.entries(s.bar)
    .filter(([, v]) => v.status === 'chci')
    .map(([id]) => ginById(id, s.userGins))
    .filter(Boolean)
  const ochutnano = d.tastedGins

  const counts = { doma: doma.length, ochutnano: ochutnano.length, chci: chci.length }

  const notes = {
    doma: 'Lahve doma i se stavem zásoby — plná, půl, dochází, prázdná. Ťukni na stav pro změnu.',
    ochutnano: 'Třetí stav „ochutnáno, ale nevlastním" je to, co konkurenci chybí.',
    chci: 'Wishlist se propisuje do doporučení na Objevuj.',
  }

  const myRating = (ginId) => {
    const t = s.tastings.find((x) => x.ginId === ginId)
    return t ? t.rating : null
  }

  return (
    <>
      <div className="row between">
        <h1 className="h1">Můj bar</h1>
        <button className="backlink" onClick={exportData}>
          Export ↓
        </button>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <Chip on={filter === 'doma'} onClick={() => setFilter('doma')}>
          Mám doma {counts.doma}
        </Chip>
        <Chip on={filter === 'ochutnano'} onClick={() => setFilter('ochutnano')}>
          Ochutnáno {counts.ochutnano}
        </Chip>
        <Chip on={filter === 'chci'} onClick={() => setFilter('chci')}>
          Chci {counts.chci}
        </Chip>
      </div>

      <span className="tiny">{notes[filter]}</span>

      {filter === 'doma' &&
        (doma.length ? (
          doma.map(({ gin, stock }) => (
            <GinRow
              key={gin.id}
              gin={gin}
              right={
                <div className="col" style={{ alignItems: 'flex-end', gap: 6 }}>
                  <RatingBadge value={myRating(gin.id)} />
                  <span
                    className="pill"
                    role="button"
                    style={{ fontSize: 11, cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      const next =
                        STOCK_ORDER[(STOCK_ORDER.indexOf(stock || 'plná') + 1) % STOCK_ORDER.length]
                      setStock(gin.id, next)
                    }}
                  >
                    {stock || 'plná'}
                  </span>
                </div>
              }
            />
          ))
        ) : (
          <EmptyHint text="Zatím žádná lahev. Otevři detail ginu a ťukni „Mám doma“." />
        ))}

      {filter === 'ochutnano' &&
        (ochutnano.length ? (
          ochutnano.map((gin) => (
            <GinRow
              key={gin.id}
              gin={gin}
              meta={`${gin.country} · ${STYLES[gin.style]?.n || gin.style} · ${
                d.ginTastingCount[gin.id]
              }× zapsáno`}
              right={<RatingBadge value={myRating(gin.id)} />}
            />
          ))
        ) : (
          <EmptyHint text="Zapiš první ochutnávku — třeba rovnou z Objevuj." />
        ))}

      {filter === 'chci' &&
        (chci.length ? (
          chci.map((gin) => (
            <GinRow
              key={gin.id}
              gin={gin}
              meta={
                d.missingStyles.includes(gin.style)
                  ? `${gin.country} · chybí ti celý styl ${STYLES[gin.style]?.n || ''}`
                  : `${gin.country} · ${STYLES[gin.style]?.n || gin.style}`
              }
            />
          ))
        ) : (
          <EmptyHint text="Wishlist je prázdný. Ťukni „Chci“ u ginu, který tě láká." />
        ))}

      {doma.length >= 2 && d.stylesTasted.length >= 2 && (
        <div className="card tinted">
          <span className="overline" style={{ color: 'var(--accent)' }}>
            Tvůj bar něco umí
          </span>
          <span className="sub">
            {doma.length} lahví, {d.stylesTasted.length} stylů. Rozdíly mezi styly máš doma vedle
            sebe — je z toho hotová lekce.
          </span>
          <button
            className="backlink"
            onClick={() => nav.push('kapitola', { chapterId: 'ch02' })}
          >
            Otevřít Sedm stylů ›
          </button>
        </div>
      )}
    </>
  )
}

function EmptyHint({ text }) {
  return (
    <div className="card soft">
      <span className="sub">{text}</span>
    </div>
  )
}
