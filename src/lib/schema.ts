/**
 * Shared Zod schemas for the knowledge base.
 *
 * Validation philosophy:
 * - Build fails on invalid frontmatter or missing citations.
 * - Errors surface at build time with file path and field path.
 * - No silent fallbacks. If you cannot describe the data shape, you cannot ship it.
 */

import { z } from 'zod';

/** A single citation in the global citation registry. */
export const CitationEntrySchema = z.object({
  id: z.string().min(1, 'Citation id is required'),
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1, 'At least one author required'),
  publisher: z.string().min(1),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  url: z.string().url(),
  accessedDate: z.string().datetime().optional(),
  doi: z.string().optional(),
});
export type CitationEntry = z.infer<typeof CitationEntrySchema>;

/** Registry: a Record keyed by citation id. */
export const CitationRegistrySchema = z.record(z.string(), CitationEntrySchema);
export type CitationRegistry = z.infer<typeof CitationRegistrySchema>;

/** Article frontmatter. Used by content collection in src/content/config.ts. */
export const ArticleFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(40, 'description should be 40+ chars for SEO'),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  author: z.object({
    name: z.string().min(1),
    url: z.string().url().optional(),
  }),
  cluster: z.enum([
    'core-web-vitals',
    'images',
    'caching',
    'javascript',
    'css',
    'rendering',
  ]),
  tags: z.array(z.string()).min(1),
  /** Citation ids referenced inline in the body. */
  citations: z.array(z.string().min(1)).default([]),
  draft: z.boolean().default(false),
  canonical: z.string().url().optional(),
});
export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;
