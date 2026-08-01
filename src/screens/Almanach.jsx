import { useState } from 'react'
import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { BOTANICALS, BOTANICALS_TOTAL_TARGET } from '../data/botanicals'
import { STYLES } from '../data/styles'
import { BackBar, Chip } from '../components'

export default function Almanach() {
  const nav = useNav()
  const { s } = useStore()
  const d = useDerived()
  const [tab, setTab] = useState('botanicals')
  const [q, setQ] = useState('')

  const query = q.trim().toLowerCase()
  const botList = Object.entries(BOTANICALS).filter(
    ([, b]) => !query || (b.n + ' ' + b.short + ' ' + b.role).toLowerCase().includes(query)
  )

  return (
    <>
      <BackBar label="Učení" />
      <h1 className="h1">Almanach</h1>

      <div className="row" style={{ gap: 8 }}>
        <Chip on={tab === 'botanicals'} onClick={() => setTab('botanicals')}>
          Botanicals
        </Chip>
        <Chip on={tab === 'styly'} onClick={() => setTab('styly')}>
          Styly
        </Chip>
      </div>

      {tab === 'botanicals' && (
        <>
          <div className="searchbar">
            <span>🔍</span>
            <input placeholder="Hledat botanical…" value={q} onChange={(e) => setQ(e.target.value)} />
            {q && (
              <button onClick={() => setQ('')} style={{ color: 'var(--muted)' }}>
                ✕
              </button>
            )}
          </div>
          <span className="tiny">
            {botList.length} z {BOTANICALS_TOTAL_TARGET} botanicals ·{' '}
            {Object.keys(s.botsRead).length} už máš přečtených
          </span>

          {botList.map(([key, b]) => (
            <button
              key={key}
              className="card"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              onClick={() => nav.push('botanical', { botKey: key })}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: 'var(--accent-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                🌿
              </div>
              <div className="col" style={{ flex: 1 }}>
                <div className="row" style={{ gap: 7 }}>
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{b.n}</span>
                  {s.botsRead[key] && <span style={{ color: 'var(--accent)', fontSize: 12 }}>✓</span>}
                </div>
                <span className="tiny">{b.short}</span>
              </div>
              <span className="pill" style={{ fontSize: 11 }}>
                {b.role}
              </span>
            </button>
          ))}

          {!botList.length && (
            <div className="card soft">
              <span className="h2">Nic jsme nenašli</span>
              <span className="sub">
                Chybí ti tam něco? Napiš nám to — botanicals doplňujeme podle vás.
              </span>
            </div>
          )}
        </>
      )}

      {tab === 'styly' &&
        Object.entries(STYLES).map(([key, st]) => (
          <div key={key} className="card">
            <div className="row between">
              <span style={{ fontWeight: 600, fontSize: 15 }}>{st.n}</span>
              {d.stylesTasted.includes(key) && (
                <span className="pill" style={{ color: 'var(--accent)', fontSize: 11 }}>
                  ochutnáno ✓
                </span>
              )}
            </div>
            <span className="sub">{st.text}</span>
          </div>
        ))}
    </>
  )
}
