import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/shop/ProductCard";
import { brand } from "@/lib/brand";
import { findCollection, getCategories } from "@/lib/bundles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/colecao/$id")({
  head: ({ params }) => {
    const c = findCollection(params.id);
    if (!c) return { meta: [{ title: `Coleção não encontrada | ${brand.name}` }] };
    const title = `${c.name} | ${brand.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: `${c.name}: ${c.desc}. Pix ou cartão.` },
        { property: "og:title", content: title },
        { property: "og:image", content: c.img },
      ],
      links: [{ rel: "canonical", href: `/colecao/${c.id}` }],
    };
  },
  component: Page,
});

const SORTS = [
  { id: "rel", label: "Destaques" },
  { id: "menor", label: "Menor preço" },
  { id: "maior", label: "Maior preço" },
] as const;
type Sort = (typeof SORTS)[number]["id"];

function Page() {
  const { id } = Route.useParams();
  const c = findCollection(id);
  const [sort, setSort] = useState<Sort>("rel");

  if (!c)
    return (
      <SiteLayout>
        <div className="container-edge py-24 text-center">
          <h1 className="display text-[40px]">Coleção não encontrada</h1>
          <Link
            to="/"
            className="mt-6 inline-block bg-[var(--ink)] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-white"
          >
            Voltar para a loja
          </Link>
        </div>
      </SiteLayout>
    );

  const items = [...c.items].sort((a, b) =>
    sort === "menor" ? a.price - b.price : sort === "maior" ? b.price - a.price : 0,
  );
  const cats = [...getCategories(), { id: "todos", name: "Ver tudo" }];

  return (
    <SiteLayout>
      <div className="container-edge pb-16 pt-6 md:pb-24 md:pt-10">
        <nav
          aria-label="Navegação"
          className="flex items-center gap-1 text-[11.5px] uppercase tracking-[0.08em] text-[var(--ink)]/50"
        >
          <Link to="/" className="hover:text-[var(--ink)]">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[var(--ink)]/80">{c.name}</span>
        </nav>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="display text-[44px] md:text-[72px]">{c.name}</h1>
            <p className="mt-2 text-[14px] text-[var(--ink)]/60">{c.desc}</p>
          </div>
        </div>

        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
          {cats.map((x) => (
            <Link
              key={x.id}
              to="/colecao/$id"
              params={{ id: x.id }}
              className={cn(
                "shrink-0 border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition",
                x.id === c.id
                  ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                  : "border-[var(--line)] hover:border-[var(--ink)]",
              )}
            >
              {x.name}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-y border-[var(--line)] py-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--ink)]/55">
            {items.length} {items.length === 1 ? "produto" : "produtos"}
          </p>
          <label className="relative flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em]">
            <span className="text-[var(--ink)]/55">Ordenar</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="cursor-pointer appearance-none bg-transparent pr-5 font-bold uppercase outline-none"
              aria-label="Ordenar produtos"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5" />
          </label>
        </div>

        {items.length === 0 ? (
          <p className="py-20 text-center text-[14px] text-[var(--ink)]/60">
            Nenhum produto nesta coleção ainda.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4">
            {items.map((p, i) => (
              <ProductCard key={p.id} p={p} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
