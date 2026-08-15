export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** リクエストボディをJSONとして読み取る。失敗時はnull。 */
export async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const data = await request.json();
    if (!data || typeof data !== "object") return null;
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}
