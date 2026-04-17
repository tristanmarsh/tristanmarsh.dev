---
title: Markdown Style Guide
description: A comprehensive reference for all supported markdown formatting options, from headings and lists to code blocks and tables.
publishDate: 2026-04-17 00:00:00
tags:
  - Meta
  - Design
draft: false
img: "https://placehold.co/1200x630/1a1a2e/ffffff?text=Markdown+Style+Guide"
img_alt: "Markdown Style Guide"
---

This post demonstrates all the markdown formatting capabilities available on this blog. Use it as a reference when writing your own posts.

---

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

## Paragraphs

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Inline Formatting

Here is some **bold text** and some *italic text*. You can also use ~~strikethrough~~ for deleted content. Combine them for ***bold and italic*** text.

Use `inline code` for short code references like `const x = 42` or file names like `package.json`.

## Blockquotes

> Design is not just what it looks like and feels like. Design is how it works.
> -- Steve Jobs

> Blockquotes can also span multiple paragraphs.
>
> Just keep using the `>` character on each line.

## Unordered Lists

- First item
- Second item
- Third item with a longer description that might wrap to the next line
- Fourth item

### Nested Unordered Lists

- Frontend technologies
  - HTML & CSS
  - JavaScript / TypeScript
  - React, Vue, Astro
- Backend technologies
  - Node.js
  - Python
  - Go
- DevOps
  - Docker
  - CI/CD pipelines

## Ordered Lists

1. Plan the feature
2. Write the code
3. Write tests
4. Submit for review
5. Deploy to production

### Nested Ordered Lists

1. Project setup
   1. Initialise the repository
   2. Install dependencies
   3. Configure linting
2. Development
   1. Build components
   2. Integrate APIs
3. Release
   1. Run final tests
   2. Tag a version
   3. Deploy

## Code Blocks

Here is a TypeScript example with syntax highlighting:

```typescript
interface BlogPost {
  title: string;
  description: string;
  publishDate: Date;
  tags: string[];
  draft?: boolean;
}

async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await fetchPosts();
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}

// Usage
const posts = await getPublishedPosts();
console.log(`Found ${posts.length} published posts`);
```

And a CSS snippet:

```css
.post-card {
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: var(--gradient-subtle);
  transition: box-shadow 0.2s ease;
}

.post-card:hover {
  box-shadow: var(--shadow-md);
}
```

## Links

- [Astro documentation](https://docs.astro.build)
- [MDN Web Docs](https://developer.mozilla.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

## Images

Below is an inline image rendered from a placeholder URL:

![Example placeholder image](https://placehold.co/800x400/2d2b55/ffffff?text=Inline+Image+Example)

## Horizontal Rule

Content above the rule.

---

Content below the rule.

## Tables

| Feature        | Status      | Notes                        |
| -------------- | ----------- | ---------------------------- |
| Headings       | Supported   | h1 through h4                |
| Lists          | Supported   | Ordered, unordered, nested   |
| Code blocks    | Supported   | With syntax highlighting     |
| Tables         | Supported   | With alignment               |
| Images         | Supported   | Inline and featured          |
| Blockquotes    | Supported   | Single and multi-paragraph   |

## Wrapping Up

That covers the full range of markdown formatting available. When writing a new post, refer back to this guide to see how each element renders on the site.
