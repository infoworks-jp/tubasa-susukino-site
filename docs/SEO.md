# 検索から来店までの設計

2026-09-20。トップの料理写真、湯気、境目、交差点の導入演出は変更しない。

## ページの役割

| URL | 答える内容・検索意図 |
| --- | --- |
| `/` | 味一番つばさの公式サイト、店名検索、店の雰囲気 |
| `/ramen/` | すすきのの味噌ラーメン、バターコーン、いくら丼とラーメンのセット、最初の一杯選び |
| `/menu/` | 味一番つばさのメニュー・値段、醤油・塩・チャーシュー・ねぎ・餃子・ハーフなどの選択 |
| `/access/` | すすきの駅周辺、新ラーメン横丁への行き方、営業時間、月曜定休、深夜・〆のラーメン |
| `/en/` | Susukino / Sapporo ramen, English menu, miso / butter corn / ikura, late-night hours |
| `/zh-hans/` | 札幌薄野拉面、味噌拉面、黄油玉米、中文菜单、营业时间与路线 |
| `/ko/` | 삿포로 스스키노 라멘、미소 라멘、버터 콘、한국어 메뉴、영업시간 |

キーワード数を増やすための地域別コピー、架空の口コミ・受賞歴・人気順位、隠しテキスト、meta keywords は使わない。
検索需要・順位を保証しない。表はユーザーが知りたい内容の対応表であり、検索ボリューム調査の数値ではない。

## 原本と更新

- 料理名・価格：`app.js` の `MENU` が原本。4言語各40項目。新ページ、トップの静的HTML、Menu構造化データはビルド時に同じ原本を使う。
- 店名・電話・住所・通常／特別営業時間：`seo.config.json`。案内文の営業時間は `scripts/seo-content.mjs` にもあるため、営業時間の変更時は双方を更新し、公開HTMLの整合を確認する。
- 説明文：`scripts/seo-content.mjs`、編集記事：`scripts/seo-pages.mjs`。
- 確認済みの公式サイト情報だけを掲載。支払方法・予約・バリアフリー・アレルギー対応可否は未確認なので断定しない。
- 翻訳は既存メニューを利用。新規の案内文は翻訳済みだが、必要に応じて母語話者の校閲を行う。
- `lastModified` は内容変更時だけ更新。ビルドのたびに現在時刻へ更新しない。

```sh
npm run build:seo
npm run test:seo
node tests/seo-browser-qa.mjs
```

生成された6ページ・トップHTML・サイトマップもコミットする。GitHub Pages はサーバーで生成しない。
公開は `pages.yml` だけが行う。既存の流体・見た目・入力QAと追加したガイドのブラウザQAを両方通す。

## 技術仕様

- 各URLは自己参照canonical、固有title/description、OG/Twitter、パンくずを持つ。
- `/menu/`, `/en/`, `/zh-hans/`, `/ko/` は同等のメニュー・来店案内。4言語＋x-default の相互hreflang。日本語のトップや料理記事には、等価でない言語ページへのhreflangを付けない。
- Restaurantは同一の `/#restaurant` IDと事実を全ページで使用。各言語の40項目はMenu/MenuSection/MenuItem/Offerで記述。レビューの星や未確認の在庫情報は加えない。
- FAQは読者向け。一般飲食店にFAQリッチリザルトが出るかのように扱わない。
- 7つのcanonical URLをXMLサイトマップに掲載。実際に表示する画像も関連付ける。noindexデモは除外。
- 重要な本文・メニューはHTMLに含まれ、JSが無効でも読める。FAQはネイティブdetails。言語リンクは通常のa要素。
- ガイドは動画・WebGL・地図ライブラリを読み込まず、写真とCSSを中心に構成。音や追跡は追加しない。
- 臨時営業のお知らせは既存の `holiday-notice.js` で2026-09-25 00:00 JSTに削除。日付を進めたテストを含む。
- 存在しないURLは404。ホームへの強制転送でエラーを隠さない。

## 公開後の確認

1. 7URLが200、canonicalとサイトマップが一致し、公開HTMLがコミットと一致すること。
2. Google Search Consoleのサイトマップ読み取りとURL検査を確認。未クロール・未登録を即座に不具合と断定しない。
3. 反映後に28日など同じ期間で、店名／非店名、ページ、言語、端末の表示・クリックを比較。小さい母数から順位向上を断定しない。
4. 外部紹介サイトの古い定休日・価格は公式の原本として取り込まない。外部プロフィールの修正は別途権限を確認する。

参考：
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/appearance/structured-data/local-business

Lighthouse SEOの点数は技術項目の診断であり、検索順位やリッチリザルト表示の保証ではない。
