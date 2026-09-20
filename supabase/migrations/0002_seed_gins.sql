-- AUTOGENEROVÁNO scripts/gen-seed.mjs — needituj ručně.
-- Seed sdíleného katalogu ginů (19 ginů) z MVP databáze.

insert into public.gins
  (id, name, distillery, country, style, abv, botanicals, description,
   pairing, community_median, community_count)
values
  ('zufanek-omg', 'Žufánek Gin OMG', 'Žufánek', 'Česko', 'new-western', 45, array['jalovec', 'koriandr', 'andelika', 'citrus', 'kubeba']::text[], 'Oh My Gin. Nejznámější český gin — 16 botanicals, výrazná citrusová špička a kubebový dozvuk. Gin, který českou scénu odstartoval.', '{"tonic":"Kinley Tonic","garnish":"pomerančová kůra","why":"Neutrální tonik nepřekřičí citrusovou špičku a kůra ji ještě zvýrazní."}'::jsonb, 4.2, 214),
  ('zufanek-oh-my-god', 'Žufánek OMG XO', 'Žufánek', 'Česko', 'old-tom', 45, array['jalovec', 'koriandr', 'andelika', 'lekorice']::text[], 'OMG zrající v sudech po víně. Kulatější, medovější — česká odpověď na Old Tom.', '{"tonic":"Thomas Henry","garnish":"snítka rozmarýnu","why":"Sudová vanilka snese aromatičtější tonik a bylinka ji podtrhne."}'::jsonb, 4.1, 89),
  ('tosh-dry', 'TŌSH Dry Gin', 'TŌSH Distillery', 'Česko', 'london-dry', 45, array['jalovec', 'koriandr', 'andelika', 'citrus']::text[], 'Učebnicový London Dry z Olomouce. Jalovec vpředu, čistý suchý dozvuk.', '{"tonic":"Fever-Tree Indian","garnish":"citronová kůra","why":"Klasika ke klasice — nic nepřekáží jalovci."}'::jsonb, 4.1, 67),
  ('endorphin-original', 'Endorphin Original', 'Endorphin Gin', 'Česko', 'new-western', 43, array['jalovec', 'koriandr', 'kardamom', 'citrus']::text[], 'Pražský gin s kardamomovou linkou. Vzniká po pár set lahvích v malých šaržích.', '{"tonic":"Fentimans","garnish":"plátek grepu","why":"Bylinný tonik ladí s kořením a grep rozsvítí citrusy."}'::jsonb, 4, 54),
  ('endorphin-baltic', 'Endorphin Baltic', 'Endorphin Gin', 'Česko', 'new-western', 43, array['jalovec', 'kardamom', 'citrus']::text[], 'Limitka s rakytníkem a mořskou solí. Slaná minerální stopa, kterou jinde nenajdeš.', null, 4.1, 31),
  ('little-urban', 'Little Urban Gin', 'Little Urban Distillery', 'Česko', 'new-western', 44, array['jalovec', 'koriandr', 'citrus', 'kosatec']::text[], 'Květinovější poloha české scény — kosatec a citrusy nad jemným jalovcem.', null, 4, 42),
  ('garage22', 'Garage 22 Bohemian Gin', 'Garage 22', 'Česko', 'new-western', 42, array['jalovec', 'koriandr', 'citrus']::text[], 'Pražská mikropalírna. Bohemian Gin s lipovým květem — česká louka v lahvi.', null, 3.9, 28),
  ('svach-gin', 'Svachův Gin', 'Svach (Svachovka)', 'Česko', 'london-dry', 45, array['jalovec', 'andelika', 'citrus']::text[], 'Jihočeský gin od Svachovky. Poctivý jalovcový základ, drobná bylinková stopa.', null, 3.8, 19),
  ('beefeater', 'Beefeater London Dry', 'Beefeater', 'UK', 'london-dry', 40, array['jalovec', 'koriandr', 'andelika', 'citrus', 'lekorice', 'kosatec']::text[], 'Devět botanicals, recept z roku 1876 a pořád jedna z nejlepších škol London Dry. Špička jalovce hned v nose, sušší dozvuk.', '{"tonic":"Schweppes","garnish":"citronová kůra","why":"Učebnicový G&T — jalovec, chinin, citron. Nic víc to nepotřebuje."}'::jsonb, 4, 1204),
  ('sipsmith', 'Sipsmith London Dry', 'Sipsmith', 'UK', 'london-dry', 41.6, array['jalovec', 'koriandr', 'andelika', 'citrus', 'lekorice', 'kosatec']::text[], 'Palírna, která v roce 2009 vrátila destilování do Londýna a odstartovala craft boom.', null, 4.3, 356),
  ('tanqueray', 'Tanqueray London Dry', 'Tanqueray', 'UK', 'london-dry', 43.1, array['jalovec', 'koriandr', 'andelika', 'lekorice']::text[], 'Jen čtyři botanicals. Důkaz, že London Dry je o přesnosti, ne o počtu ingrediencí.', null, 4, 987),
  ('hendricks', 'Hendrick''s', 'Hendrick’s (William Grant)', 'Skotsko', 'new-western', 41.4, array['jalovec', 'koriandr', 'kosatec', 'citrus']::text[], 'Okurka a růže přidávané po destilaci. Gin, který v roce 1999 předběhl dobu a otevřel dveře celé New Western vlně.', '{"tonic":"Fever-Tree Elderflower","garnish":"plátek okurky","why":"Bezinka zesílí květinovou linku a okurka je podpis značky."}'::jsonb, 4, 1876),
  ('monkey47', 'Monkey 47', 'Black Forest Distillers', 'Německo', 'new-western', 47, array['jalovec', 'koriandr', 'kardamom', 'citrus', 'kubeba', 'lekorice']::text[], 'Čtyřicet sedm botanicals ze Schwarzwaldu a chová se to jako parfém. Komplexita, na které se učí rozpoznávání vrstev.', '{"tonic":"Fever-Tree Mediterranean","garnish":"brusinky","why":"Jemnější tonik nechá vyniknout vrstvám a brusinka odkazuje na recept."}'::jsonb, 4.5, 1543),
  ('haymans-old-tom', 'Hayman''s Old Tom', 'Hayman’s', 'UK', 'old-tom', 41.4, array['jalovec', 'koriandr', 'citrus', 'lekorice']::text[], 'Rodinný recept z 19. století. Sladší předchůdce London Dry — most mezi genevrem a dneškem.', null, 4.1, 234),
  ('plymouth-gin', 'Plymouth Gin', 'Black Friars Distillery', 'UK', 'plymouth', 41.2, array['jalovec', 'koriandr', 'andelika', 'kardamom', 'citrus', 'kosatec']::text[], 'Jediný gin vázaný na jedno místo — palírna Black Friars jede od roku 1793. Zemitější a kulatější než London Dry.', null, 4.2, 412),
  ('plymouth-navy', 'Plymouth Navy Strength', 'Black Friars Distillery', 'UK', 'navy', 57, array['jalovec', 'koriandr', 'andelika', 'kardamom', 'citrus', 'kosatec']::text[], '57 % a legenda o střelném prachu. Gin, který se v koktejlu neztratí.', null, 4.3, 198),
  ('bols-genever', 'Bols Genever', 'Bols', 'Nizozemsko', 'genever', 42, array['jalovec', 'koriandr', 'lekorice']::text[], 'Sladový destilát podle receptury z roku 1820. Napůl gin, napůl mladá whisky — odkud to všechno je.', null, 3.9, 156),
  ('bombay-sapphire', 'Bombay Sapphire', 'Bombay Spirits', 'UK', 'london-dry', 40, array['jalovec', 'koriandr', 'andelika', 'citrus', 'kubeba', 'lekorice', 'kosatec']::text[], 'Deset botanicals napařovaných v košících. Lehčí, vzdušnější styl London Dry.', null, 3.6, 2103),
  ('gordons', 'Gordon''s London Dry', 'Gordon’s', 'UK', 'london-dry', 37.5, array['jalovec', 'koriandr', 'andelika', 'lekorice']::text[], 'Nejprodávanější gin světa. Základní škola jalovce — a přesně na hraně minimálních 37,5 %.', null, 3.4, 3012)
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
