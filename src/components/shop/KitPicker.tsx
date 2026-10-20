import { Check } from "lucide-react";
import { findBundle, variantSize, type Bundle } from "@/lib/bundles";
import { cn } from "@/lib/utils";

const inStock = (v: { stock: number | null }) => v.stock === null || v.stock > 0;

/**
 * Montagem do kit: para cada vaga, o cliente escolhe a peça (pelas fotos) e o tamanho.
 * `values` segue as opções do kit: [peça 1, tamanho 1, peça 2, tamanho 2, ...].
 */
export function KitPicker({
  kit,
  values,
  onChange,
  nudge,
}: {
  kit: Bundle;
  values: readonly (string | undefined)[];
  onChange: (index: number, value: string | undefined) => void;
  nudge: boolean;
}) {
  return (
    <ol className="space-y-6">
      {(kit.kit ?? []).map((slot, i) => {
        const pieceId = values[i * 2];
        const size = values[i * 2 + 1];
        const piece = findBundle(pieceId);
        const sizes = piece
          ? [...new Set((piece.variants ?? []).filter(inStock).map((v) => variantSize(piece, v)))]
          : [];
        const done = !!piece && !!size;
        const missing = nudge && !done;
        return (
          <li
            key={i}
            className={cn(
              "border-t pt-4",
              missing ? "border-[var(--sale)]" : "border-[var(--ink)]",
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em]">
                <span className="mr-2 text-[var(--ink)]/40">{String(i + 1).padStart(2, "0")}</span>
                {slot.label}
              </p>
              <p
                className={cn(
                  "truncate text-right text-[12.5px]",
                  done
                    ? "font-semibold text-[var(--ink)]"
                    : missing
                      ? "text-[var(--sale)]"
                      : "text-[var(--ink)]/50",
                )}
              >
                {done ? (
                  <span className="inline-flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    {piece.name.replace(/^(Calça|Bermuda|Polo)\s+/i, "")} · {size}
                  </span>
                ) : piece ? (
                  "Escolha o tamanho"
                ) : (
                  "Escolha o modelo"
                )}
              </p>
            </div>

            {slot.pool.length > 1 && (
              <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
                {slot.pool.map((id) => {
                  const p = findBundle(id);
                  if (!p) return null;
                  const on = id === pieceId;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={on}
                      title={p.name}
                      onClick={() => {
                        onChange(i * 2, id);
                        // Tamanho que não existe no modelo novo: limpa.
                        const nextSizes = [
                          ...new Set(
                            (p.variants ?? []).filter(inStock).map((v) => variantSize(p, v)),
                          ),
                        ];
                        if (size && !nextSizes.includes(size)) onChange(i * 2 + 1, undefined);
                        if (!size && nextSizes.length === 1) onChange(i * 2 + 1, nextSizes[0]);
                      }}
                      className="w-[68px] shrink-0 text-left md:w-[72px]"
                    >
                      <span
                        className={cn(
                          "block aspect-[3/4] overflow-hidden border-2 bg-[var(--tile)] transition",
                          on
                            ? "border-[var(--ink)]"
                            : "border-transparent hover:border-[var(--ink)]/30",
                        )}
                      >
                        <img
                          src={p.img}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span
                        className={cn(
                          "mt-1 line-clamp-2 text-[10.5px] leading-tight",
                          on ? "font-bold" : "text-[var(--ink)]/65",
                        )}
                      >
                        {p.name.replace(
                          /^(Calça|Bermuda|Polo)\s+(Jogador\s+|Jeans\s+|Alfaiataria\s+)*/i,
                          "",
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-1.5">
              {piece ? (
                sizes.map((s) => {
                  const on = s === size;
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => onChange(i * 2 + 1, s)}
                      className={cn(
                        "h-11 min-w-11 border px-3 text-[13px] font-bold transition",
                        on
                          ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                          : "border-[var(--line)] hover:border-[var(--ink)]",
                      )}
                    >
                      {s}
                    </button>
                  );
                })
              ) : slot.pool.length > 1 ? (
                <p className="text-[12.5px] text-[var(--ink)]/50">
                  Toque no modelo para ver os tamanhos.
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
