// Basic consent: no Google request before an explicit, unexpired opt-in.
(()=>{
 const id=document.body.dataset.measurementId||'';
 const enabled=/^G-[A-Z0-9]+$/.test(id);
 const key='ca-consent-v1',version=1;
 const banner=document.querySelector('[data-cookie-banner]');
 let loaded=false,returnFocus=null,memory=null;
 function read(){try{const v=JSON.parse(localStorage.getItem(key))||memory;return v?.version===version&&['accepted','refused'].includes(v.choice)&&Number.isFinite(v.expires)&&v.expires>Date.now()&&v.expires<=Date.now()+187*86400000?v:null;}catch{return memory&&memory.expires>Date.now()?memory:null;}}
 function save(choice){const expires=new Date();expires.setMonth(expires.getMonth()+6);memory={version,choice,expires:expires.getTime()};try{localStorage.setItem(key,JSON.stringify(memory));}catch{/* The preference lasts for this page if storage is blocked. */}}
 function clearCookies(){const domains=[null,location.hostname,'.'+location.hostname,'.consultant-analytics.fr'];for(const raw of document.cookie.split(';')){const name=raw.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))continue;for(const domain of domains)document.cookie=name+'=; Max-Age=0; path=/; SameSite=Lax'+(domain?'; domain='+domain:'');}}
 function load(){if(!enabled||loaded)return;loaded=true;window['ga-disable-'+id]=false;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());
  const cleanRef=(()=>{try{const u=new URL(document.referrer);return u.origin+u.pathname;}catch{return '';}})();
  window.gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:33696000,cookie_update:false,page_location:location.origin+location.pathname,page_referrer:cleanRef});
  window.gtag('event','page_view',{page_location:location.origin+location.pathname,page_referrer:cleanRef,page_title:document.title});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;script.dataset.consentAnalytics='true';document.head.append(script);
 }
 function stop(){if(enabled)window['ga-disable-'+id]=true;clearCookies();document.querySelectorAll('script[data-consent-analytics]').forEach(s=>s.remove());}
 function open(){returnFocus=document.activeElement;banner.hidden=false;document.body.classList.add('cookie-banner-open');banner.querySelector('button')?.focus();}
 function close(){banner.hidden=true;document.body.classList.remove('cookie-banner-open');if(returnFocus?.isConnected)returnFocus.focus();}
 function state(text){document.querySelectorAll('[data-cookie-state]').forEach(e=>e.textContent=text);}
 function choose(choice){save(choice);close();if(choice==='accepted'){load();state('La mesure d’audience est autorisée.');}else{const reload=loaded;stop();state('La mesure d’audience est refusée.');if(reload)location.reload();}}
 document.querySelectorAll('[data-cookie-open]').forEach(button=>button.addEventListener('click',()=>{if(enabled)open();else state('Google Analytics n’est pas encore activé. Aucune balise de mesure n’est chargée.');}));
 banner?.querySelectorAll('[data-cookie-choice]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.cookieChoice)));
 window.addEventListener('storage',event=>{if(event.key!==key)return;memory=null;const value=read();if(value?.choice==='accepted'){close();load();}else{const reload=loaded;stop();if(reload)location.reload();else if(!value&&enabled)open();else close();}});
 function checkExpiry(){if(!enabled||document.hidden)return;const value=read();if(!value){const reload=loaded;stop();if(reload)location.reload();else if(banner.hidden)open();}}
 document.addEventListener('visibilitychange',checkExpiry);
 if(!enabled){stop();return;}
 const choice=read();if(choice?.choice==='accepted')load();else{stop();if(!choice)open();}
 setInterval(checkExpiry,60000);
})();
