import { useState } from 'react'
import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { STYLES, STYLE_KEYS } from '../data/styles'
import { SERVES, QUICK_TAGS } from '../data/cards'
import { JuniperRating, Chip } from '../components'

// Zápis ochutnávky — cíl: pod 20 sekund (viz research: tření při zápisu je killer).
export default function Zapis({ params }) {
  const nav = useNav()
  const { s, addTasting, addUserGin, setBarStatus } = useStore()
  const d = useDerived()

  const [ginId, setGinId] = useState(params.ginId || null)
  const [q, setQ] = useState(params.prefillName || '')
  const [addNew, setAddNew] = useState(!!params.addNew)
  const [rating, setRating] = useState(3.5)
  const [serve, setServe] = useState('G&T')
  const [tags, setTags] = useState({})
  const [note, setNote] = useState('')
  const [markHome, setMarkHome] = useState(false)
  // nový gin
  const [ng, setNg] = useState({ name: params.prefillName || '', distillery: '', country: 'Česko', style: 'new-western', abv: 42 })

  const gin = ginId ? d.allGins.find((g) => g.id === ginId) : null
  const dg = params.dg || null

  const toggleTag = (t) =>
    setTags((m) => {
      const n = { ...m }
      if (n[t]) delete n[t]
      else n[t] = 1
      return n
    })

  const save = () => {
    addTasting({
      ginId,
      rating,
      serve,
      tags: Object.keys(tags),
      note: note.trim(),
      dg,
    })
    if (markHome) setBarStatus(ginId, 'doma')
    nav.pop()
  }

  // ── krok 1: výběr ginu ──
  if (!ginId) {
    const query = q.trim().toLowerCase()
    const results = query
      ? d.allGins.filter((g) => (g.name + ' ' + g.distillery).toLowerCase().includes(query))
      : d.allGins.slice(0, 8)

    if (addNew) {
      return (
        <>
          <div className="row between">
            <button className="backlink" onClick={() => setAddNew(false)}>
              ‹ Hledat
            </button>
            <button className="backlink" onClick={nav.pop}>
              ✕
            </button>
          </div>
          <h1 className="h1">Přidat gin</h1>
          <p className="sub">
            Tvůj gin v databázi chybí? Přidej ho — projde moderací, ale zapisovat můžeš hned. Přesně
            takhle databáze roste.
          </p>
          <input
            className="input"
            placeholder="Název ginu *"
            value={ng.name}
            onChange={(e) => setNg({ ...ng, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Palírna"
            value={ng.distillery}
            onChange={(e) => setNg({ ...ng, distillery: e.target.value })}
          />
          <div className="grid2">
            <input
              className="input"
              placeholder="Země"
              value={ng.country}
              onChange={(e) => setNg({ ...ng, country: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="% alk."
              value={ng.abv}
              onChange={(e) => setNg({ ...ng, abv: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <select
            className="input"
            value={ng.style}
            onChange={(e) => setNg({ ...ng, style: e.target.value })}
          >
            {STYLE_KEYS.map((k) => (
              <option key={k} value={k}>
                {STYLES[k].n}
              </option>
            ))}
          </select>
          <div style={{ flex: 1 }} />
          <button
            className={'btn' + (ng.name.trim() ? '' : ' disabled')}
            onClick={() => {
              const id = addUserGin({ ...ng, name: ng.name.trim(), botanicals: ['jalovec'] })
              setGinId(id)
            }}
          >
            Přidat a pokračovat
          </button>
        </>
      )
    }

    return (
      <>
        <div className="row between">
          <button className="backlink" onClick={nav.pop}>
            ✕ Zrušit
          </button>
        </div>
        <h1 className="h1">Nová ochutnávka</h1>
        <div className="searchbar">
          <span>🔍</span>
          <input
            autoFocus
            placeholder="Který gin piješ?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {results.map((g) => (
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
              </span>
            </div>
            <span style={{ color: 'var(--accent)' }}>›</span>
          </button>
        ))}
        <button className="card tinted" onClick={() => setAddNew(true)}>
          <span className="h2" style={{ color: 'var(--accent)', fontSize: 14.5 }}>
            + Můj gin tady není — přidat do databáze
          </span>
        </button>
      </>
    )
  }

  // ── krok 2: hodnocení ──
  return (
    <>
      <div className="row between">
        <button className="backlink" onClick={nav.pop}>
          ✕ Zrušit
        </button>
        <span className="overline">Nová ochutnávka</span>
      </div>

      <div className="card soft" style={{ flexDirection: 'row', alignItems: 'center' }}>
        <div className="col" style={{ flex: 1 }}>
          <span style={{ fontWeight: 600 }}>{gin.name}</span>
          <span className="tiny">
            {gin.country} · {String(gin.abv).replace('.', ',')} %
          </span>
        </div>
        <button className="backlink" onClick={() => setGinId(null)}>
          Změnit
        </button>
      </div>

      {dg && (
        <div className="card tinted" style={{ gap: 4 }}>
          <span className="overline" style={{ color: 'var(--accent)' }}>
            Z degustace · +25 XP
          </span>
          <span className="tiny">
            {dg.tags.length ? dg.tags.join(' · ') : 'bez tagů'} · intenzita {dg.intensity} %
          </span>
        </div>
      )}

      <span className="overline">Hodnocení</span>
      <JuniperRating value={rating} onChange={setRating} />
      <span className="tiny">
        Větvičky jalovce místo hvězdiček — po půlkách, 1 až 5. V databázi se zobrazuje medián, ne
        průměr — a až od pěti hodnocení.
      </span>

      <div className="col" style={{ gap: 7 }}>
        <span className="overline">Jak piješ · nepovinné</span>
        <div className="chiprow">
          {SERVES.map((sv) => (
            <Chip key={sv} on={serve === sv} onClick={() => setServe(sv)}>
              {sv}
            </Chip>
          ))}
        </div>
      </div>

      <div className="col" style={{ gap: 7 }}>
        <span className="overline">Rychlé tagy</span>
        <div className="chiprow">
          {QUICK_TAGS.map((t) => (
            <Chip key={t} on={!!tags[t]} onClick={() => toggleTag(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <textarea
        className="input"
        rows="2"
        placeholder="Poznámka vlastními slovy… (nepovinné)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ resize: 'none' }}
      />

      {s.bar[ginId]?.status !== 'doma' && (
        <Chip on={markHome} onClick={() => setMarkHome(!markHome)}>
          {markHome ? '✓ ' : ''}Lahev mám doma — přidat do baru
        </Chip>
      )}

      {!dg && (
        <button
          className="card"
          onClick={() => nav.replace('degustace', { ginId })}
          style={{ borderStyle: 'dashed' }}
        >
          <span className="h2" style={{ fontSize: 14 }}>
            Chceš to vzít do hloubky?
          </span>
          <span className="tiny">
            Průvodce degustací tě povede čtyřmi kroky. Zabere 3 minuty a dá ti +25 XP.
          </span>
        </button>
      )}

      <div style={{ flex: 1 }} />
      <button className="btn" onClick={save}>
        Zapsat · +{10 + (dg ? 25 : 0)} XP
      </button>
      <span className="tiny" style={{ textAlign: 'center' }}>
        Zapsat se dá i jedním ťuknutím a doplnit později.
      </span>
    </>
  )
}
