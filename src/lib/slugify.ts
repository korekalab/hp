/**
 * タイトルからスラッグ候補を生成する。日本語はそのまま残し(URLエンコードされて動作する)、
 * 空白や記号だけをkebab-caseに正規化する。管理画面側で編集可能なため、あくまで初期提案。
 */
export function slugify(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[\s　]+/g, "-")
    .replace(/[^\p{L}\p{N}\-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || `post-${Date.now().toString(36)}`;
}
