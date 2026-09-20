# Ginlore backend (Supabase)

Účty + cloud sync, sdílený katalog ginů s moderací a veřejný feed.
Frontend jede na GitHub Pages (statika), backend běží na Supabase.

## Co je hotové

- **Schéma + RLS** — `supabase/migrations/0001_init.sql`
  (profily, giny, ochutnávky, bar, postup v učení, lajky feedu, admini)
- **Seed 19 ginů** — `supabase/migrations/0002_seed_gins.sql`
  (generuje se z `src/data/gins.js` přes `npm run gen:seed`)
- **Klient + API vrstva** — `src/lib/supabase.js`, `src/lib/api.js`
  (auth, `pushState`/`pullState` sync, `submitGin`, moderace, feed)

Frontend zatím pořád ukládá lokálně do `localStorage` — API vrstva je
připravená k napojení, ale obrazovky se na ni ještě nepřepnuly (další krok).

## Nastavení projektu

1. **Založ projekt** na [supabase.com](https://supabase.com) (region EU, např. Frankfurt).

2. **Spusť migrace.** Buď přes Supabase CLI:

   ```bash
   npm i -g supabase
   supabase link --project-ref TVUJ-REF
   supabase db push
   ```

   nebo ručně: v Supabase → **SQL Editor** postupně vlož a spusť obsah
   `0001_init.sql` a pak `0002_seed_gins.sql`.

3. **Doplň klíče.** Zkopíruj `.env.example` → `.env` a vyplň z
   Supabase → **Project Settings → API**:

   ```
   VITE_SUPABASE_URL=https://TVUJ-PROJEKT.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

4. **Zapni e-mail auth.** Supabase → Authentication → Providers → Email.
   Pro vývoj vypni „Confirm email", ať se dá hned testovat.

5. **Povyš sebe na admina** (kvůli moderaci). V SQL Editoru po své registraci:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'tvuj@email.cz';
   ```

## Deploy klíčů na GitHub Pages

Build na Pages potřebuje env proměnné. Přidej je do GitHub → Settings →
Secrets and variables → Actions, a předej je kroku `npm run build`
ve `.github/workflows/deploy.yml` jako `VITE_SUPABASE_URL` a
`VITE_SUPABASE_ANON_KEY`. Anon klíč je veřejný (chrání ho RLS), takže
smí jít do buildu.

## Datový model (přehled)

| Tabulka | K čemu |
|---|---|
| `profiles` | jméno, XP, série — 1:1 s `auth.users`, zakládá se automaticky |
| `gins` | sdílený katalog; `status` = approved/pending/rejected, `source` = seed/community |
| `tastings` | ochutnávky; `is_public` = ve feedu |
| `bar` | stav lahve (doma/chci + zásoba) |
| `learning_progress` | lekce/kvízy/botanicals/karty |
| `tasting_likes` | lajky feedu |
| `admins` | kdo smí moderovat |

RLS: každý vidí a mění jen svá data; schválené giny a veřejné ochutnávky
čte kdokoli; moderovat smí jen admin.

## Regenerace seedu

Když se změní `src/data/gins.js`:

```bash
npm run gen:seed
```

Přepíše `0002_seed_gins.sql` (upsert — bezpečné spustit znovu).
