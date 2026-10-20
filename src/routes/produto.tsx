import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown, ChevronRight, ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { KitPicker } from "@/components/shop/KitPicker";
import { ProductCard } from "@/components/shop/ProductCard";
import { Shelf } from "@/components/shop/Shelf";
import { usePayInfo } from "@/hooks/usePayInfo";
import { brand } from "@/lib/brand";
import { FAQ } from "@/lib/faq";
import { metaTrack } from "@/lib/meta-pixel";
import { trackCheckoutClick } from "@/lib/analytics";
import { addToCart, markCartCheckout, setCartOpen } from "@/lib/cart";
import { bundleIdFromSearch, planSearchSchema } from "@/lib/plan-search";
import {
  availableValues,
  brl,
  bundleShippingLabel,
  discountPct,
  encodeVariant,
  getBundle,
  getCategories,
  installment,
  kitBundles,
  listedBundles,
  parseVariant,
  productLabel,
  withVariantPrice,
  type Bundle,
} from "@/lib/bundles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produto")({
  validateSearch: planSearchSchema,
  loaderDeps: ({ search }) => ({ plano: search.plano }),
  // Só repassa o id: o catálogo é carregado na raiz (pode vir do banco).
  loader: ({ deps }) => ({ plano: deps.plano ?? null }),
  head: ({ loaderData }) => {
    const p = getBundle(bundleIdFromSearch({ plano: loaderData?.plano ?? undefined }));
    const title = `${p.name} | ${brand.name}`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `${p.name}: ${p.checkoutProductDescription} ${bundleShippingLabel(p)}.`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: p.checkoutProductDescription },
        { property: "og:image", content: p.img },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: `/produto?plano=${encodeURIComponent(p.id)}` }],
    };
  },
  component: Page,
});

const COLOR_OPTION = /^(cor|cores|color|colour)$/i;
const SWATCH: [RegExp, string][] = [
  [/pret|black/i, "#111"],
  [/branc|white|off/i, "#f5f5f2"],
  [/gelo/i, "#e6e7e3"],
  [/grafite|chumbo/i, "#4a4c50"],
  [/cinza|gray|grey/i, "#9a9b9e"],
  [/marinho|navy/i, "#1d2a4d"],
  [/azul|blue/i, "#3c64b1"],
  [/verde|green/i, "#3d6b45"],
  [/vermelh|red/i, "#b3262b"],
  [/bege|nude/i, "#d8c6a8"],
  [/marrom|brown/i, "#6b4a33"],
  [/rosa|pink/i, "#e7a7b8"],
  [/amarel|yellow/i, "#e8c547"],
];
const swatch = (v: string) => SWATCH.find(([re]) => re.test(v))?.[1];

