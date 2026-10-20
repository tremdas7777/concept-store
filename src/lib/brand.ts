/**
 * Marca da loja.
 * NOME PROVISÓRIO: troque `name`/`gatewayName` quando decidir o nome (o logo do site é o
 * próprio nome escrito na fonte da marca, então muda junto).
 * PREENCHA `cnpj`, `email` e `whatsapp` com os dados da sua empresa antes de vender.
 */
export const brand = {
  name: "Norte Concept",
  /** Linha pequena embaixo do nome no logo. */
  logoTagline: "Concept Store",
  productName: "Norte Concept",
  /** Nome genérico que aparece na fatura do cliente (gateways Pix e cartão). */
  gatewayName: "Norte Concept",
  tagline: "Kits de calças, bermudas e peças masculinas com preço de kit",
  taglineShort: "Moda masculina em kits",
  manufacturer: "Norte Concept",
  manufacturerTagline: "Moda masculina",
  /** Cidade da loja (entregas por motoboy). Vazio = não mostra. */
  city: "Belém",
  cnpj: "00.000.000/0000-00",
  email: "contato@seudominio.com.br",
  /** Ex.: "@sualoja". Vazio = não mostra. */
  instagram: "" as string,
  whatsapp: {
    /** Número em E.164 (DDI + DDD + número), sem símbolos. Vazio = WhatsApp oculto no site. */
    phoneE164: "",
    display: "",
  },
  colors: {
    primary: "#0b0b0b",
    primaryDark: "#000000",
    primaryDeep: "#000000",
    onPrimary: "#ffffff",
    surfaceTint: "#f3f1ec",
  },
} as const;
