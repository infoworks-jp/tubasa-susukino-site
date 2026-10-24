# 更新ガイド

## 正本と公開先

- 正本: `main`
- 独自ドメイン: https://www.tubasa-susukino.com/
- GitHub Pages: https://infoworks-jp.github.io/tubasa-susukino-site/
- 公開処理: `.github/workflows/pages.yml`

## 変更したい内容とファイル

| 内容 | 検索語 | ファイル |
|---|---|---|
| 店名、営業時間、住所、価格、説明 | 表示中の文章または金額 | `index.html` |
| メニュー切替・動画ダイアログ | `openCm`、`menuDialog` | `app.js` |
| 写真・メニュー・ロゴ | ファイル名 | `assets/` |
| TOP・CM動画 | ファイル名 | `assets/video/` |
| 流体演出の実装 | `initWebGL`、`initWebGPU` | `fluid-text.js` |
| 流体演出の公開用コード | 自動生成 | `vendor/fluid-text.bundle.js` |
| 見た目 | 対象のCSSクラス | 各CSSファイル |

## SEO・メニューの更新

- 店舗の検索向け情報、通常／特別営業時間は `seo.config.json`。画面上の案内（`index.html`）も同時に更新します。
- メニューの正本は `app.js` の `MENU`。価格を変えたら `npm run build:seo` を実行し、`index.html` の4言語の静的メニューも一緒にcommitします。
- `npm run test:seo` で生成漏れ・価格の食い違い・構造化データ・sitemapを検査します。既存の公開ゲートにも追加済みです。
- `lastModified` はトップページの意味のある情報を更新した日だけ変更します。自動的に毎日更新しません。
- `robots.txt` はレンダリング資産も含めクロール可能にし、検証用HTMLには `noindex` を設定しています。
- 4言語タブは同じURL内の切替なので、別URLの翻訳ページと偽る `hreflang` は設定していません。
- Google Search Consoleで所有権を確認した後、`https://www.tubasa-susukino.com/sitemap.xml` を送信し、トップのURL検査を行います。コード公開だけではGoogleへの送信・インデックス登録は完了しません。
- 通常営業時間は11:00〜翌03:00／月曜定休。2026-09-21の特別営業と2026-09-24の休業は有効日を限定して構造化しています。口コミ・評価・予約情報は未確認のため追加していません。

## 流体演出の再ビルド

```bash
npm ci
npm run build:fluid
```

生成された `vendor/fluid-text.bundle.js` も一緒にGitHubへ保存します。公開時のブラウザはnpmや外部CDNへ接続しません。

## 外部サービス

実行時に必要な外部リンクはGoogle Mapsだけです。サイト本体の画像・動画・JavaScriptはすべてこのリポジトリ内にあります。

## 公開確認

GitHub ActionsのPages公開成功後、独自ドメインをPCとスマートフォンで開き、TOP動画、CM、メニュー4言語、流体演出、縦スクロールを確認します。

## 音の演出

- `sound.js` / `sound.css`: スープの「ぐつぐつ」、控えめな湯気の音。交差点・夜道は遠い車の音、店内・メニューは小さな食器音へクロスフェード。
- 初期状態OFF。左上のSOUNDボタンで操作。非表示・ページ離脱・音声付き動画の再生時はOFFに戻す。
- 外部音源なしの合成音。公開時はHTMLのバージョン更新とON/OFF、動画の音との切替を確認。

## 来店案内（試験版）

- `visit-guide.js` / `visit-guide.css`: トップ、メニュー、アクセス、ラーメン、英語・中国語・韓国語ページの固定ボタンとFAQ案内。
- メニュー・営業時間・住所・電話など、公開済みの情報だけを使う。個別の食材や当日の臨時営業は電話へ案内する。
- 現状は端末内の語句判定のみ。生成AI、質問送信・保存、予約、決済は未接続。実際の売上増加を示す機能ではない。
- 店舗情報を変更するときは案内文も同時に点検する。

## 短編連載「すすきの十六夜」

- 公開原稿の正本は `content/stories.json`。未承認・未来の原稿を置かないでください。GitHub Pages はリポジトリ全体を公開するため、下書きは別の非公開作業領域で管理します。
- 親の定期実行は、毎週火曜・金曜18時 **Asia/Tokyo** に、承認済みの1作品を `episodes` に追加して既存の `main` 更新経路を使います。予定実行自体はこのリポジトリに追加していません。
- 一作品の項目は `slug`（小文字英数字・ハイフンの固定URL識別子）、`title`、`publishedAt`（JSTの掲載日 `YYYY-MM-DD`、または `+09:00` の日時）、`approved: true`、`paragraphs`（段落配列。段落内の改行は `\n`）です。話数は自動付与しません。既存slugは変更しないでください。
- 連載全体の `seriesTitle`、`introduction`、`disclaimer` は作品追加時に維持します。本文や但し書きを勝手に改稿しません。
- GitHub接続ツールでこの単一JSONを更新してcommitする場合も、必ず直前のmainのファイルを取得し、既存作品を保持して追加します。後続作品を事前にrepoへ保存せず、掲載時に承認済み原稿だけ追加します。
- ビルド入口は `npm run build:seo`。`scripts/stories.mjs` が `/stories/` と各話ページを生成し、トップの一覧リンク・sitemapも同じビルドで更新します。`npm test` で生成一致・原稿条件等を検査します。
- 既存Pagesワークフローの検査用checkoutと公開用checkoutで同じビルドを実行するため、原稿JSONだけのcommitでも生成・検証・公開へ進みます。GitHub Actionsの成功と公開URLの本文一致を確認して初めて掲載完了とします。生成HTMLを直接直しても次のビルドで上書きされます。
- Facebookは別のMetricool運用です。このリポジトリからFacebookへ送信しません。同じ `paragraphs` を本文の正本にし、投稿結果のURL/IDを別途記録して重複投稿を避けます。
