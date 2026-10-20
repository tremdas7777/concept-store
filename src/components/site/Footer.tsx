import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { brand } from "@/lib/brand";
import { FREE_SHIPPING_LABEL, getCategories } from "@/lib/bundles";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { CARD_MAX_INSTALLMENTS } from "@/lib/payment-pricing";

const supportLinks = [
  { label: "Rastrear pedido", href: "/rastreio" },
  { label: "Perguntas frequentes", href: "/faq" },
  { label: "Contato", href: "/contato" },
  { label: "Sobre a loja", href: "/sobre" },
];

const legalLinks = [
  { label: "Envio e prazos", href: "/politica-envio" },
  { label: "Trocas e devoluções", href: "/politica-reembolso" },
  { label: "Privacidade", href: "/politica-privacidade" },
];

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2.5">
      {links.map((item) => (
        <li key={item.label}>
          <a href={item.href} className="text-[14px] text-white/65 transition-colors hover:text-white">
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** No celular vira sanfona fechada; no computador, coluna aberta. */
function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <>
      <details className="group border-b border-white/10 py-4 md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-bold uppercase tracking-[0.14em] [&::-webkit-details-marker]:hidden">
          {title}
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="pt-4">
          <LinkList links={links} />
        </div>
      </details>
      <div className="hidden md:block">
        <h4 className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em]">{title}</h4>
        <LinkList links={links} />
      </div>
    </>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const fetchSettings = useServerFn(getSiteSettings);
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 60_000,
  });
  const whatsappEnabled = (settings?.whatsappEnabled ?? false) && !!brand.whatsapp.phoneE164;
  const whatsappHref = `https://wa.me/${brand.whatsapp.phoneE164}?text=${encodeURIComponent(
    `Olá! Quero tirar uma dúvida sobre um produto da ${brand.name}.`,
  )}`;
  const shopLinks = [
    ...getCategories().map((c) => ({ label: c.name, href: `/colecao/${c.id}` })),
    { label: "Ver tudo", href: "/colecao/todos" },
  ];

  return (
    <footer className="bg-[var(--ink)] text-white">
      <div className="container-edge pb-10 pt-14 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" aria-label={`${brand.name}: início`} className="inline-block">
              <Logo tone="light" />
            </Link>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/60">
              {brand.tagline}. {FREE_SHIPPING_LABEL}.
            </p>
            <div className="mt-6 space-y-2 text-[14px]">
              <a href={`mailto:${brand.email}`} className="block text-white/80 hover:text-white">
                {brand.email}
              </a>
              {whatsappEnabled && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-white/80 hover:text-white"
                >
                  WhatsApp {brand.whatsapp.display}
                </a>
              )}
              {brand.instagram && (
                <a
                  href={`https://instagram.com/${brand.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-white/80 hover:text-white"
                >
                  Instagram {brand.instagram}
                </a>
              )}
            </div>
          </div>
          <div className="md:contents">
            <FooterColumn title="Loja" links={shopLinks} />
            <FooterColumn title="Ajuda" links={supportLinks} />
            <FooterColumn title="Políticas" links={legalLinks} />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[12px] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {brand.name} · CNPJ {brand.cnpj}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Pix",
              ...(settings?.cardEnabled ? [`Cartão em até ${CARD_MAX_INSTALLMENTS}x`] : []),
              "Compra segura",
            ].map((t) => (
              <span
                key={t}
                className="border border-white/20 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
