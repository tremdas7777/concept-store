/**
 * Formato do catálogo como vem do banco (tabelas collections / products / product_variants).
 * A loja monta os produtos da vitrine (src/lib/bundles.ts) a partir disto; o importador CSV
 * do admin grava neste mesmo formato.
 */

export type CatalogCollection = {
  slug: string;
  name: string;
  description: string;
  image: string | null;
  sort: number;
};

export type CatalogVariant = {
  /** Valores na ordem das opções do produto (ex.: ["Preto", "42"]). */
  values: string[];
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  /** null = sem controle de estoque (sempre disponível). */
  stock: number | null;
  image: string | null;
};

export type CatalogProduct = {
  handle: string;
  title: string;
  /** Texto da descrição (parágrafos separados por linha em branco). */
  description: string;
  productType: string | null;
  vendor: string | null;
  tags: string[];
  /** Coleções (slugs); a primeira é a principal. */
  collections: string[];
  options: { name: string; values: string[] }[];
  variants: CatalogVariant[];
  images: string[];
  sort: number;
};

export type CatalogData = {
  collections: CatalogCollection[];
  products: CatalogProduct[];
  /** "db" = veio do banco; "seed" = catálogo inicial do código (banco vazio ou desligado). */
  source: "db" | "seed";
  /** Muda quando o catálogo muda (evita remontar a vitrine à toa). */
  version?: string;
};

const fotos = (slug: string, n: number, cover = 1) => {
  const all = Array.from({ length: n }, (_, i) => `/produtos/${slug}-${i + 1}.webp`);
  const c = all[cover - 1] ?? all[0]!;
  return [c, ...all.filter((x) => x !== c)];
};

const JEANS = ["38", "40", "42", "44", "46", "48"];

type SeedPiece = {
  handle: string;
  title: string;
  collection: string;
  price: number;
  compareAt?: number;
  sizes: string[];
  photos: string[];
  lavagem: string;
};

const TEXTO: Record<string, (p: SeedPiece) => string> = {
  calcas: (p) =>
    `Calça jogador em jeans: ajustada na perna e afunilada no tornozelo, para cair certinho em cima do tênis.\n\nLavagem ${p.lavagem.toLowerCase()}. Combina com camiseta lisa, oversized ou polo, do rolê ao trabalho.`,
  over: (p) =>
    `Calça jeans com modelagem balão: mais larga no quadril e na perna, no estilo streetwear.\n\nLavagem ${p.lavagem.toLowerCase()}. Vai bem com camiseta oversized e tênis de solado alto.`,
  bermudas: (p) =>
    `Bermuda jogador em jeans: ajustada na coxa e com comprimento acima do joelho.\n\nLavagem ${p.lavagem.toLowerCase()}. Para o calor de todo dia, com camiseta ou regata.`,
  alfaiataria: () =>
    "Tecido de alfaiataria com corte jogger: reta na coxa e afunilada na barra.\n\nTem regulagem na cintura, então dá para ajustar sem cinto. Fica bem com tênis branco, mocassim ou polo de tricô.",
  trico: (p) =>
    `Polo de tricô texturizado com gola e meio zíper, na cor ${p.lavagem.toLowerCase()}.\n\nUsa com calça de alfaiataria para um visual arrumado ou com jeans no dia a dia.`,
};

