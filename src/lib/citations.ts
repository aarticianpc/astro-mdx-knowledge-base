/**
 * Citation registry loader with strict build-time validation.
 *
 * If the JSON is malformed or any referenced citation id does not exist,
 * the build will fail with a Zod issue path that points to the offending field.
 */

import rawCitations from '../data/citations.json';
import { CitationRegistrySchema, type CitationEntry } from './schema';

const parsed = CitationRegistrySchema.safeParse(rawCitations);

if (!parsed.success) {
  // Surfaces a clear, file-aware error to the build log.
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  throw new Error(
    `[citations.ts] src/data/citations.json failed Zod validation:\n${issues}`,
  );
}

export const citationRegistry = parsed.data;

/**
 * Resolves a citation id to a typed CitationEntry.
 * Throws at build time if the id is not in the registry.
 */
export function resolveCitation(id: string): CitationEntry {
  const entry = citationRegistry[id];
  if (!entry) {
    throw new Error(
      `[citations] Unknown citation id "${id}". ` +
        `Add it to src/data/citations.json or remove the reference.`,
    );
  }
  return entry;
}

/**
 * Validates that every id referenced by an article exists in the registry.
 * Called from the article layout so the build fails on broken references.
 */
export function assertCitationsExist(
  ids: readonly string[],
  context: string,
): void {
  const missing = ids.filter((id) => !(id in citationRegistry));
  if (missing.length > 0) {
    throw new Error(
      `[citations] ${context} references missing citation ids: ` +
        `${missing.join(', ')}. ` +
        `Add them to src/data/citations.json.`,
    );
  }
}

/**
 * Format an entry for bibliography rendering (APA-ish).
 * Pure function, deterministic, suitable for static generation.
 */
export function formatBibliography(entry: CitationEntry): string {
  const authors = entry.authors.join(', ');
  const accessed = entry.accessedDate
    ? `Retrieved ${new Date(entry.accessedDate).toISOString().slice(0, 10)}.`
    : '';
  return `${authors} (${entry.year}). ${entry.title}. ${entry.publisher}. ${entry.url}. ${accessed}`.trim();
}
