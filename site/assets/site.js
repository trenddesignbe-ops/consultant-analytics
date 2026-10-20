document.body.classList.add('js-ready');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
function closeMenu(){menu?.setAttribute('aria-expanded','false');nav?.classList.remove('open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});

// This is an illustrative deliverable, not visitor or customer analytics.
const examples={sales:{labels:['Ventes attribuées','Dépenses publicitaires','Coût par vente'],values:['84','3 200 €','38,10 €'],caption:'Ventes attribuées aux campagnes · exemple fictif',path:'M0 105 L28 93 L56 98 L84 70 L112 78 L140 53 L168 65 L196 35 L224 43 L252 20 L280 29 L308 7'},leads:{labels:['Demandes qualifiées','Dépenses publicitaires','Coût par demande'],values:['32','1 600 €','50 €'],caption:'Demandes validées dans le CRM · exemple fictif',path:'M0 110 L28 99 L56 103 L84 93 L112 72 L140 83 L168 55 L196 68 L224 39 L252 48 L280 21 L308 12'}};
document.querySelectorAll('[data-demo]').forEach(button=>button.addEventListener('click',()=>{const d=examples[button.dataset.demo];document.querySelectorAll('[data-demo]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));d.labels.forEach((label,i)=>{document.querySelector(`[data-demo-label="${i}"]`).textContent=label;document.querySelector(`[data-demo-value="${i}"]`).textContent=d.values[i];});document.querySelector('[data-demo-caption]').textContent=d.caption;document.querySelector('[data-demo-line]').setAttribute('d',d.path);}));

const contact=document.querySelector('[data-contact]');
contact?.addEventListener('submit',e=>{e.preventDefault();if(!contact.reportValidity())return;const data=new FormData(contact);const url=String(data.get('website')||'Non renseigné');const need=String(data.get('need')||'');const body=`Bonjour Alexandre,\n\nMon site : ${url}\n\nMon besoin :\n${need}\n\nMerci !`;const subject='Parlons du suivi de mon site';const link=`mailto:${contact.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;const status=contact.querySelector('[role="status"]');status.replaceChildren();status.append('Votre message est préparé. Validez son envoi dans votre messagerie. Si elle ne s’ouvre pas, ');const fallback=document.createElement('a');fallback.href=link;fallback.textContent='ouvrez le message ici';status.append(fallback,'.');window.location.href=link;});

// Content remains visible if JavaScript or IntersectionObserver is unavailable.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){const targets=[...document.querySelectorAll('.reveal')];document.body.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target);}}),{threshold:.08});targets.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pending');observer.observe(el);}});setTimeout(()=>targets.forEach(el=>el.classList.remove('pending')),5000);}
