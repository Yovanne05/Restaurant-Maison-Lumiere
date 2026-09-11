import { registerService } from "../kernel";
import type {
  Experience,
  FaqEntry,
  GalleryItem,
  Identity,
  OpeningDay,
  StoryChapter,
  TeamMember,
  Value,
} from "./contract";

export * from "./contract";

const identity: Identity = {
  name: "Maison Lumière",
  baseline: "Bistronomie de quartier, Paris 11e",
  shortPitch:
    "Une salle en bois clair, une cuisine ouverte et une carte qui change avec le marché. On y vient pour un déjeuner rapide, on y reste jusqu'à la dernière tournée.",
  addressLine: "18 rue des Trois Bornes",
  postalCode: "75011",
  city: "Paris",
  phone: "+33 1 84 25 09 11",
  email: "bonjour@maisonlumiere.fr",
  mapsUrl: "https://www.openstreetmap.org/search?query=18%20rue%20des%20Trois%20Bornes%2075011%20Paris",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "The Fork", href: "https://thefork.fr" },
  ],
  foundedYear: 2017,
};

const openingHours: readonly OpeningDay[] = [
  { weekday: "Lundi", shortWeekday: "Lun", index: 1, services: [], closed: true },
  {
    weekday: "Mardi",
    shortWeekday: "Mar",
    index: 2,
    services: [
      { label: "Déjeuner", range: "12h00 – 14h30" },
      { label: "Dîner", range: "19h00 – 23h00" },
    ],
    closed: false,
  },
  {
    weekday: "Mercredi",
    shortWeekday: "Mer",
    index: 3,
    services: [
      { label: "Déjeuner", range: "12h00 – 14h30" },
      { label: "Dîner", range: "19h00 – 23h00" },
    ],
    closed: false,
  },
  {
    weekday: "Jeudi",
    shortWeekday: "Jeu",
    index: 4,
    services: [
      { label: "Déjeuner", range: "12h00 – 14h30" },
      { label: "Dîner", range: "19h00 – 23h00" },
    ],
    closed: false,
  },
  {
    weekday: "Vendredi",
    shortWeekday: "Ven",
    index: 5,
    services: [
      { label: "Déjeuner", range: "12h00 – 14h30" },
      { label: "Dîner", range: "19h00 – 00h00" },
    ],
    closed: false,
  },
  {
    weekday: "Samedi",
    shortWeekday: "Sam",
    index: 6,
    services: [
      { label: "Brunch", range: "10h00 – 15h00" },
      { label: "Dîner", range: "19h00 – 00h00" },
    ],
    closed: false,
  },
  {
    weekday: "Dimanche",
    shortWeekday: "Dim",
    index: 0,
    services: [{ label: "Brunch", range: "10h00 – 15h30" }],
    closed: false,
  },
];

const story: readonly StoryChapter[] = [
  {
    id: "chap_01",
    year: "2017",
    title: "Une boulangerie vide",
    body: "Camille Rousseau pousse la porte d'un ancien fournil abandonné rue des Trois Bornes. Le four est mort, la verrière est noire de suie, mais la lumière tombe juste. Le bail est signé en trois jours.",
  },
  {
    id: "chap_02",
    year: "2019",
    title: "La cuisine s'ouvre",
    body: "Le mur qui séparait la salle du piano tombe. Depuis, les clients voient tout : le dressage, les coups de feu, les fous rires. La carte se réduit à douze lignes et change chaque semaine.",
  },
  {
    id: "chap_03",
    year: "2022",
    title: "Le circuit court, vraiment",
    body: "Neuf producteurs, tous à moins de 250 km, sauf le café et les agrumes. Les livraisons arrivent le matin, la carte du soir s'écrit à midi. Rien n'est congelé, rien n'est jeté.",
  },
  {
    id: "chap_04",
    year: "2026",
    title: "Toujours la même table",
    body: "Quarante-deux couverts, un comptoir de neuf places, une grande tablée pour ceux qui ne se connaissent pas encore. On a grandi sans s'agrandir.",
  },
];

const values: readonly Value[] = [
  {
    id: "val_01",
    title: "Le marché décide",
    body: "La carte s'écrit après la livraison, pas avant. Si le poisson n'est pas beau, il ne sort pas de la cuisine.",
  },
  {
    id: "val_02",
    title: "Tout est fait ici",
    body: "Le pain, la brioche, les glaces, les cornichons, les amers du bar. La seule chose qu'on ne fait pas, c'est le café — on le laisse à ceux qui le font mieux.",
  },
  {
    id: "val_03",
    title: "Une salle qui respire",
    body: "Quarante-deux couverts et pas un de plus. On préfère refuser du monde que servir tiède.",
  },
  {
    id: "val_04",
    title: "Des prix lisibles",
    body: "Pas de supplément caché, pas de service en sus, l'eau filtrée est offerte. Le prix affiché est le prix payé.",
  },
];

