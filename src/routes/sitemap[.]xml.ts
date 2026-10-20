import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { allBundles, getCategories } from "@/lib/bundles";
import { ensureCatalog } from "@/lib/catalog.server";

const BASE_URL = "";

const paths = () => [
  "/",
  ...getCategories().map((c) => `/colecao/${c.id}`),
  ...allBundles().map((b) => `/produto?plano=${encodeURIComponent(b.id)}`),
  "/sobre",
  "/contato",
  "/faq",
  "/rastreio",
  "/politica-envio",
  "/politica-privacidade",
  "/politica-reembolso",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        await ensureCatalog();
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...paths().map(
            (p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
