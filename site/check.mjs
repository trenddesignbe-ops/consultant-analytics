import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root),htmlFiles=files.filter(f=>f.endsWith('.html'));
const titles=new Set(),descriptions=new Set();let links=0;
for(const file of htmlFiles){const s=fs.readFileSync(file,'utf8');const relative=path.relative(root,file);assert.match(s,/<!doctype html>/i,relative);assert.match(s,/<html lang="fr">/,relative);assert.equal((s.match(/<h1[ >]/g)||[]).length,1,`${relative}: one H1`);const title=s.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title),`${relative}: unique title`);titles.add(title);const desc=s.match(/name="description" content="([^"]+)"/)[1];assert(!descriptions.has(desc),`${relative}: unique description`);descriptions.add(desc);assert.match(s,/name="viewport"/,relative);assert.match(s,/rel="canonical"/,relative);assert(!s.includes('google-analytics-wix'),`${relative}: Wix page removed`);assert(!s.includes('GTM-')&&!s.includes('gtag('),`${relative}: no unconfigured tracking`);
for(const json of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(json[1]);
for(const m of s.matchAll(/(?:href|src)="(\/[^\"]*)"/g)){const [rawPath,fragment]=m[1].split('#');const pathname=rawPath.split('?')[0];let target=path.join(root,decodeURIComponent(pathname));if(pathname===''||pathname.endsWith('/')||!path.extname(pathname))target=path.join(target,'index.html');assert(fs.existsSync(target),`${relative}: missing ${m[1]}`);if(fragment){const targetText=fs.readFileSync(target,'utf8');assert(targetText.includes(`id="${fragment}"`),`${relative}: anchor ${m[1]}`);}links++;}}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');assert(home.includes('data-demo="sales"')&&home.includes('data-demo="leads"'),'both dashboard states');assert(home.includes('https://calendly.com/alexandre-cottret/votre-projet-web'),'confirmed calendar');assert.match(home,/data-contact data-email=/,'explicit email composer');
const font=fs.readFileSync(path.join(root,'assets/switzer-regular.woff2'));assert.equal(font.subarray(0,4).toString(),'wOF2','real font, not an error response');assert(fs.statSync(path.join(root,'assets/alexandre.webp')).size<150000,'optimized portrait');
const externalScripts=home.match(/<script[^>]+src="https?:/g)||[];assert.equal(externalScripts.length,0,'no third-party runtime');
assert(home.includes('data-tool-tab="ga4"')&&home.includes('data-tool-tab="gtm"')&&home.includes('data-tool-tab="ads"')&&home.includes('data-tool-tab="looker"'),'four expertise tabs');
assert(home.includes('name="analyse-tracking"')&&home.includes('data-netlify="true"'),'real registered lead form');
assert(home.includes('<h1>Consultant web analytics freelance</h1>'),'homepage target in H1');
assert(home.includes('https://www.consultant-analytics.fr/'),'primary domain canonical');
console.log(JSON.stringify({pages:htmlFiles.length,localLinksAndAssetsChecked:links,uniqueTitles:titles.size,homeBytes:Buffer.byteLength(home),cssBytes:fs.statSync(path.join(root,'assets/site.css')).size,jsBytes:fs.statSync(path.join(root,'assets/site.js')).size,thirdPartyScripts:externalScripts.length,status:'PASS'},null,2));
