import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { updateService, getServiceById } from "../../../../../lib/db";
import { isProjectCategoryId } from "../../../../../data/projects";
import { jsonResponse, readJsonBody } from "../../../../../lib/http";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return jsonResponse({ error: "invalid id" }, 400);
  }

  const existing = await getServiceById(env.DB, id);
  if (!existing) {
    return jsonResponse({ error: "not found" }, 404);
  }

  const body = await readJsonBody(request);
  if (!body) {
    return jsonResponse({ error: "invalid JSON" }, 400);
  }

  const category = typeof body.category === "string" ? body.category : undefined;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const url = typeof body.url === "string" && body.url ? body.url : null;
  const eyecatchUrl = typeof body.eyecatch_url === "string" && body.eyecatch_url ? body.eyecatch_url : null;
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const published = !!body.published;

  if (!name || !description || !isProjectCategoryId(category)) {
    return jsonResponse({ error: "サービス名・説明文・ジャンルは必須です" }, 400);
  }

  await updateService(env.DB, id, {
    category,
    name,
    url,
    eyecatch_url: eyecatchUrl,
    description,
    published,
  });

  return jsonResponse({ ok: true });
};
