import type { CategoryId } from "./categories";

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: CategoryId;
  excerpt: string;
  content_html: string;
  eyecatch_url: string | null;
  published: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: number;
  title: string;
  body_html: string;
  published: number;
  created_at: string;
}

export interface PostInput {
  title: string;
  slug: string;
  category: CategoryId;
  excerpt: string;
  content_html: string;
  eyecatch_url: string | null;
  published: boolean;
}

export interface NewsInput {
  title: string;
  body_html: string;
  published: boolean;
}

// ---------- posts ----------

export async function listPublishedPosts(db: D1Database, category?: CategoryId): Promise<Post[]> {
  const stmt = category
    ? db
        .prepare(
          `SELECT * FROM posts WHERE published = 1 AND category = ? ORDER BY created_at DESC`
        )
        .bind(category)
    : db.prepare(`SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC`);
  const { results } = await stmt.all<Post>();
  return results;
}

export async function listAllPosts(db: D1Database): Promise<Post[]> {
  const { results } = await db.prepare(`SELECT * FROM posts ORDER BY created_at DESC`).all<Post>();
  return results;
}

export async function getPublishedPostBySlug(db: D1Database, slug: string): Promise<Post | null> {
  return db
    .prepare(`SELECT * FROM posts WHERE slug = ? AND published = 1`)
    .bind(slug)
    .first<Post>();
}

export async function getPostById(db: D1Database, id: number): Promise<Post | null> {
  return db.prepare(`SELECT * FROM posts WHERE id = ?`).bind(id).first<Post>();
}

export async function slugExists(db: D1Database, slug: string, excludeId?: number): Promise<boolean> {
  const row = excludeId
    ? await db
        .prepare(`SELECT id FROM posts WHERE slug = ? AND id != ?`)
        .bind(slug, excludeId)
        .first<{ id: number }>()
    : await db.prepare(`SELECT id FROM posts WHERE slug = ?`).bind(slug).first<{ id: number }>();
  return !!row;
}

export async function createPost(db: D1Database, input: PostInput): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO posts (title, slug, category, excerpt, content_html, eyecatch_url, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    )
    .bind(
      input.title,
      input.slug,
      input.category,
      input.excerpt,
      input.content_html,
      input.eyecatch_url,
      input.published ? 1 : 0
    )
    .run();
  return result.meta.last_row_id as number;
}

export async function updatePost(db: D1Database, id: number, input: PostInput): Promise<void> {
  await db
    .prepare(
      `UPDATE posts SET title = ?, slug = ?, category = ?, excerpt = ?, content_html = ?,
       eyecatch_url = ?, published = ?, updated_at = datetime('now') WHERE id = ?`
    )
    .bind(
      input.title,
      input.slug,
      input.category,
      input.excerpt,
      input.content_html,
      input.eyecatch_url,
      input.published ? 1 : 0,
      id
    )
    .run();
}

export async function togglePostPublished(db: D1Database, id: number): Promise<void> {
  await db
    .prepare(`UPDATE posts SET published = 1 - published, updated_at = datetime('now') WHERE id = ?`)
    .bind(id)
    .run();
}

export async function deletePost(db: D1Database, id: number): Promise<void> {
  await db.prepare(`DELETE FROM posts WHERE id = ?`).bind(id).run();
}

export async function incrementViewCount(db: D1Database, id: number): Promise<void> {
  await db.prepare(`UPDATE posts SET view_count = view_count + 1 WHERE id = ?`).bind(id).run();
}

export async function popularPosts(db: D1Database, limit = 3): Promise<Post[]> {
  const { results } = await db
    .prepare(`SELECT * FROM posts WHERE published = 1 ORDER BY view_count DESC LIMIT ?`)
    .bind(limit)
    .all<Post>();
  return results;
}

// ---------- news ----------

export async function listPublishedNews(db: D1Database): Promise<News[]> {
  const { results } = await db
    .prepare(`SELECT * FROM news WHERE published = 1 ORDER BY created_at DESC`)
    .all<News>();
  return results;
}

export async function listAllNews(db: D1Database): Promise<News[]> {
  const { results } = await db.prepare(`SELECT * FROM news ORDER BY created_at DESC`).all<News>();
  return results;
}

export async function getNewsById(db: D1Database, id: number): Promise<News | null> {
  return db.prepare(`SELECT * FROM news WHERE id = ?`).bind(id).first<News>();
}

export async function createNews(db: D1Database, input: NewsInput): Promise<number> {
  const result = await db
    .prepare(`INSERT INTO news (title, body_html, published) VALUES (?, ?, ?)`)
    .bind(input.title, input.body_html, input.published ? 1 : 0)
    .run();
  return result.meta.last_row_id as number;
}

export async function updateNews(db: D1Database, id: number, input: NewsInput): Promise<void> {
  await db
    .prepare(`UPDATE news SET title = ?, body_html = ?, published = ? WHERE id = ?`)
    .bind(input.title, input.body_html, input.published ? 1 : 0, id)
    .run();
}

export async function toggleNewsPublished(db: D1Database, id: number): Promise<void> {
  await db.prepare(`UPDATE news SET published = 1 - published WHERE id = ?`).bind(id).run();
}

export async function deleteNews(db: D1Database, id: number): Promise<void> {
  await db.prepare(`DELETE FROM news WHERE id = ?`).bind(id).run();
}
