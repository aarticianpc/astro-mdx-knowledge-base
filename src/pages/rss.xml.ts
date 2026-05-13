import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return rss({
    title: 'Web Performance Knowledge Base',
    description:
      'Long-form articles on Core Web Vitals, images, caching, rendering, and JavaScript performance.',
    site: context.site!.toString(),
    items: articles
      .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
      .map((article) => ({
        title: article.data.title,
        description: article.data.description,
        pubDate: article.data.publishedAt,
        link: `/articles/${article.slug}/`,
      })),
  });
}
