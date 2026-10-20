import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/shop/ProductCard";
import { Shelf } from "@/components/shop/Shelf";
import { usePayInfo } from "@/hooks/usePayInfo";
import { brand } from "@/lib/brand";
import { FAQ } from "@/lib/faq";
import {
  brl,
  bundlesByCategory,
  FREE_SHIPPING_MIN,
  getCategories,
  kitBundles,
  KIT_COLLECTION,
} from "@/lib/bundles";

// Sem head() aqui: a home herda título/descrição/og do __root.tsx.
export const Route = createFileRoute("/")({
  component: Home,
});

/**
 * Banners do topo: imagens prontas em /public/banners (celular 1080×1350, computador 2400×900).
 * Para trocar um banner, substitua os arquivos mantendo os nomes e os tamanhos.
 */
type Banner = {
  key: string;
  alt: string;
  mobile: string;
  desktop: string;
  /** Produto (kit) ou coleção que o banner abre. */
  to: { produto: string } | { colecao: string };
};

const linkClass = "block h-full w-full";

const BANNERS: Banner[] = [
  {
    key: "kits",
    alt: "Monte seu kit com camisa, bermuda, calça, tênis e acessórios",
    mobile: "/banners/kits-campaign-01-mobile.webp",
    desktop: "/banners/kits-campaign-01-desktop.webp",
    to: { colecao: "kits" },
  },
  {
    key: "kits-flatlay",
    alt: "Escolha cada peça do seu kit e monte o look completo",
    mobile: "/banners/kits-campaign-02-mobile.webp",
    desktop: "/banners/kits-campaign-02-desktop.webp",
    to: { colecao: "kits" },
  },
  {
    key: "kits-editorial",
    alt: "Kits masculinos com estilo urbano e peças escolhidas separadamente",
    mobile: "/banners/kits-campaign-03-mobile.webp",
    desktop: "/banners/kits-campaign-03-desktop.webp",
    to: { colecao: "kits" },
  },
];

