// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://korekalab.com',
  output: 'server',
  // Astro Sessions (Cloudflare KV) は使わず、独自の署名Cookieで管理画面の
  // 認証を行うため無効化する。有効のままだと未使用のKV namespaceが
  // デプロイ時に自動プロビジョニングされてしまう。
  session: false,
  adapter: cloudflare({
    imageService: 'compile',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
