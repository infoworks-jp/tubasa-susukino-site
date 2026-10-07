import data from './tsubasa-public-data.js';
const menu = data.menu;
const item = name => menu.find(([n]) => n === name);
const dish = name => { const row = item(name); return row ? `${row[0]}（${row[1]}）` : '最新メニューをご確認ください'; };
const links = {
 menu:{label:'メニューを見る',href:'/menu/'},
 hours:{label:'営業時間',href:'/access/'},
 map:{label:'Googleマップ',href:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.shop.name+' '+data.shop.address.streetAddress)}`},
 phone:{label:'店舗に電話',href:'tel:'+data.shop.telephone}
};
const unknown = '現在の登録情報では確認できません。正確な内容は味一番つばさへ直接お問い合わせください。';
const topics = [
 {label:'一番おすすめは？',terms:/おすすめ|人気/,text:`${dish('究極の味噌ラーメン')}をご紹介します。三日間煮込んだスープと特注麺、トロトロチャーシューが特徴です。`,cta:['menu']},
 {label:'味噌ラーメンについて',terms:/味噌|みそ|ミソ/,text:`${dish('究極の味噌ラーメン')}。味噌のバターコーン、チャーシュー、ねぎなども登録されています。`,cta:['menu']},
 {label:'辛いラーメンは？',terms:/辛|からい/,text:`${dish('ピリ辛ねぎラーメン 味噌')}をご紹介しています。期間限定の辛みそラーメンも掲載されていますが、現在の提供状況は店舗へご確認ください。`,cta:['menu','phone']},
 {label:'究極のラーメンについて',terms:/究極|豪華/,text:`${dish('究極の味噌ラーメン')}。全部乗せの商品名・価格は登録情報で確認できませんので、店舗にお問い合わせください。`,cta:['menu','phone']},
 {label:'値段を知りたい',terms:/値段|価格|料金|いくらです|何円/,text:menu.map(([n,p])=>`${n}：${p}`).join('\n'),cta:['menu']},
 {label:'営業時間',terms:/営業|時間|何時|定休|休み|休日/,text:`通常の営業時間は${data.shop.openingHoursSpecification[0].opens}〜翌${data.shop.openingHoursSpecification[0].closes}です。月曜日が定休日です。臨時の変更は公式サイトのお知らせ、または店舗へのお電話でご確認ください。`,cta:['hours','phone']},
 {label:'場所を知りたい',terms:/場所|住所|地図|アクセス|行き方|駅/,text:`${data.shop.address.addressLocality}${data.shop.address.streetAddress}。すすきの交差点から徒歩約1分です。`,cta:['map','hours']},
 {label:'初めて来ました',terms:/初めて|はじめて/,text:`初めての方には${dish('究極の味噌ラーメン')}をご紹介します。`,cta:['menu']},
 {label:'AI写真を作りたい',terms:/写真|フォト|AI画像/i,text:'AI写真機能は準備中です。現在はメニューの商品写真をご覧いただけます。',cta:['menu']},
 {label:'お腹いっぱい食べたい',terms:/お腹|満腹|セット|たくさん|ボリューム/,text:`${dish('つばさラーメン（いくら丼＋ハーフラーメン）')}や${dish('味噌＋餃子セット')}をご紹介します。`,cta:['menu']}
];
export default {
 id:'tsubasa',title:'つばさAI',launch:'つばさAI',
 note:'登録情報からご案内します。端末内AIを有効にすると質問の意味から登録情報を探します。質問は外部送信・保存されません。',
 blocked:q=>/アレルギ|アレルゲン|食材|安全|妊娠|病気|禁煙|喫煙|席数|予約|社員|個人情報|内部|法律|保証|採用|給料|給与/.test(q.normalize('NFKC')),
 unknown,topics:topics.slice(0,9),links,
 answer(query) {
  const q=query.normalize('NFKC').trim();
  // Sensitive and unregistered details must not be answered by a generic menu match.
  if(/アレルギ|アレルゲン|食材|安全|妊娠|病気|禁煙|喫煙|席数|予約|社員|個人情報|内部|法律|保証|採用|給料|給与/.test(q)) return {text:unknown,cta:['phone']};
  const ordered=[topics[8],topics[5],topics[6],topics[2],topics[9],topics[7],topics[3],topics[4],topics[0],topics[1]];
  const found=ordered.find(t=>t.terms.test(q));
  if(found) return found;
  const dishes=menu.filter(([name])=>q.includes(name.normalize('NFKC')));
  return dishes.length ? {text:dishes.map(([n,p])=>`${n}：${p}`).join('\n'),cta:['menu']} : {text:unknown,cta:['phone']};
 }
};
