import {build} from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const check=process.argv.includes('--check');
const result=await build({absWorkingDir:root,entryPoints:['fluid-text.js'],bundle:true,splitting:true,format:'esm',target:'es2022',minify:true,outdir:'vendor',entryNames:'fluid-text.bundle',chunkNames:'fluid-chunks/[name]-[hash]',write:false,metafile:true});
for(const file of result.outputFiles){
 if(check){const current=await fs.readFile(file.path).catch(()=>null);if(!current?.equals(file.contents))throw Error('Stale or missing fluid asset: '+path.relative(root,file.path));}
 else{await fs.mkdir(path.dirname(file.path),{recursive:true});await fs.writeFile(file.path,file.contents);}
}
if(!check){await fs.mkdir(path.join(root,'output'),{recursive:true});await fs.writeFile(path.join(root,'output/fluid-build.json'),JSON.stringify(result.metafile,null,2));}
console.log(`${check?'Verified':'Built'} ${result.outputFiles.length} fluid modules; same pinned Three and fluid shaders.`);
