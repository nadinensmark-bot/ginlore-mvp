import { BOTANICALS } from './botanicals'

// Cesta — 7 kapitol / 42 lekcí (plán). V MVP je plně zpracováno 24 lekcí,
// kapitoly 05–07 jsou zamčené a obsah vznikne ve fázi 2.
// Lekce = 1–3 kroky obsahu + kvíz. Kvíz +20 XP, dokončení +30 XP.

const ch01 = [
  {
    id: 'gin-je-gin',
    t: 'Co dělá gin ginem',
    s: 'Tři pravidla a jedna bobule',
    steps: [
      {
        h: 'Destilát + jalovec. To je celé.',
        p: 'Gin je neutrální líh ochucený botanicals, ve kterém musí převládat jalovec. Evropská pravidla k tomu přidávají minimálně 37,5 % alkoholu. Všechno ostatní — styl, botanicals, původ — je volitelná nadstavba.',
        bullets: [
          'Jalovec musí být převládající chuť, jinak to gin není.',
          'Minimálně 37,5 % alkoholu (v USA 40 %).',
          'Základem je neutrální líh — z obilí, brambor i hroznů.',
        ],
      },
      {
        h: 'Proč na tom záleží',
        p: 'Až uvidíš na etiketě „gin", víš jen tohle minimum. Teprve slova jako London Dry, distilled nebo Navy Strength ti řeknou, jak se s chutí pracovalo. Přesně to se naučíš v kapitole Sedm stylů.',
      },
    ],
    quiz: {
      q: 'Který botanical v ginu být musí?',
      options: ['Koriandr', 'Jalovec', 'Citrusová kůra'],
      correct: 1,
      explain: 'Jalovec je jediná povinná ingredience — a musí být tou převládající chutí. Vše ostatní je na palírně.',
    },
  },
  {
    id: 'jalovec',
    t: 'Jalovec zblízka',
    s: 'Bobule, která není bobule',
    steps: [
      {
        h: 'Šiška v přestrojení',
        p: 'Jalovcové „bobule" jsou botanicky šišky. Zrají dva až tři roky, takže keř nese zelené i černé naráz a sbírá se ručně — nejvíc v Toskánsku a na Balkáně. Voní pryskyřicí, jehličím a tmavým lesem.',
        bullets: [
          'Sklizeň je ruční — keř píchá a bobule zrají různě.',
          'Většina světové produkce jde právě do ginu.',
          'Čerstvě rozmáčknutá bobule = vůně, kterou hledáš v každém ginu.',
        ],
      },
      {
        h: 'Jak ho poznáš',
        p: 'V London Dry přijde jalovec první — pryskyřice a jehličí hned v nose. V New Western ustupuje dozadu a musíš ho hledat pod citrusy a kořením. Ale být tam musí vždycky.',
      },
    ],
    quiz: {
      q: 'Jalovcové bobule jsou ve skutečnosti…',
      options: ['Šišky', 'Semena', 'Plody růže'],
      correct: 0,
      explain: 'Jalovec je jehličnan a jeho „bobule" jsou dužnaté šišky. Zrají dva až tři roky.',
    },
  },
  {
    id: 'procenta',
    t: 'Procenta a síla',
    s: 'Proč gin nikdy nemá 20 %',
    steps: [
      {
        h: '37,5 je zákon, 40–47 je zvyk',
        p: 'Pod 37,5 % to v EU gin není. Většina ginů se prodává mezi 40 a 47 % — silice botanicals se v silnějším alkoholu drží lépe, takže vyšší procento často znamená výraznější chuť, ne „tvrdší" pití.',
        bullets: [
          'Gordon\'s jede přesně na hraně: 37,5 %.',
          'Craft giny míří na 43–47 % kvůli plnější chuti.',
          'Navy Strength začíná na 57 % — o tom celá jedna lekce.',
        ],
      },
      {
        h: 'Voda je taky ingredience',
        p: 'Po destilaci má gin přes 70 %. Na lahvovou sílu se ředí vodou — a její kvalita a množství je poslední rozhodnutí, které chuť ovlivní. Víc vody = kulatější, ale plošší gin.',
      },
    ],
    quiz: {
      q: 'Jaké je minimum alkoholu pro gin v EU?',
      options: ['40 %', '37,5 %', '35 %'],
      correct: 1,
      explain: '37,5 %. V USA je hranice 40 % — proto mají některé giny jinou sílu pro různé trhy.',
    },
  },
  {
    id: 'destilace',
    t: 'Jak se gin destiluje',
    s: 'Kotel, koš a pára',
    steps: [
      {
        h: 'Dvě cesty k chuti',
        p: 'Botanicals se buď máčejí přímo v lihu a destilují s ním (macerace), nebo se zavěsí do koše nad hladinu a chuť z nich vytáhne až pára (vapour infusion). Macerace dává hutnější chuť, pára jemnější a květinovější.',
        bullets: [
          'Beefeater maceruje 24 hodin před destilací.',
          'Bombay Sapphire je vlajková loď parní infuze.',
          'Většina palíren obě metody kombinuje.',
        ],
      },
      {
        h: 'Řez je řemeslo',
        p: 'Destilatér odděluje „hlavu" (agresivní začátek), „srdce" (to, co půjde do lahve) a „ocas" (těžký konec). Kde přesně řízne, je největší tajemství každé palírny — a důvod, proč dva giny se stejnými botanicals chutnají jinak.',
      },
    ],
    quiz: {
      q: 'Co je „vapour infusion"?',
      options: [
        'Ředění ginu párou',
        'Botanicals v koši, chuť vytáhne pára',
        'Druhá destilace téhož ginu',
      ],
      correct: 1,
      explain: 'Botanicals visí v koši nad hladinou a chuť z nich uvolní až procházející pára. Výsledek je jemnější než macerace.',
    },
  },
]