function Gallery({ p, images }: { p: Bundle; images: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    ref.current?.scrollTo({ left: 0 });
    setI(0);
  }, [images]);
  return (
    <>
      {/* Celular: arrasta as fotos */}
      <div className="relative -mx-4 md:hidden">
        <div
          ref={ref}
          onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, k) => (
            <div key={src} className="aspect-[3/4] w-full shrink-0 snap-start bg-[var(--tile)]">
              <img
                src={src}
                alt={k === 0 ? p.name : ""}
                loading={k === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 text-[11px] font-bold">
            {i + 1}/{images.length}
          </span>
        )}
      </div>
      {/* Computador: grade de fotos */}
      <div className="hidden gap-2 md:grid md:grid-cols-2">
        {images.map((src, k) => (
          <div
            key={src}
            className={cn("aspect-[3/4] bg-[var(--tile)]", k === 0 && images.length % 2 === 1 && "col-span-2 aspect-[4/5]")}
          >
            <img
              src={src}
              alt={k === 0 ? p.name : ""}
              loading={k < 2 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}

function Accordion({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <div className="border-t border-[var(--ink)]">
      {items.map((it, k) => (
        <details key={it.title} open={k === 0} className="group border-b border-[var(--line)] py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[12.5px] font-extrabold uppercase tracking-[0.1em] [&::-webkit-details-marker]:hidden">
            {it.title}
            <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
          </summary>
          <div className="mt-3 text-[14px] leading-relaxed text-[var(--ink)]/70">{it.body}</div>
        </details>
      ))}
    </div>
  );
}

function Page() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const pay = usePayInfo();
  const p = getBundle(bundleIdFromSearch(search));
  const category = getCategories().find((c) => c.id === p.category);

  // Valores escolhidos, na ordem das opções (kits: peça e tamanho de cada vaga).
  const [vals, setVals] = useState<(string | undefined)[]>([]);
  const [nudge, setNudge] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Troca de produto: zera as escolhas (produto de uma opção só com um valor já vem marcado).
  useEffect(() => {
    setVals(p.options.map((o) => (o.values.length === 1 && !p.kit ? o.values[0] : undefined)));
    setNudge(false);
  }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    metaTrack("ViewContent", { value: p.price, contentName: p.name });
  }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const setAt = (i: number, v: string | undefined) => {
    setVals((cur) => {
      const next = [...cur];
      next[i] = v;
      return next;
    });
    setNudge(false);
  };

  const chosen = p.options.map((_, i) => vals[i]);
  const complete = chosen.every(Boolean) && !!parseVariant(p, encodeVariant(chosen as string[]));
  const priced = complete ? withVariantPrice(p, chosen as string[]) : p;
  const off = discountPct(priced);

  // Foto da cor escolhida vai para a frente.
  const images = useMemo(() => {
    const colorImg = chosen.map((v) => (v ? p.optionImages?.[v] : undefined)).find(Boolean);
    return colorImg ? [colorImg, ...p.images.filter((x) => x !== colorImg)] : p.images;
  }, [p, chosen.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  const ready = () => {
    if (complete) return true;
    setNudge(true);
    optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  };
  const values = chosen as string[];
  const buy = () => {
    if (!ready()) return;
    markCartCheckout(false);
    trackCheckoutClick({
      source: "product_page",
      bundleId: p.id,
      bundleName: productLabel(p, values).slice(0, 80),
      value: priced.price,
    });
    navigate({
      to: "/checkout",
      search: { plano: p.id, ...(values.length ? { variante: encodeVariant(values) } : {}) },
    });
  };
  const addCart = () => {
    if (!ready()) return;
    addToCart({ plano: p.id, ...(values.length ? { variante: encodeVariant(values) } : {}) });
    metaTrack("AddToCart", { value: priced.price, contentName: p.name });
    setCartOpen(true);
  };

  const missingCount = chosen.filter((v) => !v).length;
  const buyLabel = p.soldOut
    ? "Esgotado"
    : complete
      ? "Comprar agora"
      : p.kit
        ? "Monte o kit"
        : `Escolha ${p.options.find((_, i) => !chosen[i])?.name.toLowerCase() ?? "as opções"}`;

  // Peça avulsa que entra num kit: mostra quanto sai no kit.
  const kitOffer = !p.kit ? kitBundles().find((k) => k.kit?.some((s) => s.pool.includes(p.id))) : undefined;

  const related = [
    ...listedBundles().filter((b) => b.id !== p.id && b.category === p.category),
    ...listedBundles().filter((b) => b.id !== p.id && b.category !== p.category && !b.kit),
  ].slice(0, 12);

  const info: { title: string; body: ReactNode }[] = [
    {
      title: "Descrição",
      body: (
        <span className="block space-y-3">
          {(p.description?.length ? p.description : [p.checkoutProductDescription]).map((t) => (
            <span key={t} className="block whitespace-pre-line">
              {t}
            </span>
          ))}
        </span>
      ),
    },
    ...(p.specs?.length
      ? [
          {
            title: "Detalhes",
            body: (
              <span className="block divide-y divide-[var(--line)]">
                {p.specs.map(([k, v]) => (
                  <span key={k} className="flex gap-4 py-2">
                    <b className="w-32 shrink-0 font-semibold text-[var(--ink)]">{k}</b>
                    <span>{v}</span>
                  </span>
                ))}
              </span>
            ),
          },
        ]
      : []),
    { title: "Entrega e frete", body: `${FAQ[0]!.a} ${bundleShippingLabel(p)}.` },
    { title: "Trocas", body: FAQ.find((f) => f.q.startsWith("Posso trocar"))?.a ?? "" },
    { title: "Pagamento", body: FAQ.find((f) => f.q.startsWith("Quais as formas"))?.a ?? "" },
  ];

  return (
    <SiteLayout>
      <div className="container-edge pb-28 pt-0 md:pb-20 md:pt-6">
        <nav
          aria-label="Navegação"
          className="hidden items-center gap-1 text-[11.5px] uppercase tracking-[0.08em] text-[var(--ink)]/50 md:flex"
        >
          <Link to="/" className="hover:text-[var(--ink)]">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {category && (
            <>
              <Link to="/colecao/$id" params={{ id: category.id }} className="hover:text-[var(--ink)]">
                {category.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="truncate text-[var(--ink)]/80">{p.name}</span>
        </nav>

        <div className="grid gap-6 md:mt-5 md:grid-cols-[1.35fr_1fr] lg:gap-14">
          <Gallery p={p} images={images} />

          <div className="md:sticky md:top-[calc(var(--site-chrome-h,7rem)+1.5rem)] md:self-start">
            {(p.kit || p.badge) && (
              <div className="mb-3 flex gap-1.5">
                {p.kit && (
                  <span className="bg-[var(--primary)] px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                    Kit {p.kit.length} peças
                  </span>
                )}
                {p.badge && (
                  <span className="border border-[var(--ink)] px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em]">
                    {p.badge}
                  </span>
                )}
              </div>
            )}
            <h1 className="text-[22px] font-extrabold uppercase leading-tight tracking-[0.01em] md:text-[26px]">
              {p.name}
            </h1>
            <p className="mt-1 text-[14px] text-[var(--ink)]/60">{p.tag}</p>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[28px] font-extrabold leading-none">{brl(priced.price)}</span>
              {priced.compareAtPrice && (
                <>
                  <s className="text-[15px] text-[var(--ink)]/45">{brl(priced.compareAtPrice)}</s>
                  <span className="bg-[var(--ink)] px-2 py-0.5 text-[11px] font-extrabold text-white">
                    -{off}%
                  </span>
                </>
              )}
            </div>
            <div className="mt-2 space-y-0.5 text-[13px] text-[var(--ink)]/65">
              {p.kit && (
                <p className="font-semibold text-[var(--primary)]">
                  Sai {brl(Math.round((p.price / p.kit.length) * 100) / 100)} cada peça
                  {p.compareAtPrice ? ` · economia de ${brl(p.compareAtPrice - p.price)}` : ""}
                </p>
              )}
              {pay.card ? (
                <>
                  <p>
                    ou {pay.installments}x de {installment(priced.price, pay.installments)} sem juros
                  </p>
                  {pay.pixOff > 0 && (
                    <p>
                      {brl(Math.round(priced.price * (1 - pay.pixOff) * 100) / 100)} no Pix (
                      {Math.round(pay.pixOff * 100)}% off)
                    </p>
                  )}
                </>
              ) : (
                <p>Pagamento no Pix, aprovação na hora</p>
              )}
            </div>

            {p.benefits.length > 0 && (
              <ul className="mt-5 space-y-1.5 text-[13.5px] text-[var(--ink)]/80">
                {p.benefits.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-3 shrink-0 bg-[var(--ink)]" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {p.options.length > 0 && (
              <div ref={optionsRef} className="mt-7">
                {p.kit ? (
                  <KitPicker kit={p} values={vals} onChange={setAt} nudge={nudge} />
                ) : (
                  <div className="space-y-5">
                    {p.options.map((o, i) => {
                      const avail = availableValues(p, i, chosen);
                      const isColor = COLOR_OPTION.test(o.name.trim());
                      const missing = nudge && !chosen[i];
                      return (
                        <div key={o.name}>
                          <div
                            className={cn(
                              "mb-2.5 text-[12px] font-extrabold uppercase tracking-[0.1em]",
                              missing && "text-[var(--sale)]",
                            )}
                          >
                            {o.name}
                            {chosen[i] && (
                              <span className="ml-1 font-semibold normal-case tracking-normal text-[var(--ink)]/65">
                                : {chosen[i]}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {o.values.map((v) => {
                              const on = chosen[i] === v;
                              const ok = avail.has(v);
                              const img = isColor ? p.optionImages?.[v] : undefined;
                              const sw = isColor && !img ? swatch(v) : undefined;
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  disabled={!ok}
                                  aria-pressed={on}
                                  onClick={() => setAt(i, on ? undefined : v)}
                                  title={ok ? v : `${v} esgotado`}
                                  className={cn(
                                    "relative inline-flex h-11 min-w-11 items-center justify-center gap-2 border px-3 text-[13px] font-bold transition",
                                    on
                                      ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                                      : "border-[var(--line)] hover:border-[var(--ink)]",
                                    !ok &&
                                      "cursor-not-allowed text-[var(--ink)]/30 line-through hover:border-[var(--line)]",
                                    img && "h-auto p-0.5",
                                  )}
                                >
                                  {img ? (
                                    <img src={img} alt={v} className="h-14 w-11 object-cover" />
                                  ) : (
                                    <>
                                      {sw && (
                                        <i
                                          className="h-3.5 w-3.5 rounded-full border border-black/15"
                                          style={{ background: sw }}
                                        />
                                      )}
                                      {v}
                                    </>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {nudge && missingCount > 0 && (
                  <p className="mt-4 text-[13px] font-semibold text-[var(--sale)]">
                    {p.kit
                      ? "Escolha o modelo e o tamanho de todas as peças do kit."
                      : "Escolha as opções para continuar."}
                  </p>
                )}
              </div>
            )}

            <div className="mt-7 hidden gap-2 md:grid">
              <button
                type="button"
                onClick={buy}
                disabled={p.soldOut}
                className="h-14 bg-[var(--ink)] text-[13px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:opacity-85 disabled:opacity-40"
              >
                {buyLabel}
              </button>
              <button
                type="button"
                onClick={addCart}
                disabled={p.soldOut}
                className="flex h-14 items-center justify-center gap-2 border border-[var(--ink)] text-[13px] font-extrabold uppercase tracking-[0.14em] transition hover:bg-[var(--ink)] hover:text-white disabled:opacity-40"
              >
                <ShoppingBag className="h-4 w-4" /> Adicionar ao carrinho
              </button>
            </div>

            <p className="mt-4 text-[12px] text-[var(--ink)]/55">
              {bundleShippingLabel(p)} · Envio com rastreio · Troca de tamanho
            </p>

            {kitOffer?.kit && (
              <Link
                to="/produto"
                search={{ plano: kitOffer.id }}
                className="mt-6 flex items-center gap-4 border border-[var(--primary)] p-4 transition hover:bg-[var(--brand-tint)]"
              >
                <img src={kitOffer.img} alt="" className="h-20 w-16 bg-[var(--tile)] object-cover" />
                <span className="flex-1">
                  <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--primary)]">
                    Leve no kit
                  </span>
                  <span className="mt-0.5 block text-[14px] font-bold">{kitOffer.name}</span>
                  <span className="block text-[13px] text-[var(--ink)]/65">
                    {brl(kitOffer.price)} · sai{" "}
                    {brl(Math.round((kitOffer.price / kitOffer.kit.length) * 100) / 100)} cada
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-[var(--primary)]" />
              </Link>
            )}

            <div className="mt-8">
              <Accordion items={info} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="display mb-6 text-[34px] md:text-[48px]">Combina com</h2>
            <Shelf label="Relacionados">
              {related.map((b) => (
                <ProductCard key={b.id} p={b} />
              ))}
            </Shelf>
          </section>
        )}
      </div>

      {/* Barra de compra fixa no celular */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white px-4 py-3 md:hidden [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-[17px] font-extrabold">{brl(priced.price)}</div>
            <div className="truncate text-[11.5px] text-[var(--ink)]/55">
              {complete ? productLabel(p, values).replace(`${p.name} — `, "") : p.name}
            </div>
          </div>
          <button
            type="button"
            onClick={addCart}
            disabled={p.soldOut}
            aria-label="Adicionar ao carrinho"
            className="grid h-12 w-12 shrink-0 place-items-center border border-[var(--ink)] disabled:opacity-40"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={buy}
            disabled={p.soldOut}
            className="h-12 shrink-0 bg-[var(--ink)] px-5 text-[12px] font-extrabold uppercase tracking-[0.1em] text-white disabled:opacity-40"
          >
            {buyLabel}
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}
