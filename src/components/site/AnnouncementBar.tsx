import { brand } from "@/lib/brand";
import { FREE_SHIPPING_LABEL } from "@/lib/bundles";

const messages = [
  FREE_SHIPPING_LABEL,
  "Monte seu kit e pague menos por peça",
  ...(brand.city ? [`Entrega por motoboy em ${brand.city} e região`] : []),
  "Troca de tamanho facilitada",
  "Envio para todo o Brasil com rastreio",
];

/** Faixa preta do topo com os avisos correndo (para quieta com "reduzir movimento"). */
export function AnnouncementBar() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {messages.map((m) => (
        <li key={m} className="flex items-center px-6">
          <span className="mr-6 h-1 w-1 rounded-full bg-white/40" />
          {m}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className="overflow-hidden bg-[var(--ink)] py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
      role="region"
      aria-label="Avisos da loja"
    >
      <div className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
