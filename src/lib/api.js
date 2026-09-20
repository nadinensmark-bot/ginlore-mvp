// Datová vrstva nad Supabase. Mapuje tvar stavu aplikace (viz state.jsx)
// na tabulky backendu a zpět. Když backend není nakonfigurovaný,
// funkce vrací bezpečné no-opy, takže aplikace jede dál lokálně.
import { supabase, isBackendEnabled } from './supabase'

const need = () => {
  if (!isBackendEnabled) throw new Error('Backend není nakonfigurovaný.')
  return supabase
}

// ── Merge lokálního a serverového stavu ──────────────────────
// Používá se při přihlášení, aby se nic neztratilo: sjednotí obojí,
// u XP/série bere vyšší/novější hodnotu. Výsledek je nadmnožina obou,
// takže následný pushState nic nesmaže.
export function mergeStates(local, server) {
  const byId = (arr) => {
    const m = new Map()
    for (const x of arr ?? []) m.set(x.id, x)
    return m
  }
  const tastings = byId(server.tastings)
  for (const t of local.tastings ?? []) if (!tastings.has(t.id)) tastings.set(t.id, t)

  const userGins = byId(server.userGins)
  for (const g of local.userGins ?? []) if (!userGins.has(g.id)) userGins.set(g.id, g)

  const mergeMap = (a, b) => ({ ...(a ?? {}), ...(b ?? {}) })

  const laterStreak = () => {
    const ls = local.streak ?? { count: 0, lastDate: null }
    const ss = server.streak ?? { count: 0, lastDate: null }
    if (!ss.lastDate) return ls
    if (!ls.lastDate) return ss
    return ss.lastDate >= ls.lastDate ? ss : ls
  }

  return {
    ...local,
    onboarded: true,
    profile: { name: server.profile?.name || local.profile?.name || '' },
    xp: Math.max(local.xp ?? 0, server.xp ?? 0),
    streak: laterStreak(),
    tastings: [...tastings.values()].sort((a, b) => (a.date < b.date ? 1 : -1)),
    bar: mergeMap(local.bar, server.bar),
    userGins: [...userGins.values()],
    lessonsDone: mergeMap(local.lessonsDone, server.lessonsDone),
    quizRight: mergeMap(local.quizRight, server.quizRight),
    botsRead: mergeMap(local.botsRead, server.botsRead),
    cardsRead: mergeMap(local.cardsRead, server.cardsRead),
  }
}

// ── Auth ─────────────────────────────────────────────────────
export async function signUp(email, password, name) {
  const sb = need()
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { name: name || '' } },
  })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const sb = need()
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  if (!isBackendEnabled) return
  await supabase.auth.signOut()
}

export async function getUser() {
  if (!isBackendEnabled) return null
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

export function onAuthChange(cb) {
  if (!isBackendEnabled) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session?.user ?? null))
  return () => data.subscription.unsubscribe()
}

export async function isAdmin() {
  if (!isBackendEnabled) return false
  const user = await getUser()
  if (!user) return false
  const { data } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
  return Boolean(data)
}

// ── Mapování řádek ↔ tvar stavu ──────────────────────────────
const tastingToRow = (t, userId) => ({
  id: t.id,
  user_id: userId,
  gin_id: t.ginId,
  rating: t.rating ?? null,
  serve: t.serve ?? null,
  tags: t.tags ?? [],
  note: t.note ?? null,
  tasted_on: t.date,
  dg: t.dg ?? null,
  is_public: Boolean(t.isPublic),
})

const rowToTasting = (r) => ({
  id: r.id,
  ginId: r.gin_id,
  rating: r.rating != null ? Number(r.rating) : null,
  serve: r.serve ?? undefined,
  tags: r.tags ?? [],
  note: r.note ?? '',
  date: r.tasted_on,
  dg: r.dg ?? null,
  isPublic: r.is_public,
})

const userGinToRow = (g, userId) => ({
  id: g.id,
  name: g.name ?? 'Bez názvu',
  distillery: g.distillery ?? null,
  country: g.country ?? null,
  style: g.style ?? null,
  abv: g.abv ?? null,
  botanicals: g.botanicals ?? [],
  description: g.desc ?? g.description ?? null,
  pairing: g.pairing ?? null,
  status: 'pending',
  source: 'community',
  submitted_by: userId,
})

const rowToUserGin = (r) => ({
  id: r.id,
  name: r.name,
  distillery: r.distillery ?? undefined,
  country: r.country ?? undefined,
  style: r.style ?? undefined,
  abv: r.abv != null ? Number(r.abv) : undefined,
  botanicals: r.botanicals ?? [],
  desc: r.description ?? undefined,
  pairing: r.pairing ?? undefined,
  pending: r.status === 'pending',
})

