/**
 * アップロードされた画像ファイルをリサイズし、data URL文字列にして返す。
 * R2等の外部ストレージを使わず、D1のTEXTカラムにそのまま保存できるサイズに収めるため、
 * ブラウザのCanvasで最大辺を制限してJPEG圧縮する(SVGはそのまま)。
 */
export async function fileToDataUrl(file: File, maxDimension = 1600, quality = 0.82): Promise<string> {
  if (file.type === "image/svg+xml") {
    return readFileAsDataUrl(file);
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("このブラウザはCanvasに対応していません");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("読み込みに失敗しました"));
    reader.readAsDataURL(file);
  });
}

/** 1枚あたりの上限(バイト目安)。D1の1行あたりのサイズに収まるよう保守的に制限する。 */
export const MAX_DATA_URL_LENGTH = 500 * 1024;
