// Pure rendering: approved public copy only. Never put drafts in this repository.
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base = 'https://www.tubasa-susukino.com';
export function buildStories(data, now = new Date()) {
  if (!Array.isArray(data.episodes)) throw new Error('episodes must be an array');
  if (!data.episodes.length) return new Map();
  if (typeof data.seriesTitle !== 'string' || !data.seriesTitle.trim()) throw new Error('Confirm seriesTitle first');
  const slugs = new Set();
  for (const item of data.episodes) {
    if (item.approved !== true) throw new Error('Only approved public copy is allowed');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || slugs.has(item.slug)) throw new Error('Invalid or duplicate slug');
    slugs.add(item.slug);
    if (typeof item.title !== 'string' || !item.title.trim() || !Array.isArray(item.paragraphs) || !item.paragraphs.length || item.paragraphs.some(p => typeof p !== 'string' || !p.trim())) throw new Error('Missing title or paragraphs');
    const value = /^\d{4}-\d{2}-\d{2}$/.test(item.publishedAt) ? item.publishedAt + 'T00:00:00+09:00' : item.publishedAt;
    const timestamp = Date.parse(value);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/.test(value) || !Number.isFinite(timestamp) || timestamp > now.getTime() || new Date(timestamp + 9 * 3600000).toISOString().slice(0,19) + '+09:00' !== value) throw new Error('Publication must be a valid elapsed JST date');
  }
  const episodes = [...data.episodes].sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const title = escape(data.seriesTitle);
  const page = (heading, url, body) => `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index, follow"><title>${heading}｜味一番つばさ</title><link rel="canonical" href="${base}${url}"><meta name="description" content="${escape(url === '/stories/' ? (data.introduction || data.seriesTitle) : data.seriesTitle + '「' + episodes.find(item => url === `/stories/${item.slug}/`).title + '」—すすきのを舞台にした短い物語。')}"><meta property="og:type" content="${url === '/stories/' ? 'website' : 'article'}"><meta property="og:title" content="${heading}｜味一番つばさ"><meta property="og:url" content="${base}${url}"><meta name="theme-color" content="#16090b"><link rel="stylesheet" href="/guide.css"><style>.story{max-width:760px;overflow-wrap:anywhere}.story p{line-height:2;white-space:pre-wrap}.story-list{list-style:none;padding:0}.story-list li{padding:24px 0;border-bottom:1px solid var(--rule)}.story-list a{display:block;min-height:48px}.story-nav{display:flex;flex-wrap:wrap;gap:24px}.story-meta{color:var(--muted);font-size:14px}</style><script defer src="/site-analytics.js?v=20261025-1" data-ga-id="G-TGTCZFTN96" data-ga-hosts="www.tubasa-susukino.com,tubasa-susukino.com"></script></head><body><a class="guide-skip" href="#main">本文へ</a><header class="guide-header"><a class="guide-brand" href="/"><span>味一番つばさ</span><small>AJIICHIBAN TSUBASA</small></a><nav aria-label="サイト案内"><a href="/">店舗サイト</a><a href="/stories/">連載一覧</a></nav></header><main id="main" class="guide-section story">${body}</main><footer class="guide-footer"><a href="/">味一番つばさへ戻る</a></footer></body></html>\n`;
  const stamp = item => `<time datetime="${escape(item.publishedAt)}">${escape(item.publishedAt.slice(0,10).replaceAll('-','/'))}</time>`;
  const outputs = new Map();
  outputs.set('stories/index.html', page(title, '/stories/', `<p class="eyebrow">短編連載</p><h1>${title}</h1>${data.introduction ? `<p>${escape(data.introduction)}</p>` : ''}<ul class="story-list">${episodes.map(item => `<li><span class="story-meta">${stamp(item)}</span><a href="/stories/${item.slug}/">${escape(item.title)}</a></li>`).join('')}</ul>`));
  episodes.forEach((item, i) => {
    const older = episodes[i + 1], newer = episodes[i - 1];
    const link = (entry, label) => entry ? `<a href="/stories/${entry.slug}/">${label}：${escape(entry.title)}</a>` : '';
    outputs.set(`stories/${item.slug}/index.html`, page(`${escape(item.title)}｜${title}`, `/stories/${item.slug}/`, `<article><p class="eyebrow">${title}</p><h1>${escape(item.title)}</h1><p class="story-meta">${stamp(item)}</p><div class="story-copy">${item.paragraphs.map(p => `<p>${escape(p)}</p>`).join('')}</div>${data.disclaimer ? `<p class="story-meta">${escape(data.disclaimer)}</p>` : ''}</article><nav class="story-nav" aria-label="各話の移動">${link(older,'前の作品')}<a href="/stories/">一覧へ</a>${link(newer,'次の作品')}</nav>`));
  });
  return outputs;
}
export function facebookCopy(seriesTitle, item) {
  return [seriesTitle, item.title, ...item.paragraphs].join('\n\n');
}
