# Zásady ochrany osobních údajů — Ginlore

_Draft k revizi. Není to právní rada — před ostrým spuštěním doporučuju nechat
projít právníkem. Místa k doplnění jsou označena `[...]`._

**Poslední aktualizace:** [doplň datum]

## 1. Kdo zpracovává tvoje údaje (správce)

Provozovatelem aplikace Ginlore a správcem osobních údajů je:

- **[Jméno / název provozovatele]**
- [Adresa / sídlo]
- Kontakt: **[kontaktní e-mail]**

## 2. Jaké údaje zpracováváme

Aplikaci Ginlore můžeš z velké části používat bez registrace — data pak zůstávají
jen ve tvém zařízení (v prohlížeči). Pokud se **zaregistruješ a přihlásíš**,
zpracováváme navíc tyto údaje:

| Údaj | Proč |
|---|---|
| **E-mailová adresa** | přihlášení, obnova hesla, identifikace účtu |
| **Jméno / přezdívka** | zobrazení v profilu a ve feedu (pokud ho používáš) |
| **Tvoje záznamy** (ochutnávky, hodnocení, „můj bar", postup v učení, XP) | fungování aplikace a synchronizace mezi zařízeními |
| **Návrhy nových ginů** | doplnění do sdílené databáze (po schválení) |
| **Technické údaje** (např. čas přihlášení) | zabezpečení účtu |

Hesla nevidíme ani neukládáme v čitelné podobě — řeší je bezpečně náš
poskytovatel autentizace (Supabase).

## 3. Proč je zpracováváme (právní základ)

- **Plnění služby** (čl. 6 odst. 1 písm. b GDPR) — abys mohl/a používat účet a sync.
- **Oprávněný zájem** (písm. f) — zabezpečení a provoz aplikace.
- **Souhlas** (písm. a) — u nepovinných věcí (např. sdílení ochutnávek ve feedu),
  který můžeš kdykoli odvolat.

## 4. Kde jsou data uložená a kdo je zpracovatel

- **Supabase** — databáze a přihlašování. Data jsou hostovaná v EU (region [doplň, např. Frankfurt]).
- **[Poskytovatel e-mailů, např. Resend]** — odesílání systémových e-mailů
  (potvrzení, obnova hesla).
- **GitHub Pages** — hosting samotné aplikace (statické soubory).

Se zpracovateli máme (resp. budeme mít) uzavřené zpracovatelské smlouvy dle GDPR.
Data nepředáváme třetím stranám k marketingu ani je neprodáváme.

## 5. Jak dlouho data uchováváme

Data účtu uchováváme, dokud máš účet. Po jeho zrušení je smažeme [doplň lhůtu,
např. do 30 dnů], kromě případů, kdy je musíme uchovat ze zákona.

## 6. Tvoje práva

Máš právo:

- na **přístup** ke svým údajům a jejich **kopii** (aplikace umí export dat do JSON),
- na **opravu** nepřesných údajů,
- na **výmaz** („právo být zapomenut") — napiš nám na [kontaktní e-mail],
- na **omezení** zpracování a na **přenositelnost**,
- **odvolat souhlas** u nepovinného zpracování,
- podat **stížnost** u Úřadu pro ochranu osobních údajů (uoou.gov.cz).

## 7. Věkové omezení

Aplikace je o vzdělávání a zodpovědném přístupu k alkoholu a je určena osobám
**18+**. Účet si nevytvářej, pokud ti ještě nebylo 18 let.

## 8. Cookies a úložiště prohlížeče

Ginlore nepoužívá reklamní ani sledovací cookies. Ukládáme pouze technicky nutná
data do úložiště tvého prohlížeče (localStorage) — tvoje záznamy a přihlášení.

## 9. Změny

Tyto zásady můžeme aktualizovat. O podstatných změnách tě budeme informovat
v aplikaci nebo e-mailem.

---

### Co ještě chybí doplnit (checklist pro tebe)
- [ ] Jméno/název a sídlo provozovatele + kontaktní e-mail
- [ ] Region Supabase (Project Settings → General)
- [ ] Finální poskytovatel e-mailů (Resend/SendGrid/…)
- [ ] Lhůta pro výmaz po zrušení účtu
- [ ] Nechat projít právníkem
- [ ] Přidat odkaz na tyto zásady do onboardingu a k registraci (zaškrtávátko souhlasu)
