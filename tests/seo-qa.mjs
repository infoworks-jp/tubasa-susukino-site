import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { locales, editorial } from '../scripts/seo-content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => fs.readFile(path.join(root, file), 'utf8');
const html = await read('index.html');
const config = JSON.parse(await read('seo.config.json'));
const head = html.split('</head>')[0];
const body = html.split('</head>')[1];
const menu = vm.runInNewContext('(' + (await read('app.js')).match(/const MENU=(\{[\s\S]*?\});/)[1] + ')',
  Object.create(null), { timeout: 1000 });
assert.equal((head.match(/rel="canonical"/g) || []).length, 1);
assert(head.includes('rel="canonical" href="' + config.url + '"'));
assert.equal((head.match(/<title>/g) || []).length, 1);
assert(head.includes('<title>' + config.title + '</title>'));
assert(head.includes('max-image-preview:large'));
assert(!head.includes('noindex'));
assert.equal((head.match(/name="google-site-verification"/g) || []).length, 1);
assert.equal(head.match(/<meta name="google-site-verification" content="([^"]+)">/)?.[1],
  config.googleSiteVerification, 'Keep the approved Search Console ownership token in the homepage head.');
assert(/^[A-Za-z0-9_-]+$/.test(config.googleSiteVerification ?? ''));
for (const token of ['味一番つばさ', 'すすきの', '新ラーメン横丁', '味噌ラーメン']) {
  assert(config.title.includes(token), 'Descriptive title: ' + token);
}
const ld = JSON.parse(head.match(/<script type="application\/ld\+json" id="restaurant-schema">([\s\S]*?)<\/script>/)[1]);
assert.equal(ld['@context'], 'https://schema.org');
assert.equal(ld['@graph'].length, 3);
const restaurant = ld['@graph'].find(item => item['@type'] === 'Restaurant');
assert.equal(restaurant.name, config.name);
assert.equal(restaurant.url, config.url);
assert.equal(restaurant.hasMenu, config.url + 'menu/');
assert(body.includes('id="menu"'));
assert(body.includes('tel:0115215963'));
assert.equal(restaurant.telephone.replace(/\D/g, '').replace(/^81/, '0'), '0115215963');
assert(body.includes('札幌市中央区南4条西3丁目1-1'));
assert(body.includes('第3グリーンビル 新ラーメン横丁'));
const hours = restaurant.openingHoursSpecification;
assert.equal(hours[0].opens, '11:00');
assert.equal(hours[0].closes, '03:00'); // The close time is the following day.
assert.equal(hours[0].dayOfWeek.length, 6);
assert(!hours[0].dayOfWeek.includes('Monday'));
assert.deepEqual(hours[1], { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '00:00', closes: '00:00' });
const holiday = restaurant.specialOpeningHoursSpecification;
assert.equal(holiday[0].validFrom, '2026-09-21');
assert.equal(holiday[0].validThrough, holiday[0].validFrom);
assert.equal(holiday[0].opens, '11:00');
assert.equal(holiday[0].closes, '03:00');
assert.equal(holiday[1].validFrom, '2026-09-24');
assert.equal(holiday[1].validThrough, holiday[1].validFrom);
assert.equal(holiday[1].opens, '00:00');
assert.equal(holiday[1].closes, '00:00');
assert(body.includes('datetime="2026-09-21"'));
assert(body.includes('datetime="2026-09-24"'));
assert(!JSON.stringify(ld).match(/aggregateRating|reviewCount|SearchAction/),
  'Do not invent reviews, ratings or an internal search feature.');
