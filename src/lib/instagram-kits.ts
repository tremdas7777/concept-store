import type { CatalogProduct } from "@/lib/catalog-data";

const posts = [
  "DeuDwYTkZZC",
  "Det76UQEX7t",
  "Desi0JvEcxk",
  "DesDyzYDyoj",
  "DergpxLkdaT",
  "DerdrsLkQx-",
  "DerZA9-EXt_",
  "DerYXmaEe3c",
  "DemQwkYkTwT",
  "Def0cjQkcbB",
  "DefV9iDjwPA",
  "Deed-i-EaNk",
  "Dec9JF4kdAV",
  "DeUarfvEcdt",
  "DePNdx2kY88",
  "DeNMWvWjx03",
  "DeMkwJKEbuh",
  "DeLEnbpkQRF",
  "DeKoNLaD7of",
  "DeKhws4jy0t",
];

export const INSTAGRAM_KITS: CatalogProduct[] = posts.map((post, index) => ({
  handle: `kit-instagram-${String(index + 1).padStart(2, "0")}`,
  title: `Kit Norte Concept ${index + 1}`,
  description:
    "Kit exclusivo Norte Concept. Escolha as peças e os tamanhos disponíveis antes de finalizar o pedido.",
  productType: "Kit",
  vendor: "Norte Concept",
  tags: ["kit", "norte-concept"],
  collections: ["kits"],
  options: [{ name: "Tamanho", values: ["Único"] }],
  variants: [
    {
      values: ["Único"],
      sku: `BRNW-KIT-${String(index + 1).padStart(2, "0")}`,
      price: 179.9,
      compareAtPrice: null,
      stock: null,
      image: `/instagram-kits/kit-${String(index + 1).padStart(2, "0")}-1.jpg`,
    },
  ],
  images: [`/instagram-kits/kit-${String(index + 1).padStart(2, "0")}-1.jpg`],
  sort: -1000 + index,
}));
