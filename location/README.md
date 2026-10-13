# 味一番つばさ 3Dロケハン

参考ツール「どこでもロケハン」の実地図→3D街区・線画/トーン・書き出しという体験を、つばさ周辺専用ページとして独自実装。
参考ツールのコード・画像は複製せず、Three.js (MIT) とOpenStreetMap由来のOpenFreeMap/OpenMapTilesデータを使用。
元ツールは `frame-ancestors` により他ドメインへの埋め込み不可。

- 実際の建物の平面形状と地図タイルの高さを使用。高さ欠落時は15m。
- 約420m四方の街区、317棟分の平面形状。地図データは2026-10-13取得。
- カラー・輪郭線・網点トーン・夜景、回転/拡大/移動、3つのカメラ位置。
- 窓は装飾。建物の看板や入口、地形の標高は再現しない。
- PNGに出典を焼き込み、GLBのextrasに出典・地図メタデータを保持。
- 利用時のAI API呼び出し無し。地図・ライブラリは同一サイトから静的配信。
- 他の場所の検索、広さ変更、4km遠景、KML取り込み、地形再現は今回のページには含まれない。
- メニュー、TOPのFluid Text、既存の夜のすすきの案内は維持する。

## 再ビルド

リポジトリの既存依存 (three 0.183.2 / esbuild 0.25.9) を使用。

```bash
npx esbuild location/city.source.mjs --bundle --format=esm --minify --outfile=location/city.bundle.js
```

## 検証

`tests/location-browser-qa.mjs` と `.github/workflows/location-qa.yml`:
参考ツールの無改造表示を確認し、PC・スマートフォン幅で4モード、カメラ、キーボード操作、PNG/GLB保存、横スクロール、例外/シェーダーエラーを確認。
証拠はActionsの location-scout アーティファクトに保存。
既存の公開には `.github/workflows/pages.yml` の検証・配信経路を使う。
