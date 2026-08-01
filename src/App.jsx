import { NavProvider, useNav } from './nav'
import { useStore } from './state'
import Onboarding from './screens/Onboarding'
import Objevuj from './screens/Objevuj'
import Bar from './screens/Bar'
import Uceni from './screens/Uceni'
import Cesta from './screens/Cesta'
import Kapitola from './screens/Kapitola'
import Lekce from './screens/Lekce'
import Degustace from './screens/Degustace'
import Almanach from './screens/Almanach'
import Botanical from './screens/Botanical'
import Odznaky from './screens/Odznaky'
import Lahev from './screens/Lahev'
import Zapis from './screens/Zapis'
import Karta from './screens/Karta'
import Feed from './screens/Feed'
import Ja from './screens/Ja'

const SCREENS = {
  objevuj: Objevuj,
  bar: Bar,
  uceni: Uceni,
  cesta: Cesta,
  kapitola: Kapitola,
  lekce: Lekce,
  degustace: Degustace,
  almanach: Almanach,
  botanical: Botanical,
  odznaky: Odznaky,
  lahev: Lahev,
  zapis: Zapis,
  karta: Karta,
  feed: Feed,
  ja: Ja,
}

const NO_TABS = ['lekce', 'degustace', 'zapis']

const TABS = [
  { id: 'objevuj', ico: '🔍', label: 'Objevuj', owns: ['objevuj'] },
  { id: 'bar', ico: '🥃', label: 'Můj bar', owns: ['bar'] },
  { id: 'uceni', ico: '📖', label: 'Učení', owns: ['uceni', 'cesta', 'kapitola', 'almanach', 'botanical', 'odznaky', 'karta'] },
  { id: 'feed', ico: '👥', label: 'Feed', owns: ['feed'] },
  { id: 'ja', ico: '🌿', label: 'Já', owns: ['ja'] },
]

function Shell() {
  const nav = useNav()
  const { s, toast } = useStore()
  const cur = nav.cur

  if (!s.onboarded) {
    return (
      <div className="phone">
        <Onboarding />
        {toast && <div className="toast">{toast}</div>}
      </div>
    )
  }

  const Screen = SCREENS[cur.name] || Objevuj
  const showTabs = !NO_TABS.includes(cur.name)

  return (
    <div className="phone">
      <div className={'screen' + (showTabs ? '' : ' no-tabs')} key={nav.stack.length + cur.name}>
        <Screen params={cur.params} />
      </div>
      {showTabs && (
        <nav className="tabbar">
          {TABS.map((t) => {
            const on = t.owns.includes(cur.name) || (t.id === 'objevuj' && cur.name === 'lahev')
            return (
              <button key={t.id} className={'tab' + (on ? ' on' : '')} onClick={() => nav.tab(t.id)}>
                <span className="ico">{t.ico}</span>
                {t.label}
              </button>
            )
          })}
        </nav>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default function App() {
  return (
    <NavProvider>
      <Shell />
    </NavProvider>
  )
}
