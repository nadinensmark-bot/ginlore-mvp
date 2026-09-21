import { useEffect, useState } from 'react'
import { useNav } from '../nav'
import { useStore } from '../state'
import { fetchPendingGins, moderateGin } from '../lib/api'

// Moderace: admin schvaluje/zamítá uživatelské návrhy ginů.
export default function Moderace() {
  const nav = useNav()
  const { admin, say } = useStore()
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState('')

  const load = () => {
    setErr('')
    fetchPendingGins()
      .then(setRows)
      .catch((e) => setErr(e.message))
  }
  useEffect(() => {
    if (admin) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin])

  const decide = async (id, status) => {
    setBusy(id)
    try {
      await moderateGin(id, status)
      setRows((r) => r.filter((g) => g.id !== id))
      say(status === 'approved' ? 'Schváleno ✓' : 'Zamítnuto')
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <>
      <div className="row between">
        <button className="backlink" onClick={nav.pop}>‹ Zpět</button>
        <span className="overline">Moderace</span>
      </div>

      {!admin ? (
        <div className="card"><span className="sub">Tahle sekce je jen pro adminy.</span></div>
      ) : err ? (
        <div className="card" style={{ gap: 10 }}>
          <span className="tiny" style={{ color: '#a3472e' }}>{err}</span>
          <button className="btn ghost" onClick={load}>Zkusit znovu</button>
        </div>
      ) : rows === null ? (
        <div className="card"><span className="sub">Načítám…</span></div>
      ) : rows.length === 0 ? (
        <div className="card"><span className="sub">Žádné giny ke schválení. 🎉</span></div>
      ) : (
        rows.map((g) => (
          <div key={g.id} className="card" style={{ gap: 10 }}>
            <div>
              <div className="h2">{g.name}</div>
              <span className="tiny">
                {[g.distillery, g.country, g.style].filter(Boolean).join(' · ')}
                {g.abv ? ` · ${g.abv} %` : ''}
              </span>
            </div>
            {g.description && <span className="sub">{g.description}</span>}
            <div className="row" style={{ gap: 8 }}>
              <button className={'btn' + (busy === g.id ? ' disabled' : '')} style={{ flex: 1 }} onClick={() => decide(g.id, 'approved')}>
                Schválit
              </button>
              <button className={'btn ghost' + (busy === g.id ? ' disabled' : '')} style={{ flex: 1 }} onClick={() => decide(g.id, 'rejected')}>
                Zamítnout
              </button>
            </div>
          </div>
        ))
      )}
    </>
  )
}
