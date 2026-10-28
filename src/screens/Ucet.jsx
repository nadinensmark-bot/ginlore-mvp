import { useState } from 'react'
import { useNav } from '../nav'
import { useStore } from '../state'

// Účet: přihlášení / registrace + stav synchronizace.
export default function Ucet() {
  const nav = useNav()
  const { backendEnabled, user, sync, signIn, signUp, recovery, resetPassword } = useStore()

  const [mode, setMode] = useState('signin') // signin | signup | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')

  const submit = async () => {
    setErr('')
    setInfo('')
    if (mode === 'reset') {
      if (!email.trim()) {
        setErr('Vyplň e-mail.')
        return
      }
      setBusy(true)
      try {
        await resetPassword(email.trim())
        setInfo('Poslali jsme ti odkaz na změnu hesla. Otevři ho na tomhle zařízení.')
      } catch (e) {
        setErr(prettyErr(e.message))
      } finally {
        setBusy(false)
      }
      return
    }
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
      ) : recovery ? (
        <NewPasswordForm />
      ) : user ? (
        <LoggedIn />
      ) : (
        <div className="card" style={{ gap: 12 }}>
          <div>
            <div className="h2">
              {mode === 'signup' ? 'Vytvořit účet' : mode === 'reset' ? 'Reset hesla' : 'Přihlásit se'}
            </div>
            <span className="tiny">
              {mode === 'reset'
                ? 'Pošleme ti e-mailem odkaz na nastavení nového hesla.'
                : 'Ulož si ochutnávky, bar a postup do cloudu — přežijí i na jiném telefonu.'}
            </span>
          </div>

          <input
            className="input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && mode === 'reset' && submit()}
          />
          {mode !== 'reset' && (
            <input
              className="input"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder="Heslo (aspoň 6 znaků)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          )}

          {err && <span className="tiny" style={{ color: '#a3472e' }}>{err}</span>}
          {info && <span className="tiny" style={{ color: 'var(--accent)' }}>{info}</span>}

          <button className={'btn' + (busy ? ' disabled' : '')} onClick={submit} disabled={busy}>
            {busy ? '…' : mode === 'signup' ? 'Vytvořit účet' : mode === 'reset' ? 'Poslat odkaz' : 'Přihlásit se'}
          </button>

          {mode === 'signin' && (
            <button
              className="backlink"
              style={{ textAlign: 'center' }}
              onClick={() => {
                setErr('')
                setInfo('')
                setMode('reset')
              }}
            >
              Zapomenuté heslo?
            </button>
          )}

          <button
            className="backlink"
            style={{ textAlign: 'center' }}
            onClick={() => {
              setErr('')
              setInfo('')
              setMode(mode === 'signin' ? 'signup' : 'signin')
            }}
          >
            {mode === 'signin' ? 'Nemám účet — vytvořit' : 'Zpět na přihlášení'}
          </button>

          {sync.status === 'error' && (
            <span className="tiny" style={{ color: '#a3472e' }}>Sync: {sync.error}</span>
          )}
        </div>
      )}
    </>
  )
}

function NewPasswordForm() {
  const { updatePassword } = useStore()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const save = async () => {
    setErr('')
    if (password.length < 6) {
      setErr('Heslo musí mít aspoň 6 znaků.')
      return
    }
    setBusy(true)
    try {
      await updatePassword(password)
    } catch (e) {
      setErr(prettyErr(e.message))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card" style={{ gap: 12 }}>
      <div>
        <div className="h2">Nastav nové heslo</div>
        <span className="tiny">Přišel/a jsi přes odkaz na reset hesla.</span>
      </div>
      <input
        className="input"
        type="password"
        autoComplete="new-password"
        placeholder="Nové heslo (aspoň 6 znaků)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && save()}
      />
      {err && <span className="tiny" style={{ color: '#a3472e' }}>{err}</span>}
      <button className={'btn' + (busy ? ' disabled' : '')} onClick={save} disabled={busy}>
        {busy ? '…' : 'Uložit heslo'}
      </button>
    </div>
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
