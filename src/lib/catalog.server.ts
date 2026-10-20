import { setCatalogData } from "@/lib/bundles";
import { CATALOG_MEDIA } from "@/lib/catalog-media";
import { CATALOG_MEDIA_BY_TITLE } from "@/lib/catalog-media-title";
import {
  SEED_CATALOG,
  type CatalogCollection,
  type CatalogData,
  type CatalogProduct,
} from "@/lib/catalog-data";

const TTL_MS = 30_000;
let cache: { at: number; data: CatalogData } | null = null;

const titleKey = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const mediaForTitle = (title: string) => CATALOG_MEDIA_BY_TITLE[titleKey(title)] ?? [];

export function catalogDbConfigured() {
  const url = process.env["SUPABASE_URL"] ?? "";
  return !!url && !url.includes("seu-projeto-id") && !!process.env["SUPABASE_SERVICE_ROLE_KEY"];
}

type Opt = { name: string; values: string[] };
const asOptions = (j: unknown): Opt[] =>
  Array.isArray(j)
    ? j
        .filter(
          (o): o is Opt =>
            !!o &&
            typeof (o as Opt).name === "string" &&
            Array.isArray((o as Opt).values) &&
            (o as Opt).values.every((v) => typeof v === "string"),
        )
        .map((o) => ({ name: o.name, values: o.values }))
    : [];

const optionsFromVariants = (raw: unknown, variants: { values: string[] }[]): Opt[] => {
  const saved = asOptions(raw);
  const count = Math.max(saved.length, ...variants.map((v) => v.values.length), 0);
  if (!count) return [];
  return Array.from({ length: count }, (_, i) => {
    const savedName = saved[i]?.name?.trim();
    const name =
      savedName || (count > 1 && i === 0 ? "Cor" : i === 1 ? "Tamanho" : `Opção ${i + 1}`);
    const values = [
      ...(saved[i]?.values ?? []),
      ...variants.map((v) => v.values[i]).filter((v): v is string => !!v),
    ];
    return { name, values: [...new Set(values)] };
  });
};

async function readDb(): Promise<CatalogData | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const cols = await supabaseAdmin
    .from("collections")
    .select("id,slug,name,description,image,sort,updated_at")
    .order("sort");
  if (cols.error) throw new Error(cols.error.message);
  const PAGE = 1000;
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const page = await supabaseAdmin
      .from("products")
      .select(
        "id,handle,title,description,product_type,vendor,tags,options,images,sort,updated_at,product_variants(position,option_values,sku,price,compare_at_price,stock,image),product_collections(position,collection_id)",
      )
      .eq("status", "active")
      .order("sort")
      .order("created_at")
      .range(from, from + PAGE - 1);
    if (page.error) throw new Error(page.error.message);
    rows.push(...(page.data as unknown as DbProduct[]));
    if (page.data.length < PAGE) break;
  }
  if (!rows.length) return null;
  const slugById = new Map(cols.data.map((c) => [c.id, c.slug]));
  const collections: CatalogCollection[] = cols.data.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    sort: c.sort,
  }));
  const products: CatalogProduct[] = rows
    .map((p) => {
      const images = CATALOG_MEDIA[p.handle]?.length
        ? CATALOG_MEDIA[p.handle]
        : mediaForTitle(p.title).length
          ? mediaForTitle(p.title)
          : (p.images ?? []).filter((url) => !!url && url !== "/placeholder.svg");
      const variants = [...(p.product_variants ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((v) => ({
          values: v.option_values ?? [],
          sku: v.sku,
          price: Number(v.price),
          compareAtPrice: v.compare_at_price === null ? null : Number(v.compare_at_price),
          stock: v.stock,
          image: v.image,
        }));
      return {
        handle: p.handle,
        title: p.title,
        description: p.description,
        productType: p.product_type,
        vendor: p.vendor,
        tags: p.tags ?? [],
        collections: [...(p.product_collections ?? [])]
          .sort((a, b) => a.position - b.position)
          .map((pc) => slugById.get(pc.collection_id))
          .filter((s): s is string => !!s),
        options: optionsFromVariants(p.options, variants),
        variants,
        images,
        sort: p.sort,
        _hasImage: images.length > 0,
      } as CatalogProduct & { _hasImage: boolean };
    })
    .filter((p) => p._hasImage)
    .map(({ _hasImage, ...p }) => p as CatalogProduct);
  const stamps = [...rows.map((r) => r.updated_at), ...cols.data.map((c) => c.updated_at)].sort();
  return {
    collections,
    products,
    source: "db",
    version: `db:${products.length}:${stamps.at(-1) ?? ""}`,
  };
}

type DbProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  product_type: string | null;
  vendor: string | null;
  tags: string[] | null;
  options: unknown;
  images: string[] | null;
  sort: number;
  updated_at: string;
  product_variants: {
    position: number;
    option_values: string[] | null;
    sku: string | null;
    price: number | string;
    compare_at_price: number | string | null;
    stock: number | null;
    image: string | null;
  }[];
  product_collections: { position: number; collection_id: string }[];
};

export async function loadCatalog(force = false): Promise<CatalogData> {
  if (!force && cache && Date.now() - cache.at < TTL_MS) return cache.data;
  let data: CatalogData = SEED_CATALOG;
  if (catalogDbConfigured()) {
    try {
      data = (await readDb()) ?? SEED_CATALOG;
    } catch (e) {
      console.error("[catalogo] não consegui ler o banco; usando o catálogo inicial:", e);
      if (cache) data = cache.data;
    }
  }
  cache = { at: Date.now(), data };
  return data;
}
export function invalidateCatalog() {
  cache = null;
}
export async function ensureCatalog() {
  setCatalogData(await loadCatalog());
}