const PIECES: SeedPiece[] = [
  {
    handle: "calca-jogador-azul-medio",
    title: "Calça Jogador Jeans Azul Médio",
    collection: "calcas",
    price: 189.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-basic-jeans", 4),
    lavagem: "Azul médio",
  },
  {
    handle: "calca-jogador-grafite-lavada",
    title: "Calça Jogador Jeans Grafite Lavada",
    collection: "calcas",
    price: 189.9,
    compareAt: 249.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-city-cinza-mat", 4),
    lavagem: "Grafite estonada",
  },
  {
    handle: "calca-jogador-chumbo",
    title: "Calça Jogador Jeans Chumbo",
    collection: "calcas",
    price: 189.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-city-cinza-mescla-escuro", 4),
    lavagem: "Cinza chumbo",
  },
  {
    handle: "calca-jogador-cinza-destroyed",
    title: "Calça Jogador Jeans Cinza Destroyed",
    collection: "calcas",
    price: 189.9,
    compareAt: 249.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-city-cinza-rasgo", 4),
    lavagem: "Cinza com puídos e rasgos",
  },
  {
    handle: "calca-jogador-cinza-puida",
    title: "Calça Jogador Jeans Cinza Puída",
    collection: "calcas",
    price: 189.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-city-cinza-rasgo-p", 3),
    lavagem: "Cinza claro com puídos",
  },
  {
    handle: "calca-jogador-cinza-classica",
    title: "Calça Jogador Jeans Cinza Clássica",
    collection: "calcas",
    price: 189.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-city-cinzac", 3),
    lavagem: "Cinza liso",
  },
  {
    handle: "calca-jogador-marmorizada",
    title: "Calça Jogador Jeans Marmorizada",
    collection: "calcas",
    price: 189.9,
    compareAt: 249.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-city-ciza-marmorizada", 4),
    lavagem: "Grafite marmorizado",
  },
  {
    handle: "calca-jogador-black-patches",
    title: "Calça Jogador Jeans Black Patches",
    collection: "calcas",
    price: 189.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-city-quadrado-cinza-x", 3),
    lavagem: "Preto lavado com patches",
  },
  {
    handle: "calca-jogador-azul-claro",
    title: "Calça Jogador Jeans Azul Claro",
    collection: "calcas",
    price: 189.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-jeans", 4),
    lavagem: "Azul claro",
  },
  {
    handle: "calca-jogador-azul-escuro-destroyed",
    title: "Calça Jogador Jeans Azul Escuro Destroyed",
    collection: "calcas",
    price: 189.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-jeans-2", 4),
    lavagem: "Azul escuro com rasgos",
  },
  {
    handle: "calca-jogador-gelo-joelho-rasgado",
    title: "Calça Jogador Jeans Gelo Joelho Rasgado",
    collection: "calcas",
    price: 189.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-jeans-lisa", 2, 2),
    lavagem: "Azul gelo com rasgo no joelho",
  },
  {
    handle: "calca-jogador-black-denim",
    title: "Calça Jogador Black Denim",
    collection: "calcas",
    price: 189.9,
    sizes: JEANS,
    photos: fotos("calca-jogador-lipse-black-denim", 3),
    lavagem: "Preto",
  },
  {
    handle: "calca-over-balao-grafite",
    title: "Calça Jeans Over Balão Grafite",
    collection: "over",
    price: 189.9,
    sizes: ["44", "46"],
    // Recortes sem as sacolas da loja de referência que aparecem nas fotos originais.
    photos: [2, 1, 3, 4, 5].map((n) => `/produtos/calca-over-balao-c${n}.webp`),
    lavagem: "Grafite",
  },
  {
    handle: "calca-over-balao-chumbo",
    title: "Calça Jeans Over Balão Chumbo",
    collection: "over",
    price: 189.9,
    sizes: ["44", "46"],
    photos: [1, 2].map((n) => `/produtos/calca-over-balao-cree-c${n}.webp`),
    lavagem: "Cinza chumbo",
  },
  {
    handle: "bermuda-jeans-destroyed-grafite",
    title: "Bermuda Jeans Destroyed Grafite",
    collection: "bermudas",
    price: 149.9,
    sizes: ["38", "40", "42", "44"],
    photos: fotos("berma-jogador-city-cinza-esx", 5, 2),
    lavagem: "Grafite com puídos",
  },
  {
    handle: "bermuda-jeans-destroyed-gelo",
    title: "Bermuda Jeans Destroyed Gelo",
    collection: "bermudas",
    price: 149.9,
    sizes: ["38", "40", "42", "44"],
    photos: fotos("berma-jogador-city-cinza-listra", 5, 2),
    lavagem: "Gelo com puídos",
  },
  {
    handle: "bermuda-jeans-preta-faixa-lateral",
    title: "Bermuda Jeans Preta Faixa Lateral",
    collection: "bermudas",
    price: 149.9,
    compareAt: 189.9,
    sizes: ["38", "40", "42", "44"],
    photos: fotos("berma-jogador-jeans-preto", 3, 2),
    lavagem: "Preto com faixa lateral",
  },
  {
    handle: "calca-alfaiataria-jogger-gelo",
    title: "Calça Alfaiataria Jogger Gelo",
    collection: "alfaiataria",
    price: 219.9,
    sizes: ["38", "40", "42"],
    photos: fotos("calca-alfaiataria-com-regulagem-cintura", 5),
    lavagem: "Gelo",
  },
  {
    handle: "calca-alfaiataria-jogger-marinho",
    title: "Calça Alfaiataria Jogger Marinho",
    collection: "alfaiataria",
    price: 219.9,
    sizes: JEANS,
    photos: fotos("calca-alfaiataria-com-regulagem-na-cintura", 5),
    lavagem: "Azul marinho",
  },
  {
    handle: "polo-trico-meio-ziper-gelo",
    title: "Polo Tricô Meio Zíper Gelo",
    collection: "trico",
    price: 249.9,
    compareAt: 350,
    sizes: ["P", "G"],
    photos: fotos("jaqueta-polo-trico-meio-ziper", 5),
    lavagem: "Gelo",
  },
];

export const SEED_COLLECTIONS: CatalogCollection[] = [
  {
    slug: "calcas",
    name: "Calças Jogador",
    description: "Jeans slim com barra afunilada, do claro ao black",
    image: "/produtos/calca-jogador-city-cinza-rasgo-1.webp",
    sort: 1,
  },
  {
    slug: "bermudas",
    name: "Bermudas",
    description: "Bermudas jogador em jeans, lisas e destroyed",
    image: "/produtos/berma-jogador-city-cinza-esx-2.webp",
    sort: 2,
  },
  {
    slug: "over",
    name: "Calças Over",
    description: "Modelagem balão, larga e confortável",
    image: "/produtos/calca-over-balao-c2.webp",
    sort: 3,
  },
  {
    slug: "alfaiataria",
    name: "Alfaiataria",
    description: "Calças de alfaiataria com regulagem na cintura",
    image: "/produtos/calca-alfaiataria-com-regulagem-cintura-1.webp",
    sort: 4,
  },
  {
    slug: "trico",
    name: "Tricô",
    description: "Polos de tricô com meio zíper",
    image: "/produtos/jaqueta-polo-trico-meio-ziper-1.webp",
    sort: 5,
  },
];

export const SEED_PRODUCTS: CatalogProduct[] = PIECES.map((p, i) => ({
  handle: p.handle,
  title: p.title,
  description: TEXTO[p.collection]!(p),
  productType: SEED_COLLECTIONS.find((c) => c.slug === p.collection)!.name,
  vendor: null,
  tags: [],
  collections: [p.collection],
  options: [{ name: "Tamanho", values: p.sizes }],
  variants: p.sizes.map((s) => ({
    values: [s],
    sku: null,
    price: p.price,
    compareAtPrice: p.compareAt ?? null,
    stock: null,
    image: null,
  })),
  images: p.photos,
  sort: i,
}));

export const SEED_CATALOG: CatalogData = {
  collections: SEED_COLLECTIONS,
  products: SEED_PRODUCTS,
  source: "seed",
};
