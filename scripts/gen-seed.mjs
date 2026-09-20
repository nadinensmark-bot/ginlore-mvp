// Vygeneruje supabase/migrations/0002_seed_gins.sql z src/data/gins.js.
// Spuštění:  node scripts/gen-seed.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { GINS } from '../src/data/gins.js'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, '../supabase/migrations/0002_seed_gins.sql')

const q = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const arr = (a) =>
  a && a.length
    ? `array[${a.map((x) => `'${String(x).replace(/'/g, "''")}'`).join(', ')}]::text[]`
    : `'{}'::text[]`
const jsonb = (o) => (o == null ? 'null' : `${q(JSON.stringify(o))}::jsonb`)
const num = (n) => (n == null ? 'null' : Number(n))

const rows = GINS.map((g) => {
  const cols = [
    q(g.id),
    q(g.name),
    q(g.distillery),
    q(g.country),
    q(g.style),
    num(g.abv),
    arr(g.botanicals),
    q(g.desc),
    jsonb(g.pairing),
    num(g.community?.median),
    num(g.community?.count ?? 0),
  ]
  return `  (${cols.join(', ')})`
})

const sql = `-- AUTOGENEROVÁNO scripts/gen-seed.mjs — needituj ručně.
-- Seed sdíleného katalogu ginů (${GINS.length} ginů) z MVP databáze.

insert into public.gins
  (id, name, distillery, country, style, abv, botanicals, description,
   pairing, community_median, community_count)
values
${rows.join(',\n')}
on conflict (id) do update set
  name = excluded.name,
  distillery = excluded.distillery,
  country = excluded.country,
  style = excluded.style,
  abv = excluded.abv,
  botanicals = excluded.botanicals,
  description = excluded.description,
  pairing = excluded.pairing,
  community_median = excluded.community_median,
  community_count = excluded.community_count;
`

writeFileSync(out, sql)
console.log(`Zapsáno ${GINS.length} ginů → ${out}`)
