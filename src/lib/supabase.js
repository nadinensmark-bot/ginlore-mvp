// Supabase klient. Konfiguruje se přes .env (viz .env.example).
// Když klíče nejsou nastavené, klient je null a aplikace jede dál
// čistě lokálně (localStorage) — backend je volitelný.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isBackendEnabled = Boolean(url && anonKey)

export const supabase = isBackendEnabled
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

if (!isBackendEnabled && import.meta.env.DEV) {
  console.info(
    'ginlore: backend není nakonfigurovaný (chybí VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) — jedu lokálně.'
  )
}
