import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { DecodeHintType, BarcodeFormat } from '@zxing/library'
import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { findGinByBarcode } from '../lib/api'

const HINTS = new Map([
  [
    DecodeHintType.POSSIBLE_FORMATS,
    [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ],
  ],
])

// Skenování čárového kódu (EAN/UPC) kamerou telefonu.
export default function Sken() {
  const nav = useNav()
  const { say } = useStore()
  const d = useDerived()
  const videoRef = useRef(null)
  const controlsRef = useRef(null)

  const [phase, setPhase] = useState('scanning') // scanning | looking | result | error
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [barcode, setBarcode] = useState('')

  const stopCamera = () => {
    try {
      controlsRef.current?.stop()
    } catch {
      /* už zastaveno */
    }
    controlsRef.current = null
  }

  const lookup = async (code) => {
    setBarcode(code)
    setPhase('looking')
    stopCamera()
    try {
      const r = await findGinByBarcode(code)
      // gin z katalogu může být uživatelský přidaný lokálně
      if (r.source === 'catalog') {
        setResult(r)
      } else if (r.source === 'off') {
        setResult(r)
      } else {
        // zkus lokálně přidané giny s tímhle kódem (offline režim)
        const local = d.allGins.find((g) => g.barcode === code)
        setResult(local ? { source: 'catalog', gin: local } : r)
      }
      setPhase('result')
    } catch (e) {
      setError(e.message || 'Vyhledávání selhalo.')
      setPhase('result')
      setResult({ source: 'none', barcode: code })
    }
  }

  const startCamera = async () => {
    setPhase('scanning')
    setError('')
    setResult(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Tento prohlížeč nepodporuje kameru. Zkus Chrome nebo Safari přes HTTPS.')
      setPhase('error')
      return
    }
    try {
      const reader = new BrowserMultiFormatReader(HINTS)
      controlsRef.current = await reader.decodeFromConstraints(
        { video: { facingMode: { ideal: 'environment' } } },
        videoRef.current,
        (res) => {
          if (res) lookup(res.getText())
        }
      )
    } catch (e) {
      const msg =
        e?.name === 'NotAllowedError'
          ? 'Přístup ke kameře byl odmítnut. Povol kameru v nastavení prohlížeče a zkus to znovu.'
          : e?.name === 'NotFoundError'
            ? 'Nenašel jsem kameru.'
            : 'Kameru se nepodařilo spustit. Na iPhonu je potřeba HTTPS a Safari.'
      setError(msg)
      setPhase('error')
    }
  }

  useEffect(() => {
    startCamera()
    return stopCamera
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="row between">
        <button className="backlink" onClick={() => { stopCamera(); nav.pop() }}>
          ‹ Zpět
        </button>
        <span className="overline">Sken etikety</span>
      </div>

      {(phase === 'scanning' || phase === 'looking') && (
        <div className="col" style={{ gap: 12 }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3 / 4',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#000',
            }}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '22% 12%',
                border: '2px solid rgba(255,255,255,.9)',
                borderRadius: 12,
                boxShadow: '0 0 0 2000px rgba(0,0,0,.25)',
              }}
            />
          </div>
          <span className="sub" style={{ textAlign: 'center' }}>
            {phase === 'looking'
              ? `Hledám kód ${barcode}…`
              : 'Namiř kameru na čárový kód na lahvi.'}
          </span>
        </div>
      )}

      {phase === 'error' && (
        <div className="card" style={{ gap: 10 }}>
          <span style={{ fontWeight: 600 }}>Kamera nejede</span>
          <span className="sub">{error}</span>
          <button className="btn" onClick={startCamera}>Zkusit znovu</button>
          <button className="backlink" onClick={() => nav.push('zapis')}>
            …nebo zapiš gin ručně
          </button>
        </div>
      )}

      {phase === 'result' && result && (
        <ScanResult
          result={result}
          barcode={barcode}
          onAgain={startCamera}
          onOpen={(id) => nav.replace('lahev', { ginId: id })}
          onWrite={(id) => nav.replace('zapis', { ginId: id })}
          onAdd={(prefill) => nav.replace('zapis', { addNew: true, prefillName: prefill, barcode })}
          say={say}
        />
      )}
    </>
  )
}

function ScanResult({ result, barcode, onAgain, onOpen, onWrite, onAdd }) {
  if (result.source === 'catalog') {
    const g = result.gin
    return (
      <div className="card" style={{ gap: 12 }}>
        <span className="overline">Nalezeno v katalogu</span>
        <div>
          <div className="h2">{g.name}</div>
          <span className="tiny">
            {[g.distillery, g.country].filter(Boolean).join(' · ')}
          </span>
        </div>
        <button className="btn" onClick={() => onWrite(g.id)}>Zapsat ochutnávku</button>
        <button className="btn ghost" onClick={() => onOpen(g.id)}>Otevřít detail</button>
        <button className="backlink" onClick={onAgain}>Skenovat další</button>
      </div>
    )
  }

  if (result.source === 'off') {
    const s = result.suggestion
    return (
      <div className="card" style={{ gap: 12 }}>
        <span className="overline">Návrh z Open Food Facts</span>
        <div>
          <div className="h2">{s.name}</div>
          {s.distillery && <span className="tiny">{s.distillery}</span>}
        </div>
        <span className="sub">
          Tenhle gin ještě není v Ginlore. Přidej ho — po přihlášení půjde ke schválení do sdílené databáze.
        </span>
        <button className="btn" onClick={() => onAdd(s.name)}>Přidat tento gin</button>
        <button className="backlink" onClick={onAgain}>Skenovat další</button>
      </div>
    )
  }

  return (
    <div className="card" style={{ gap: 12 }}>
      <span className="overline">Kód nenalezen</span>
      <span className="sub">
        Kód <strong>{barcode}</strong> jsme nenašli v katalogu ani v Open Food Facts.
        Přidej gin ručně — kód se k němu rovnou přiřadí.
      </span>
      <button className="btn" onClick={() => onAdd('')}>Přidat gin ručně</button>
      <button className="backlink" onClick={onAgain}>Skenovat další</button>
    </div>
  )
}