const ch02 = [
  {
    id: 'london-dry',
    t: 'London Dry',
    s: 'Nejpřísnější recept v ginu',
    styleKey: 'london-dry',
    steps: [
      {
        h: 'Není to místo. Je to metoda.',
        p: 'London Dry gin nemusí mít s Londýnem nic společného — legálně ho můžeš destilovat v Ostravě i v Tokiu. Je to nejpřísnější recept v ginu a drží se tří pravidel:',
        bullets: [
          'Všechna chuť musí vzniknout při destilaci s botanicals. Nic se nedochucuje potom.',
          'Cukr smí přidat jen v homeopatickém množství — do 0,1 g na litr. Odtud to „dry".',
          'Minimálně 37,5 % alkoholu a jalovec jako převládající chuť.',
        ],
      },
      {
        h: 'Proč je to fajn vědět',
        p: 'Palírna nemá kam schovat chybu. Co destilát nedostal v kotli, už nedostane. London Dry se proto pozná podle čistoty — a taky podle toho, že se v něm nedá nic zamaskovat.',
      },
      {
        h: 'Jak to poznáš v ruce',
        p: 'Tři vodítka, která tě nezradí:',
        bullets: [
          'Špička jalovce hned v nose — pryskyřice a jehličí přijdou první, teprve za nimi citrus a koření.',
          'Sušší dozvuk — nezůstane sladká vrstva na jazyku. Proto je London Dry tak dobrý základ pro Martini.',
          'Čistota, ne komplikace — tři až šest rozeznatelných vůní. Když jich cítíš deset, budeš spíš u New Western.',
        ],
      },
    ],
    quiz: {
      q: 'Palírna po destilaci přidá do ginu meruňkový extrakt. Může tomu pořád říkat London Dry?',
      options: [
        'Ano, když je jalovec pořád hlavní chuť',
        'Ne, po destilaci už smí jen voda',
        'Jen když to napíše na etiketu',
      ],
      correct: 1,
      explain: 'Do London Dry smí po destilaci jen voda a ta kapka cukru. Tenhle gin bude na etiketě „distilled gin" nebo prostě „gin" — a to není nic špatného, jen jiná kategorie.',
    },
    homeHint: { ginIds: ['beefeater', 'tosh-dry'], text: 'Beefeater a TŌSH Dry Gin jsou učebnicové London Dry. Až si dáš, hledej to jehličí.' },
  },
  {
    id: 'plymouth',
    t: 'Plymouth',
    s: 'Jedna palírna, jedno město',
    styleKey: 'plymouth',
    steps: [
      {
        h: 'Gin s adresou',
        p: 'Plymouth gin se smí vyrábět jen v Black Friars Distillery v Plymouthu — palírna běží od roku 1793 a je nejstarší fungující v Anglii. Je to jediný styl vázaný na jedno konkrétní místo.',
        bullets: [
          'Víc kořenových botanicals → zemitější, kulatější chuť.',
          'Méně ostrý jalovec než London Dry, žádná hořkost.',
          'Historicky gin Royal Navy — odtud vede stopa k Navy Strength.',
        ],
      },
      {
        h: 'Kdy po něm sáhnout',
        p: 'Když ti London Dry přijde moc ostrý. Plymouth je měkčí vstup do suchých ginů a v klasickém Gimletu je nenahraditelný.',
      },
    ],
    quiz: {
      q: 'Čím je styl Plymouth unikátní?',
      options: [
        'Nejvyšším obsahem alkoholu',
        'Smí se vyrábět jen na jednom místě',
        'Nesmí obsahovat jalovec',
      ],
      correct: 1,
      explain: 'Jediný gin vázaný na jedno místo — Black Friars Distillery v Plymouthu, od roku 1793.',
    },
  },
  {
    id: 'old-tom',
    t: 'Old Tom',
    s: 'Sladší předchůdce',
    styleKey: 'old-tom',
    steps: [
      {
        h: 'Most mezi genevrem a dneškem',
        p: 'V 18. století se gin doslazoval, aby zamaskoval drsný destilát. Old Tom je tenhle sladší mezikrok — bez něj nepochopíš, proč se dnešnímu ginu říká „dry". Jmenuje se podle kocoura na vývěsních štítech nelegálních výčepů.',
        bullets: [
          'Sladší než London Dry, sušší než genever.',
          'Tom Collins a Martinez se původně míchaly právě z něj.',
          'Dnes ho vrací koktejlová scéna — i Žufánek má sudový OMG XO.',
        ],
      },
    ],
    quiz: {
      q: 'Proč se London Dry jmenuje „dry"?',
      options: [
        'Vymezoval se proti sladšímu Old Tomu',
        'Pije se bez ledu',
        'Destiluje se ze suchého obilí',
      ],
      correct: 0,
      explain: '„Dry" znamenalo nedoslazovaný — na rozdíl od tehdy běžného sladkého Old Tomu.',
    },
  },
  {
    id: 'sloe',
    t: 'Sloe gin',
    s: 'Trnky a proč to není gin',
    styleKey: 'sloe',
    steps: [
      {
        h: 'Likér v ginové rodině',
        p: 'Sloe gin vzniká macerací trnek s cukrem v hotovém ginu. Výsledek má 25–30 % a legálně je to likér — pod hranicí 37,5 % prostě gin být nemůže. Přesto k ginové kultuře neodmyslitelně patří.',
        bullets: [
          'Nejrozšířenější „domácí" ginový produkt v UK.',
          'Trnky se tradičně sbírají po prvním mrazu.',
          'Pije se čistý, s tonikem i v šampaňském (Sloe Royale).',
        ],
      },
    ],
    quiz: {
      q: 'Proč sloe gin legálně není gin?',
      options: [
        'Neobsahuje jalovec',
        'Má méně než 37,5 % alkoholu',
        'Nesmí se destilovat',
      ],
      correct: 1,
      explain: 'Macerací s cukrem klesne síla na 25–30 % — pod zákonnou hranici. Je to likér na bázi ginu.',
    },
  },
  {
    id: 'navy',
    t: 'Navy Strength',
    s: '57 % a legenda o střelném prachu',
    styleKey: 'navy',
    steps: [
      {
        h: 'Důkaz ohněm',
        p: 'Na lodích královského námořnictva se gin skladoval vedle střelného prachu. Když se sud rozlil, prach politý ginem o síle 57 % a víc pořád šel zapálit — proto se téhle hranici říkalo „proof", důkaz. Slabší gin by prach znehodnotil.',
        bullets: [
          'Minimálně 57 % alkoholu.',
          'Víc alkoholu = víc rozpuštěných silic = intenzivnější chuť.',
          'V koktejlu se neztratí — proto ho barmani milují.',
        ],
      },
    ],
    quiz: {
      q: 'Co dokazovalo, že gin má „navy strength"?',
      options: [
        'Ginem politý střelný prach šel zapálit',
        'Gin hořel modrým plamenem',
        'Nezamrzal v podpalubí',
      ],
      correct: 0,
      explain: 'Při 57 % a víc prach vzplál i politý — důkaz, že líh nikdo neředil. Odtud slovo „proof".',
    },
  },
  {
    id: 'new-western',
    t: 'New Western',
    s: 'Když jalovec ustoupí',
    styleKey: 'new-western',
    steps: [
      {
        h: 'Celá jedna nová škola',
        p: 'Po roce 2000 začaly palírny stavět giny, kde jalovec zůstává, ale pouští dopředu jiné chutě — okurku a růži (Hendrick\'s), 47 botanicals (Monkey 47), citrusy (Žufánek OMG). Není to slabina, je to záměr.',
        bullets: [
          'Jalovec je pořád přítomný, ale ne dominantní.',
          'Většina craft ginů včetně těch českých patří sem.',
          'Když v ginu cítíš deset vůní, jsi skoro jistě tady.',
        ],
      },
    ],
    quiz: {
      q: 'Čím se New Western liší od London Dry?',
      options: [
        'Nesmí obsahovat jalovec',
        'Jalovec ustupuje jiným botanicals do pozadí',
        'Vyrábí se jen v USA',
      ],
      correct: 1,
      explain: 'Jalovec tam být musí — ale hlavní roli hrají citrusy, květiny nebo koření. Je to stylová volba, ne chyba.',
    },
    homeHint: { ginIds: ['zufanek-omg', 'hendricks'], text: 'Žufánek OMG i Hendrick\'s jsou New Western. Zkus v nich jalovec najít — je tam, jen schovaný.' },
  },
  {
    id: 'genever',
    t: 'Genever',
    s: 'Odkud to všechno je',
    styleKey: 'genever',
    steps: [
      {
        h: 'Předek z nížin',
        p: 'Nizozemský a belgický genever je předchůdce ginu — základ tvoří sladový destilát (moutwijn), takže chutná napůl jako gin, napůl jako mladá whisky. Angličtí vojáci ho poznali v třicetileté válce, přivezli domů a zkrátili si ho na „gin".',
        bullets: [
          'Chráněné označení původu — jen NL, BE a kousky FR/DE.',
          '„Dutch courage" — kalíšek genoveru před bitvou.',
          'Oude (staré) vs. jonge (nové) — dva poměry sladu, ne stáří.',
        ],
      },
    ],
    quiz: {
      q: 'Co dělá genever chuťově jiným než gin?',
      options: [
        'Sladový destilát v základu',
        'Dvojnásobek jalovce',
        'Zrání v sudech po rumu',
      ],
      correct: 0,
      explain: 'Moutwijn — sladový destilát — dává genoveru obilnou, whiskyovou polohu, kterou gin z neutrálního lihu nemá.',
    },
  },
]

