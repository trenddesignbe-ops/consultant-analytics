document.body.classList.add('js-ready');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
function closeMenu(){menu?.setAttribute('aria-expanded','false');nav?.classList.remove('open');menu?.setAttribute('aria-label','Ouvrir le menu');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});

// This is an illustrative deliverable, not visitor or customer analytics.
const examples={sales:{labels:['Ventes attribuées','Dépenses publicitaires','Coût par vente'],values:['84','3 200 €','38,10 €'],caption:'Ventes attribuées aux campagnes · exemple fictif',path:'M0 105 L28 93 L56 98 L84 70 L112 78 L140 53 L168 65 L196 35 L224 43 L252 20 L280 29 L308 7'},leads:{labels:['Demandes qualifiées','Dépenses publicitaires','Coût par demande'],values:['32','1 600 €','50 €'],caption:'Demandes validées dans le CRM · exemple fictif',path:'M0 110 L28 99 L56 103 L84 93 L112 72 L140 83 L168 55 L196 68 L224 39 L252 48 L280 21 L308 12'}};
document.querySelectorAll('[data-demo]').forEach(button=>button.addEventListener('click',()=>{const d=examples[button.dataset.demo];document.querySelectorAll('[data-demo]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));d.labels.forEach((label,i)=>{document.querySelector(`[data-demo-label="${i}"]`).textContent=label;document.querySelector(`[data-demo-value="${i}"]`).textContent=d.values[i];});document.querySelector('[data-demo-caption]').textContent=d.caption;document.querySelector('[data-demo-line]').setAttribute('d',d.path);}));

const contact=document.querySelector('[data-contact]');
contact?.addEventListener('submit',e=>{e.preventDefault();if(!contact.reportValidity())return;const data=new FormData(contact);const url=String(data.get('website')||'Non renseigné');const need=String(data.get('need')||'');const body=`Bonjour Alexandre,\n\nMon site : ${url}\n\nMon besoin :\n${need}\n\nMerci !`;const subject='Parlons du suivi de mon site';const link=`mailto:${contact.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;const status=contact.querySelector('[role="status"]');status.replaceChildren();status.append('Votre message est préparé. Validez son envoi dans votre messagerie. Si elle ne s’ouvre pas, ');const fallback=document.createElement('a');fallback.href=link;fallback.textContent='ouvrez le message ici';status.append(fallback,'.');window.location.href=link;});


const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const toolTabs=[...document.querySelectorAll('[data-tool-tab]')];
function selectTool(tab){
 toolTabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});
}
toolTabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectTool(tab));
 tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%toolTabs.length;if(event.key==='ArrowLeft')next=(index+toolTabs.length-1)%toolTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=toolTabs.length-1;if(next!==undefined){event.preventDefault();selectTool(toolTabs[next]);toolTabs[next].focus();}});
});

const measure=document.querySelector('[data-measure-toggle]');
measure?.addEventListener('click',()=>{
 const corrected=measure.getAttribute('aria-pressed')!=='true';measure.setAttribute('aria-pressed',String(corrected));
 document.querySelector('.key.missing').style.background=corrected?'#5489ff':'#f48468';
 document.querySelector('[data-measured-count]').textContent=corrected?'92':'72';
 document.querySelector('[data-measured-label]').textContent=corrected?'92 mesurés après correction':'72 mesurés';
 document.querySelector('[data-missing-label]').textContent=corrected?'20 achats à nouveau mesurés dans cet exemple':'20 à vérifier : événement d’achat absent';
 const bar=document.querySelector('[data-measured-bar]'),missing=document.querySelector('[data-missing-bar]');
 const oldWidth=bar.getAttribute('width');bar.setAttribute('width',corrected?'368':'288');missing.setAttribute('width',corrected?'0':'80');
 if(!reducedMotion.matches&&bar.animate){bar.animate([{width:oldWidth+'px'},{width:(corrected?368:288)+'px'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});missing.animate([{opacity:corrected?1:0},{opacity:corrected?0:1}],{duration:400});}
 document.querySelector('.measurement-flow').setAttribute('aria-label',corrected?'Exemple après correction : 92 achats mesurés et 8 non observés.':'Exemple avant correction : 72 achats mesurés, 20 absents à cause d’une erreur technique, 8 non observés.');
 document.querySelector('[data-measure-note]').textContent=corrected?'8 restent non observés dans cet exemple. Corriger un événement ne contourne pas un refus de cookies.':'Simulation uniquement. Les proportions ne décrivent pas votre site.';
 measure.firstChild.textContent=corrected?'Revenir à l’exemple initial ':'Simuler la correction de l’événement ';
});

const scan=document.querySelector('[data-scan]');
const requestForm=document.querySelector('[data-analysis-form]');
scan?.addEventListener('submit',async event=>{
 event.preventDefault();if(!scan.reportValidity())return;
 const button=scan.querySelector('button'),status=document.querySelector('[data-scan-status]'),results=document.querySelector('[data-scan-results]');
 button.disabled=true;status.textContent='Lecture de votre page publique en cours…';results.hidden=true;results.replaceChildren();
 // Never keep findings from an earlier website in a new enquiry.
 requestForm.elements.constats.value='Contrôle en cours ou non effectué';requestForm.elements.website.value=scan.elements.url.value;
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),11000);
 try{
  const response=await fetch('/api/tracking-check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:scan.elements.url.value}),signal:controller.signal});
  if(response.status===429)throw Error('Vous avez lancé plusieurs contrôles. Patientez une minute avant de réessayer.');
  if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Le contrôle est momentanément indisponible. Vous pouvez demander une analyse ci-dessous.');
  const data=await response.json();if(!response.ok)throw Error(data.error||'Le contrôle n’a pas abouti. Réessayez.');
  status.textContent='Premiers constats disponibles. Une balise repérée n’est pas une preuve de bon fonctionnement.';
  const scope=document.createElement('p');scope.className='scan-scope';scope.textContent='Page consultée : '+data.url;results.append(scope);
  const list=document.createElement('ul');list.className='scan-findings';
  data.checks.forEach(check=>{const li=document.createElement('li'),heading=document.createElement('b'),text=document.createElement('p');heading.textContent=check.name+' · '+(check.observed?'Référence repérée':'À vérifier');text.textContent=check.detail;li.append(heading,text);list.append(li);});results.append(list);
  const limit=document.createElement('p');limit.className='small';limit.textContent=data.scope;results.append(limit);results.hidden=false;
  requestForm.elements.website.value=data.url;requestForm.elements.constats.value=data.checks.map(c=>c.name+': '+(c.observed?'référence repérée':'à vérifier')).join('\n')+'\n'+data.scope;
  const details=document.querySelector('[data-analysis-request]');details.open=true;details.querySelector('summary').textContent='Faire vérifier mon suivi en détail avec Alexandre';
 }catch(error){status.textContent=error.name==='AbortError'?'Le contrôle prend trop de temps. Réessayez ou demandez une analyse ci-dessous.':error.message;requestForm.elements.constats.value='Contrôle non abouti : '+status.textContent;}
 finally{clearTimeout(timer);button.disabled=false;}
});
requestForm?.addEventListener('submit',async event=>{
 event.preventDefault();if(!requestForm.reportValidity())return;
 const button=requestForm.querySelector('button'),status=requestForm.querySelector('[data-analysis-status]');button.disabled=true;status.textContent='Envoi de votre demande…';
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
 try{const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(requestForm)).toString(),signal:controller.signal});if(!response.ok)throw Error('Envoi impossible pour le moment. Réessayez ou utilisez le contact en bas de page.');status.textContent='Votre demande est enregistrée. Alexandre vous répondra par email pour préciser les vérifications utiles.';requestForm.reset();}
 catch(error){status.textContent=error.name==='AbortError'?'L’envoi n’a pas pu être confirmé. Réessayez ou contactez Alexandre en bas de page.':error.message;}
 finally{clearTimeout(timer);button.disabled=false;}
});