function BannerLink({ to, children }: { to: Banner["to"]; children: ReactNode }) {
  return "produto" in to ? (
    <Link to="/produto" search={{ plano: to.produto }} className={linkClass}>
      {children}
    </Link>
  ) : (
    <Link to="/colecao/$id" params={{ id: to.colecao }} className={linkClass}>
      {children}
    </Link>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [active, setActive] = useState(0);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const n = (i + BANNERS.length) % BANNERS.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const el = ref.current;
      if (!el || touched.current || document.hidden) return;
      const i = Math.round(el.scrollLeft / el.clientWidth);
      el.scrollTo({ left: ((i + 1) % BANNERS.length) * el.clientWidth, behavior: "smooth" });
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const arrow =
    "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center bg-white/90 text-[var(--ink)] transition hover:bg-white md:grid";

  return (
    <section aria-label="Destaques" className="relative bg-[var(--tile)]">
      <h1 className="sr-only">
        {brand.name}: {brand.taglineShort}
      </h1>
      <div
        ref={ref}
        onScroll={(e) =>
          setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
        }
        onPointerDown={() => (touched.current = true)}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {BANNERS.map((b, i) => (
          <div
            key={b.key}
            className="aspect-[4/5] w-full shrink-0 snap-start md:aspect-[8/3]"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${BANNERS.length}`}
          >
            <BannerLink to={b.to}>
              <picture>
                <source media="(min-width: 768px)" srcSet={b.desktop} />
                <img
                  src={b.mobile}
                  alt={b.alt}
                  fetchPriority={i === 0 ? "high" : undefined}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="block h-full w-full max-w-full object-cover"
                />
              </picture>
            </BannerLink>
          </div>
        ))}
      </div>
      <button
        type="button"
        aria-label="Banner anterior"
        onClick={() => {
          touched.current = true;
          goTo(active - 1);
        }}
        className={`${arrow} left-6`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Próximo banner"
        onClick={() => {
          touched.current = true;
          goTo(active + 1);
        }}
        className={`${arrow} right-6`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
        {BANNERS.map((b, i) => (
          <button
            key={b.key}
            type="button"
            aria-label={`Ver banner ${i + 1}`}
            onClick={() => {
              touched.current = true;
              goTo(i);
            }}
            className={`h-[3px] transition-all ${i === active ? "w-8 bg-white" : "w-4 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}

/** Título de seção: condensado à esquerda, link "ver tudo" à direita. */
function SectionHead({ title, kicker, href }: { title: string; kicker?: string; href?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 md:mb-7">
      <div>
        {kicker && (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]/50">
            {kicker}
          </p>
        )}
        <h2 className="display text-[34px] md:text-[52px]">{title}</h2>
      </div>
      {href && (
        <a
          href={href}
          className="flex shrink-0 items-center gap-1.5 border-b border-current pb-0.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:opacity-60"
        >
          Ver tudo <ArrowRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

function Categories() {
  const cats = getCategories();
  return (
    <section className="container-edge pt-10 md:pt-16">
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-6 md:gap-3 md:px-0 [&::-webkit-scrollbar]:hidden">
        {cats.map((c) => (
          <Link
            key={c.id}
            to="/colecao/$id"
            params={{ id: c.id }}
            className="group relative block w-[38%] shrink-0 snap-start sm:w-[24%] md:w-auto"
          >
            <div className="aspect-[3/4] overflow-hidden bg-[var(--tile)]">
              <img
                src={c.img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10">
              <span
                className={`display text-[19px] text-white md:text-[22px] ${c.id === "kits" ? "underline decoration-[var(--primary)] decoration-[3px] underline-offset-4" : ""}`}
              >
                {c.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Faixa preta com a oferta do kit principal (preço vem do catálogo). */
function KitPromo() {
  const k = kitBundles()[0];
  if (!k?.kit) return null;
  const each = Math.round((k.price / k.kit.length) * 100) / 100;
  return (
    <section className="bg-[var(--ink)] text-white">
      <div className="container-edge grid items-center gap-8 py-12 md:grid-cols-[1.2fr_1fr] md:py-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
            Monte o seu
          </p>
          <p className="display mt-3 text-[48px] md:text-[88px]">
            {k.kit.length} calças
            <br />
            por {brl(k.price)}
          </p>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            Escolha o modelo e o tamanho de cada uma. Sai {brl(each)} por calça
            {k.compareAtPrice ? `, contra ${brl(k.compareAtPrice)} comprando separado` : ""}.
          </p>
          <Link
            to="/produto"
            search={{ plano: k.id }}
            className="mt-7 inline-flex items-center gap-2 bg-white px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:bg-white/85"
          >
            Montar meu kit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {k.images.slice(1, 4).map((src) => (
            <div key={src} className="aspect-[3/4] overflow-hidden bg-white/5">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Perks() {
  const pay = usePayInfo();
  const items = [
    { t: "Frete grátis", d: `Acima de R$ ${FREE_SHIPPING_MIN} para todo o Brasil` },
    { t: "Kits com desconto", d: "Quanto mais peças, menor o preço de cada uma" },
    pay.card
      ? {
          t: `Até ${pay.installments}x sem juros`,
          d: `Ou ${Math.round(pay.pixOff * 100)}% de desconto no Pix`,
        }
      : { t: "Pagamento no Pix", d: "Aprovação na hora, pedido separado no mesmo dia" },
    { t: "Troca de tamanho", d: "Não serviu? A gente troca" },
  ];
  return (
    <section className="border-y border-[var(--line)]">
      <div className="container-edge grid grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.t}
            className={`py-6 pr-4 md:py-8 md:pl-6 ${i % 2 ? "pl-4 border-l border-[var(--line)]" : ""} ${i >= 2 ? "border-t border-[var(--line)] md:border-t-0" : ""} ${i > 0 ? "md:border-l md:border-[var(--line)]" : "md:pl-0"}`}
          >
            <p className="text-[12.5px] font-extrabold uppercase tracking-[0.08em]">{it.t}</p>
            <p className="mt-1 text-[13px] leading-snug text-[var(--ink)]/60">{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="container-edge grid gap-8 py-16 md:grid-cols-[1fr_1.6fr] md:py-24">
      <div>
        <h2 className="display text-[34px] md:text-[52px]">Dúvidas</h2>
        <p className="mt-3 max-w-xs text-[14px] text-[var(--ink)]/60">
          Não achou? Fale com a gente pelo{" "}
          <a href="/contato" className="underline underline-offset-2">
            contato
          </a>
          .
        </p>
      </div>
      <div className="border-t border-[var(--ink)]">
        {FAQ.slice(0, 5).map((f) => (
          <details key={f.q} className="group border-b border-[var(--line)] py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[var(--ink)]/65">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const kits = kitBundles().filter((p) => p.collections.includes(KIT_COLLECTION.id));
  const shelves = getCategories().filter((c) => c.id !== KIT_COLLECTION.id);
  const [first, ...rest] = shelves;

  return (
    <SiteLayout>
      <Hero />
      <Categories />

      {kits.length > 0 && (
        <section className="container-edge pt-14 md:pt-24">
          <SectionHead
            title="Kits"
            kicker="Escolha modelo e tamanho de cada peça"
            href="/colecao/kits"
          />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-6">
            {kits.map((p, i) => (
              <ProductCard key={p.id} p={p} priority={i < 2} />
            ))}
          </div>
        </section>
      )}

      {first && (
        <section className="container-edge py-14 md:py-24">
          <SectionHead title={first.name} kicker={first.desc} href={`/colecao/${first.id}`} />
          <Shelf label={first.name}>
            {bundlesByCategory(first.id).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </Shelf>
        </section>
      )}

      {rest.map((c) => (
        <section key={c.id} className="container-edge pt-14 md:pt-24">
          <SectionHead title={c.name} kicker={c.desc} href={`/colecao/${c.id}`} />
          <Shelf label={c.name}>
            {bundlesByCategory(c.id).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </Shelf>
        </section>
      ))}
    </SiteLayout>
  );
}
