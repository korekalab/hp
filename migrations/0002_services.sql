-- Migration number: 0002    2026-08-15T00:00:00.000Z

CREATE TABLE IF NOT EXISTS services (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  category      TEXT    NOT NULL CHECK (category IN ('app','media','marketing','event','more')),
  name          TEXT    NOT NULL,
  url           TEXT,
  eyecatch_url  TEXT,
  description   TEXT    NOT NULL DEFAULT '',
  published     INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0,1)),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_services_category_published ON services (category, published, created_at DESC);
