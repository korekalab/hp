const encoder = new TextEncoder();

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7日

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

/** 管理画面のセッションCookie値(payload.signature形式)を発行する。 */
export async function createSessionValue(secret: string): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 });
  const payloadB64 = toBase64Url(encoder.encode(payload));
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const sigB64 = toBase64Url(new Uint8Array(signature));
  return `${payloadB64}.${sigB64}`;
}

/** セッションCookie値の署名と有効期限を検証する。 */
export async function verifySessionValue(value: string | undefined, secret: string): Promise<boolean> {
  if (!value) return false;
  const [payloadB64, sigB64] = value.split(".");
  if (!payloadB64 || !sigB64) return false;

  const key = await importKey(secret);
  const expectedSignature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const expectedSigB64 = toBase64Url(new Uint8Array(expectedSignature));
  if (expectedSigB64 !== sigB64) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64))) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