// Kapitola 03 — Botanická abeceda: lekce generované z Almanachu + autorské kvízy.
const botQuiz = {
  jalovec: {
    q: 'Kde v ginu jalovec hledat jako první?',
    options: ['V barvě', 'V nose — pryskyřice a jehličí', 'Na dně sklenice'],
    correct: 1,
    explain: 'Jalovec voní pryskyřicí a jehličím a v klasických stylech přichází první.',
  },
  koriandr: {
    q: 'Co se z koriandru používá v ginu?',
    options: ['List', 'Semínko', 'Kořen'],
    correct: 1,
    explain: 'Semínko — voní citrusově a dřevitě, úplně jinak než nenáviděná nať.',
  },
  andelika: {
    q: 'Jaká je role andělíky v ginu?',
    options: ['Fixativ — drží ostatní vůně', 'Hlavní sladidlo', 'Barvivo'],
    correct: 0,
    explain: 'Andělika je fixativ: prodlouží a upevní ostatní vůně, aby se nerozplynuly.',
  },
  citrus: {
    q: 'Proč se citrusová kůra přidává až ke konci destilace?',
    options: [
      'Je nejlevnější',
      'Její silice jsou těkavé a rychle se vytratí',
      'Jinak by gin zežloutl',
    ],
    correct: 1,
    explain: 'Citrusové silice jsou první, co ucítíš, a první, co zmizí — proto se s nimi zachází šetrně.',
  },
  kardamom: {
    q: 'Jak poznáš kardamom v ginu?',
    options: ['Gin chladí, i když je teplý', 'Gin je zakalený', 'Gin sládne na konci'],
    correct: 0,
    explain: 'Kardamom dává chladivou, mentolově citrusovou linku.',
  },
  kubeba: {
    q: 'Co kubebový pepř ginu přidává?',
    options: ['Pálivost', 'Dlouhý lesní dozvuk', 'Sladkost'],
    correct: 1,
    explain: 'Voní borovicí a pryskyřicí — prodlouží jalovec bez pálivosti.',
  },
  lekorice: {
    q: 'Jak může být London Dry sladký, když nesmí mít cukr?',
    options: ['Lékořicí', 'Medem', 'Karamelem'],
    correct: 0,
    explain: 'Glycyrrhizin v lékořici je mnohem sladší než cukr — a pravidlo o cukru neporušuje.',
  },
  kosatec: {
    q: 'Jak voní odležený kosatcový kořen (orris)?',
    options: ['Fialkami a pudrem', 'Citronem', 'Kouřem'],
    correct: 0,
    explain: 'Po letech zrání voní fialkami a pudrovou jemností — a drží květinové giny pohromadě.',
  },
}