// ── Pull: stáhne serverový stav do tvaru aplikace ────────────
export async function pullState() {
  const sb = need()
  const user = await getUser()
  if (!user) throw new Error('Nepřihlášený uživatel.')
  const uid = user.id

  const [profileR, tastingsR, barR, progressR, ginsR] = await Promise.all([
    sb.from('profiles').select('*').eq('id', uid).maybeSingle(),
    sb.from('tastings').select('*').eq('user_id', uid).order('tasted_on', { ascending: false }),
    sb.from('bar').select('*').eq('user_id', uid),
    sb.from('learning_progress').select('*').eq('user_id', uid),
    sb.from('gins').select('*').eq('submitted_by', uid),
  ])
  for (const r of [profileR, tastingsR, barR, progressR, ginsR]) {
    if (r.error) throw r.error
  }

  const p = profileR.data
  const bar = {}
  for (const b of barR.data ?? []) {
    bar[b.gin_id] = b.status === 'doma' ? { status: 'doma', stock: b.stock ?? undefined } : { status: b.status }
  }

  const maps = { lesson_done: {}, quiz_right: {}, bot_read: {}, card_read: {} }
  for (const row of progressR.data ?? []) {
    maps[row.kind][row.item_key] = row.value
  }

  return {
    profile: { name: p?.name ?? '' },
    xp: p?.xp ?? 0,
    streak: { count: p?.streak_count ?? 0, lastDate: p?.streak_last_date ?? null },
    tastings: (tastingsR.data ?? []).map(rowToTasting),
    bar,
    userGins: (ginsR.data ?? []).map(rowToUserGin),
    lessonsDone: maps.lesson_done,
    quizRight: maps.quiz_right,
    botsRead: maps.bot_read,
    cardsRead: maps.card_read,
  }
}

// ── Push: zrcadlí lokální stav na server (klient je zdroj pravdy) ─
export async function pushState(s) {
  const sb = need()
  const user = await getUser()
  if (!user) throw new Error('Nepřihlášený uživatel.')
  const uid = user.id

  // 1. profil
  const profileUp = await sb.from('profiles').upsert({
    id: uid,
    name: s.profile?.name ?? '',
    xp: s.xp ?? 0,
    streak_count: s.streak?.count ?? 0,
    streak_last_date: s.streak?.lastDate ?? null,
    updated_at: new Date().toISOString(),
  })
  if (profileUp.error) throw profileUp.error

  // 2. vlastní giny (community submissions) — musí být před ochutnávkami kvůli FK
  if (s.userGins?.length) {
    const up = await sb.from('gins').upsert(s.userGins.map((g) => userGinToRow(g, uid)))
    if (up.error) throw up.error
  }

  // 3. ochutnávky — upsert + smazání těch, co lokálně zmizely
  const tastings = s.tastings ?? []
  if (tastings.length) {
    const up = await sb.from('tastings').upsert(tastings.map((t) => tastingToRow(t, uid)))
    if (up.error) throw up.error
  }
  await pruneRows(sb, 'tastings', uid, tastings.map((t) => t.id))

  // 4. bar
  const barRows = Object.entries(s.bar ?? {}).map(([ginId, v]) => ({
    user_id: uid,
    gin_id: ginId,
    status: v.status,
    stock: v.status === 'doma' ? v.stock ?? null : null,
    updated_at: new Date().toISOString(),
  }))
  if (barRows.length) {
    const up = await sb.from('bar').upsert(barRows)
    if (up.error) throw up.error
  }
  await pruneRows(sb, 'bar', uid, barRows.map((r) => r.gin_id), 'gin_id')

  // 5. postup v učení
  const progRows = []
  const push = (kind, map) => {
    for (const [item_key, value] of Object.entries(map ?? {})) {
      progRows.push({ user_id: uid, kind, item_key, value, updated_at: new Date().toISOString() })
    }
  }
  push('lesson_done', s.lessonsDone)
  push('quiz_right', s.quizRight)
  push('bot_read', s.botsRead)
  push('card_read', s.cardsRead)
  if (progRows.length) {
    const up = await sb.from('learning_progress').upsert(progRows)
    if (up.error) throw up.error
  }

  return { ok: true }
}

// Smaže serverové řádky uživatele, které nejsou v `keepIds`.
async function pruneRows(sb, table, uid, keepIds, idCol = 'id') {
  let q = sb.from(table).delete().eq('user_id', uid)
  if (keepIds.length) {
    const list = keepIds.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(',')
    q = q.not(idCol, 'in', `(${list})`)
  }
  const { error } = await q
  if (error) throw error
}

