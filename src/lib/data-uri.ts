/**
 * D1に保存したBase64 data URI(`data:image/jpeg;base64,...`)を、
 * X/Twitterなど外部クローラーが取得できる実体のあるHTTPレスポンスに変換する。
 * SNSのOGP画像取得は data: URL を認識できないため必要。
 */
export function dataUriToImageResponse(dataUri: string): Response | null {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  const [, mimeType, base64] = match;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Response(bytes, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
