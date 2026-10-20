# Norte Concept — reprodução visual da loja de referência

## Objetivo

Manter a marca **Norte Concept**, os produtos importados do catálogo da Senna Store e uma experiência de vitrine visualmente equivalente à referência autorizada pelo utilizador: barra promocional, cabeçalho com categorias, banner rotativo, atalhos de categorias, prateleira de kits e prateleiras por categoria.

## Implementação

- Reutilizar o catálogo existente do banco e as rotas de produto, coleção, carrinho e checkout.
- Remover blocos de conteúdo que não fazem parte da sequência principal da referência na home.
- Usar `CATALOG_MEDIA` como recuperação somente quando um produto ativo do banco estiver sem imagens.
- Manter o importador compatível com a coluna `imagens` e com URLs separadas por `|`.
- Manter fallback SVG válido para URLs realmente quebradas.

## Design

**Movimento:** e-commerce editorial urbano, inspirado em vitrines Nuvemshop de moda.

**Princípios:** navegação direta, fotografia dominante, tipografia condensada em caixa alta e ritmo de prateleiras horizontais.

**Paleta:** preto e branco com azul índigo para destacar kits e descontos; o contraste preserva a leitura do catálogo.

**Layout:** cabeçalho fixo, banner full-bleed, categorias horizontais no mobile e grade/prateleira no desktop.

**Essência da marca:** Norte Concept é uma loja masculina de catálogo amplo, com kits e compra rápida; direta, urbana e acessível.

**Voz:** CTAs curtos e comerciais, como “Ver tudo” e “Monte seu kit”.

## Estrutura

- `src/routes/index.tsx`: home e sequência visual da vitrine.
- `src/components/site`: cabeçalho, barra promocional e rodapé.
- `src/lib/catalog.server.ts`: leitura do banco e recuperação de imagens.
- `src/lib/catalog-media.ts`: mapa de fotos públicas do catálogo extraído.
- `src/lib/shopify-csv.ts`: importação e normalização de imagens do CSV.
