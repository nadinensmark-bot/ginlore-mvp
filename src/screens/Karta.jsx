import { useNav } from '../nav'
import { useStore, todayStr } from '../state'
import { cardForDate, DAILY_CARDS } from '../data/cards'
import { BackBar } from '../components'

export default function Karta() {
  const nav = useNav()
  const { s, markCardRead } = useStore()
  const card = cardForDate(todayStr())
  const read = s.cardsRead[card.id] === todayStr()

  const today = new Date()
  const dateLabel = today.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })

  const past = DAILY_CARDS.filter((c) => c.id !== card.id).slice(0, 3)

  return (
    <>
      <BackBar label="Zpět" right={<span className="tiny">{dateLabel}</span>} />

      <div className="illus" style={{ minHeight: 130 }}>
        ilustrace — {card.t.toLowerCase().slice(0, 30)}
      </div>

      <span className="overline">
        {card.kind} · 1 min
      </span>
      <h1 className="h1" style={{ marginTop: -6 }}>
        {card.t}
      </h1>
      {card.p.split('\n\n').map((p, i) => (
        <p key={i} className="sub" style={{ fontSize: 14.5 }}>
          {p}
        </p>
      ))}

      {card.related && (
        <div className="col" style={{ gap: 7 }}>
          <span className="overline">Souvisí</span>
          <div className="chiprow">
            {card.related.map((r) => (
              <span key={r} className="pill">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        className={'btn' + (read ? ' disabled' : '')}
        onClick={() => {
          markCardRead(card.id)
          if (card.botKey) setTimeout(() => nav.replace('botanical', { botKey: card.botKey }), 400)
        }}
      >
        {read ? 'Přečteno ✓' : card.botKey ? 'Rozumím · +10 XP → detail v Almanachu' : 'Rozumím · +10 XP'}
      </button>

      <div className="col" style={{ gap: 8 }}>
        <span className="overline">Minulé karty</span>
        {past.map((c) => (
          <div key={c.id} className="card soft" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <div className="col" style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{c.t}</span>
              <span className="tiny">{c.kind}</span>
            </div>
          </div>
        ))}
        <span className="tiny">Karta se mění každý den. Zítra tu bude nová.</span>
      </div>
    </>
  )
}
