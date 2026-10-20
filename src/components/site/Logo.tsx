import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Logo da loja: o nome escrito na fonte da marca (condensada, caixa alta) com a linha
 * pequena embaixo. Trocar o nome em src/lib/brand.ts troca o logo do site inteiro.
 */
export function Logo({
  className,
  size = "md",
  tone = "dark",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-col items-center leading-none",
        tone === "light" ? "text-white" : "text-[var(--ink)]",
        className,
      )}
    >
      <span
        className={cn(
          "whitespace-nowrap font-display font-black uppercase tracking-[-0.01em] [font-stretch:72%]",
          size === "sm" && "text-[22px]",
          size === "md" && "text-[28px] md:text-[32px]",
          size === "lg" && "text-[44px] md:text-[64px]",
        )}
      >
        {brand.name}
      </span>
      {brand.logoTagline && (
        <span
          className={cn(
            "mt-1 font-sans font-semibold uppercase opacity-70",
            size === "lg" ? "text-[11px] tracking-[0.5em]" : "text-[8.5px] tracking-[0.42em]",
          )}
        >
          {brand.logoTagline}
        </span>
      )}
    </span>
  );
}
