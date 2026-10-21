import https from 'node:https';
import {resolve4} from 'node:dns/promises';
import {isIP} from 'node:net';

// The address is checked, then pinned in the TLS request's DNS lookup. Redirects
// repeat this process; a hostname cannot rebind to an internal service afterwards.
export function isPublicV4(address){
 if(isIP(address)!==4)return false;
 const [a,b,c]=address.split('.').map(Number);
 return !(a===0||a===10||a===127||a>=224||(a===100&&b>=64&&b<=127)||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&(b===168||b===0||b===2))||(a===198&&(b===18||b===19||(b===51&&c===100)))||(a===203&&b===0&&c===113));
}
export function normalizeTarget(value){
 if(typeof value!=='string'||value.length>500)throw Error('Adresse de site invalide.');
 value=value.trim();if(!value||/\s/.test(value))throw Error('Indiquez une adresse de site sans espace, par exemple votre-site.fr.');
 if(value.startsWith('//'))value='https:'+value;
 else if(!/^[a-z][a-z0-9+.-]*:/i.test(value))value='https://'+value;
 let u;try{u=new URL(value);}catch{throw Error('Indiquez une adresse complète, par exemple https://votre-site.fr.');}
 if(u.protocol==='http:')u.protocol='https:';
 if(u.protocol!=='https:'||u.username||u.password||u.port||isIP(u.hostname)||!u.hostname.includes('.')||u.hostname.endsWith('.')||! /^[a-z0-9.-]+$/i.test(u.hostname)||/\.(?:localhost|local|internal|test|invalid)$/i.test(u.hostname))throw Error('Indiquez un site public en HTTPS, sans identifiant ni port particulier.');
 // A first public-page check does not need query tokens or fragment identifiers.
 u.search='';u.hash='';return u;
}
export async function publicTarget(value,resolver=resolve4){
 const url=normalizeTarget(value);const addresses=await resolver(url.hostname);
 if(!addresses.length||!addresses.every(isPublicV4))throw Error('Cette adresse ne correspond pas à un site public accessible.');
 return {url,address:addresses[0]};
}
async function getHtml(target,signal){
 return new Promise((resolve,reject)=>{
  const req=https.get(target.url,{signal,agent:false,headers:{'User-Agent':'ConsultantAnalytics-Precheck/1.0','Accept':'text/html','Accept-Encoding':'identity'},lookup:(_host,options,callback)=>options?.all?callback(null,[{address:target.address,family:4}]):callback(null,target.address,4)},res=>{
   if([301,302,303,307,308].includes(res.statusCode)){res.resume();resolve({redirect:res.headers.location});return;}
   if(res.statusCode<200||res.statusCode>=300){res.resume();reject(Error('Le site refuse le contrôle automatique ou ne répond pas normalement.'));return;}
   if(!/text\/html|application\/xhtml\+xml/i.test(String(res.headers['content-type']))){res.resume();reject(Error('Cette adresse ne renvoie pas une page HTML.'));return;}
   if(res.headers['content-encoding']&&res.headers['content-encoding']!=='identity'){res.resume();reject(Error('Le format de cette page ne permet pas ce contrôle rapide.'));return;}
   let size=0;const chunks=[];
   res.on('data',chunk=>{const remaining=1024*1024-size;size+=chunk.length;if(size>1024*1024){chunks.push(chunk.subarray(0,Math.max(0,remaining)));resolve({html:Buffer.concat(chunks).toString('utf8'),truncated:true});res.destroy();return;}chunks.push(chunk);});
   res.on('error',reject);res.on('end',()=>resolve({html:Buffer.concat(chunks).toString('utf8')}));
  });req.on('error',reject);
 });
}
export function inspectHtml(html){
 const clean=html.replace(/<!--[\s\S]*?-->/g,'');
 const scripts=[...clean.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
 const sources=scripts.map(m=>m[1].match(/\bsrc\s*=\s*["']([^"']+)/i)?.[1]||'');
 const code=scripts.map(m=>m[2]).join('\n');
 const ga=sources.some(s=>/(?:\/\/)www\.googletagmanager\.com\/gtag\/js\?[^"']*\bid=G-[A-Z0-9]+/i.test(s))||/gtag\s*\(\s*['"]config['"]\s*,\s*['"]G-[A-Z0-9]+/i.test(code);
 const gtm=sources.some(s=>/(?:\/\/)www\.googletagmanager\.com\/gtm\.js\?/i.test(s))||(/googletagmanager\.com\/gtm\.js/.test(code)&&/['"]GTM-[A-Z0-9]+['"]/.test(code));
 const cmp=/cookiebot|cookielaw\.org|onetrust|axeptio|didomi|tarteaucitron|iubenda|cookieyes|consent\.cookie/.test((sources.join('\n')+'\n'+code).toLowerCase());
 return [
  {name:'Google Analytics 4',observed:ga,detail:ga?'Une référence GA4 est présente dans le code de cette page. Cela ne prouve pas que les événements sont envoyés correctement.':'Aucune référence GA4 directe repérée. GA4 peut être chargé via Tag Manager, après consentement ou par une autre méthode.'},
  {name:'Google Tag Manager',observed:gtm,detail:gtm?'Une référence au conteneur GTM est présente. Son contenu et ses déclencheurs ne sont pas vérifiés par ce test.':'Aucune référence GTM classique repérée. Un chargement différé ou un domaine personnalisé peut ne pas être détecté.'},
  {name:'Outil de consentement',observed:cmp,detail:cmp?'Une référence à un outil courant de gestion des cookies est présente. Le comportement du bandeau et la conformité ne sont pas vérifiés.':'Aucun des outils courants recherchés n’a été repéré. Cela ne permet pas de conclure à l’absence de bandeau ni à un problème de conformité.'},
 ];
}
export default async function handler(request){
 const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}});
 if(request.method!=='POST')return reply({error:'Utilisez le formulaire du site pour lancer un contrôle.'},405);
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return reply({error:'Lancez le contrôle depuis ce site.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'Format de demande invalide.'},415);
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);
 try{
  const reader=request.body?.getReader();if(!reader)throw Error('Indiquez l’adresse de votre site.');let body='';let size=0;
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>2048){await reader.cancel();return reply({error:'La demande est trop volumineuse.'},413);}body+=new TextDecoder().decode(value);}
  let data;try{data=JSON.parse(body);}catch{return reply({error:'La demande est invalide.'},400);}
  let current=normalizeTarget(data.url);let result;
  for(let i=0;i<4;i++){
   const target=await Promise.race([publicTarget(current.href),new Promise((_,reject)=>{if(controller.signal.aborted)reject(Error('timeout'));else controller.signal.addEventListener('abort',()=>reject(Error('timeout')),{once:true});})]);
   result=await getHtml(target,controller.signal);if(!result.redirect)break;
   if(i===3)throw Error('Trop de redirections pour ce contrôle rapide.');current=normalizeTarget(new URL(result.redirect,current).href);
  }
  return reply({url:current.href,checks:inspectHtml(result.html),scope:(result.truncated?'Page volumineuse : seul le premier mégaoctet de HTML a été lu. ':'')+'Lecture du HTML public uniquement. Les scripts ne sont pas exécutés, aucun achat n’est simulé et aucun compte privé n’est consulté.'});
 }catch(error){const message=controller.signal.aborted?'Le site n’a pas répondu assez vite. Réessayez ou utilisez le contact en bas de page.':(/^(Indiquez|Adresse|Cette adresse|Ce site|Le site|Cette|La page|Le format|Trop de)/.test(error.message)?error.message:'Le contrôle automatique n’a pas pu lire cette page. Vérifiez l’adresse ou utilisez le contact en bas de page.');return reply({error:message},422);}
 finally{clearTimeout(timer);}
}
export const config={path:'/api/tracking-check',rateLimit:{action:'rate_limit',aggregateBy:['ip','domain'],windowSize:60,windowLimit:6}};
