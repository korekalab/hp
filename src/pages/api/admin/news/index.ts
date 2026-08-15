import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { createNews } from "../../../../lib/db";
import { jsonResponse, readJsonBody } from "../../../../lib/http";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
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

  const id = await createNews(env.DB, { title, body_html: bodyHtml, published });
  return jsonResponse({ id }, 201);
};
