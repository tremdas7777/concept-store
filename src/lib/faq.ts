import { brand } from "@/lib/brand";
import { FREE_SHIPPING_MIN } from "@/lib/bundles";
import { CARD_MAX_INSTALLMENTS, PIX_DISCOUNT } from "@/lib/payment-pricing";

/** Perguntas frequentes da loja (home, página do produto e /faq). */
export const FAQ: readonly { q: string; a: string }[] = [
  {
    q: "Qual o prazo de entrega?",
    a: `Os pedidos saem em até 1 dia útil depois da confirmação do pagamento. A entrega leva em média de 3 a 7 dias úteis, conforme a região${brand.city ? `, e em ${brand.city} e região pode chegar por motoboy` : ""}.`,
  },
  {
    q: "O frete é grátis?",
    a: `Sim, nas compras a partir de R$ ${FREE_SHIPPING_MIN} em produtos, para todo o Brasil. Abaixo disso, você escolhe o frete no checkout e vê o valor antes de pagar.`,
  },
  {
    q: "Quais as formas de pagamento?",
    a: `Pix e cartão de crédito em até ${CARD_MAX_INSTALLMENTS}x sem juros. No Pix tem ${Math.round(PIX_DISCOUNT * 100)}% de desconto sempre que o cartão estiver disponível na loja.`,
  },
  {
    q: "Como funcionam os kits?",
    a: "No kit você escolhe o modelo e o tamanho de cada peça e paga um preço fechado, menor do que comprando separado. Pode misturar modelos ou repetir o mesmo em tamanhos diferentes.",
  },
  {
    q: "Como escolho o tamanho?",
    a: "As calças e bermudas seguem a numeração de jeans (38, 40, 42...). Se você já usa calça jeans, escolha o mesmo número. Na dúvida entre dois, prefira o maior.",
  },
  {
    q: "Posso trocar se não servir?",
    a: "Sim. Você tem 7 dias depois de receber para desistir da compra e até 30 dias para trocar o tamanho, com a peça sem uso e com a etiqueta. Nos kits, cada peça pode ser trocada separadamente.",
  },
  {
    q: "Como acompanho meu pedido?",
    a: "Você recebe o código de rastreio por e-mail assim que o pedido sai. Também dá para consultar na página Rastrear pedido, pelo CPF de quem comprou.",
  },
];
