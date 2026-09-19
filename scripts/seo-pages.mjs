import { locales, editorial } from './seo-content.mjs';
const e = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json = o => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');
const images = {'ultimate-miso.webp':[1440,960], 'butter-corn.webp':[1199,800], 'tsubasa-ramen.webp':[1440,960], 'store-interior.webp':[1566,1005]};
const photo = (file, alt, hero = false) => `<img src="/assets/${file}" alt="${e(alt)}" width="${images[file][0]}" height="${images[file][1]}" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const groups = [[0,6],[6,12],[12,18],[18,26],[26,31],[31,36],[36,40]];
const maps = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('味一番つばさ 札幌市中央区南4条西3丁目1-1') + '&travelmode=walking';

export function buildPages(config, menu, restaurant) {
  const abs = p => new URL(p, config.url).href;
  const restaurantId = restaurant['@id'];
  const langLinks = current => `<nav class="guide-languages" aria-label="Language">${Object.values(locales).map(l=>`<a lang="${l.lang}" hreflang="${l.lang}" href="/${l.path}"${current === l.path ? ' aria-current="page"' : ''}>${l.label}</a>`).join('')}</nav>`;
  const alternate = Object.values(locales).map(l=>`<link rel="alternate" hreflang="${l.lang}" href="${abs(l.path)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${abs('menu/')}">`;
  const notice = l => `<aside id="holiday-notice" class="guide-notice" data-expires="2026-09-25T00:00:00+09:00" hidden>${e(l.notice)}</aside>`;
  const visit = l => `<section class="guide-section guide-visit" id="visit"><p class="eyebrow">SAPPORO / SUSUKINO</p><h2>${e(l.visitTitle)}</h2>${notice(l)}<p class="guide-hours">${e(l.hours)}</p><address>${e(l.address)}</address><p>${e(l.route)}</p><div class="guide-actions"><a class="guide-button" href="${e(maps)}" target="_blank" rel="noopener">${e(l.maps)} ↗</a><a href="tel:+81115215963">${e(l.call)}：011-521-5963</a></div></section>`;
  const dishIds = ['miso','butter-corn','tsubasa'];
  const dishPhotos = ['ultimate-miso.webp','butter-corn.webp','tsubasa-ramen.webp'];
  const signatures = (l, lang, detailed = false) => `<section class="guide-section" id="signatures"><p class="eyebrow">THE SIGNATURES</p><h2>${e(l.signatures)}</h2>${[0,1,2].map((i)=>`<article class="guide-dish" id="${dishIds[i]}">${photo(dishPhotos[i],l.dishTitles[i])}<div><p class="eyebrow">0${i+1}</p><h3>${e(l.dishTitles[i])}</h3><p>${e(l.dishText[i])}</p><p class="guide-price">${i===0?e(menu[lang][0][1]):i===2?e(menu[lang][25][1]):`${e(l.flavors[0])} ${e(menu[lang][1][1])}<br>${e(l.flavors[1])}・${e(l.flavors[2])} ${e(menu[lang][7][1])}`}</p>${detailed?`<a class="guide-text-link" href="/menu/#group-${i===2?3:0}">メニュー・価格を確認する →</a>`:''}</div></article>`).join('')}</section>`;
  const faq = l => `<section class="guide-section guide-faq"><h2>${e(l.qa)}</h2>${l.faqs.map(([q,a])=>`<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('')}</section>`;
  const menuBody = (l,lang) => `<section class="guide-section" id="full-menu"><p class="eyebrow">MENU / JPY</p><h2>${e(l.all)}</h2><p>${e(l.priceNote)}</p><nav class="guide-jump" aria-label="${e(l.menu)}">${l.groups.map((g,i)=>`<a href="#group-${i}">${e(g)}</a>`).join('')}</nav><div class="guide-menu">${groups.map(([start,end],i)=>`<section id="group-${i}"><h3>${e(l.groups[i])}</h3><dl>${menu[lang].slice(start,end).map(([name,price])=>`<div class="guide-menu-row"><dt>${e(name)}</dt><dd>${e(price)}</dd></div>`).join('')}</dl></section>`).join('')}</div></section>`;
  const make = (p,l,body,extra=[],translated=false) => {
    const url=abs(p.path), title=p.title, desc=p.description, file=p.image||'ultimate-miso.webp';
    const graph=[restaurant,{
      '@type':'WebPage','@id':url+'#webpage',url,name:title,description:desc,inLanguage:l.lang,
      isPartOf:{'@id':config.url+'#website'},about:{'@id':restaurantId},
      breadcrumb:{'@id':url+'#breadcrumb'},dateModified:config.lastModified,
      ...(translated?{mainEntity:{'@id':url+'#menu'}}:{}),
    },{'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[
      {'@type':'ListItem',position:1,name:l.home,item:config.url},
      {'@type':'ListItem',position:2,name:p.sub,item:url},
    ]},...extra];
    return `<!doctype html>
<html lang="${l.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(title)}</title><meta name="description" content="${e(desc)}">
<link rel="canonical" href="${url}"><meta name="robots" content="index, follow, max-image-preview:large">
${translated?alternate:''}
<meta property="og:type" content="website"><meta property="og:site_name" content="味一番つばさ"><meta property="og:locale" content="${l.locale}">
<meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(desc)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${abs('assets/'+file)}"><meta property="og:image:alt" content="${e(file==='store-interior.webp'?'味一番つばさのカウンター':l.dishTitles[0])}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(desc)}"><meta name="twitter:image" content="${abs('assets/'+file)}">
<meta name="theme-color" content="#16090b"><link rel="icon" href="/favicon.ico?v=20260915-tsubasa">
<link rel="stylesheet" href="/guide.css?v=20260920-1"><script defer src="/holiday-notice.js?v=20260909-1"></script>
<script type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script></head>
<body class="tsubasa-guide"><a class="guide-skip" href="#content">${e(l.skip)}</a>
<header class="guide-header"><a class="guide-brand" href="/"><span lang="ja">味一番つばさ</span><small>AJIICHIBAN TSUBASA</small></a><nav aria-label="${e(l.menu)}"><a href="/${l.path}#full-menu">${e(l.menu)}</a><a href="${l.lang==='ja'?'/access/':'#visit'}">${e(l.access)}</a></nav></header>
<main id="content"><section class="guide-hero">${photo(file,file==='store-interior.webp'?'味一番つばさのカウンター':l.dishTitles[0],true)}<div class="guide-hero-copy"><p class="eyebrow">${e(p.sub)}</p><h1>${e(p.h1).replace('\n','<br>')}</h1><p>${e(p.intro)}</p><a class="guide-button" href="${translated?'#full-menu':p.path==='access/'?'#visit':'#signatures'}">${translated?e(l.viewMenu):p.path==='access/'?'営業時間・地図を見る':'三つの定番を見る'} ↓</a></div></section>
<div class="guide-breadcrumb" aria-label="Breadcrumb"><a href="/">${e(l.home)}</a><span aria-hidden="true"> / </span><span>${e(p.sub)}</span></div>
${langLinks(p.path)}${body}
<section class="guide-section guide-return"><h2 lang="ja">味一番つばさ</h2><p>${e(l.footer)}</p><a class="guide-button" href="/">${e(l.home)} →</a>${l.lang==='ja'?'<p><a href="/ramen/">つばさのラーメンを知る</a> ／ <a href="/menu/">メニュー・値段</a> ／ <a href="/access/">営業時間・アクセス</a></p>':''}</section></main>
<footer class="guide-footer"><span>© 2026 AJIICHIBAN TSUBASA</span><a href="tel:+81115215963">011-521-5963</a></footer></body></html>\n`;
  };
  const outputs=new Map();
  for(const [lang,l] of Object.entries(locales)) {
    const url=abs(l.path);
    const menuSchema={'@type':'Menu','@id':url+'#menu',url,name:l.all,inLanguage:l.lang,
      hasMenuSection:groups.map(([start,end],i)=>({'@type':'MenuSection',name:l.groups[i],hasMenuItem:menu[lang].slice(start,end).map(([name,price])=>({'@type':'MenuItem',name,offers:{'@type':'Offer',price:price.replace(/[^0-9]/g,''),priceCurrency:'JPY'}}))}))};
    outputs.set(l.path+'index.html',make(l,l,signatures(l,lang)+menuBody(l,lang)+visit(l)+faq(l),[menuSchema],true));
  }
  const l=locales.ja;
  const ramen=editorial[0];
  outputs.set(ramen.path+'index.html',make(ramen,l,signatures(l,'ja',true)+`<section class="guide-section guide-prose"><h2>初めての一杯を選ぶなら。</h2><p>つばさの味噌を味わうなら「究極の味噌ラーメン」。バターとコーンを添えたいなら「バターコーンラーメン」。いくら丼も楽しみたいなら、ハーフラーメンと組み合わせた「つばさラーメン」があります。</p><p>味噌だけではなく、醤油・塩もご用意しています。チャーシュー麺、ねぎたっぷり、ピリ辛ねぎ、キムチなど、その日の気分で選べる一杯をメニューにまとめました。</p><a class="guide-button" href="/menu/">全メニューと値段を見る →</a><h2>昼はランチに。夜は〆のラーメンに。</h2><p>通常の営業時間は11:00〜翌3:00。昼にすすきのを訪れたときも、夜の食事のあとにもう一杯食べたくなったときも。毎週月曜日は定休日です。</p><p>お店は「新ラーメン横丁」の中にあります。すすきの交差点から徒歩約1分。行き方と営業日の案内もあわせてご覧ください。</p><a class="guide-text-link" href="/access/">営業時間・アクセスを確認する →</a></section>`+visit(l)));
  const access=editorial[1];
  outputs.set(access.path+'index.html',make(access,l,visit(l)+`<section class="guide-section guide-prose"><h2>すすきの駅周辺からの行き方</h2><ol class="guide-steps"><li><h3>すすきの交差点へ</h3><p>まずはすすきの交差点を目印に。現在地からの詳しい道順は、Google マップの徒歩ルートで確認できます。</p></li><li><h3>新ラーメン横丁を探す</h3><p>住所は南4条西3丁目1-1、第3グリーンビル。「新ラーメン横丁」の看板を目印にお進みください。</p></li><li><h3>横丁の中の「味一番つばさ」へ</h3><p>交差点から徒歩約1分。店内のカウンターで、味噌ラーメンやバターコーンラーメンをお楽しみください。</p></li></ol><h2>「新ラーメン横丁」のお店です。</h2><p>つばさの所在地は、新ラーメン横丁です。名前の似た横丁やお店と取り違えないよう、地図では「味一番つばさ」と住所をあわせてご確認ください。</p><h2>深夜にラーメンを食べたい方へ</h2><p>通常は翌朝3時まで営業しています。毎週月曜日は定休日です。日付をまたいで来店する場合や連休中は、臨時営業のお知らせをご確認ください。営業状況が気になるときは、お電話でお問い合わせください。</p><h2>出発前にメニューを決めておく</h2><p>究極の味噌ラーメン ${e(menu.ja[0][1])}、バターコーン味噌 ${e(menu.ja[1][1])}、いくら丼とハーフラーメンのつばさラーメン ${e(menu.ja[25][1])}。メニュー・価格は日本語、英語、中国語、韓国語で読めます。</p><a class="guide-button" href="/menu/">メニュー・値段を見る →</a></section>`));
  return outputs;
}

export function homeDirectory() {
  return `<!-- GUIDES:START (generated by npm run build:seo) -->
<section class="home-guides" aria-labelledby="home-guides-title"><div><small>PLAN YOUR VISIT</small><h2 id="home-guides-title">一杯を選ぶ。<br>つばさへ向かう。</h2><p>札幌すすきの・新ラーメン横丁の味一番つばさ。<br>味噌ラーメンを楽しむランチから、深夜の〆の一杯まで。</p></div><nav aria-label="来店ガイド"><a href="/ramen/">つばさの味噌・バターコーン・いくら丼セット <span>→</span></a><a href="/menu/">全メニュー・値段 <span>→</span></a><a href="/access/">営業時間・定休日・すすきの駅周辺からの行き方 <span>→</span></a><div class="home-guide-languages"><a href="/en/" lang="en" hreflang="en">English menu</a><a href="/zh-hans/" lang="zh-Hans" hreflang="zh-Hans">中文菜单</a><a href="/ko/" lang="ko" hreflang="ko">한국어 메뉴</a></div></nav></section>
<!-- GUIDES:END -->`;
}
