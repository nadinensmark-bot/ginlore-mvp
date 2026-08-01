import { useNav } from '../nav'
import { useStore, useDerived } from '../state'
import { BOTANICALS_TOTAL_TARGET } from '../data/botanicals'

export default function Ja() {
  const nav = useNav()
  const { s, exportData, resetAll, say } = useStore()
  const d = useDerived()

  return (
    <>
      <div className="col" style={{ alignItems: 'center', gap: 6, paddingTop: 10 }}>
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: 999,
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--serif)',
            fontSize: 30,
            fontStyle: 'italic',
          }}
        >
          {(s.profile.name || 'G')[0].toUpperCase()}
        </div>
        <h1 className="h1" style={{ fontSize: 26 }}>
          {s.profile.name || 'Beze jména'}
        </h1>
        <span className="tiny">
          Úroveň {d.level.no} · {d.level.name}
        </span>
      </div>

      <div className="grid2">
        <Stat n={d.tastedGins.length} t="ochutnaných ginů" />
        <Stat n={d.countriesTasted.length} t="zemí původu" />
        <Stat n={`${d.botsMet.size} / ${BOTANICALS_TOTAL_TARGET}`} t="botanicals" />
        <Stat n={`${d.stylesTasted.length} / 7`} t="stylů" />
      </div>

      <div className="card" style={{ gap: 12 }}>
        <div className="row between">
          <span className="overline">Tvůj chuťový profil</span>
          <span className="tiny">z {s.tastings.length} hodnocení</span>
        </div>
        {s.tastings.length >= 2 ? (
          <>
            <Axis l="Suchý" r="Sladký" v={d.profile.suchySladky} />
            <Axis l="Jalovcový" r="Citrusový" v={d.profile.jalovcovyCitrusovy} />
            <Axis l="Jemný" r="Intenzivní" v={d.profile.jemnyIntenzivni} />
            {d.profile.topTags.length > 0 && (
              <span className="sub">
                Jdeš po{' '}
                {d.profile.topTags
                  .slice(0, 2)
                  .map((t) => t.replace(/ý$/, 'ých'))
                  .join(' a ')}{' '}
                ginech. Podle toho ti doporučujeme na Objevuj.
              </span>
            )}
          </>
        ) : (
          <span className="sub">
            Profil se začne kreslit po dvou zapsaných ochutnávkách s tagy.
          </span>
        )}
      </div>

      <button className="card" style={{ flexDirection: 'row', alignItems: 'center' }} onClick={() => nav.push('odznaky')}>
        <span style={{ flex: 1, fontWeight: 600 }}>Odznaky</span>
        <span className="tiny">
          {d.badgeCount} z {d.badgeTotal} ›
        </span>
      </button>

      <button
        className="card gold"
        onClick={() => say('Premium (129 Kč/měs) přijde ve fázi 3 — zatím je všechno zdarma.')}
      >
        <div className="row between">
          <span style={{ fontWeight: 600 }}>Ginlore Premium</span>
          <span className="tiny" style={{ color: 'var(--gold)', fontWeight: 600 }}>
            129 Kč / měs
          </span>
        </div>
        <span className="tiny">
          Plný doporučovací engine, hlídání cen, blind tasting. Fáze 3 — teď je všechno zdarma.
        </span>
      </button>

      <div className="card" style={{ gap: 0 }}>
        <SettingRow t="Export mých dat" s="zdarma, JSON" onClick={exportData} />
        <hr className="hr" />
        <SettingRow t="Jazyk" s="Čeština (EN přijde s fází 1 launch)" onClick={() => say('Angličtina je v plánu od prvního ostrého vydání.')} />
        <hr className="hr" />
        <SettingRow
          t="Smazat všechna data"
          s="začít úplně znovu"
          danger
          onClick={() => {
            if (confirm('Opravdu smazat všechna lokální data Ginlore?')) resetAll()
          }}
        />
      </div>

      <span className="tiny" style={{ textAlign: 'center' }}>
        Ginlore MVP · data zůstávají jen ve tvém prohlížeči
      </span>
    </>
  )
}

function Stat({ n, t }) {
  return (
    <div className="card" style={{ alignItems: 'center', gap: 3 }}>
      <span style={{ fontFamily: 'var(--serif)', fontSize: 27, fontWeight: 600, color: 'var(--accent)' }}>
        {n}
      </span>
      <span className="tiny" style={{ textAlign: 'center' }}>
        {t}
      </span>
    </div>
  )
}

function Axis({ l, r, v }) {
  return (
    <div className="col" style={{ gap: 5 }}>
      <div className="row between tiny">
        <span>{l}</span>
        <span>{r}</span>
      </div>
      <div className="progressbar" style={{ height: 8, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: `calc(${v}% - 7px)`,
            top: -3,
            width: 14,
            height: 14,
            borderRadius: 999,
            background: 'var(--accent)',
            border: '2.5px solid var(--bg)',
            boxShadow: '0 0 0 1px var(--line)',
          }}
        />
      </div>
    </div>
  )
}

function SettingRow({ t, s, onClick, danger }) {
  return (
    <button className="row between" style={{ padding: '11px 0' }} onClick={onClick}>
      <span style={{ fontWeight: 600, fontSize: 14, color: danger ? '#a3472e' : undefined }}>{t}</span>
      <span className="tiny">{s}</span>
    </button>
  )
}
