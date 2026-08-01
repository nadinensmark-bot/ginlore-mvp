import { useState } from 'react'
import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { DG_STEPS } from '../data/cards'
import { STYLES } from '../data/styles'
import { Chip } from '../components'

// Průvodce degustací — 4 kroky. Výsledek se dá uložit jako plnohodnotná ochutnávka.
export default function Degustace({ params }) {
  const nav = useNav()
  const { s, say } = useStore()
  const d = useDerived()
  const [ginId, setGinId] = useState(params.ginId || null)
  const [step, setStep] = useState(0)
  const [tags, setTags] = useState({})
  const [intensity, setIntensity] = useState(50)

  const cur = DG_STEPS[step]
  const gin = ginId ? d.allGins.find((g) => g.id === ginId) : null

  const toggle = (t) =>
    setTags((m) => {
      const n = { ...m }
      if (n[t]) delete n[t]
      else n[t] = 1
      return n
    })

  const setInt = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    setIntensity(Math.round(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * 100))
  }

  if (!ginId) {
    // výběr ginu, kterého se degustace týká
    const candidates = [
      ...Object.entries(s.bar)
        .filter(([, v]) => v.status === 'doma')
        .map(([id]) => d.allGins.find((g) => g.id === id))
        .filter(Boolean),
      ...d.allGins.filter((g) => !s.bar[g.id] || s.bar[g.id].status !== 'doma'),
    ]
    return (
      <>
        <div className="row between">
          <button className="backlink" onClick={nav.pop}>
            ✕ Zrušit
          </button>
        </div>
        <h1 className="h1">Degustace</h1>
        <p className="sub">
          Čtyři kroky: vzhled → aroma → chuť → dozvuk. Vyber gin, který máš ve sklenici.
        </p>
        {candidates.slice(0, 12).map((g) => (
          <button
            key={g.id}
            className="card"
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onClick={() => setGinId(g.id)}
          >
            <div className="col" style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 14.5 }}>{g.name}</span>
              <span className="tiny">
                {g.country} · {STYLES[g.style]?.n || g.style}
                {s.bar[g.id]?.status === 'doma' ? ' · máš doma' : ''}
              </span>
            </div>
            <span style={{ color: 'var(--accent)' }}>›</span>
          </button>
        ))}
      </>
    )
  }

  return (
    <>
      <div className="row between">
        <button className="backlink" onClick={() => (step > 0 ? setStep(step - 1) : setGinId(null))}>
          ‹ {step > 0 ? DG_STEPS[step - 1].n : 'Jiný gin'}
        </button>
        <button className="backlink" onClick={nav.pop}>
          ✕
        </button>
      </div>

      <span className="overline">Degustace · {gin.name}</span>

      <div className="row" style={{ gap: 5 }}>
        {DG_STEPS.map((x, i) => (
          <div key={x.n} className="col" style={{ flex: 1, gap: 4 }}>
            <div
              style={{
                height: 4,
                borderRadius: 999,
                background: i <= step ? 'var(--accent)' : 'var(--line-soft)',
              }}
            />
            <span
              className="tiny"
              style={{
                color: i === step ? 'var(--accent)' : 'var(--muted)',
                fontWeight: i === step ? 700 : 400,
              }}
            >
              {x.n}
            </span>
          </div>
        ))}
      </div>

      <div className="card soft">
        <span className="overline">Co teď udělat</span>
        <span className="sub" style={{ fontSize: 14.5 }}>
          {cur.instr}
        </span>
      </div>

      <div className="row between">
        <span className="h2">{cur.prompt}</span>
        <span className="tiny">{Object.keys(tags).length} vybraných</span>
      </div>

      {cur.groups.map((g) => (
        <div key={g.n} className="col" style={{ gap: 7 }}>
          <span className="overline">{g.n}</span>
          <div className="chiprow">
            {g.tags.map((t) => (
              <Chip key={t} on={!!tags[t]} onClick={() => toggle(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
      ))}

      {step === 2 && (
        <div className="col" style={{ gap: 7 }}>
          <div className="row between">
            <span className="overline">Intenzita</span>
            <span className="tiny" style={{ fontWeight: 600, color: 'var(--accent)' }}>
              {intensity > 70 ? 'výrazná' : intensity > 40 ? 'střední' : 'jemná'}
            </span>
          </div>
          <div
            className="slider-track"
            style={{ height: 34 }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              setInt(e)
            }}
            onPointerMove={(e) => {
              if (e.buttons) setInt(e)
            }}
          >
            <div className="slider-fill" style={{ width: intensity + '%' }} />
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <button
        className="btn"
        onClick={() => {
          if (step < 3) setStep(step + 1)
          else {
            // předá degustaci do zápisu ochutnávky
            nav.replace('zapis', {
              ginId,
              dg: { tags: Object.keys(tags), intensity },
            })
            say('Skvěle. Teď hodnocení — a máš to celé.')
          }
        }}
      >
        {step < 3 ? 'Dál na ' + DG_STEPS[step + 1].n.toLowerCase() : 'Pokračovat k hodnocení · +25 XP'}
      </button>
      <span className="tiny" style={{ textAlign: 'center' }}>
        Nevíš, co cítíš? Klidně nevybírej nic — projít kroky má cenu samo o sobě.
      </span>
    </>
  )
}
