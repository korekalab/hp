import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { deleteService } from "../../../../../lib/db";

export const prerender = false;

export const POST: APIRoute = async ({ params, redirect }) => {
  const id = Number(params.id);
  if (Number.isFinite(id)) {
    await deleteService(env.DB, id);
  }
  return redirect("/admin/services", 303);
};