const ch03 = Object.entries(BOTANICALS).map(([key, b]) => ({
  id: 'bot-' + key,
  t: b.n,
  s: b.short,
  botKey: key,
  steps: [
    { h: b.n + ' — ' + b.role, p: b.text },
    { h: 'Zkus to poznat', p: b.try, bullets: b.notes.map((n) => 'Typická nota: ' + n) },
  ],
  quiz: botQuiz[key],
}))

const ch04 = [
  {
    id: 'ctyri-kroky',
    t: 'Čtyři kroky degustace',
    s: 'Vzhled → aroma → chuť → dozvuk',
    steps: [
      {
        h: 'Systém místo náhody',
        p: 'Degustace není rituál pro snoby — je to checklist, díky kterému si zapamatuješ, co piješ. Čtyři kroky, čtyři otázky: Jak vypadá? Co cítíš? Co chutná? Co zůstalo?',
        bullets: [
          'Vzhled: čirost, olejnatost, slzy na stěně sklenice.',
          'Aroma: první nádech je nejcennější, nedýchej zhluboka.',
          'Chuť: malý doušek přes celá ústa.',
          'Dozvuk: polkni a počítej sekundy.',
        ],
      },
    ],
    quiz: {
      q: 'Jaké je správné pořadí kroků degustace?',
      options: [
        'Chuť → aroma → vzhled → dozvuk',
        'Vzhled → aroma → chuť → dozvuk',
        'Aroma → dozvuk → chuť → vzhled',
      ],
      correct: 1,
      explain: 'Od očí přes nos k ústům — a nakonec to, co zůstane.',
    },
  },
  {
    id: 'aroma',
    t: 'Nos ví první',
    s: 'Jak čichat, abys něco ucítil/a',
    steps: [
      {
        h: 'Lehce a s otevřenou pusou',
        p: 'Přibliž nos k okraji sklenice a lehce otevři ústa — obejdeš tím pálení lihu. Nedýchej zhluboka, první krátký nádech je nejcennější. Pak sklenici nech minutu stát a přivoň znovu: těkavé citrusy zmizí a odkryjou, co je pod nimi.',
        bullets: [
          'Ústa pootevřená = líh nepálí.',
          'Krátké nádechy, ne dlouhé.',
          'Druhé přivonění po minutě odhalí spodní vrstvy.',
        ],
      },
    ],
    quiz: {
      q: 'Proč čichat s pootevřenými ústy?',
      options: [
        'Vypadá to profesionálně',
        'Alkohol pak nepálí v nose',
        'Gin se rychleji ohřeje',
      ],
      correct: 1,
      explain: 'Výpary lihu částečně uniknou ústy a nos může vnímat botanicals místo pálení.',
    },
  },
  {
    id: 'chut-mapa',
    t: 'Mapa chuti',
    s: 'Kde co hledat na jazyku',
    steps: [
      {
        h: 'Nech gin projít celá ústa',
        p: 'Vezmi malý doušek a nech ho projít celými ústy. Sladkost ucítíš vpředu, hořkost vzadu, pálení a hřejivost po stranách. Nehledej deset chutí najednou — tři rozeznané noty jsou lepší než deset tušených.',
        bullets: [
          'První dojem: sladký, suchý, ostrý, nebo kulatý?',
          'Tělo: jalovec, citrus, koření — co vede?',
          'Nespěchej. Druhý doušek říká víc než první.',
        ],
      },
    ],
    quiz: {
      q: 'Kolik chutí je realistické rozeznat v jednom ginu?',
      options: ['Tři až šest', 'Minimálně deset', 'Jen jednu'],
      correct: 0,
      explain: 'Tři až šest jasně rozeznaných not je poctivý výsledek — i profíci pracují s krátkým seznamem.',
    },
  },
  {
    id: 'dozvuk',
    t: 'Dozvuk',
    s: 'Polkni a počítej',
    steps: [
      {
        h: 'Deset sekund je dlouho',
        p: 'Polkni a počítej, jak dlouho chuť drží. Dvě sekundy je krátký dozvuk, deset dlouhý. Dlouhý lesní dozvuk často znamená kubebu, hořký konec anděliku nebo lékořicové dřevo, chladivý kardamom.',
        bullets: [
          'Krátký dozvuk není chyba — u lehkých ginů je záměr.',
          'Dozvuk je místo, kde se pozná fixativ.',
        ],
      },
    ],
    quiz: {
      q: 'Co obvykle prozrazuje dlouhý lesní dozvuk?',
      options: ['Kubebový pepř', 'Citrusovou kůru', 'Vyšší obsah cukru'],
      correct: 0,
      explain: 'Kubeba voní borovicí a drží se vzadu na jazyku — je to král dozvuku.',
    },
  },
  {
    id: 'slovnik',
    t: 'Slovník místo prázdného pole',
    s: 'Jak si zapsat, co cítíš',
    steps: [
      {
        h: 'Tagy porazí esej',
        p: 'Nemusíš psát slohovku. Vyber pár tagů (jalovec, citron, pepř, kulatý…), přidej intenzitu a hotovo. Slova se naučíš používáním — a tvoje starší zápisy začnou dávat smysl, až ochutnáš víc ginů vedle sebe.',
        bullets: [
          'Zapiš i to, jak jsi gin pil/a — čistý chutná jinak než v G&T.',
          'Vlastní slova > správná slova. Piš, co cítíš ty.',
        ],
      },
    ],
    quiz: {
      q: 'Proč zapisovat i způsob podání (čistý / G&T / koktejl)?',
      options: [
        'Kvůli statistice aplikace',
        'Stejný gin chutná v každém podání jinak',
        'Je to povinné pole',
      ],
      correct: 1,
      explain: 'Tonik přidá cukr a chinin, led ředí — hodnocení bez kontextu podání je poloviční informace.',
    },
  },
]

