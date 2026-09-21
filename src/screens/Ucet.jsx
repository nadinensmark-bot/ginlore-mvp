import { useState } from 'react'
import { useNav } from '../nav'
import { useStore } from '../state'

// Účet: přihlášení / registrace + stav synchronizace.
export default function Ucet() {
  const nav = useNav()
  const { backendEnabled, user, admin, sync, signIn, signUp } = useStore()

  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')

  const submit = async () => {
    setErr('')
    setInfo('')
    if (!email.trim() || password.length < 6) {
      setErr('Vyplň e-mail a heslo (aspoň 6 znaků).')
      return
    }
    setBusy(true)
    try {
      if (mode === 'signup') {
        const res = await signUp(email.trim(), password)
        if (!res?.session) {
          setInfo('Účet vytvořen. Pokud je zapnuté potvrzení e-mailu, klikni na odkaz v mailu a pak se přihlas.')
          setMode('signin')
        }
      } else {
        await signIn(email.trim(), password)
      }
    } catch (e) {
      setErr(prettyErr(e.message))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="row between">
        <button className="backlink" onClick={nav.pop}>‹ Zpět</button>
        <span className="overline">Účet</span>
      </div>

      {!backendEnabled ? (
        <div className="card">
          <span className="sub">Synchronizace není v této verzi nakonfigurovaná — data zůstávají jen v tomto zařízení.</span>
        </div>
      ) : user ? (
        <LoggedIn />
      ) : (
        <div className="card" style={{ gap: 12 }}>
          <div>
            <div className="h2">{mode === 'signup' ? 'Vytvořit účet' : 'Přihlásit se'}</div>
            <span className="tiny">Ulož si ochutnávky, bar a postup do cloudu — přežijí i na jiném telefonu.</span>
          </div>

          <input
            className="input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder="Heslo (aspoň 6 znaků)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />

          {err && <span className="tiny" style={{ color: '#a3472e' }}>{err}</span>}
          {info && <span className="tiny" style={{ color: 'var(--accent)' }}>{info}</span>}

          <button className={'btn' + (busy ? ' disabled' : '')} onClick={submit} disabled={busy}>
            {busy ? '…' : mode === 'signup' ? 'Vytvořit účet' : 'Přihlásit se'}
          </button>

          <button
            className="backlink"
            style={{ textAlign: 'center' }}
            onClick={() => {
              setErr('')
              setInfo('')
              setMode(mode === 'signup' ? 'signin' : 'signup')
            }}
          >
            {mode === 'signup' ? 'Už mám účet — přihlásit se' : 'Nemám účet — vytvořit'}
          </button>

          {sync.status === 'error' && (
            <span className="tiny" style={{ color: '#a3472e' }}>Sync: {sync.error}</span>
          )}
        </div>
      )}
    </>
  )
}

function LoggedIn() {
  const { user, admin, sync, signOut } = useStore()
  const nav = useNav()
  const label =
    sync.status === 'syncing' ? 'Synchronizuji…'
    : sync.status === 'error' ? `Chyba syncu: ${sync.error}`
    : 'Uloženo v cloudu ✓'

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="card" style={{ gap: 6 }}>
        <span className="overline">Přihlášen{admin ? ' · admin' : ''}</span>
        <span style={{ fontWeight: 600 }}>{user.email}</span>
        <span className="tiny" style={{ color: sync.status === 'error' ? '#a3472e' : 'var(--accent)' }}>{label}</span>
      </div>

      {admin && (
        <button className="card" style={{ flexDirection: 'row', alignItems: 'center' }} onClick={() => nav.push('moderace')}>
          <span style={{ flex: 1, fontWeight: 600 }}>Moderace ginů</span>
          <span className="tiny">schvalování ›</span>
        </button>
      )}

      <button className="btn ghost" onClick={signOut}>Odhlásit se</button>
    </div>
  )
}

function prettyErr(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'Špatný e-mail nebo heslo.'
  if (m.includes('already registered')) return 'Tenhle e-mail už je registrovaný — přihlas se.'
  if (m.includes('email') && m.includes('confirm')) return 'Potvrď e-mail odkazem v mailu, pak se přihlas.'
  return msg || 'Něco se nepovedlo, zkus to znovu.'
}
