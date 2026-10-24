// Local preview only. Publishing requires a separately reviewed integration.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStories } from './stories.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, '../story-preview');
const data = JSON.parse(await fs.readFile(path.join(root, 'content/stories.json'), 'utf8'));
const pages = buildStories(data);
// This folder is disposable and never part of the Pages artifact.
await fs.rm(path.join(output, 'stories'), {recursive:true, force:true});
for (const [filename, html] of pages) {
  await fs.mkdir(path.dirname(path.join(output, filename)), {recursive:true});
  await fs.writeFile(path.join(output, filename), html);
}
if (pages.size) await fs.copyFile(path.join(root, 'guide.css'), path.join(output, 'guide.css'));
console.log(`Local preview: ${pages.size} pages; no public source pages changed.`);
