-- Migration number: 0001    2026-08-12T00:00:00.000Z

CREATE TABLE IF NOT EXISTS posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT    NOT NULL,
  slug          TEXT    NOT NULL UNIQUE,
  category      TEXT    NOT NULL CHECK (category IN ('development','media','knowhow','case')),
  excerpt       TEXT    NOT NULL DEFAULT '',
  content_html  TEXT    NOT NULL DEFAULT '',
  eyecatch_url  TEXT,
  published     INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0,1)),
  view_count    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_published_created ON posts (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category           ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_view_count          ON posts (view_count DESC);

CREATE TABLE IF NOT EXISTS news (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  body_html   TEXT    NOT NULL DEFAULT '',
  published   INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0,1)),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_news_published_created ON news (published, created_at DESC);
