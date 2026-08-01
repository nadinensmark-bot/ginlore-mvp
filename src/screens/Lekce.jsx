import { useState } from 'react'
import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { lessonById, ALL_LESSONS } from '../data/lessons'
import { ginById } from '../data/gins'

export default function Lekce({ params }) {
  const nav = useNav()
  const { s, say, completeLesson } = useStore()
  const d = useDerived()
  const lesson = lessonById(params.lessonId)
  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [done, setDone] = useState(false)
  const wasDoneBefore = !!s.lessonsDone[lesson?.id]

  if (!lesson) {
    return (
      <>
        <button className="backlink" onClick={nav.pop}>
          ‹ Zpět
        </button>
        <p className="sub">Lekce nenalezena.</p>
      </>
    )
  }

  const totalSteps = lesson.steps.length + 1 // + kvíz
  const isQuiz = step === lesson.steps.length
  const win = answer === lesson.quiz.correct

  const homeGins = (lesson.homeHint?.ginIds || []).filter((id) => s.bar[id]?.status === 'doma')

  const finish = () => {
    completeLesson(lesson.id, win)
    setDone(true)
  }

  const nextLessonAfter = ALL_LESSONS.find(
    (l) => l.id !== lesson.id && !s.lessonsDone[l.id] && l.chapterId === lesson.chapterId
  )

  if (done) {
    return (
      <div className="col" style={{ gap: 16, flex: 1, justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
        <span style={{ fontSize: 44 }}>🎉</span>
        <h1 className="h1">Lekce hotová</h1>
        <p className="sub" style={{ maxWidth: 280 }}>
          {lesson.t} máš v kapse.{' '}
          {nextLessonAfter ? `Další je ${nextLessonAfter.t}.` : 'Kapitola je hotová.'}
        </p>
        <div className="row" style={{ gap: 10 }}>
          <span className="pill">
            Celkem XP <strong>{s.xp}</strong>
          </span>
          <span className="pill">
            Série <strong>{d.streak} dní</strong>
          </span>
        </div>

        {homeGins.length > 0 && (
          <div className="card tinted" style={{ textAlign: 'left', width: '100%' }}>
            <span className="overline" style={{ color: 'var(--accent)' }}>
              Teorie je hezká věc
            </span>
            <span className="sub">
              Máš doma {ginById(homeGins[0], s.userGins)?.name}. Dáš si dnes a zapíšeš ochutnávku?
            </span>
            <button
              className="backlink"
              onClick={() => nav.replace('zapis', { ginId: homeGins[0] })}
            >
              Zapsat ochutnávku ›
            </button>
          </div>
        )}

        <div className="col" style={{ gap: 10, width: '100%' }}>
          {nextLessonAfter && (
            <button
              className="btn"
              onClick={() => {
                nav.replace('lekce', { lessonId: nextLessonAfter.id })
                setStep(0)
                setAnswer(null)
                setDone(false)
              }}
            >
              Další lekce
            </button>
          )}
          <button className="btn secondary" onClick={nav.pop}>
            Zpět na rozcestník
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="row between">
        <button className="backlink" onClick={nav.pop}>
          ✕ Zavřít
        </button>
        <span className="tiny">
          {step + 1}/{totalSteps}
        </span>
      </div>

      <div className="row" style={{ gap: 5 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 999,
              background: i <= step ? 'var(--accent)' : 'var(--line-soft)',
            }}
          />
        ))}
      </div>

      <span className="overline">
        Kapitola {lesson.chapterNum} · {lesson.chapterT}
      </span>
      <h1 className="h1" style={{ marginTop: -6 }}>
        {lesson.t}
      </h1>

      {!isQuiz ? (
        <>
          <div className="illus">ilustrace — {lesson.t.toLowerCase()}</div>
          <h2 className="h2" style={{ fontSize: 18 }}>
            {lesson.steps[step].h}
          </h2>
          <p className="sub" style={{ fontSize: 14.5 }}>
            {lesson.steps[step].p}
          </p>
          {lesson.steps[step].bullets && (
            <div className="col" style={{ gap: 8 }}>
              {lesson.steps[step].bullets.map((b, i) => (
                <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>·</span>
                  <span className="sub" style={{ fontSize: 14 }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>
          )}
          {lesson.homeHint && step === lesson.steps.length - 1 && homeGins.length > 0 && (
            <div className="card tinted">
              <span className="overline" style={{ color: 'var(--accent)' }}>
                Máš doma
              </span>
              <span className="sub">{lesson.homeHint.text}</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="card soft">
            <span className="overline">Ověření</span>
            <span className="h2" style={{ fontSize: 16.5, lineHeight: 1.4 }}>
              {lesson.quiz.q}
            </span>
          </div>
          {lesson.quiz.options.map((opt, i) => {
            let style = {}
            if (answer !== null) {
              if (i === lesson.quiz.correct)
                style = { borderColor: 'var(--accent)', borderWidth: 2 }
              else if (i === answer) style = { borderColor: 'var(--gold)', borderWidth: 2, color: 'var(--muted-2)' }
              else style = { opacity: 0.6 }
            }
            return (
              <button
                key={i}
                className="card"
                style={{ ...style, fontSize: 14.5 }}
                onClick={() => {
                  if (answer === null) {
                    setAnswer(i)
                    if (i === lesson.quiz.correct && !wasDoneBefore) say('+20 XP')
                  }
                }}
              >
                {opt}
              </button>
            )
          })}
          {answer !== null && (
            <div className={'card ' + (win ? 'tinted' : 'gold')}>
              <span
                className="h2"
                style={{ color: win ? 'var(--accent)' : 'var(--gold)', fontSize: 15 }}
              >
                {win ? 'Přesně tak.' + (wasDoneBefore ? '' : ' +20 XP') : 'Skoro. Správně je ' + (lesson.quiz.correct + 1) + '. možnost.'}
              </span>
              <span className="sub">{lesson.quiz.explain}</span>
            </div>
          )}
        </>
      )}

      <div style={{ flex: 1 }} />

      <button
        className={'btn' + (isQuiz && answer === null ? ' disabled' : '')}
        onClick={() => {
          if (!isQuiz) setStep(step + 1)
          else if (answer !== null) finish()
          else say('Nejdřív vyber odpověď')
        }}
      >
        {!isQuiz ? 'Dál' : answer !== null ? 'Dokončit lekci' + (wasDoneBefore ? '' : ' · +30 XP') : 'Vyber odpověď'}
      </button>
    </>
  )
}
