# Astro MDX Knowledge Base (Demo)

A production-quality demo of an Astro static authority site with strict, build-time validation across MDX content and a JSON citation registry.

## What this demo proves

- **Astro 5 + TypeScript** in strict mode (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`).
- **MDX content collections** with Zod-validated frontmatter (`src/content/config.ts`).
- **JSON citation registry** validated once at module load (`src/lib/citations.ts`); the build fails on:
  - Malformed JSON
  - Missing required fields
  - An article referencing a citation id that does not exist in the registry
- **JSON-LD structured data** generated from the same object the visible page reads from. Visible content and structured data cannot drift, because they share a single source.
- **Tailwind 3** with a small, opinionated typography layer; no UI library.
- **Sitemap + RSS** generated at build time.
- **Lighthouse CI** wired into GitHub Actions; build fails if mobile performance/accessibility/best-practices/SEO drops below 95.
- **Cloudflare Pages** ready (zero-config: `npm run build`, output `dist/`).

## Architecture

```
src/
  content/
    config.ts          # Zod schema for article frontmatter
    articles/*.mdx     # Long-form content, validated at build time
  data/
    citations.json     # Single citation registry, validated at module load
  lib/
    schema.ts          # Shared Zod schemas
    citations.ts       # Registry loader + missing-id assertion
  components/
    Citation.astro     # Inline citation with hover tooltip + bibliography link
    Bibliography.astro # Renders the references section
    JsonLd.astro       # JSON-LD <script> emitter
    ArticleCard.astro
  layouts/
    BaseLayout.astro   # Site shell, canonical, meta
    ArticleLayout.astro# Wraps MDX, renders bibliography, emits JSON-LD
  pages/
    index.astro
    about.astro
    articles/
      index.astro
      [...slug].astro  # Static MDX article pages
    rss.xml.ts
```

## Validation philosophy

The build is the cheapest place to catch bad content. There are no runtime fallbacks or warnings; if frontmatter is malformed, the build fails loudly with a Zod issue path that points to the offending field.

Three layers:

1. **Frontmatter** is validated by Astro's content collection layer using `ArticleFrontmatterSchema`.
2. **Citation registry** is validated by `CitationRegistrySchema` at module load. Any malformed `citations.json` blows up the import.
3. **Cross-reference integrity** is enforced in `ArticleLayout.astro` via `assertCitationsExist`. If `citations: ["foo"]` references an id that is not in the registry, the article will not render and the build will fail.

## Local development

```bash
npm install
npm run dev      # localhost:4321
npm run build    # static dist/ output
npm run preview  # serve dist/
npm run lhci     # Lighthouse CI locally
```

## Deploy

See `DEPLOY.md` for full Cloudflare Pages instructions.