export const CHAPTERS = [
  {
    id: 'ch01',
    num: '01',
    t: 'Než nalejeme',
    desc: 'Co dělá gin ginem, jalovec, procenta a jak se destiluje.',
    lessons: ch01,
  },
  {
    id: 'ch02',
    num: '02',
    t: 'Sedm stylů',
    desc: 'Šest jasně odlišených škol plus genever. Až tohle budeš mít, poznáš z etikety, co tě v lahvi čeká.',
    lessons: ch02,
  },
  {
    id: 'ch03',
    num: '03',
    t: 'Botanická abeceda',
    desc: 'Osm klíčových botanicals — od jalovce po kosatec.',
    lessons: ch03,
  },
  {
    id: 'ch04',
    num: '04',
    t: 'Jak chutnat',
    desc: 'Čtyři kroky degustace a slovník, kterým se to dá popsat.',
    lessons: ch04,
  },
  {
    id: 'ch05',
    num: '05',
    t: 'Perfect serve',
    desc: 'Tonik, poměr, led, sklo, garnish, teplota.',
    lessons: [],
    lockedBy: { chapter: 'ch03', label: 'Odemkne se po kapitole 03' },
  },
  {
    id: 'ch06',
    num: '06',
    t: 'Pět klasik',
    desc: 'Martini, Negroni, Gimlet, Tom Collins, Gin Fizz.',
    lessons: [],
    lockedBy: { level: 2, label: 'Odemkne se od úrovně Znalec' },
    gold: true,
  },
  {
    id: 'ch07',
    num: '07',
    t: 'Gin lore',
    desc: 'Genever, Gin Craze, tonik a malárie, prohibice, craft boom.',
    lessons: [],
    lockedBy: { level: 2, label: 'Odemkne se od úrovně Znalec' },
    gold: true,
  },
]

export const ALL_LESSONS = CHAPTERS.flatMap((c) =>
  c.lessons.map((l) => ({ ...l, chapterId: c.id, chapterNum: c.num, chapterT: c.t }))
)

export const TOTAL_LESSONS_PLANNED = 42

export function lessonById(id) {
  return ALL_LESSONS.find((l) => l.id === id)
}
