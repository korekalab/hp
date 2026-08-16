import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { updatePost, slugExists, getPostById } from "../../../../../lib/db";
import { isCategoryId } from "../../../../../lib/categories";
import { stripHtmlAndTruncate } from "../../../../../lib/excerpt";
import { jsonResponse, readJsonBody } from "../../../../../lib/http";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return jsonResponse({ error: "invalid id" }, 400);
  }

  const existing = await getPostById(env.DB, id);
  if (!existing) {
    return jsonResponse({ error: "not found" }, 404);
  }

  const body = await readJsonBody(request);
  if (!body) {
    return jsonResponse({ error: "invalid JSON" }, 400);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const category = typeof body.category === "string" ? body.category : undefined;
  const contentHtml = typeof body.content_html === "string" ? body.content_html : "";
  const eyecatchUrl = typeof body.eyecatch_url === "string" && body.eyecatch_url ? body.eyecatch_url : null;
  const metaDescriptionRaw = typeof body.meta_description === "string" ? body.meta_description.trim() : "";
  const metaDescription = metaDescriptionRaw ? metaDescriptionRaw.slice(0, 160) : null;
  const published = !!body.published;

  if (!title || !slug || !isCategoryId(category)) {
    return jsonResponse({ error: "タイトル・スラッグ・カテゴリは必須です" }, 400);
  }

  if (await slugExists(env.DB, slug, id)) {
    return jsonResponse({ error: "このスラッグは既に使われています" }, 409);
  }

  const excerpt = stripHtmlAndTruncate(contentHtml, 100);

  await updatePost(env.DB, id, {
    title,
    slug,
    category,
    excerpt,
    meta_description: metaDescription,
    content_html: contentHtml,
    eyecatch_url: eyecatchUrl,
    published,
  });

  return jsonResponse({ ok: true });
};
