# 湯気の描画修正・検証記録（2026-09-08）

## 今回の範囲

最新指示「上の4つも自然な感じがしない」に対応。究極の味噌1本、バターコーン1本、つばさ2本、まだある8商品の合計12か所。
単純な過去版への巻き戻しではない。写真の細い湯気を生かし、全端末に同じ流体ソルバー・同じ合成処理を適用した。
価格、商品名、原本写真、メニュー、TOP、店内、ナイトウォークの実装は変更していない。

## 確認できた原因と修正

- 旧描画の `SRC_ALPHA, ONE_MINUS_SRC_ALPHA` は透明Canvasのアルファにも適用されていた。GPU実測で、白・alpha=.5を描いた結果はRGBA `[128,128,128,64]`。直接出力では `[255,255,255,128]`。さらにブラウザ側の合成が入る。この差は実測済みだが、ユーザー環境の全症状をこの一因だけで説明したとはしない。
- 写真のcrop/scaleと、画面座標で計算した煙のCanvas変形が重なり、湯気の根元を合わせにくくしていた。画像の自然寸法でシミュレーションし、写真とCanvasに一度だけ同じ表示変換を適用する。
- 写真にもともとある細い湯気に別の白い密度を足すと、二重の塊に見える。写真の湯気部分だけを流体速度で変形し、追加密度は薄い膜に制限。丼・具材を動かさない。
- スマホのつばさは従来の縦長cover拡大で左の湯気が切れていた。写真表示をセクション高64%・top5%に収め、両方を見せる。下端はフェードで背景に接続。文字や価格の配置は維持。
- 旧GitHub検査は別リポジトリ `subasa-new-official` の公開URLを参照していた。今回のcheckoutをローカル配信して検査するよう修正し、Deploy Pagesに検査の成功を必須化した。

アルファの説明: [WebGL Fundamentals](https://webglfundamentals.org/webgl/lessons/webgl-and-alpha.html)。流体ソルバーは [PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) のMITライセンスを保持。

## 描画構造

- advection / divergence / pressure projection / gradient / curl / vorticity / splatを保持。写真を揺らすだけのCSSアニメーションへの置換ではない。
- 全商品でWebGL2コンテキスト1個。商品ごとの流体状態を保持し、描画直後に写真Canvasへ同期コピーする。Canvas2Dは表示用で、流体計算はGPU。
- 主役写真は30fps上限、8商品は24fps上限。画面外・非表示タブで停止。戻ると再開。
- 動きを減らす設定では静止写真。GPU非対応・context lossでも写真とテキストを残し、ページ全体を勝手に再読み込みしない。
- 新規配信コード/CSSは計24,502バイト（非圧縮）。新しい画像・動画のダウンロードは追加しない。

## ローカル実測

Mac上、ネットワーク/CPU低速化なし。スマホは画面幅・タッチのエミュレーションであり、実機iPhoneではない。

| 対象 | 幅 | 11写真/12発生源 | 丼部分の変化 | rAF間隔p95 |
|---|---:|---|---:|---:|
| インストール済みBrave | 1440 | PASS | 0px | 16.7ms |
| インストール済みChrome | 1440 | PASS | 0px | 16.7ms |
| Chromeスマホ幅 | 390 | PASS | 0px | 16.7ms |
| WebKitスマホ幅 | 375 | PASS | 0px | 20ms |
| WebKitスマホ幅 | 390 | PASS | 0px | 19ms |
| WebKitスマホ幅 | 430 | PASS | 0px | 20ms |

全ケースで自然動作の画像差分、写真との座標一致、スクロール復帰、pointer入力・終了、reduced-motion切替、GPU非対応フォールバック、横はみ出し、JS/HTTPエラーを検査した。
Safari実アプリでも主役・8商品の合成画面を複数時点で目視確認。WebKit390pxでは81.7秒連続表示後も湯気78,673pxが変化し、丼0px・エラー0件。故意のGPU停止で元写真opacity=1へ復帰することも別途確認した。

数値PASSは自然さの保証ではない。各商品のt0/t1スクリーンショットと動画を別途目視し、白い円・棒・二重の発生位置がないことを確認した。
この表は合成ラボ値であり、実利用者のCore Web Vitals、実機iPhoneの発熱/電池、全Safari/Brave設定を保証しない。

Lighthouse 13・ローカルのスマホ条件で Accessibility / Best Practices / SEO は各100、該当自動監査の失敗0件。これはアクセシビリティの全項目や実利用者性能の保証ではない。

## 再検査

1. `npm install --no-save --package-lock=false playwright@1.55.0`
2. `npx playwright install chromium webkit`
3. 別ターミナルで `python3 -m http.server 4174 --bind 127.0.0.1`
4. `node tests/steam-qa.mjs`

公開後は `STEAM_QA_URL=https://www.tubasa-susukino.com/ node tests/steam-qa.mjs` で同じ検査を実行する。
結果は `output/steam-qa/report.json` と商品ごとのt0/t1画像に保存。GitHub Actionsでも同じ検査とPavel原本のREFERENCE BASELINEを実行し、成果物を保存する。

公開完了はこの文書やcommitの存在で判断せず、Deploy Pages成功・公開ファイルのハッシュ一致・公開画面での動作確認を別途必要とする。
