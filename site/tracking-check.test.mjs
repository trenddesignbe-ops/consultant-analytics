import test from 'node:test';
import assert from 'node:assert/strict';
import handler,{isPublicV4,normalizeTarget,publicTarget,inspectHtml} from '../netlify/functions/tracking-check.mjs';
test('private, metadata, reserved and encoded IP targets are rejected',async()=>{
 for(const ip of ['127.0.0.1','10.0.0.1','169.254.169.254','172.16.0.1','192.168.1.1','100.64.0.1','198.18.0.1','0.0.0.0','224.0.0.1','::1'])assert.equal(isPublicV4(ip),false,ip);
 assert.equal(isPublicV4('8.8.8.8'),true);
 for(const url of ['http://example.com','https://127.1','https://2130706433','https://[::1]','https://example.com:444','https://me:secret@example.com','https://foo.local','https://example.com.'])assert.throws(()=>normalizeTarget(url),url);
 await assert.rejects(publicTarget('https://example.com',async()=>['8.8.8.8','10.0.0.1']));
 const target=await publicTarget('https://example.com/path?token=secret#x',async()=>['8.8.8.8']);assert.equal(target.url.href,'https://example.com/path');assert.equal(target.address,'8.8.8.8');
});
test('checks inspect script references, not marketing copy, comments or a deterministic URL score',()=>{
 assert.deepEqual(inspectHtml('<p>Google Analytics GTM-ABC</p><!-- <script src="https://www.googletagmanager.com/gtag/js?id=G-ABC"></script> -->').map(x=>x.observed),[false,false,false]);
 const html=`<script src="https://www.googletagmanager.com/gtag/js?id=G-ABC123"></script><script>(function(){var x='https://www.googletagmanager.com/gtm.js?id=';var y='GTM-ABC123';})()</script><script src="https://cdn.cookielaw.org/x.js"></script>`;
 assert.deepEqual(inspectHtml(html).map(x=>x.observed),[true,true,true]);
 assert.deepEqual(inspectHtml(`<script>gtag('config','G-ABC123')</script>`).map(x=>x.observed),[true,false,false]);
 assert.deepEqual(inspectHtml('<script src="https://www.googletagmanager.com.evil.com/gtag/js?id=G-ABC"></script>').map(x=>x.observed),[false,false,false]);
});
test('API rejects malformed requests and cross-origin use without accessing a target',async()=>{
 const make=(body,headers={})=>new Request('https://consultant-analytics.netlify.app/api/tracking-check',{method:'POST',headers:{'Content-Type':'application/json',...headers},body});
 assert.equal((await handler(new Request('https://example.com/api/tracking-check'))).status,405);
 assert.equal((await handler(make('{}',{origin:'https://elsewhere.com'}))).status,403);
 assert.equal((await handler(make('x'))).status,400);
 assert.equal((await handler(make('x'.repeat(3000)))).status,413);
 assert.equal((await handler(make(JSON.stringify({url:'https://127.0.0.1'})))).status,422);
});
