import { useNav } from '../nav'
import { useStore } from '../state'
import { CHAPTERS } from '../data/lessons'
import { BackBar } from '../components'

export default function Kapitola({ params }) {
  const nav = useNav()
  const { s } = useStore()
  const ch = CHAPTERS.find((c) => c.id === params.chapterId) || CHAPTERS[0]

  return (
    <>
      <BackBar label="Cesta" />
      <span className="overline">Kapitola {ch.num}</span>
      <h1 className="h1" style={{ marginTop: -6 }}>
        {ch.t}
      </h1>
      <p className="sub">{ch.desc}</p>

      {ch.lessons.map((l, i) => {
        const done = !!s.lessonsDone[l.id]
        const first = !done && ch.lessons.slice(0, i).every((x) => s.lessonsDone[x.id])
        return (
          <button
            key={l.id}
            className="card"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 13,
              borderColor: first ? 'var(--accent)' : undefined,
              borderWidth: first ? '1.5px' : '1px',
            }}
            onClick={() => nav.push('lekce', { lessonId: l.id })}
          >
            <span
              className="num-badge"
              style={{
                background: done ? 'var(--accent)' : 'var(--accent-soft)',
                color: done ? 'var(--accent-ink)' : 'var(--accent)',
              }}
            >
              {done ? '✓' : i + 1}
            </span>
            <div className="col" style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{l.t}</span>
              <span className="tiny">{l.s}</span>
            </div>
            <span className="tiny">3 min</span>
          </button>
        )
      })}
    </>
  )
}
