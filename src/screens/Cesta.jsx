import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { CHAPTERS, TOTAL_LESSONS_PLANNED } from '../data/lessons'
import { BackBar } from '../components'

export default function Cesta() {
  const nav = useNav()
  const { s, say } = useStore()
  const d = useDerived()

  return (
    <>
      <BackBar label="Učení" />
      <h1 className="h1">Cesta</h1>
      <p className="sub">
        {TOTAL_LESSONS_PLANNED} lekcí v 7 kapitolách. Tři minuty denně a za šest týdnů víš o ginu
        víc než barman.
      </p>

      {CHAPTERS.map((ch) => {
        const unlocked = d.chapterUnlocked(ch)
        const doneCnt = ch.lessons.filter((l) => s.lessonsDone[l.id]).length
        const done = d.chapterDone(ch)
        const now = unlocked && !done && ch.lessons.length > 0 && doneCnt >= 0 && !done
        const isNext = unlocked && !done && ch.lessons.some((l) => !s.lessonsDone[l.id])

        let sub
        if (!unlocked && ch.lessons.length === 0) sub = ch.lockedBy?.label + ' · obsah ve fázi 2'
        else if (!unlocked) sub = ch.lockedBy?.label
        else if (done) sub = `${doneCnt} z ${ch.lessons.length} lekcí · hotovo`
        else sub = `${doneCnt} z ${ch.lessons.length} lekcí`

        return (
          <button
            key={ch.id}
            className="card"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 13,
              borderColor: isNext ? 'var(--accent)' : ch.gold ? 'rgba(181,118,58,.4)' : undefined,
              borderWidth: isNext ? '1.5px' : '1px',
              opacity: unlocked ? 1 : 0.75,
            }}
            onClick={() => {
              if (!unlocked) {
                say(
                  ch.lessons.length === 0
                    ? 'Obsah téhle kapitoly vzniká — fáze 2.'
                    : 'Zamčeno — ' + ch.lockedBy.label.toLowerCase()
                )
                return
              }
              nav.push('kapitola', { chapterId: ch.id })
            }}
          >
            <span
              className="num-badge"
              style={{
                background: done ? 'var(--accent)' : 'transparent',
                color: done ? 'var(--accent-ink)' : unlocked ? 'var(--accent)' : 'var(--muted)',
                boxShadow: done ? 'none' : 'inset 0 0 0 1.5px ' + (ch.gold ? 'rgba(181,118,58,.5)' : 'var(--line)'),
              }}
            >
              {done ? '✓' : ch.num}
            </span>
            <div className="col" style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: unlocked ? 'var(--ink)' : 'var(--muted-2)' }}>
                {ch.t}
              </span>
              <span className="tiny">{sub}</span>
            </div>
            {isNext && (
              <span className="pill" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                teď
              </span>
            )}
            {!unlocked && <span style={{ color: 'var(--muted)' }}>🔒</span>}
          </button>
        )
      })}

      <div className="card soft">
        <span className="h2">Znáš to už?</span>
        <span className="sub">
          Vstupní test, který přeskočí kapitoly, které umíš, připravujeme ve fázi 2. Zatím můžeš
          kapitoly procházet v libovolném pořadí.
        </span>
      </div>
    </>
  )
}
