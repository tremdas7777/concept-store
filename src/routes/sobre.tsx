import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { brand } from "@/lib/brand";
import { CARD_MAX_INSTALLMENTS } from "@/lib/payment-pricing";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: `Sobre a ${brand.name}` },
      { name: "description", content: `A ${brand.name}: ${brand.tagline.toLowerCase()}.` },
      { property: "og:title", content: `Sobre a ${brand.name}` },
      { property: "og:description", content: `${brand.tagline}. Envio para todo o Brasil.` },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: Page,
});

const VALUES = [
  ["Kits de verdade", "Você escolhe modelo e tamanho de cada peça. O desconto vem do kit, não de preço inflado."],
  ["Envio rastreado", "Pedidos saem em até 1 dia útil, com código de rastreio por e-mail."],
  ["Troca de tamanho", "Não serviu? Troca em até 30 dias, sem uso e com etiqueta."],
  ["Pagamento", `Pix ou cartão em até ${CARD_MAX_INSTALLMENTS}x, em site com certificado SSL.`],
] as const;

function Page() {
  return (
    <SiteLayout>
      <section className="container-edge grid items-center gap-10 py-14 md:grid-cols-2 md:py-24 lg:gap-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]/50">Sobre</p>
          <h1 className="display mt-3 text-[52px] md:text-[88px]">{brand.name}</h1>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-[var(--ink)]/70">
            Moda masculina em kits: calças jogador em jeans, bermudas, alfaiataria e tricô. A ideia é
            simples: quem compra mais de uma peça paga menos por cada uma.
          </p>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-[var(--ink)]/70">
            Vendemos para todo o Brasil{brand.city ? ` e entregamos por motoboy em ${brand.city} e região` : ""}.
            Dúvida sobre tamanho, prazo ou troca? Fale com a gente pela{" "}
            <Link to="/contato" className="underline underline-offset-2">
              página de contato
            </Link>
            .
          </p>
        </div>
        <img
          src="/produtos/calca-alfaiataria-com-regulagem-cintura-1.webp"
          alt="Calça de alfaiataria jogger"
          className="aspect-[4/5] max-h-[620px] w-full bg-[var(--tile)] object-cover"
        />
      </section>
      <section className="border-t border-[var(--line)]">
        <div className="container-edge grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([t, d]) => (
            <div key={t} className="border-t-2 border-[var(--ink)] pt-4">
              <h2 className="text-[13px] font-extrabold uppercase tracking-[0.1em]">{t}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink)]/65">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
