import { useState } from 'react'
import { useStore } from '../state'

export default function Onboarding() {
  const { startFresh, startDemo } = useStore()
  const [name, setName] = useState('')
  const [ageOk, setAgeOk] = useState(false)

  return (
    <div className="screen no-tabs" style={{ justifyContent: 'center', gap: 22, paddingBottom: 60 }}>
      <div className="col" style={{ alignItems: 'center', gap: 10, textAlign: 'center' }}>
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="76" height="76" style={{ borderRadius: 20 }} />
        <span className="brand" style={{ fontSize: 44 }}>
          ginlore
        </span>
        <p className="sub" style={{ maxWidth: 280 }}>
          Deník a škola ginu. Zapisuj, co piješ, a nauč se, co vlastně chutnáš — tři minuty denně.
        </p>
      </div>

      <div className="card" style={{ gap: 12 }}>
        <label className="col" style={{ gap: 6 }}>
          <span className="overline">Jak ti máme říkat?</span>
          <input
            className="input"
            placeholder="Jméno nebo přezdívka"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <button
          className="row"
          style={{ alignItems: 'flex-start', gap: 10 }}
          onClick={() => setAgeOk(!ageOk)}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              flexShrink: 0,
              background: ageOk ? 'var(--accent)' : 'var(--card)',
              boxShadow: 'inset 0 0 0 1.5px ' + (ageOk ? 'var(--accent)' : 'var(--line)'),
              color: 'var(--accent-ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
            }}
          >
            {ageOk ? '✓' : ''}
          </span>
          <span className="sub" style={{ fontSize: 13 }}>
            Je mi 18 a víc let. Ginlore je o vzdělávání a zodpovědném pití.
          </span>
        </button>
      </div>

      <div className="col" style={{ gap: 10 }}>
        <button
          className={'btn' + (ageOk && name.trim() ? '' : ' disabled')}
          onClick={() => startFresh(name.trim())}
        >
          Začít od začátku
        </button>
        <button
          className={'btn secondary' + (ageOk && name.trim() ? '' : ' disabled')}
          onClick={() => startDemo(name.trim())}
        >
          Prohlédnout s ukázkovými daty
        </button>
        <span className="tiny" style={{ textAlign: 'center' }}>
          Ukázková data naplní bar a pár lekcí, ať vidíš, jak appka žije. Kdykoli se dají smazat v profilu.
        </span>
      </div>
    </div>
  )
}
