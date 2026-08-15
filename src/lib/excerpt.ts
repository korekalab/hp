/**
 * TipTapが出力するHTMLからタグを除去し、指定文字数で切り詰めて抜粋を作る。
 */
export function stripHtmlAndTruncate(html: string, maxChars = 100): string {
  const text = html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|br)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}…`;
}
