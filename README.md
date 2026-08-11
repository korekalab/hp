# コレカラボ公式サイト (korekalab.com)

「これか！」と思ったら、やってみる。を1ページのスクロールで伝える、コレカラボのコーポレートサイトです。

## 技術構成と選定理由

| 項目             | 選定                                    |
| ---------------- | --------------------------------------- |
| フレームワーク   | [Astro](https://astro.build/)（静的出力）|
| スタイリング     | Tailwind CSS v4 (`@tailwindcss/vite`)   |
| ホスティング     | Cloudflare Workers（Static Assets）      |
| フォント         | Fontsource（M PLUS Rounded 1c / Noto Sans JP、セルフホスト）|
| CMS / DB         | なし（コンテンツはリポジトリ内の TypeScript データファイル）|

### なぜ Astro か

- **1ページのコーポレートLP**という規模に対して、Next.js や Remix のようなフルスタックフレームワークは過剰。Astro はデフォルトでクライアントJSをほぼ出力しない「Islands」構成のため、この規模のサイトで最速の表示速度を実現できる。
- ビルド成果物が完全な静的HTML/CSS/JSになるため、**Cloudflare（Workers Static Assets）に無料枠で安定してデプロイ**できる（サーバーレス関数やDBは一切不要）。
- `sitemap.xml`・OGP・構造化データなど**SEO関連の機能が標準/公式インテグレーションで揃っている**（`@astrojs/sitemap` など）。
- コンポーネント指向で、`src/data/*.ts` にコンテンツを分離しているため、**非エンジニアでも配列に1項目追加するだけで**プロジェクトや実験を追加できる。

Vite/React SPA や素のHTMLも検討したが、SEO（メタタグ・sitemap・構造化データ）の扱いやすさ、将来ページが増えた場合の拡張性を考慮しAstroを採用した。

## ディレクトリ構成

```text
/
├── public/                 favicon, OGP画像, robots.txt, _headers など（そのまま配信される）
├── src/
│   ├── assets/              ロゴなど、ビルド時に処理する元画像
│   ├── components/          セクションごとのAstroコンポーネント
│   │   └── icons/           SVGアイコンコンポーネント
│   ├── data/                 コンテンツデータ（ここを編集すれば内容更新できる）
│   │   ├── site.ts           サイト全体の設定（タイトル・説明文・メールアドレス等）
│   │   ├── projects.ts       「今、やっていること」カード
│   │   ├── experiments.ts    「実験中。」に載せるプロダクト一覧
│   │   └── flow.ts           「HOW WE DO」の5ステップ
│   ├── layouts/Layout.astro  head内のメタタグ・OGP・構造化データ・共通script
│   ├── pages/index.astro     1ページ分のセクションを並べるだけ
│   └── styles/global.css     Tailwindテーマ（ブランドカラー・フォント・アニメーション）
└── wrangler.jsonc           Cloudflare Workers (Static Assets) 向け設定
```

## コンテンツの追加・編集方法

すべて `src/data/` 配下のファイルを編集するだけで反映されます。

- **「今、やっていること」のカードを増やす／減らす／並び替える** → `src/data/projects.ts` の配列を編集。`url` を設定すると自動的にカードがリンクになります。
- **「実験中。」にプロダクトを追加する** → `src/data/experiments.ts` の `experiments` 配列に `{ id, name, description, status, url? }` を追加。`status` は `developing` / `released` / `testing` / `closed` から選択（終了した実験も `closed` として残すことで、失敗も含めた実験の履歴になります）。配列が空の間は「ここには、これからいろいろ増えていきます。」というプレースホルダーが表示されます。
- **サイトタイトル・説明文・問い合わせ先メール** → `src/data/site.ts`

## 開発

```sh
npm install
npm run dev       # http://localhost:4321
```

```sh
npm run build     # ./dist/ に静的ファイルを出力
npm run preview   # ビルド結果をローカルで確認
```

## Cloudflare へのデプロイ

Cloudflare は Pages と Workers を統合しており、本プロジェクトは **Workers Static Assets**（静的アセットのみのWorker）としてデプロイする構成になっている。`wrangler.jsonc` の `assets.directory` がビルド出力先 `dist` を指しており、サーバーサイドの処理（`main` エントリーポイント）は一切持たない、完全な静的サイトとして配信される。

### 方法A: Cloudflare ダッシュボードでGitHub連携（推奨）

1. このリポジトリをGitHubにpushする
2. Cloudflare ダッシュボード → Workers & Pages → 「Gitに接続」でこのリポジトリを選択
3. ビルド設定（ダッシュボードが `wrangler.jsonc` を検出して自動入力する）
   - ビルドコマンド: `npm run build`
   - デプロイコマンド: `npx wrangler deploy`
4. デプロイ後、プロジェクトの「カスタムドメイン」設定から `korekalab.com` を追加（ドメインのゾーンが同じCloudflareアカウントに存在している必要がある）

### 方法B: Wrangler CLI で手動デプロイ

```sh
npm run build
npx wrangler deploy
```

設定内容は `npx wrangler deploy --dry-run` で事前検証できる。

## Google Analytics の追加方法

現時点ではアナリティクスは未導入です。導入する場合は `src/layouts/Layout.astro` の `<head>` 内にあるコメント部分に gtag.js のスクリプトタグを追加するだけで有効になります（サイト全体に反映されます）。

## SEO / メタデータ

- `title` / `description` / OGP / Twitter Card: `src/layouts/Layout.astro`（`src/data/site.ts` の値を利用）
- 構造化データ（Organization / JSON-LD）: `src/layouts/Layout.astro`
- `sitemap.xml`: `@astrojs/sitemap` により `npm run build` 時に自動生成（`astro.config.mjs` の `site` を参照）
- `robots.txt`: `public/robots.txt`
- favicon一式（ico / svg / apple-touch-icon / android-chrome）: `public/`

## アクセシビリティ / モーション

`prefers-reduced-motion: reduce` が指定された環境では、`src/styles/global.css` の設定によりスクロールアニメーション・浮遊アニメーションが無効化されます。
