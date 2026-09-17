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
