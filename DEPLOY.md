# Deployment Guide

This project deploys to Cloudflare Pages with auto-deploy from GitHub.

## Prerequisites

- GitHub account
- Cloudflare account (free tier is fine)
- Repository pushed to GitHub

## Step 1: Push to GitHub

```bash
git init
git add -A
git commit -m "Initial commit: Astro MDX knowledge base demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/astro-mdx-knowledge-base.git
git push -u origin main
```

## Step 2: Connect to Cloudflare Pages

1. Visit https://dash.cloudflare.com
2. Workers and Pages, then Create, then Pages, then Connect to Git.
3. Select the `astro-mdx-knowledge-base` repository.
4. Configure build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leave empty
   - Environment variables: `NODE_VERSION=20`
5. Save and Deploy.

The first deploy takes 2-3 minutes. Future pushes to `main` auto-deploy.

## Step 3: Update site URL

After your first deploy, Cloudflare assigns a URL like `astro-mdx-knowledge-base.pages.dev`. Update `astro.config.mjs`:

```js
site: 'https://YOUR-SUBDOMAIN.pages.dev',
```

Commit and push to trigger redeploy. This ensures correct sitemap, RSS, and JSON-LD URLs.

## Step 4: Custom domain (optional)

Pages, then Custom domains, then Add. Cloudflare handles DNS and SSL automatically.

## Step 5: Lighthouse CI

The included GitHub Action (`.github/workflows/lighthouse.yml`) runs Lighthouse on every push and PR. It uploads results to temporary public storage and prints scores in the workflow log. The build fails if any category drops below 95.

For permanent results storage, set `LHCI_GITHUB_APP_TOKEN` in your repo secrets after installing the Lighthouse CI GitHub App.

## Verifying the build-time validation

Try one of these to confirm strict validation is working:

1. Add a typo to `src/data/citations.json` (e.g., remove a required field). Build fails with a Zod issue path.
2. In any MDX file, change `citations: [web-vitals-2024]` to `citations: [does-not-exist]`. Build fails with an unknown-id error.
3. Remove `description` from a frontmatter block. Build fails at the Astro content layer.

This is the proof that bad content cannot reach production.
