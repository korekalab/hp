import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getPostById, getServiceById } from "../../../lib/db";
import { dataUriToImageResponse } from "../../../lib/data-uri";

export const prerender = false;

/**
 * ブログ記事・サービスのアイキャッチ画像(D1にBase64で保存)を、
 * X/TwitterなどSNSクローラーが読み取れる実URLとして配信する。
 * 例: /media/post/12 , /media/service/3
 */
export const GET: APIRoute = async ({ params }) => {
  const type = params.type;
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return new Response("Not found", { status: 404 });
  }

  let eyecatchUrl: string | null = null;

  if (type === "post") {
    const post = await getPostById(env.DB, id);
    if (post?.published === 1) eyecatchUrl = post.eyecatch_url;
  } else if (type === "service") {
    const service = await getServiceById(env.DB, id);
    if (service?.published === 1) eyecatchUrl = service.eyecatch_url;
  }

  if (!eyecatchUrl) {
    return new Response("Not found", { status: 404 });
  }

  const response = dataUriToImageResponse(eyecatchUrl);
  return response ?? new Response("Not found", { status: 404 });
};
