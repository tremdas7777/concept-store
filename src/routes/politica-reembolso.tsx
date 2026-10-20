import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/politica-reembolso")({
  head: () => ({
    meta: [
      { title: `Política de Trocas e Reembolso | ${brand.name}` },
      {
        name: "description",
        content: `Condições de troca e reembolso dos produtos da ${brand.name}.`,
      },
      { property: "og:title", content: "Política de Trocas e Reembolso" },
      {
        property: "og:description",
        content: `Direito de arrependimento, trocas e reembolso na ${brand.name}.`,
      },
      { property: "og:url", content: "/politica-reembolso" },
    ],
    links: [{ rel: "canonical", href: "/politica-reembolso" }],
  }),
  component: () => (
    <PolicyPage
      title="Política de Trocas e Reembolso"
      intro="Garantia conforme o Código de Defesa do Consumidor."
    >
      <h2>Direito de arrependimento</h2>
      <p>
        Você tem até 7 dias após o recebimento do produto para desistir da compra, conforme o art.
        49 do CDC.
      </p>
      <h2>Troca de tamanho</h2>
      <p>
        Calças, bermudas e demais peças podem ser trocadas por outro tamanho em até 30 dias após o
        recebimento, sem uso, sem lavagem e com a etiqueta, sujeito à disponibilidade em estoque.
        Nos kits, cada peça pode ser trocada separadamente.
      </p>
      <h2>Como solicitar</h2>
      <p>Entre em contato pelo e-mail {brand.email} com o número do pedido.</p>
      <h2>Prazo de reembolso</h2>
      <p>
        O reembolso é processado em até 7 dias úteis após o recebimento do produto em nosso centro
        de distribuição.
      </p>
    </PolicyPage>
  ),
});
