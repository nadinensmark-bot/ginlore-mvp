import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { GINS, ginById } from './data/gins'
import { BOTANICALS } from './data/botanicals'
import { STYLE_KEYS } from './data/styles'
import { ALL_LESSONS, CHAPTERS } from './data/lessons'
import { LEVELS } from './data/cards'

const KEY = 'ginlore-mvp-v2' // v2: hodnocení 1–5 větviček

export function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`
}

const EMPTY = {
  onboarded: false,
  profile: { name: '' },
  xp: 0,
  streak: { count: 0, lastDate: null },
  tastings: [], // {id, ginId, rating, serve, tags, note, date, dg}
  bar: {}, // ginId -> {status: 'doma'|'chci'|null, stock}
  userGins: [], // vlastní přidané giny (pending moderace)
  lessonsDone: {}, // lessonId -> true
  quizRight: {}, // lessonId -> true
  botsRead: {}, // botKey -> true
  cardsRead: {}, // cardId -> date
}

function demoData(name) {
  const d = (offset) => {
    const dt = new Date(Date.now() - offset * 86400000)
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(
      dt.getDate()
    ).padStart(2, '0')}`
  }
  return {
    ...EMPTY,
    onboarded: true,
    profile: { name },
    xp: 340,
    streak: { count: 12, lastDate: todayStr() },
    tastings: [
      { id: 't1', ginId: 'zufanek-omg', rating: 4.4, serve: 'G&T', tags: ['citrusový', 'kořeněný'], note: 'Kubebový dozvuk je znát. S Kinley a pomerančem paráda.', date: d(1), dg: { tags: ['jalovec', 'citronová kůra', 'kardamom'], intensity: 72 } },
      { id: 't2', ginId: 'beefeater', rating: 4.0, serve: 'Martini', tags: ['jalovcový', 'suchý'], note: '', date: d(4), dg: null },
      { id: 't3', ginId: 'tosh-dry', rating: 4.1, serve: 'G&T', tags: ['jalovcový', 'citrusový'], note: 'Čistý, učebnicový London Dry.', date: d(9), dg: null },
      { id: 't4', ginId: 'hendricks', rating: 4.0, serve: 'G&T', tags: ['květinový'], note: 'S okurkou, klasika.', date: d(15), dg: null },
      { id: 't5', ginId: 'monkey47', rating: 4.5, serve: 'čistý', tags: ['kořeněný', 'květinový'], note: 'Chová se to jako parfém. Vrstvy a vrstvy.', date: d(20), dg: { tags: ['jalovec', 'kardamom', 'fialka'], intensity: 85 } },
      { id: 't6', ginId: 'endorphin-baltic', rating: 4.1, serve: 'G&T', tags: ['citrusový'], note: 'Slaná stopa, zajímavé.', date: d(30), dg: null },
      { id: 't7', ginId: 'bombay-sapphire', rating: 3.6, serve: 'G&T', tags: ['citrusový', 'suchý'], note: '', date: d(45), dg: null },
      { id: 't8', ginId: 'sipsmith', rating: 4.3, serve: 'čistý', tags: ['jalovcový', 'suchý'], note: 'Ginfest Praha.', date: d(60), dg: null },
    ],
    bar: {
      'zufanek-omg': { status: 'doma', stock: 'plná' },
      beefeater: { status: 'doma', stock: 'dochází' },
      'tosh-dry': { status: 'doma', stock: 'půl' },
      hendricks: { status: 'doma', stock: 'prázdná' },
      'haymans-old-tom': { status: 'chci' },
      'plymouth-navy': { status: 'chci' },
      'bols-genever': { status: 'chci' },
      'little-urban': { status: 'chci' },
    },
    lessonsDone: {
      'gin-je-gin': true,
      jalovec: true,
      procenta: true,
      destilace: true,
      'london-dry': true,
      'bot-jalovec': true,
      'bot-koriandr': true,
      'bot-andelika': true,
      'ctyri-kroky': true,
      aroma: true,
      'chut-mapa': true,
    },
    quizRight: { 'gin-je-gin': true, jalovec: true, 'london-dry': true, 'bot-jalovec': true, 'ctyri-kroky': true },
    botsRead: { jalovec: true, koriandr: true, andelika: true, kubeba: true },
    cardsRead: {},
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...EMPTY, ...JSON.parse(raw) }
  } catch (e) {
    console.warn('ginlore: nelze načíst uložená data', e)
  }
  return EMPTY
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [s, setS] = useState(load)
  const [toast, setToastMsg] = useState('')
  const toastTimer = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch (e) {
      console.warn('ginlore: nelze uložit data', e)
    }
  }, [s])

  const say = (msg) => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2400)
  }

  // streak: každá XP akce v nový den prodlouží sérii
  const touchStreak = (st) => {
    const today = todayStr()
    if (st.streak.lastDate === today) return st.streak
    const yest = new Date(Date.now() - 86400000)
    const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(
      yest.getDate()
    ).padStart(2, '0')}`
    return {
      count: st.streak.lastDate === yestStr ? st.streak.count + 1 : 1,
      lastDate: today,
    }
  }

  const award = (n, msg) => {
    setS((st) => ({ ...st, xp: st.xp + n, streak: touchStreak(st) }))
    if (msg) say(msg)
  }

  const api = {
    s,
    toast,
    say,
    award,

    startFresh(name) {
      setS({ ...EMPTY, onboarded: true, profile: { name } })
    },
    startDemo(name) {
      setS(demoData(name))
    },
    resetAll() {
      localStorage.removeItem(KEY)
      setS(EMPTY)
    },

    addTasting(t) {
      setS((st) => ({
        ...st,
        xp: st.xp + 10 + (t.dg ? 25 : 0),
        streak: touchStreak(st),
        tastings: [{ ...t, id: ':' + Date.now(), date: todayStr() }, ...st.tastings],
      }))
      say(t.dg ? 'Degustace uložena · +35 XP' : 'Zapsáno · +10 XP')
    },

    setBarStatus(ginId, status) {
      setS((st) => {
        const cur = st.bar[ginId] || {}
        const next = { ...st.bar }
        if (status === null) delete next[ginId]
        else next[ginId] = { ...cur, status, stock: status === 'doma' ? cur.stock || 'plná' : undefined }
        return { ...st, bar: next }
      })
    },

    setStock(ginId, stock) {
      setS((st) => ({
        ...st,
        bar: { ...st.bar, [ginId]: { ...(st.bar[ginId] || { status: 'doma' }), stock } },
      }))
    },

    addUserGin(g) {
      const id = 'user-' + Date.now()
      setS((st) => ({ ...st, userGins: [...st.userGins, { ...g, id, pending: true }] }))
      say('Gin přidán — čeká na moderaci, ale můžeš ho hned zapisovat.')
      return id
    },

    completeLesson(lessonId, quizWasRight) {
      setS((st) => ({
        ...st,
        xp:
          st.xp +
          (st.lessonsDone[lessonId] ? 0 : 30) +
          (quizWasRight && !st.quizRight[lessonId] ? 20 : 0),
        streak: touchStreak(st),
        lessonsDone: { ...st.lessonsDone, [lessonId]: true },
        quizRight: quizWasRight ? { ...st.quizRight, [lessonId]: true } : st.quizRight,
      }))
    },

    markBotRead(botKey) {
      setS((st) => {
        if (st.botsRead[botKey]) return st
        return {
          ...st,
          xp: st.xp + 15,
          streak: touchStreak(st),
          botsRead: { ...st.botsRead, [botKey]: true },
        }
      })
    },

    markCardRead(cardId) {
      setS((st) => {
        if (st.cardsRead[cardId] === todayStr()) return st
        return {
          ...st,
          xp: st.xp + 10,
          streak: touchStreak(st),
          cardsRead: { ...st.cardsRead, [cardId]: todayStr() },
        }
      })
    },

    exportData() {
      const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ginlore-export-${todayStr()}.json`
      a.click()
      URL.revokeObjectURL(url)
      say('Data exportována jako JSON')
    },
  }

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useStore() {
  return useContext(Ctx)
}

