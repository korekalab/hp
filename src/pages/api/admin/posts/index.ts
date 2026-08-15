import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { createPost, slugExists } from "../../../../lib/db";
import { isCategoryId } from "../../../../lib/categories";
import { stripHtmlAndTruncate } from "../../../../lib/excerpt";
import { jsonResponse, readJsonBody } from "../../../../lib/http";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await readJsonBody(request);
  if (!body) {
    return jsonResponse({ error: "invalid JSON" }, 400);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const category = typeof body.category === "string" ? body.category : undefined;
  const contentHtml = typeof body.content_html === "string" ? body.content_html : "";
  const eyecatchUrl = typeof body.eyecatch_url === "string" && body.eyecatch_url ? body.eyecatch_url : null;
  const published = !!body.published;

  if (!title || !slug || !isCategoryId(category)) {
    return jsonResponse({ error: "タイトル・スラッグ・カテゴリは必須です" }, 400);
  }

  if (await slugExists(env.DB, slug)) {
    return jsonResponse({ error: "このスラッグは既に使われています" }, 409);
  }

  const excerpt = stripHtmlAndTruncate(contentHtml, 100);

  const id = await createPost(env.DB, {
    title,
    slug,
    category,
    excerpt,
    content_html: contentHtml,
    eyecatch_url: eyecatchUrl,
    published,
  });

  return jsonResponse({ id }, 201);
};
