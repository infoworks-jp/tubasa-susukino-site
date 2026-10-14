# 写真付き建物データの出典

出典：「3D都市モデル（Project PLATEAU）札幌市（2020年度）」（札幌市・国土交通省）を加工して味一番つばさサイトが作成。

- データセット：https://www.geospatial.jp/ckan/dataset/plateau-01100-sapporo-shi-2020
- 利用条件：https://www.mlit.go.jp/plateau/site-policy/ （公共データ利用規約1.0、CC BY 4.0での利用を許諾）
- CC BY 4.0：https://creativecommons.org/licenses/by/4.0/
- 使用版：仕様v4への更新データ。**外観の資料年代は2020年度**であり、2025年の仕様更新や当サイトの更新日は撮影日を意味しません。
- 配信元：https://assets.cms.plateau.reearth.io/assets/16/06e56d-a2d4-4fe4-ac91-b2762b96e033/01100_sapporo-shi_city_2020_citygml_7_op_bldg_3dtiles_01101_chuo-ku_lod2/tileset.json
- 使用タイル：`data/data30.b3dm`、`data/data44.b3dm`。

## 収録範囲と加工

中心は東経141.354277879度・北緯43.055365148368度。約400m四方の街区のうち、交差点北側を中心とする写真付きLOD2建物85棟（東側タイル55棟・西側30棟）を選択しています。横丁入口・ニッカの建物・交差点北側の漫画原画がある区画は、既存の原画を優先しています。

ECEF座標から東・上・南のメートル座標へ変換し、既存の平坦な道路に合わせて各建物の最下点を0.2mに揃えています。地形の標高を再現したモデルではありません。建物に含まれる屋根形状、段差、窓や外壁・看板の写真を使用しています。写真のない建物は既存の地図由来の概略表現を残しています。

写真画像は利用部分だけをUVアトラスへ詰め直しました。元の画素解像度を維持し、リサイズ・生成による看板の追加は行っていません。WebPはロスレス。線画・トーン表示では、写真内の明暗の境界を画面上で抽出し、黒ベタと網点に変換します。この処理はAIを呼び出しません。

**面ごとの写真解像度には差があります。近接しても読めない看板や、写真の歪み・撮影時の影は残ります。現況の店舗情報、営業状況、すべての外壁の精密トレースを保証するものではありません。**

PNGには出典と加工の表示を焼き込みます。GLBには写真付き形状・元写真テクスチャ・建物ID・資料年代・出典・利用条件を含めます。画面上の輪郭抽出と網点はGLBへ焼き込まれないため、同じ漫画の見え方を保存するときはPNGを使用してください。

## 再生成

公式タイルを保存したフォルダを指定し、リポジトリのNode依存関係とPython Pillowを用いて以下を実行します。

```sh
node scripts/build-plateau.mjs output/plateau-v4/tiles output/plateau-v4/processed
python3 scripts/pack-plateau-textures.py output/plateau-v4/processed location/assets/plateau
npm run build:location
```

ブラウザへ配信するのは `location/assets/plateau/data30.glb` と `data44.glb` です。制作時のデコードにはThree.js同梱のDraco（Apache-2.0）を使用します。閲覧時にはPLATEAU APIや外部地図APIへ接続せず、当サイトの静的ファイルのみを読み込みます。
