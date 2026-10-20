import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('./assets/consent.js',import.meta.url),'utf8');
function fixture({id='G-TEST123',stored=null,blocked=false}={}){
 const events={},nodes=[],deleted=[];let storage=stored,reloads=0;const values=[];
 const make=()=>({handlers:{},dataset:{},isConnected:true,addEventListener(e,f){this.handlers[e]=f;},focus(){},remove(){this.removed=true;}});
 const yes=make(),no=make(),manage=make(),status=make();yes.dataset.cookieChoice='accepted';no.dataset.cookieChoice='refused';
 const banner={hidden:true,querySelector:()=>no,querySelectorAll:()=>[no,yes]};
 const document={body:{dataset:{measurementId:id},classList:{add(){},remove(){}}},head:{append(s){nodes.push(s);}},activeElement:manage,hidden:false,title:'Contact',referrer:'https://example.com/page?email=private@example.com',querySelector:()=>banner,querySelectorAll(s){return s==='[data-cookie-open]'?[manage]:s==='[data-cookie-state]'?[status]:nodes;},createElement:()=>make(),addEventListener(e,f){events[e]=f;}};
 Object.defineProperty(document,'cookie',{get:()=> '_ga=test; _ga_TEST123=test; necessary=keep',set:v=>deleted.push(v)});
 const window={addEventListener(e,f){events[e]=f;}};
 const context={window,document,location:{hostname:'www.consultant-analytics.fr',origin:'https://www.consultant-analytics.fr',pathname:'/contact/',reload(){reloads++;}},localStorage:{getItem(){if(blocked)throw Error();return storage;},setItem(k,v){if(blocked)throw Error();storage=v;}},Date,JSON,Number,URL,setInterval(fn){values.push(fn);}};
 vm.runInNewContext(source,context);
 return {window,banner,nodes,deleted,yes,no,manage,status,events,tick:()=>values[0]?.(),get stored(){return storage;},get reloads(){return reloads;}};
}
test('GA4 makes no request before choice, after refusal or without a measurement ID',()=>{
 const f=fixture();assert.equal(f.nodes.length,0);assert.equal(f.banner.hidden,false);f.no.handlers.click();assert.equal(f.nodes.length,0);assert.equal(JSON.parse(f.stored).choice,'refused');
 const disabled=fixture({id:''});assert.equal(disabled.banner.hidden,true);assert.equal(disabled.nodes.length,0);disabled.manage.handlers.click();assert.match(disabled.status.textContent,/pas encore activé/);
 const refused=fixture({stored:f.stored});assert.equal(refused.banner.hidden,true);assert.equal(refused.nodes.length,0);
});
test('acceptance loads once with clean URLs, no ads consent and bounded cookie lifetime',()=>{
 const f=fixture();f.yes.handlers.click();f.yes.handlers.click();assert.equal(f.nodes.length,1);assert.match(f.nodes[0].src,/id=G-TEST123$/);
 const calls=f.window.dataLayer.map(args=>Array.from(args));const config=calls.find(c=>c[0]==='config')[2];assert.equal(config.page_location,'https://www.consultant-analytics.fr/contact/');assert.equal(config.page_referrer,'https://example.com/page');assert.equal(config.cookie_update,false);assert.equal(config.cookie_expires,33696000);assert.equal(config.allow_google_signals,false);
 const consent=calls.find(c=>c[0]==='consent'&&c[1]==='update')[2];assert.equal(consent.analytics_storage,'granted');assert.equal(consent.ad_storage,'denied');
 const returning=fixture({stored:f.stored});assert.equal(returning.nodes.length,1);assert.equal(returning.banner.hidden,true);
});
test('withdrawal disables GA4 and clears analytics cookies, while stale choices ask again',()=>{
 const f=fixture();f.yes.handlers.click();f.manage.handlers.click();assert.equal(f.banner.hidden,false);f.no.handlers.click();assert.equal(f.window['ga-disable-G-TEST123'],true);assert.equal(f.reloads,1);assert(f.deleted.some(v=>v.startsWith('_ga=;')));assert(!f.deleted.some(v=>v.startsWith('necessary=')));
 for(const stored of ['broken',JSON.stringify({version:1,choice:'accepted',expires:Date.now()-1}),JSON.stringify({version:0,choice:'accepted',expires:Date.now()+10000})]){const old=fixture({stored});assert.equal(old.nodes.length,0);assert.equal(old.banner.hidden,false);}
 const blocked=fixture({blocked:true});blocked.yes.handlers.click();blocked.tick();assert.equal(blocked.reloads,0);
});
