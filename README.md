# Norte Concept (nome provisório)

Loja de moda masculina focada em kits: calças jogador, bermudas, alfaiataria e tricô, com
checkout próprio (Pix + cartão), painel admin, importador de produtos CSV e integrações de
rastreio e marketing.

Hospedada na Vercel: https://concept-store-six.vercel.app (repositório `tremdas7777/concept-store`).
Publicar de novo: `npx vercel deploy --prod` (ou, com o GitHub ligado à Vercel, um push na `main`).

## O que tem na loja

- **Vitrine** (`src/routes/index.tsx`, `colecao.$id.tsx`, `produto.tsx`): banners em HD
  (`public/banners`), kits em destaque, prateleiras por coleção, página de produto com seletor
  de kit (modelo + tamanho de cada peça) e de variações (tamanho/cor com estoque).
- **Kits** (`src/lib/bundles.ts`, lista `KITS`): cada vaga puxa as peças de uma coleção. Os
  PREÇOS DOS KITS SÃO PROVISÓRIOS — confirme antes de vender.
- **Catálogo**: vem do banco (tabelas `collections`, `products`, `product_variants`). Com o banco
  vazio ou desligado, a loja mostra o catálogo inicial de `src/lib/catalog-data.ts`.
- **Importador CSV** (`/admin` → aba Produtos): formato de exportação da Shopify (Handle, Title,
  Body (HTML), Type, Tags, Collection, Status, Option1–3 Name/Value, Variant SKU, Variant Price,
  Variant Compare At Price, Variant Inventory Qty, Variant Image, Image Src). Também aceita
  planilha em português ("Título", "Preço", "Tamanho", "Cor", "Estoque", "Coleção") e arquivos
  do Excel com ";". Detecta a coleção pela coluna Collection, pelo Type ou pelo título; liga a
  uma coleção existente ou cria uma nova. Não duplica: acha o produto pelo Handle, depois pelo
  SKU e pelo título, e atualiza. Mostra prévia, erros por linha e o resultado.
- **Checkout** (`/checkout`): 3 etapas, Pix (PixGate, Umbrella, SagacePay, PayShark) e cartão em
  até 12x (HyperCash), upsell pós-compra, envio expresso. O preço é sempre recalculado no
  servidor (preço da variação escolhida) e variação sem estoque é recusada.
- **Painel admin** (`/admin`): funil, pedidos, checkouts abandonados, produtos e configuração
  dos gateways, do Meta Pixel e da UTMify.

## Antes de vender — o que configurar

1. **Supabase**: crie um projeto em supabase.com, rode os arquivos de `supabase/migrations/` (SQL
   Editor) e preencha o `.env` (hoje com valores de exemplo) e o `project_id` em `supabase/config.toml`.
2. **Segredos do servidor** (Vercel → Settings → Environment Variables — **nunca** no `.env`):
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` e as chaves dos gateways/rastreio que usar.
3. **Nome e dados da empresa**: `src/lib/brand.ts` (nome provisório, CNPJ, e-mail, WhatsApp,
   Instagram, cidade). O logo do site é o próprio nome; favicon e `og-image.jpg` foram gerados
   com o nome provisório.
4. **Preços dos kits e frete grátis**: `KITS` e `FREE_SHIPPING_MIN` em `src/lib/bundles.ts`.
5. **Produtos**: importe pelo admin (aba Produtos) ou clique em "Carregar catálogo inicial".
6. **Webhook**: registre `https://SEU-DOMINIO/api/public/pix-webhook` em cada gateway.

## Rodar localmente

```sh
bun install
bun run dev
```
