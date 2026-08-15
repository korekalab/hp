import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { SESSION_COOKIE_NAME, verifySessionValue } from "./lib/auth";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isProtectedPage = pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.has(pathname);
  const isProtectedApi = pathname.startsWith("/api/admin");

  if (!isProtectedPage && !isProtectedApi) {
    return next();
  }

  const cookieValue = context.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authenticated = await verifySessionValue(cookieValue, env.SESSION_SECRET);

  if (authenticated) {
    return next();
  }

  if (isProtectedApi) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const redirectTarget = pathname.startsWith("/admin") ? pathname : "/admin";
  return context.redirect(`/admin/login?next=${encodeURIComponent(redirectTarget)}`);
});