// ── odvozené hodnoty ──

export function useDerived() {
  const { s } = useStore()
  return useMemo(() => {
    const allGins = [...GINS, ...s.userGins]
    const tastedIds = [...new Set(s.tastings.map((t) => t.ginId))]
    const tastedGins = tastedIds.map((id) => ginById(id, s.userGins)).filter(Boolean)

    const stylesTasted = [...new Set(tastedGins.map((g) => g.style).filter(Boolean))]
    const countriesTasted = [...new Set(tastedGins.map((g) => g.country).filter(Boolean))]
    const botsMet = new Set(Object.keys(s.botsRead))
    tastedGins.forEach((g) => (g.botanicals || []).forEach((b) => botsMet.add(b)))

    // úroveň
    let li = 0
    for (let k = 0; k < LEVELS.length; k++) if (s.xp >= LEVELS[k].min) li = k
    const next = LEVELS[Math.min(li + 1, LEVELS.length - 1)]
    const base = LEVELS[li].min
    const span = Math.max(1, next.min - base)
    const level = {
      i: li,
      no: li + 1,
      name: LEVELS[li].n,
      nextXp: next.min,
      nextGen: next.gen,
      pct: li === LEVELS.length - 1 ? 100 : Math.min(100, Math.round(((s.xp - base) / span) * 100)),
      missing: Math.max(0, next.min - s.xp),
    }

    // streak platí jen pokud poslední aktivita byla dnes nebo včera
    const today = todayStr()
    const yest = new Date(Date.now() - 86400000)
    const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(
      yest.getDate()
    ).padStart(2, '0')}`
    const streakAlive = s.streak.lastDate === today || s.streak.lastDate === yestStr
    const streak = streakAlive ? s.streak.count : 0

    // chuťový profil ze zápisů (osy: suchý↔sladký, jalovcový↔citrusový, jemný↔intenzivní)
    const tagCount = {}
    s.tastings.forEach((t) => (t.tags || []).forEach((tag) => (tagCount[tag] = (tagCount[tag] || 0) + 1)))
    const axis = (a, b) => {
      const ca = tagCount[a] || 0
      const cb = tagCount[b] || 0
      if (ca + cb === 0) return 50
      return Math.round((cb / (ca + cb)) * 100)
    }
    const dgInts = s.tastings.filter((t) => t.dg).map((t) => t.dg.intensity)
    const profile = {
      suchySladky: axis('suchý', 'sladký'),
      jalovcovyCitrusovy: axis('jalovcový', 'citrusový'),
      jemnyIntenzivni: dgInts.length
        ? Math.round(dgInts.reduce((a, x) => a + x, 0) / dgInts.length)
        : 50,
      topTags: Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([t]) => t),
    }

    // doporučení „% pro tebe" — shoda stylů a botanicals s tím, co uživatel hodnotí dobře
    const likedStyles = {}
    const likedBots = {}
    s.tastings
      .filter((t) => t.rating >= 3.5)
      .forEach((t) => {
        const g = ginById(t.ginId, s.userGins)
        if (!g) return
        likedStyles[g.style] = (likedStyles[g.style] || 0) + 1
        ;(g.botanicals || []).forEach((b) => (likedBots[b] = (likedBots[b] || 0) + 1))
      })
    const matchFor = (g) => {
      if (tastedIds.includes(g.id)) return null
      if (!s.tastings.length) return null
      let score = 50
      if (likedStyles[g.style]) score += Math.min(25, likedStyles[g.style] * 8)
      ;(g.botanicals || []).forEach((b) => {
        if (likedBots[b]) score += Math.min(6, likedBots[b] * 2)
      })
      return Math.min(97, score)
    }
    const recommendations = allGins
      .map((g) => ({ gin: g, match: matchFor(g) }))
      .filter((r) => r.match !== null)
      .sort((a, b) => b.match - a.match)
      .slice(0, 6)

    const missingStyles = STYLE_KEYS.filter((k) => !stylesTasted.includes(k))

    // lekce
    const doneCount = Object.keys(s.lessonsDone).length
    const chapterDone = (ch) => ch.lessons.length > 0 && ch.lessons.every((l) => s.lessonsDone[l.id])
    const chapterUnlocked = (ch) => {
      if (!ch.lockedBy) return true
      if (ch.lessons.length === 0) return false // obsah fáze 2
      if (ch.lockedBy.chapter) {
        const dep = CHAPTERS.find((c) => c.id === ch.lockedBy.chapter)
        return dep ? chapterDone(dep) : true
      }
      if (ch.lockedBy.level != null) return li >= ch.lockedBy.level
      return true
    }
    const nextLesson = ALL_LESSONS.find(
      (l) => !s.lessonsDone[l.id] && chapterUnlocked(CHAPTERS.find((c) => c.id === l.chapterId))
    )

    // odznaky
    const czTasted = tastedGins.filter((g) => g.country === 'Česko').length
    const ginTastingCount = {}
    s.tastings.forEach((t) => (ginTastingCount[t.ginId] = (ginTastingCount[t.ginId] || 0) + 1))
    const repeatTastings = Object.values(ginTastingCount).filter((c) => c >= 2).length
    const detailedNotes = s.tastings.filter((t) => (t.note || '').length >= 30).length
    const dgCount = s.tastings.filter((t) => t.dg).length
    const badges = {
      breadth: [
        { n: 'Sedm stylů', c: stylesTasted.length, max: 7 },
        { n: 'Deset zemí', c: countriesTasted.length, max: 10 },
        { n: 'Dvacet botanicals', c: Math.min(botsMet.size, 20), max: 20, gold: true },
        { n: 'Česká stopa', c: czTasted, max: 10 },
        { n: 'Navy', c: tastedGins.filter((g) => g.style === 'navy').length, max: 3 },
        { n: 'Genever', c: tastedGins.filter((g) => g.style === 'genever').length, max: 1 },
      ],
      depth: [
        { n: 'Podruhé jinak', d: 'stejný gin, druhá degustace', c: repeatTastings, max: 1 },
        { n: 'Vlastními slovy', d: '10 detailních notes', c: detailedNotes, max: 10 },
        { n: 'Čtyři kroky', d: '5 vedených degustací', c: dgCount, max: 5 },
        { n: 'Jalovcový základ', d: 'dokonči kapitolu 01', c: chapterDone(CHAPTERS[0]) ? 1 : 0, max: 1 },
        { n: 'Stylista', d: 'dokonči kapitolu Sedm stylů', c: chapterDone(CHAPTERS[1]) ? 1 : 0, max: 1 },
        { n: 'Herbář', d: 'přečti 8 botanicals v Almanachu', c: Object.keys(s.botsRead).length, max: 8 },
      ],
    }
    const badgeCount = [...badges.breadth, ...badges.depth].filter((b) => b.c >= b.max).length
    const badgeTotal = badges.breadth.length + badges.depth.length

    // komunitní hodnocení: seed + lokální zápisy dohromady (medián)
    const communityFor = (gin) => {
      const local = s.tastings.filter((t) => t.ginId === gin.id).map((t) => t.rating)
      const seed = gin.community
      const count = (seed?.count || 0) + local.length
      if (count < 5) return { count, median: null }
      // aproximace: seed medián váhově + lokální hodnoty
      if (!seed) {
        const sorted = [...local].sort((a, b) => a - b)
        return { count, median: sorted[Math.floor(sorted.length / 2)] }
      }
      if (!local.length) return { count, median: seed.median }
      const localAvg = local.reduce((a, x) => a + x, 0) / local.length
      const blended = (seed.median * seed.count + localAvg * local.length) / count
      return { count, median: Math.round(blended * 10) / 10 }
    }

    return {
      allGins,
      tastedIds,
      tastedGins,
      stylesTasted,
      countriesTasted,
      missingStyles,
      botsMet,
      level,
      streak,
      profile,
      recommendations,
      doneCount,
      nextLesson,
      chapterDone,
      chapterUnlocked,
      badges,
      badgeCount,
      badgeTotal,
      communityFor,
      ginTastingCount,
    }
  }, [s])
}
