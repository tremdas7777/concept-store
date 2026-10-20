import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, Search, Truck, UserRound, X } from "lucide-react";
import { CartButton, CartDrawer } from "@/components/site/CartDrawer";
import { Logo } from "@/components/site/Logo";
import { brand } from "@/lib/brand";
import { brl, getCategories, listedBundles } from "@/lib/bundles";
import { cn } from "@/lib/utils";

const help = [
  { href: "/rastreio", label: "Rastrear pedido" },
  { href: "/faq", label: "Dúvidas frequentes" },
  { href: "/contato", label: "Contato" },
  { href: "/sobre", label: "Sobre a loja" },
];

const iconBtn = "grid h-10 w-10 place-items-center text-white transition hover:opacity-60";

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const term = normalize(q.trim());
  const cats = getCategories();
  const results = listedBundles().filter((b) => {
    if (!term) return !!b.kit;
    const cat = cats.find((c) => c.id === b.category)?.name ?? "";
    return normalize(`${b.name} ${b.tag} ${cat}`).includes(term);
  });

  return (
    <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose}>
      <div className="bg-white pb-8" onClick={(e) => e.stopPropagation()}>
        <div className="container-edge flex items-center gap-3 border-b border-[var(--line)] py-4">
          <Search className="h-5 w-5 shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar calça, bermuda, kit..."
            aria-label="Buscar produtos"
            className="h-10 w-full bg-transparent text-[16px] outline-none placeholder:text-[var(--ink)]/40"
          />
          <button type="button" aria-label="Fechar busca" className={iconBtn} onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="container-edge pt-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ink)]/50">
            {term
              ? `${results.length} resultado${results.length === 1 ? "" : "s"}`
              : "Kits em destaque"}
          </p>
          {results.length === 0 ? (
            <p className="py-6 text-[14px] text-[var(--ink)]/60">Nada encontrado para “{q}”.</p>
          ) : (
            <ul className="grid max-h-[60vh] gap-x-6 overflow-y-auto sm:grid-cols-2">
              {results.slice(0, 24).map((b) => (
                <li key={b.id}>
                  <Link
                    to="/produto"
                    search={{ plano: b.id }}
                    onClick={onClose}
                    className="flex items-center gap-3 border-b border-[var(--line)] py-2.5"
                  >
                    <img src={b.img} alt="" className="h-16 w-12 bg-[var(--tile)] object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold uppercase">
                        {b.name}
                      </span>
                      <span className="text-[13px] text-[var(--ink)]/70">{brl(b.price)}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--ink)]/40" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Drawer({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const cats = getCategories();

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 xl:hidden" onClick={onClose}>
      <aside
        className="flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-white animate-in slide-in-from-left duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/15 px-5 py-3">
          <Logo size="sm" tone="light" />
          <button type="button" aria-label="Fechar menu" className={iconBtn} onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-5 pt-2">
          <ul>
            {cats.map((c) => (
              <li key={c.id}>
                <Link
                  to="/colecao/$id"
                  params={{ id: c.id }}
                  onClick={onClose}
                  className="flex items-center gap-4 border-b border-[var(--line)] py-3"
                >
                  <img src={c.img} alt="" className="h-14 w-11 bg-[var(--tile)] object-cover" />
                  <span
                    className={cn(
                      "flex-1 text-[15px] font-bold uppercase tracking-[0.04em]",
                      c.id === "kits" && "text-[var(--primary)]",
                    )}
                  >
                    {c.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[var(--ink)]/35" />
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/colecao/$id"
                params={{ id: "todos" }}
                onClick={onClose}
                className="flex items-center justify-between border-b border-[var(--line)] py-4 text-[15px] font-bold uppercase tracking-[0.04em]"
              >
                Ver tudo <ArrowRight className="h-4 w-4 text-[var(--ink)]/35" />
              </Link>
            </li>
          </ul>
          <p className="mb-1 mt-8 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ink)]/45">
            Ajuda
          </p>
          <ul className="pb-10">
            {help.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="block py-2.5 text-[14px] text-[var(--ink)]/80"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);
  const closeSearch = useCallback(() => setSearch(false), []);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const cats = getCategories();

  // Trava a rolagem da página com o menu ou a busca abertos.
  useEffect(() => {
    if (!menu && !search) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menu, search]);

  return (
    <header className="border-b border-white/15 bg-black text-white">
      <div className="container-edge py-4 xl:py-5">
        <div className="grid min-h-[44px] grid-cols-[1fr_auto_1fr] items-center gap-3 xl:min-h-[76px]">
          <div className="-ml-2 flex min-w-0 items-center gap-1 xl:ml-0">
            <button
              type="button"
              aria-label="Abrir menu"
              className={`${iconBtn} xl:hidden`}
              onClick={() => setMenu(true)}
            >
              <Menu className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label="Buscar"
              className={`${iconBtn} xl:hidden`}
              onClick={() => setSearch(true)}
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <label className="group hidden w-full max-w-[270px] items-center gap-2 rounded-full border border-white/35 px-4 transition-colors hover:border-white xl:flex">
              <Search className="h-4 w-4 shrink-0 text-white/65" strokeWidth={1.75} />
              <input
                placeholder="Buscar produtos"
                aria-label="Buscar produtos"
                onFocus={() => setSearch(true)}
                className="h-10 min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/60"
              />
            </label>
          </div>

          <Link to="/" aria-label={`${brand.name}: início`} className="justify-self-center">
            <Logo tone="light" size="sm" className="xl:[&>span:first-child]:text-[42px]" />
          </Link>

          <div className="-mr-2 flex items-center justify-end">
            <button type="button" aria-label="Minha conta" className={`${iconBtn} hidden sm:grid`}>
              <UserRound className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <a
              href="/rastreio"
              aria-label="Rastrear pedido"
              className={`${iconBtn} hidden sm:grid`}
            >
              <Truck className="h-5 w-5" strokeWidth={1.75} />
            </a>
            <CartButton className={iconBtn} />
          </div>
        </div>

        <nav
          aria-label="Categorias"
          className="mt-4 hidden items-center justify-center gap-8 overflow-x-auto border-t border-white/15 pt-3 text-[12px] font-bold uppercase tracking-[0.05em] xl:flex"
        >
          {cats.map((c) => {
            const on = path === `/colecao/${c.id}`;
            return (
              <Link
                key={c.id}
                to="/colecao/$id"
                params={{ id: c.id }}
                className={cn(
                  "relative whitespace-nowrap py-2 text-white transition-opacity hover:opacity-60",
                  on &&
                    "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-current",
                )}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <CartDrawer />

      {menu && <Drawer onClose={closeMenu} />}
      {search && <SearchPanel onClose={closeSearch} />}
    </header>
  );
}
