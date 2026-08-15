import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { updateNews, getNewsById } from "../../../../../lib/db";
import { jsonResponse, readJsonBody } from "../../../../../lib/http";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return jsonResponse({ error: "invalid id" }, 400);
  }

  const existing = await getNewsById(env.DB, id);
  if (!existing) {
    return jsonResponse({ error: "not found" }, 404);
  }

  const body = await readJsonBody(request);
  if (!body) {
    return jsonResponse({ error: "invalid JSON" }, 400);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const bodyHtml = typeof body.body_html === "string" ? body.body_html : "";
  const published = !!body.published;

  if (!title) {
    return jsonResponse({ error: "タイトルは必須です" }, 400);
  }

  await updateNews(env.DB, id, { title, body_html: bodyHtml, published });
  return jsonResponse({ ok: true });
};
