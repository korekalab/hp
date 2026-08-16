-- Migration number: 0004    2026-08-16T00:00:00.000Z
-- ブログのカテゴリ体系を development/media/knowhow/case から
-- blog/knowhow/devlog/case/column に変更する。
-- SQLiteはCHECK制約を直接変更できないため、テーブルを作り直す。
-- 既存記事はすべて "blog" に割り振る(ユーザー指示による)。

CREATE TABLE posts_new (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  title             TEXT    NOT NULL,
  slug              TEXT    NOT NULL UNIQUE,
  category          TEXT    NOT NULL CHECK (category IN ('blog','knowhow','devlog','case','column')),
  excerpt           TEXT    NOT NULL DEFAULT '',
  meta_description  TEXT,
  content_html      TEXT    NOT NULL DEFAULT '',
  eyecatch_url      TEXT,
  published         INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0,1)),
  view_count        INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO posts_new (
  id, title, slug, category, excerpt, meta_description, content_html,
  eyecatch_url, published, view_count, created_at, updated_at
)
SELECT
  id, title, slug, 'blog', excerpt, meta_description, content_html,
  eyecatch_url, published, view_count, created_at, updated_at
FROM posts;

DROP TABLE posts;
ALTER TABLE posts_new RENAME TO posts;

CREATE INDEX IF NOT EXISTS idx_posts_published_created ON posts (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category           ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_view_count          ON posts (view_count DESC);
