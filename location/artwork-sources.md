# すすきの漫画街区 — 写真資料と原画

2026-10-14制作。利用許可のある写真を使い、北側の交差点は写真を直接3D壁面へ投影して線画化。横丁入口とニッカの建物はAI画像編集による漫画原画を分割して配置しています。訪問者の操作でAIサービスは呼び出しません。

## 新ラーメン横丁

- 提供写真：利用者本人撮影、または制作利用許可ありと2026-10-14に確認済み。
- 承認原画：[yokocho-approved.png](assets/manga/yokocho-approved.png)
- 3D用展開原画：[yokocho-facade.png](assets/manga/yokocho-facade.png)
- 変更：白黒の漫画化、前景の分離、壁面の正面化、看板ごとの切り分け。主看板の幅を約3.2mとして比率を換算。絶対寸法は未測量。
- 入口の階段・凹みは見える範囲の浅い形状だけです。屋内の長さ・各店舗区画を再現したモデルではありません。

## ニッカの看板・すすきのビル

- x768, **Susukino 2016 (28870538075)**, 2016-07-31.
  [原写真と履歴](https://commons.wikimedia.org/wiki/File:Susukino_2016_(28870538075).jpg) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)
- ノボホショコロトソ, **すすきの交差点 01**, 2024-03-25.
  [原写真と履歴](https://commons.wikimedia.org/wiki/File:すすきの交差点_01.jpg) / [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- 派生原画：[nikka-facade.png](assets/manga/nikka-facade.png)。この派生原画は **[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)** で提供します。
- 変更：2枚の写真を基に白黒漫画へ描き起こし、壁面の展開・透視補正、看板の分割、前景の除去。隣接ビルの広告が混じった領域は3Dに使用していません。
- 下部の広告は2024年資料に基づく表現です。現在掲出中の広告の保証ではありません。

## 交差点北側（初回原画・現在は不使用）

- MIKI Yoshihito, **Susukino Intersection, Sapporo - Mar 5, 2024**, 2024-03-05.
  [原写真と履歴](https://commons.wikimedia.org/wiki/File:Susukino_Intersection,_Sapporo_-_Mar_5,_2024.jpg) / [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)
- 派生原画：[north-facades.png](assets/manga/north-facades.png)。この派生原画は **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)** で提供します。
- 変更：白黒漫画化、建物ごとの展開、前景の除去、壁面の分割。確認できない店名の補完が生じた低層部分は3Dに使用していません。Asahiの缶看板は交差点に向く一面に配置。

## 表現と精度

建物の配置はOpenStreetMap由来の地図と資料写真から調整。3Dの絶対寸法、細い柱や窓、表面の凹凸、遠景は概略です。漫画原画は写真のピクセル単位のトレースではなく描き起こしで、細かな文字や構造には省略・補完があります。未確認の屋内・店舗入口を実測として示していません。

漫画化の対象は新ラーメン横丁入口、すすきのビル、北側の看板・外壁。周辺全317棟の実写再現ではありません。外側の街区は既存の地図由来のモデルを使っています。実在性を保証できない自動配置の装飾樹木は、この対象街区では非表示にしています。

地図出典：© OpenStreetMap contributors / © OpenMapTiles / OpenFreeMap。
写真出典はページ、PNGの下部、GLBのメタデータにも残ります。PNG/GLBを再配布する際も、含まれる写真由来の原画のクレジットとライセンスを保持してください。

初回原画の配信用 `.webp` は上記PNGと全画素が一致する可逆圧縮版です。同じクレジット・利用条件が適用されます。旧原画3枚の配信量は合計約6.3MBでした。

## 交差点北側の写真投影への置換（2026-10-14・今回の改修）

北側の旧AI漫画原画 `north-facades.webp` は描画から外しました。上記MIKI Yoshihitoの2024-03-05写真（6000×3375px）から、`x=1020, y=520, width=2800, height=1680` を解像度変更なしで取り出し、可逆WebP `north-photo-2024.webp` として保存。**CC BY 2.0** が適用されます。看板の文字を生成し直さず、写真の画素をそのまま使用します。

- 対象：SAMTYの2方向の屋上看板と支持部、Asahiの缶看板、下層階の案内所・店舗、茶色のビルの連続窓・ベガスベガスの縦看板、東横インの文字・窓・アーチ窓、駅前通側の歯科・カラオケの看板と窓。
- 写真で測った4隅を射影変換し、32×32分割の通常UVで各壁面に投影。凹凸は写真で確認できる水平部材・連続窓枠・突出看板だけを浅く付けています。寸法は地図の輪郭と写真の比率に基づく概略です。
- 2024年写真の手前の時計で隠れた中央の外壁は、**jegal gihwan**, *a city street at night with cars and billboards*（2022-12-18公開）の別角度写真を利用。
  [写真](https://unsplash.com/photos/a-city-street-at-night-with-cars-and-billboards-qsB8WZkPBZs) / [Unsplash License](https://unsplash.com/license)
  3648×5472pxの `x=1380, y=2580, width=480, height=1430` を可逆WebP `asahi-base-2022.webp` として保存し、中央の細い範囲だけに投影しました。撮影日の情報は未確認です。古い資料のため現在の広告・入居状況を保証しません。
- 計28面。外壁の写真に時計や自動車を建物の一部として貼り付けないよう範囲を分割しています。写真で見えない壁面は概略表現が残ります。
- 線画では外壁写真のコントラストから輪郭と黒ベタを抽出。線画＋トーンでは細かな網点を追加。PNGはその見え方を保存し、GLBは写真・測定点・出典・利用条件を保存します。
- 写真の技術的切り出し・投影・シェーダーによる表現です。この28面にはAI画像生成を使用していません。

既存のニッカ・横丁入口の漫画原画と周辺85棟のPLATEAUは維持しています。**街全体の全壁面が高解像度で再現されたわけではありません。** 屋内の店の並び・つばさまでの通路は未確認のため追加していません。
