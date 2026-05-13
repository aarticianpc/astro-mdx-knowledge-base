import { defineCollection } from 'astro:content';
import { ArticleFrontmatterSchema } from '../lib/schema';

const articles = defineCollection({
  type: 'content',
  schema: ArticleFrontmatterSchema,
});

export const collections = { articles };
