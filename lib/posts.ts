import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface Forwho {
  yes: string;
  no: string;
}
export interface Myth {
  said: string;
  real: string;
}

export interface Post {
  slug: string;
  title: string;
  sub: string;
  excerpt: string;
  cat: string;
  level: number;
  order: number;
  min: number;
  asof: string;
  draft: boolean;
  tldr: string;
  forwho?: Forwho;
  myth?: Myth;
  todo: string[];
  body: string;
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache) return cache;
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  cache = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? "",
      sub: data.sub ?? "",
      excerpt: data.excerpt ?? "",
      cat: data.cat,
      level: data.level,
      order: data.order,
      min: data.min ?? 0,
      asof: data.asof ?? "",
      draft: !!data.draft,
      tldr: data.tldr ?? "",
      forwho: data.forwho,
      myth: data.myth,
      todo: data.todo ?? [],
      body: content,
    } as Post;
  });
  return cache;
}

const byOrder = (a: Post, b: Post) => a.level - b.level || a.order - b.order;

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => !p.draft);
}

export function getQuestions(): Post[] {
  return getPublishedPosts()
    .filter((p) => p.level === 0)
    .sort(byOrder);
}

export function getGridPosts(): Post[] {
  return getPublishedPosts()
    .filter((p) => p.level >= 1)
    .sort(byOrder);
}

export function getComingCards(): Post[] {
  return getAllPosts()
    .filter((p) => p.draft)
    .sort(byOrder);
}

export function getReadingOrder(): Post[] {
  return getPublishedPosts().sort(byOrder);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug && !p.draft);
}

export function getPrevNext(slug: string): { prev: Post | null; next: Post | null } {
  const order = getReadingOrder();
  const at = order.findIndex((p) => p.slug === slug);
  if (at === -1) return { prev: null, next: null };
  return {
    prev: at > 0 ? order[at - 1] : null,
    next: at < order.length - 1 ? order[at + 1] : null,
  };
}

/** Levels that actually have at least one published post, level 0 excluded. */
export function getAvailableLevels(): number[] {
  const set = new Set<number>();
  getGridPosts().forEach((p) => set.add(p.level));
  getComingCards().forEach((p) => set.add(p.level));
  return Array.from(set)
    .filter((l) => l !== 0)
    .sort((a, b) => a - b);
}

/** Categories that actually have at least one published post or coming card. */
export function getAvailableCats(): string[] {
  const set = new Set<string>();
  getGridPosts().forEach((p) => set.add(p.cat));
  getComingCards().forEach((p) => set.add(p.cat));
  return Array.from(set);
}
