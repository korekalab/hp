/// <reference path="../worker-configuration.d.ts" />

// wrangler types が生成する Env (`worker-configuration.d.ts`) には D1/R2/Assets の
// バインディングしか含まれない。secret経由の値(wrangler.jsoncには現れない)を
// ここで宣言マージして Env / Cloudflare.Env の両方に反映する。
interface __BaseEnv_Env {
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
}
