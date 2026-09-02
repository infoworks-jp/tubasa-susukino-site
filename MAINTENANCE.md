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

## 流体演出を変更した場合

```bash
npm ci
npm run build:fluid
```

生成された `vendor/fluid-text.bundle.js` も一緒にGitHubへ保存します。公開時のブラウザはnpmや外部CDNへ接続しません。

## 外部サービス

実行時に必要な外部リンクはGoogle Mapsだけです。サイト本体の画像・動画・JavaScriptはすべてこのリポジトリ内にあります。

## 公開確認

GitHub ActionsのPages公開成功後、独自ドメインをPCとスマートフォンで開き、TOP動画、CM、メニュー4言語、流体演出、縦スクロールを確認します。