// ── Čárové kódy (EAN/UPC) ────────────────────────────────────
const OFF_URL = 'https://world.openfoodfacts.org/api/v2/product'

// Najde gin podle čárového kódu. Vrací:
//   { source: 'catalog', gin }              — nalezeno v Ginlore DB
//   { source: 'off', suggestion, barcode }  — nalezeno v Open Food Facts (návrh k přidání)
//   { source: 'none', barcode }             — nikde
export async function findGinByBarcode(barcode) {
  const code = String(barcode).trim()

  // 1) Ginlore katalog (funguje i bez přihlášení — čте veřejný anon klíč)
  if (isBackendEnabled) {
    const { data, error } = await supabase
      .from('gin_barcodes')
      .select('gin_id, gins(*)')
      .eq('barcode', code)
      .maybeSingle()
    if (!error && data?.gins) {
      return { source: 'catalog', gin: dbGinToApp(data.gins) }
    }
  }

  // 2) Open Food Facts (veřejné, bez klíče)
  try {
    const res = await fetch(
      `${OFF_URL}/${encodeURIComponent(code)}.json?fields=product_name,brands,generic_name`
    )
    if (res.ok) {
      const json = await res.json()
      if (json.status === 1 && json.product) {
        const p = json.product
        const name = p.product_name || p.generic_name || ''
        if (name) {
          return {
            source: 'off',
            barcode: code,
            suggestion: { name, distillery: p.brands || '', barcode: code },
          }
        }
      }
    }
  } catch {
    // offline / CORS — přejdi na 'none'
  }

  return { source: 'none', barcode: code }
}

// Přiřadí čárový kód ke ginu v katalogu (po přihlášení).
export async function linkBarcode(barcode, ginId) {
  const sb = need()
  const { error } = await sb
    .from('gin_barcodes')
    .upsert({ barcode: String(barcode).trim(), gin_id: ginId })
  if (error) throw error
}

const dbGinToApp = (r) => ({
  id: r.id,
  name: r.name,
  distillery: r.distillery ?? undefined,
  country: r.country ?? undefined,
  style: r.style ?? undefined,
  abv: r.abv != null ? Number(r.abv) : undefined,
  botanicals: r.botanicals ?? [],
  desc: r.description ?? undefined,
  pairing: r.pairing ?? undefined,
  community: r.community_median != null
    ? { median: Number(r.community_median), count: r.community_count ?? 0 }
    : undefined,
})

// ── Katalog ginů ─────────────────────────────────────────────
export async function fetchApprovedGins() {
  const sb = need()
  const { data, error } = await sb.from('gins').select('*').eq('status', 'approved')
  if (error) throw error
  return data
}

// Uživatelský návrh nového ginu (moderace čeká). Vrací id.
export async function submitGin(gin) {
  const sb = need()
  const user = await getUser()
  if (!user) throw new Error('Nepřihlášený uživatel.')
  const id = gin.id ?? `user-${Date.now()}`
  const { error } = await sb.from('gins').insert(userGinToRow({ ...gin, id }, user.id))
  if (error) throw error
  return id
}

// ── Moderace (admin) ─────────────────────────────────────────
export async function fetchPendingGins() {
  const sb = need()
  const { data, error } = await sb
    .from('gins')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function moderateGin(id, status) {
  const sb = need()
  if (!['approved', 'rejected'].includes(status)) throw new Error('Neplatný stav moderace.')
  const { error } = await sb.from('gins').update({ status }).eq('id', id)
  if (error) throw error
}

// ── Feed ─────────────────────────────────────────────────────
export async function fetchFeed(limit = 30) {
  const sb = need()
  const { data, error } = await sb
    .from('tastings')
    .select('id, gin_id, rating, serve, tags, note, tasted_on, dg, user_id, gins(name, distillery), profiles(name), tasting_likes(count)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    ginId: r.gin_id,
    ginName: r.gins?.name ?? r.gin_id,
    distillery: r.gins?.distillery ?? '',
    author: r.profiles?.name || 'Anonym',
    rating: r.rating != null ? Number(r.rating) : null,
    serve: r.serve,
    tags: r.tags ?? [],
    note: r.note ?? '',
    date: r.tasted_on,
    likes: r.tasting_likes?.[0]?.count ?? 0,
  }))
}

export async function toggleLike(tastingId, liked) {
  const sb = need()
  const user = await getUser()
  if (!user) throw new Error('Nepřihlášený uživatel.')
  if (liked) {
    const { error } = await sb.from('tasting_likes').delete().match({ tasting_id: tastingId, user_id: user.id })
    if (error) throw error
    return false
  }
  const { error } = await sb.from('tasting_likes').insert({ tasting_id: tastingId, user_id: user.id })
  if (error) throw error
  return true
}