for (const language of Object.keys(menu)) {
  const section = body.match(new RegExp('data-panel="' + language +
    '" lang="[^"]+"[^>]*><div class="menu-text-list"[^>]*>([\\s\\S]*?)<div class="menu-sheet-card">'))?.[1];
  assert(section, 'Static menu missing: ' + language);
  const rows = [...section.matchAll(/<div class="menu-row[^"]*"><b>([^<]*)<\/b><span>([^<]*)<\/span><\/div>/g)];
  assert.equal(rows.length, menu[language].length, language);
  assert.equal(rows.length, 40, language);
  assert.deepEqual(rows.map(row => [row[1], row[2]]), JSON.parse(JSON.stringify(menu[language])));
}
assert(body.includes('alt="期間限定 特製辛味噌ラーメン"'));
assert(body.includes('<h3>特製辛味噌ラーメン</h3><p>¥1,200</p>'));
assert(!body.includes('limited-pending'));
assert(body.includes('alt="味一番つばさ公式サイト 二次元コード"'));
// Language tabs share one URL; fragment-based hreflang would be misleading.
assert(!head.includes('hreflang='));
assert(head.includes('assets/link-preview-20260916.jpg'));
assert(head.includes('favicon.ico?v=20260915-tsubasa'));
assert(body.includes('sound.js?v=20260917-label'));
for (const image of [...restaurant.image, restaurant.logo]) {
  const url = new URL(image);
  assert.equal(url.origin, new URL(config.url).origin);
  assert((await fs.stat(path.join(root, url.pathname))).isFile());
}
const robots = await read('robots.txt');
assert.equal(robots, 'User-agent: *\nAllow: /\n\nSitemap: ' + config.url + 'sitemap.xml\n');
const sitemap = await read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(urls, [config.url, ...Object.values(locales).map(l=>config.url+l.path), ...editorial.map(p=>config.url+p.path)]);
assert(sitemap.includes('<lastmod>' + config.lastModified + '</lastmod>'));
assert(/^\d{4}-\d{2}-\d{2}$/.test(config.lastModified));
for (const directory of ['reference', 'steam-lab', 'steam-lab-live', 'progress']) {
  for (const file of await fs.readdir(path.join(root, directory))) {
    if (!file.endsWith('.html')) continue;
    assert((await read(directory + '/' + file)).split('</head>')[0].includes('content="noindex, follow"'));
  }
}
console.log('SEO PASS: canonical, metadata, Restaurant schema, hours/holiday dates, 160 static menu rows, assets, sitemap and demo noindex.');

const titles=new Set([config.title]), descriptions=new Set([config.description]);
for (const page of [...Object.values(locales), ...editorial]) {
  const text=await read(page.path+'index.html');
  const pageHead=text.split('</head>')[0], pageBody=text.split('</head>')[1];
  assert.equal((pageHead.match(/rel="canonical"/g)||[]).length,1);
  assert(pageHead.includes('rel="canonical" href="'+config.url+page.path+'"'));
  assert(!pageHead.includes('noindex'));
  assert(!pageHead.includes('name="keywords"'));
  assert(!titles.has(page.title));titles.add(page.title);
  assert(!descriptions.has(page.description));descriptions.add(page.description);
  assert.equal((pageBody.match(/<h1>/g)||[]).length,1);
  assert(pageBody.includes('href="tel:+81115215963"'));
  assert(pageBody.includes('id="visit"'));
  assert(pageBody.includes('data-expires="2026-09-25T00:00:00+09:00" hidden'));
  const graph=JSON.parse(pageHead.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.deepEqual(graph.find(n=>n['@type']==='Restaurant'),restaurant,'Business facts must stay identical: '+page.path);
  const crumbs=graph.find(n=>n['@type']==='BreadcrumbList');
  assert.equal(crumbs.itemListElement[1].item,config.url+page.path);
  assert(!JSON.stringify(graph).match(/aggregateRating|reviewCount|FAQPage|SearchAction/));
  const ids=[...pageBody.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'Unique IDs: '+page.path);
  for(const m of text.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
    const target=m[1].endsWith('/')?m[1]+'index.html':m[1];
    assert((await fs.stat(path.join(root,target))).isFile(),'Missing resource: '+target);
  }
  for(const m of text.matchAll(/href="#([^"]+)"/g))assert(ids.includes(m[1]),'Missing anchor '+m[1]);
  const language=Object.keys(locales).find(k=>locales[k].path===page.path);
  if(language){
    assert(text.includes('<html lang="'+locales[language].lang+'"'));
    assert.equal((pageHead.match(/hreflang=/g)||[]).length,5);
    for(const l of Object.values(locales))assert(pageHead.includes('hreflang="'+l.lang+'" href="'+config.url+l.path+'"'));
    const rows=[...pageBody.matchAll(/<div class="guide-menu-row"><dt>([^<]+)<\/dt><dd>([^<]+)<\/dd>/g)];
    assert.deepEqual(rows.map(m=>[m[1],m[2]]),JSON.parse(JSON.stringify(menu[language])));
    const schemaMenu=graph.find(n=>n['@type']==='Menu');
    assert.equal(schemaMenu.hasMenuSection.flatMap(s=>s.hasMenuItem).length,40);
    assert.deepEqual(schemaMenu.hasMenuSection.flatMap(s=>s.hasMenuItem).map(i=>i.offers.price),Array.from(menu[language],([,p])=>p.replace(/[^0-9]/g,'')));
  } else assert(!pageHead.includes('hreflang='),'Only actual translated equivalents get hreflang');
  assert(body.includes('href="/'+page.path+'"'),'Crawlable home link: '+page.path);
}
console.log('SEO EXPANSION PASS: 7 canonical URLs; distinct metadata; reciprocal hreflang; 160 translated rows and Menu offers; shared hours; links, IDs and breadcrumbs.');
