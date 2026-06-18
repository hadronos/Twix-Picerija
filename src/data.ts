import { MenuItem, GalleryItem, Review } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // PIZZE
  {
    id: 'pizza-kapricoza',
    name: 'Kaprićoza',
    description: 'Pelat, sir, šunka, šampinjoni, masline, origano',
    price: { '32cm': 700, '42cm': 1000, '50cm': 1300 },
    sizes: ['32cm', '42cm', '50cm'],
    category: 'pizze',
    badge: 'Popularno',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pizza-mesana',
    name: 'Mešana',
    description: 'Pelat, kačkavalj, šunka, slanina, kulen, šampinjoni, ljuta papričica',
    price: { '32cm': 750, '42cm': 1100, '50cm': 1400 },
    sizes: ['32cm', '42cm', '50cm'],
    category: 'pizze',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pizza-banatska',
    name: 'Banatska',
    description: 'Pelat, kačkavalj, šunka, slanina, kulen, domaći sir, crni luk, jaje',
    price: { '32cm': 750, '42cm': 1100, '50cm': 1400 },
    sizes: ['32cm', '42cm', '50cm'],
    category: 'pizze',
    badge: 'Lokalni specijalitet',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pizza-madarica',
    name: 'Mađarica',
    description: 'Svojstven ljuti sos, kačkavalj, kulen, ljuta kobasica, feferoni',
    price: { '32cm': 750, '42cm': 1100, '50cm': 1400 },
    sizes: ['32cm', '42cm', '50cm'],
    category: 'pizze',
    badge: 'Ljuto 🔥',
    image: 'https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pizza-pileca',
    name: 'Pileća',
    description: 'Pavlaka, kačkavalj, bareno pileće belo meso, kukuruz, šampinjoni',
    price: { '32cm': 700, '42cm': 1000, '50cm': 1300 },
    sizes: ['32cm', '42cm', '50cm'],
    category: 'pizze',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pizza-davolja',
    name: 'Đavolja',
    description: 'Pelat, kačkavalj, kulen, slanina, feferoni, kajmak, origano',
    price: { '32cm': 750, '42cm': 1100, '50cm': 1400 },
    sizes: ['32cm', '42cm', '50cm'],
    category: 'pizze',
    badge: 'Veoma ljuto 🌶️',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pizza-vegetarijana',
    name: 'Vegetarijana',
    description: 'Pelat, posni sir, šampinjoni, kukuruz, paprika, paradajz, masline',
    price: { '32cm': 700, '42cm': 1000, '50cm': 1300 },
    sizes: ['32cm', '42cm', '50cm'],
    category: 'pizze',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pizza-tuna',
    name: 'Pizza Tuna',
    description: 'Pelat, posni sir / kačkavalj, tunjevina, crni luk, masline, limun',
    price: { '32cm': 700, '42cm': 1000, '50cm': 1300 },
    sizes: ['32cm', '42cm', '50cm'],
    category: 'pizze',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pizza-parce',
    name: 'Pizza parče (Capricciosa)',
    description: 'Ukusno, sveže pečeno parče popularne Kaprićoze',
    price: 200,
    category: 'pizze',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pizza-parce-cola',
    name: 'Pizza parče + čaša Kole',
    description: 'Savršen brzi obrok u pokretu',
    price: 250,
    category: 'pizze',
    badge: 'Super ponuda 🥤',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80'
  },

  // SENDVIČI
  {
    id: 'sendvic-twix',
    name: 'TWIX sendvič',
    description: 'Domaći somun, premaz, suvi vrat / šunka, kačkavalj, zelena salata, prilozi po izboru',
    price: 190,
    category: 'sendvici',
    badge: 'Twin Choice',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendvic-skolski',
    name: 'Školski sendvič',
    description: 'Sveža kifla / somun, šunka, sir, namaz, kečap, majonez',
    price: 190,
    category: 'sendvici',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendvic-hotdog',
    name: 'Hot Dog',
    description: 'Kvalitetna viršla u toploj kifli sa senfom i kečapom',
    price: 190,
    category: 'sendvici',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendvic-duplihotdog',
    name: 'Dupli Hot Dog',
    description: 'Dve sočne viršle u toplom pecivu sa prilozima',
    price: 250,
    category: 'sendvici',
    badge: 'Popularno',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendvic-sunka',
    name: 'Sendvič sa šunkom',
    description: 'Somun, namaz, stišnjena šunka, kačkavalj, salata',
    price: 250,
    category: 'sendvici',
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendvic-kulen',
    name: 'Sendvič sa kulenom',
    description: 'Somun, pikantni namaz, kulen, kačkavalj, prilozi',
    price: 250,
    category: 'sendvici',
    badge: 'Pikantno',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendvic-pecenica',
    name: 'Sendvič sa pečenicom',
    description: 'Somun, kajmak/namaz, užička pečenica, sir, salata',
    price: 250,
    category: 'sendvici',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendvic-tunjevina',
    name: 'Sendvič sa tunjevinom',
    description: 'Somun, tunjevina, posni namaz, crni luk, kukuruz, zelena salata',
    price: 250,
    category: 'sendvici',
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendvic-klub',
    name: 'Klub sendvič',
    description: 'Tost hleb, piletina, slanina, jaje, kačkavalj, paradajz, majonez, pomfrit',
    price: 330,
    category: 'sendvici',
    badge: 'Rich Flavor',
    image: 'https://images.unsplash.com/photo-1567234607050-d9af96a4a902?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendvic-somun',
    name: 'Somun sendvič',
    description: 'Domaći somun, suhomesnato po želji, sir, namaz, prilozi',
    price: 300,
    category: 'sendvici',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80'
  },

  // ROŠTILJ
  {
    id: 'rostilj-mesano-1kg',
    name: 'Mešano meso 1kg',
    description: 'Tradicionalni miks sa roštilja: pljeskavica, belo meso, batak, kobasica, uštipci, pomfrit i luk',
    price: 1500,
    category: 'rostilj',
    badge: 'Najprodavanije 🏆',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rostilj-velika-pljeskavica',
    name: 'Velika pljeskavica',
    description: 'Sveže juneće i svinjsko meso 200g, lepinja, prilozi po izboru',
    price: 350,
    category: 'rostilj',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rostilj-punjena-pljeskavica',
    name: 'Punjena pljeskavica',
    description: 'Domaće meso punjeno finim topljenim kačkavaljem, lepinja, prilozi',
    price: 400,
    category: 'rostilj',
    badge: 'Preporuka',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rostilj-gurmanska',
    name: 'Gurmanska pljeskavica',
    description: 'Meso sa seckanom slaninom, krupnim kačkavaljem i malo ljute tucane paprike',
    price: 430,
    category: 'rostilj',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rostilj-belo-meso',
    name: 'Belo meso',
    description: 'Grilovani pileći file na ćumuru, svež i sočan, somun i prilozi',
    price: 380,
    category: 'rostilj',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rostilj-punjeno-belo-meso',
    name: 'Punjeno belo meso',
    description: 'Rolovani pileći file punjen kačkavaljem i šunkom, lepinja, prilozi',
    price: 400,
    category: 'rostilj',
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rostilj-batak',
    name: 'Batak',
    description: 'Sočan otkošćeni pileći batak sa roštilja na ćumuru, sveža lepinja',
    price: 380,
    category: 'rostilj',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rostilj-punjeni-batak',
    name: 'Punjeni batak',
    description: 'Otkošćeni batak punjen bogatim slojem kačkavalja i urolan, nezaboravan ukus',
    price: 400,
    category: 'rostilj',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rostilj-kobasica',
    name: 'Roštilj kobasica',
    description: 'Domaća blago dimljena roštilj kobasica u lepinji sa senfom i prilozima',
    price: 350,
    category: 'rostilj',
    image: 'https://images.unsplash.com/photo-1541014741259-df5290dbf82d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rostilj-pomfrit',
    name: 'Pomfrit',
    description: 'Velika porcija zlatnog, hrskavog pomfrita',
    price: 200,
    category: 'rostilj',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80'
  },

  // PALAČINKE
  {
    id: 'palacinke-eurokrem',
    name: 'Eurokrem',
    description: 'Slatka, sveža palačinka premazana originalnim Eurokremom',
    price: 200,
    category: 'palacinke',
    image: 'https://images.unsplash.com/photo-1622347489947-0aa025217983?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'palacinke-eurokrem-keks',
    name: 'Eurokrem + keks',
    description: 'Eurokrem sa finom mlevenom plazmom / keksom',
    price: 250,
    category: 'palacinke',
    image: 'https://images.unsplash.com/photo-1622347489947-0aa025217983?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'palacinke-nutela',
    name: 'Nutela',
    description: 'Originalni bogati čokoladni premaz od lješnjaka',
    price: 300,
    category: 'palacinke',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'palacinke-nutela-plazma',
    name: 'Nutela + Plazma',
    description: 'Najtraženija kombinacija prave Nutele i mlevene Plazme',
    price: 350,
    category: 'palacinke',
    badge: 'Bestseller 🌟',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'palacinke-kinder',
    name: 'Kinder Bueno',
    description: 'Kremasti Kinder Bueno sos sa čokoladnim prelivom',
    price: 300,
    category: 'palacinke',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'palacinke-kinder-plazma',
    name: 'Kinder Bueno + Plazma',
    description: 'Kinder Bueno preliv obogaćen sa mlevenom Plazmom',
    price: 350,
    category: 'palacinke',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'palacinke-nutela-visnja-plazma',
    name: 'Nutela + višnja + Plazma',
    description: 'Savršen miks slatke čokolade, kiselkastih višanja i hrskave Plazme',
    price: 350,
    category: 'palacinke',
    badge: 'Gurmanski izbor',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80'
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-p-1',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    category: 'pizze',
    title: 'Kaprićoza iz peći'
  },
  {
    id: 'g-p-2',
    url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    category: 'pizze',
    title: 'Banatska pizza sa bogatim nadevom'
  },
  {
    id: 'g-b-1',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    category: 'burgeri',
    title: 'Sočni TWIX Burger'
  },
  {
    id: 'g-b-2',
    url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    category: 'burgeri',
    title: 'Double Cheeseburger sa pomfritom'
  },
  {
    id: 'g-r-1',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    category: 'rostilj',
    title: 'Mešano meso roštilj'
  },
  {
    id: 'g-r-2',
    url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80',
    category: 'rostilj',
    title: ' Punjeno pileće belo meso'
  },
  {
    id: 'g-pa-1',
    url: 'https://images.unsplash.com/photo-1622347489947-0aa025217983?auto=format&fit=crop&w=800&q=80',
    category: 'palacinke',
    title: 'Palačinka Nutela Plazma'
  },
  {
    id: 'g-pa-2',
    url: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80',
    category: 'palacinke',
    title: 'Kinder Bueno desert palačinka'
  },
  {
    id: 'g-e-1',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    category: 'enterijer',
    title: 'Prijatan ambijent picerije TWIX'
  },
  {
    id: 'g-e-2',
    url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    category: 'enterijer',
    title: 'Priprema hrane u otvorenoj kuhinji'
  },
  {
    id: 'g-d-1',
    url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    category: 'dostava',
    title: 'Brza i topla dostava na Vašu adresu'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r-1',
    author: 'Marko J.',
    rating: 5,
    text: 'Pizza je zaista fantastična, 10/10.',
    date: 'Pre 3 dana'
  },
  {
    id: 'r-2',
    author: 'Jelena S.',
    rating: 5,
    text: 'Prijatan ambijent, sveža hrana i odlična dostava.',
    date: 'Pre 1 nedelju'
  },
  {
    id: 'r-3',
    author: 'Dragan K.',
    rating: 4.5,
    text: 'Odličan odnos cene i kvaliteta.',
    date: 'Pre 2 nedelje'
  },
  {
    id: 'r-4',
    author: 'Nikola M.',
    rating: 5,
    text: 'Veliki izbor hrane i veoma ljubazno osoblje.',
    date: 'Pre 1 mesec'
  },
  {
    id: 'r-5',
    author: 'Milica P.',
    rating: 4,
    text: 'Odlični burgeri sa jedinstvenim ukusom.',
    date: 'Pre 1 mesec'
  }
];

export const WORKING_HOURS = [
  { day: 'Ponedeljak', hours: '07:00–03:00' },
  { day: 'Utorak', hours: '07:00–03:00' },
  { day: 'Sreda', hours: '07:00–03:00' },
  { day: 'Četvrtak', hours: '07:00–03:00' },
  { day: 'Petak', hours: '07:00–03:00' },
  { day: 'Subota', hours: '08:00–03:00' },
  { day: 'Nedelja', hours: '10:00–02:00' }
];
