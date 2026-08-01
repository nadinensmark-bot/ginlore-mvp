// Karta dne — jedna minuta čtení denně. Vybírá se rotací podle data.
export const DAILY_CARDS = [
  {
    id: 'andelika-fixativ',
    kind: 'Botanical dne',
    t: 'Andělika drží gin pohromadě',
    p: 'Sama o sobě není nijak zajímavá — voní jako suchá zem a mech. Ale je to fixativ: prodlouží a upevní ostatní vůně, aby se citrusy nerozplynuly za tři sekundy. Bez andělíky by se gin rozpadl na jednotlivé kousky.\n\nPoužívá se kořen, sklizený po prvním roce, sušený. Druhý klasický fixativ je kosatcový kořen — ten navíc voní fialkami.',
    related: ['Kosatcový kořen', 'fixativy', 'London Dry'],
    botKey: 'andelika',
  },
  {
    id: 'chinin',
    kind: 'Lore',
    t: 'Proč má tonik chinin',
    p: 'Chinin z kůry chinovníku byl lék proti malárii — a byl tak hořký, že si ho britští důstojníci v Indii ředili sodovkou, cukrem a ginem. Z léku se stal drink. Dnešní tonik má chininu zlomek, ale ta hořkost je pořád důvod, proč G&T funguje: hořké + suché + citrus.',
    related: ['Perfect serve', 'G&T'],
  },
  {
    id: 'kosatec',
    kind: 'Botanical dne',
    t: 'Kosatcový kořen musí léta ležet',
    p: 'Orris — sušený kořen kosatce — začne vonět až po několika letech zrání. Teprve pak z něj vylezou fialky a pudrová jemnost. Je to druhý velký fixativ ginu a jeden z nejdražších botanicals vůbec: používá se i v parfumerii.',
    related: ['Andělika', 'fixativy'],
    botKey: 'kosatec',
  },
  {
    id: 'led',
    kind: 'Perfect serve',
    t: 'Kolik ledu je moc ledu',
    p: 'Intuice říká „míň ledu = silnější drink". Je to naopak: plná sklenice ledu chladí rychleji a taje pomaleji, takže G&T zůstane déle silný. Dvě kostky plavou, rychle tají a drink ředí. Led nešetři — sklenici naplň až po okraj.',
    related: ['Perfect serve', 'G&T'],
  },
  {
    id: 'gin-craze',
    kind: 'Lore',
    t: 'Gin Craze: když Londýn pil gin místo vody',
    p: 'V první polovině 18. století pil Londýn v přepočtu přes půl litru ginu na osobu týdně — byl levnější než pivo a bezpečnější než voda. Trvalo osm zákonů („Gin Acts"), než se to podařilo zkrotit. Odtud pochází špatná pověst, kterou gin doháněl dalších dvě stě let.',
    related: ['Gin lore', 'Old Tom'],
  },
  {
    id: 'kubeba-dozvuk',
    kind: 'Botanical dne',
    t: 'Kubeba: pepř, který voní borovicí',
    p: 'Pepř s ocáskem z Jávy se v ginu nechová jako pepř — voní pryskyřicí a borovicí a umí prodloužit jalovcový dozvuk, aniž přidá pálivost. Palírny po něm sahají, když chtějí gin, který v ústech zůstane. Najdeš ho i v Žufánek OMG.',
    related: ['Jalovec', 'dozvuk'],
    botKey: 'kubeba',
  },
  {
    id: 'sklo',
    kind: 'Perfect serve',
    t: 'Copa: proč má G&T balonovou sklenici',
    p: 'Španělé udělali z G&T večerní rituál a přinesli copa de balón — širokou balonovou sklenici. Není to póza: velký objem pojme víc ledu, stopka drží ruku od drinku a šířka soustředí aroma. Když nemáš copu, poslouží velká sklenice na víno.',
    related: ['Perfect serve'],
  },
]

export function cardForDate(dateStr) {
  // stabilní výběr karty podle data (YYYY-MM-DD)
  const n = dateStr.split('-').reduce((a, x) => a + parseInt(x, 10), 0)
  return DAILY_CARDS[n % DAILY_CARDS.length]
}

// Průvodce degustací — 4 kroky (vzhled → aroma → chuť → dozvuk)
export const DG_STEPS = [
  {
    n: 'Vzhled',
    prompt: 'Jak vypadá?',
    instr: 'Podrž sklenici proti světlu. Gin má být čirý — zákal znamená, že se filtrovalo méně, což nemusí být chyba.',
    groups: [{ n: 'Vzhled', tags: ['čirý', 'olejnatý', 'lehký zákal', 'slzy na stěně'] }],
  },
  {
    n: 'Aroma',
    prompt: 'Co cítíš?',
    instr: 'Přibliž nos k okraji sklenice a lehce otevři ústa. Nedýchej zhluboka — první nádech je nejcennější.',
    groups: [
      { n: 'Jalovec a jehličí', tags: ['jalovec', 'borovice', 'rozmarýn', 'mech'] },
      { n: 'Citrusy', tags: ['citronová kůra', 'grep', 'pomeranč', 'limetka'] },
      { n: 'Koření a květiny', tags: ['kardamom', 'koriandr', 'levandule', 'fialka'] },
    ],
  },
  {
    n: 'Chuť',
    prompt: 'Co chutná?',
    instr: 'Vezmi malý doušek a nech ho projít celými ústy. Hledej, kde to hřeje a kde to sladí.',
    groups: [
      { n: 'První dojem', tags: ['sladký', 'suchý', 'ostrý', 'kulatý'] },
      { n: 'Tělo', tags: ['jalovec', 'citrus', 'pepř', 'lékořice'] },
    ],
  },
  {
    n: 'Dozvuk',
    prompt: 'Co zůstalo?',
    instr: 'Polkni a počítej. Deset sekund je dlouhý dozvuk, dvě sekundy krátký.',
    groups: [{ n: 'Dozvuk', tags: ['krátký', 'dlouhý', 'hořký', 'chladivý', 'lesní'] }],
  },
]

// Hodnocení: 1–5 větviček jalovce (po půlkách), s pojmenovanými pásmy.
export const RATING_BANDS = [
  [4.75, 'Skvost'],
  [4.25, 'Výborný'],
  [3.75, 'Moc dobrý'],
  [3.25, 'Dobrý'],
  [2.75, 'Průměr'],
  [2.25, 'Slabší'],
  [1.75, 'Špatný'],
  [1.25, 'Zlý'],
  [0, 'Nepitelný'],
]

export function bandFor(r) {
  for (const [min, n] of RATING_BANDS) if (r >= min) return n
  return RATING_BANDS[RATING_BANDS.length - 1][1]
}

export const SERVES = ['G&T', 'čistý', 'Martini', 'Negroni', 'jinak']
export const QUICK_TAGS = ['citrusový', 'kořeněný', 'jalovcový', 'květinový', 'sladký', 'suchý']

export const LEVELS = [
  { n: 'Nováček', gen: 'Nováčka', min: 0 },
  { n: 'Ochutnávač', gen: 'Ochutnávače', min: 250 },
  { n: 'Znalec', gen: 'Znalce', min: 750 },
  { n: 'Kurátor', gen: 'Kurátora', min: 1800 },
  { n: 'Ginolog', gen: 'Ginologa', min: 4000 },
]
