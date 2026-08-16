# コレカラボ公式サイト (korekalab.com)

「これか！」と思ったら、やってみる。を1ページのスクロールで伝える、コレカラボのコーポレートサイト。トップページ(`/`)は完全な静的ページ、`/blog`（事例・ノウハウ）と`/news`（お知らせ）はノーコード管理画面から更新できるDB連動のページになっている。

## 技術構成と選定理由

| 項目             | 選定                                    |
| ---------------- | --------------------------------------- |
| フレームワーク   | [Astro](https://astro.build/)（`output: "server"`、トップページ等は`prerender`で静的化）|
| スタイリング     | Tailwind CSS v4 (`@tailwindcss/vite`)   |
| ホスティング     | Cloudflare Workers（`@astrojs/cloudflare`アダプタ + Static Assets）|
| DB               | Cloudflare D1（ブログ記事・お知らせ）    |
| 画像保存         | D1にBase64で保存（クレジットカード登録なしで完結。詳細は後述）|
| リッチエディタ   | [TipTap](https://tiptap.dev/) core（vanilla JS、フレームワーク依存なし）|
| 管理画面認証     | 共有パスワード + 署名付きCookie（セッションテーブル不要）|
| フォント         | Fontsource（M PLUS Rounded 1c / Noto Sans JP、セルフホスト）|

### なぜ Astro か

- トップページのような**完全な静的1ページLP**と、`/blog` `/admin` のような**DBを伴う動的ページ**が同じサイト内に混在する。Astroは`output: "server"`のもとでもページ単位で`export const prerender = true`を指定でき、トップページ(`index.astro`)・`404.astro`は今まで通り完全静的なまま、ブログ/お知らせ/管理画面だけをオンデマンドSSR化できる。この使い分けが必要だったのがAstroを選んだ最大の理由。
- `@astrojs/cloudflare`アダプタにより、D1・R2などのCloudflareバインディングにそのままアクセスできる。
- コンポーネント指向で、既存の静的セクションの資産（`src/data/*.ts`のパターンやTailwindの意匠）をそのままブログ/管理画面にも流用できた。

### なぜR2を使わずD1にBase64で画像を保存しているか

Cloudflare R2は無料枠があるものの、**有効化にクレジットカード登録が必須**という制約がある。今回はそれを避けたいという要望があったため、アップロードされた画像はブラウザのCanvasで最大辺1200〜1600px程度にリサイズ・JPEG圧縮してからBase64文字列に変換し、D1のTEXTカラム（`eyecatch_url` / `content_html`内の`<img>`）にそのまま保存している（`src/lib/client-image.ts`）。1枚あたり500KB程度を上限にクライアント側でチェックしており、通常のブログ運用であれば実用上問題ない設計。将来的に画像点数・容量が大きく増えた場合はR2への移行を検討する。

## ディレクトリ構成

```text
/
├── migrations/0001_init.sql   D1スキーマ(posts, news テーブル)
├── public/                     favicon, OGP画像, robots.txt, _headers
├── src/
│   ├── assets/                  ロゴなど、ビルド時に処理する元画像
│   ├── components/
│   │   ├── icons/                ホームページ用SVGアイコン
│   │   ├── blog/                 BlogCard / CategoryTabs / PopularSidebar
│   │   ├── news/                 NewsAccordionItem
│   │   └── admin/                AdminEditorScript(TipTap) / EyecatchUploader
│   ├── data/                    静的コンテンツ(トップページ用)
│   ├── layouts/
│   │   ├── Layout.astro           head内のメタタグ・OGP・構造化データ
│   │   ├── PageLayout.astro       Layout+Header+Footer(/blog, /news用)
│   │   └── AdminLayout.astro      管理画面用レイアウト(noindex)
│   ├── lib/
│   │   ├── db.ts                  D1クエリヘルパー
│   │   ├── auth.ts                管理画面セッションCookieの署名/検証
│   │   ├── categories.ts          ブログカテゴリ定義
│   │   ├── slugify.ts / excerpt.ts
│   │   └── client-image.ts        画像リサイズ→Base64変換(ブラウザ側)
│   ├── middleware.ts             /admin, /api/admin の認証ガード
│   └── pages/
│       ├── index.astro / 404.astro   静的(prerender)
│       ├── blog/                     一覧・詳細(SSR)
│       ├── news/                     一覧(SSR)
│       ├── admin/                    管理画面(要ログイン)
│       └── api/admin/                管理画面用API
└── wrangler.jsonc               D1バインディング等を含むCloudflare設定
```

## コンテンツの追加・編集方法

### トップページ(静的セクション)

`src/data/*.ts` を編集するだけで反映される(従来通り)。

- 「今、やっていること」カード → `src/data/projects.ts`
- 「実験中。」のプロダクト一覧 → `src/data/experiments.ts`
- サイトタイトル・説明文・問い合わせ先 → `src/data/site.ts`

### ブログ(事例・ノウハウ)・お知らせ・サービス(今、やっていること)

`/admin` のノーコード管理画面から追加・編集する。共有パスワードでログイン後、以下を編集できる。エンジニアの操作は不要。

- **ブログ記事**: タイトル・リンク(スラッグ)・カテゴリ・メタディスクリプション(SEO用、未入力時は本文から自動生成)・アイキャッチ画像・本文(TipTapエディタでH1〜H3・太字・画像挿入・リンクのボタン化/カード化など)・公開/非公開
- **お知らせ**: タイトル・本文・公開/非公開
- **サービス**: トップページ「今、やっていること」の各ジャンル(`/works/[ジャンル]`)に表示される、サービス名・リンク・アイキャッチ画像・説明文・公開/非公開。ジャンルの定義自体(アイコンや説明文)は引き続き `src/data/projects.ts` で管理する。

## 開発

```sh
npm install
npm run dev       # http://localhost:4321 (astro dev / workerd上で動作)
npm run build     # ./dist/ に出力(client=静的アセット, server=Workerスクリプト)
npm run astro check   # 型チェック
```

### ローカルでD1・管理画面を使うための初回セットアップ

```sh
# .dev.vars を作成(gitignore対象)し、以下2行を記入
# ADMIN_PASSWORD=好きなパスワード
# SESSION_SECRET=openssl rand -base64 32 などで生成したランダム文字列

npx wrangler d1 migrations apply korekalab-db --local
```

## Cloudflare へのデプロイ

本プロジェクトは `@astrojs/cloudflare` アダプタによる **Workers（SSR + Static Assets 併用）** 構成。`wrangler.jsonc` の `main` は Astro アダプタが提供する統一エントリーポイント(`@astrojs/cloudflare/entrypoints/server`)を指定しており、`astro build` の出力(`dist/client` = 静的アセット, `dist/server` = Workerスクリプト)をそのままデプロイできる。

### 初回のみ: Cloudflareリソース作成

```sh
npx wrangler login
npx wrangler d1 create korekalab-db      # database_id を wrangler.jsonc に転記済み
npx wrangler secret put ADMIN_PASSWORD   # 管理画面の共有パスワード
npx wrangler secret put SESSION_SECRET   # ランダムな長い文字列
npx wrangler d1 migrations apply korekalab-db --remote   # 本番DBにテーブル作成
```

### 方法A: Cloudflare ダッシュボードでGitHub連携（推奨・現在の運用方法）

1. リポジトリをGitHubにpush
2. Cloudflare ダッシュボード → Workers & Pages → 「Gitに接続」
3. ビルド設定
   - ビルドコマンド: `npm run build`
   - デプロイコマンド: `npx wrangler deploy`
4. カスタムドメイン `korekalab.com` を追加

### 方法B: Wrangler CLI で手動デプロイ

```sh
npm run build
npx wrangler deploy
```

## Google Analytics (GA4)

`src/data/site.ts` の `gaMeasurementId` に測定ID(`G-XXXXXXX`)を設定すると、`src/layouts/Layout.astro` が自動でgtag.jsを出力する(全ページに反映)。測定を止めたい場合は空文字にすればタグ自体が出力されなくなる。

## SEO / メタデータ

- `title` / `description` / OGP / Twitter Card: `src/layouts/Layout.astro`
- 構造化データ（Organization / JSON-LD）: `src/layouts/Layout.astro`
- `sitemap.xml`: `@astrojs/sitemap` により自動生成
- `robots.txt`: `public/robots.txt`（`/admin` `/api` はDisallow、管理画面ページ自体にも`noindex`メタタグあり）

## アクセシビリティ / モーション

`prefers-reduced-motion: reduce` が指定された環境では、`src/styles/global.css` の設定によりスクロールアニメーション・浮遊アニメーションが無効化される。