const gallery: readonly GalleryItem[] = [
  {
    id: "gal_01",
    src: "/media/venue/salle.jpg",
    alt: "Salle du restaurant avec tables en bois clair et banquettes sombres",
    caption: "La salle, avant le coup de feu",
    shape: "grande",
  },
  {
    id: "gal_02",
    src: "/media/venue/comptoir.jpg",
    alt: "Comptoir du bar avec ardoise et bouteilles alignées",
    caption: "Neuf places au comptoir",
    shape: "paysage",
  },
  {
    id: "gal_03",
    src: "/media/venue/marche.jpg",
    alt: "Étal de légumes frais vu de dessus",
    caption: "La livraison du mardi",
    shape: "carre",
  },
  {
    id: "gal_04",
    src: "/media/venue/vitrine.jpg",
    alt: "Vitrine éclairée du restaurant vue de la rue, le soir",
    caption: "Rue des Trois Bornes, 22h",
    shape: "portrait",
  },
  {
    id: "gal_05",
    src: "/media/venue/grande-tablee.jpg",
    alt: "Grande tablée animée avec de nombreux convives",
    caption: "La grande tablée du vendredi",
    shape: "paysage",
  },
  {
    id: "gal_06",
    src: "/media/venue/partage.jpg",
    alt: "Plats partagés vus de dessus autour d'une table",
    caption: "Tout se partage",
    shape: "carre",
  },
  {
    id: "gal_07",
    src: "/media/venue/atelier.jpg",
    alt: "Grande salle lumineuse avec verrière et mobilier en bois",
    caption: "L'ancien fournil, sous la verrière",
    shape: "paysage",
  },
  {
    id: "gal_08",
    src: "/media/venue/service.jpg",
    alt: "Convives attablés en train de partager un repas",
    caption: "Un mercredi ordinaire",
    shape: "paysage",
  },
];

const experiences: readonly Experience[] = [
  {
    id: "exp_01",
    title: "La table du chef",
    description:
      "Six places face au piano, un menu en sept services décidé le matin même, commenté au fil du repas.",
    detail: "Jeudi et vendredi soir · 6 personnes maximum",
    image: {
      src: "/media/venue/brasserie.jpg",
      alt: "Cuisine ouverte et comptoir de dressage du restaurant",
    },
    priceLabel: "95 € par personne",
  },
  {
    id: "exp_02",
    title: "Privatisation",
    description:
      "La salle entière pour une soirée : anniversaire, lancement, repas d'équipe. On déplace les tables, on adapte la carte.",
    detail: "42 couverts assis · 70 debout",
    image: {
      src: "/media/venue/grande-tablee.jpg",
      alt: "Longue tablée occupée par un groupe de convives",
    },
    priceLabel: "Sur devis",
  },
  {
    id: "exp_03",
    title: "Terrasse d'été",
    description:
      "Dix-huit places au soleil dès les beaux jours, carte raccourcie et bar à spritz jusqu'à minuit.",
    detail: "De mai à septembre · sans réservation",
    image: {
      src: "/media/venue/terrasse.jpg",
      alt: "Terrasse aménagée avec tables dressées face à l'eau",
    },
    priceLabel: "À la carte",
  },
];

const faq: readonly FaqEntry[] = [
  {
    id: "faq_01",
    question: "Peut-on venir sans réserver ?",
    answer:
      "Oui, le comptoir garde neuf places sans réservation à chaque service. Pour une table en salle, mieux vaut réserver, surtout du jeudi au samedi.",
  },
  {
    id: "faq_02",
    question: "Avez-vous des options végétariennes ?",
    answer:
      "Toujours : au moins une entrée, un plat et un dessert sans produit animal carné. Les plats véganes et sans gluten sont signalés sur la carte.",
  },
  {
    id: "faq_03",
    question: "Est-ce accessible en fauteuil ?",
    answer:
      "La salle est de plain-pied depuis la rue et les toilettes sont adaptées. Prévenez-nous à la réservation, on garde une table près de l'entrée.",
  },
  {
    id: "faq_04",
    question: "Acceptez-vous les groupes ?",
    answer:
      "Jusqu'à 8 personnes en réservation en ligne. Au-delà, écrivez-nous : la grande tablée accueille 14 couverts et la salle entière se privatise.",
  },
  {
    id: "faq_05",
    question: "Les enfants sont-ils les bienvenus ?",
    answer:
      "Bien sûr. Chaises hautes, demi-portions sur demande et une glace maison offerte aux moins de dix ans le dimanche.",
  },
];

const team: readonly TeamMember[] = [
  {
    id: "team_01",
    name: "Camille Rousseau",
    role: "Cheffe et fondatrice",
    bio: "Passée par une maison étoilée lyonnaise puis par quatre ans de cuisine de rue à Lisbonne. Écrit la carte chaque lundi soir, à la main.",
  },
  {
    id: "team_02",
    name: "Idriss Benali",
    role: "Chef de cuisine",
    bio: "Tient le poste chaud depuis 2019. Responsable de la côte de cochon, et de la playlist du service du soir.",
  },
  {
    id: "team_03",
    name: "Léa Marchand",
    role: "Cheffe pâtissière",
    bio: "Arrivée pour un extra d'un week-end, restée six ans. Le pain perdu est sa faute.",
  },
  {
    id: "team_04",
    name: "Tom Abadie",
    role: "Chef de salle et barman",
    bio: "Infuse ses amers dans l'arrière-cuisine. Connaît le prénom de la moitié du quartier.",
  },
];

/** Enregistrement du service dans le mesh. */
export const contentService = registerService({
  name: "content",
  version: "1.0.4",
  latencyMs: 0,
  operations: {
    getIdentity: (): Identity => identity,
    getOpeningHours: (): readonly OpeningDay[] => openingHours,
    getStory: (): readonly StoryChapter[] => story,
    getValues: (): readonly Value[] => values,
    getGallery: (payload: { limit?: number } = {}): readonly GalleryItem[] =>
      payload?.limit ? gallery.slice(0, payload.limit) : gallery,
    getExperiences: (): readonly Experience[] => experiences,
    getFaq: (): readonly FaqEntry[] => faq,
    getTeam: (): readonly TeamMember[] => team,
  },
});
