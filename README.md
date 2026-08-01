# Ginlore — MVP

Deník a škola ginu. Mobilní webová aplikace (MVP fáze 1 dle průzkumu trhu) — zapisuj ochutnávky,
spravuj bar a nauč se gin skrz lekce, kvízy a průvodce degustací.

## Co MVP umí

- **Objevuj** — vyhledávání v databázi (19 seed ginů, kompletní česká scéna), doporučení
  „% pro tebe" počítaná z tvých hodnocení, botanical dne
- **Zápis ochutnávky** — hodnocení 1–5 **větvičkami jalovce** (po půlkách), způsob podání,
  rychlé tagy, poznámka; cíl pod 20 sekund
- **Můj bar** — tři stavy: *mám doma* (se stavem zásoby), *ochutnáno*, *chci*; export dat v JSON
- **Učení** — Cesta (24 hotových lekcí ze 42 plánovaných, kvízy), průvodce degustací
  (vzhled → aroma → chuť → dozvuk), Almanach (8 botanicals, 7 stylů), karta dne
- **Gamifikace** — XP, 5 úrovní (Nováček → Ginolog), série dní, 12 odznaků za šíři i hloubku
- **Přidání vlastního ginu** — odpověď na nejčastější stížnost trhu („můj gin tam není")
- **Chuťový profil** — počítá se z tagů a intenzity tvých zápisů

Feed a skenování etikety jsou v MVP zaslepené ukázky (fáze 2 dle roadmapy).

## Spuštění

```bash
npm install
npm run dev
```

Data se ukládají jen lokálně (localStorage). Onboarding nabízí ukázková data pro rychlé proklikání.

## Stack

Vite + React, bez backendu. Deploy na GitHub Pages přes GitHub Actions (`.github/workflows/deploy.yml`).

## Podklady

Postaveno podle průzkumu trhu „Gin aplikace — průzkum trhu a feature gap" (07/2026),
edukační architektury Ginlore Learn a klikatelného prototypu (14 obrazovek).
