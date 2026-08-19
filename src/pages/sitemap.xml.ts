import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { listPublishedPosts, listPublishedServices } from "../lib/db";
import { toIsoDatetime } from "../lib/datetime";
import { SITE } from "../data/site";

export const prerender = false;

function urlEntry(loc: string, lastmod?: string): string {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
}

export const GET: APIRoute = async () => {
  const [posts, services] = await Promise.all([listPublishedPosts(env.DB), listPublishedServices(env.DB)]);

  const staticPaths = ["/", "/blog", "/news", "/privacy"];

  const urls = [
    ...staticPaths.map((path) => urlEntry(new URL(path, SITE.url).toString())),
    ...posts.map((post) =>
      urlEntry(new URL(`/blog/${post.slug}`, SITE.url).toString(), toIsoDatetime(post.updated_at))
    ),
    ...services.map((service) =>
      urlEntry(
        new URL(`/works/${service.category}/${service.id}`, SITE.url).toString(),
        toIsoDatetime(service.updated_at)
      )
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
