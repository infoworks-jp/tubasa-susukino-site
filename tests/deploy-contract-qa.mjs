import assert from 'node:assert/strict';
import fs from 'node:fs';
const directory='.github/workflows';
const deployers=fs.readdirSync(directory).filter(f=>/\.ya?ml$/.test(f))
  .filter(f=>/uses:\s*actions\/deploy-pages@/.test(fs.readFileSync(directory+'/'+f,'utf8')));
assert.deepEqual(deployers,['pages.yml'],'Only the fully gated Pages workflow may publish');
const pages=fs.readFileSync(directory+'/pages.yml','utf8');
assert.match(pages,/needs:\s*\[steam-qa,\s*runtime-assets\]/);
const assets=fs.readFileSync(directory+'/localize-runtime-assets.yml','utf8');
assert.match(assets,/contents:\s*read/);
assert.doesNotMatch(assets,/pages:\s*write|id-token:\s*write|git push|upload-pages-artifact/);
assert.match(assets,/git diff --exit-code -- vendor\/fluid-text\.bundle\.js/);
console.log('DEPLOY CONTRACT PASS: one publisher, visual QA and reproducible asset gates.');
