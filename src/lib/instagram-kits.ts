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
  title: `Kit Brownstore ${String(index + 1).padStart(2, "0")}`,
  description:
    "Kit selecionado a partir de uma publicação pública do Instagram da Brownstore. Consulte disponibilidade e tamanhos antes de finalizar o pedido.",
  productType: "Kit",
  vendor: "Brownstore",
  tags: ["kit", "instagram", "brownstore"],
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
  images: [
    `/instagram-kits/kit-${String(index + 1).padStart(2, "0")}-1.jpg`,
    `/instagram-kits/kit-${String(index + 1).padStart(2, "0")}-2.jpg`,
  ],
  sort: -1000 + index,
}));
