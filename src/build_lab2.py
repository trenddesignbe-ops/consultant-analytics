import re,glob,os,html
ORDER=['waapi','splittext','codrops-blur','flip','svg-morph','rough','d3','echarts','matter','zdog','lenis','codrops-grid','lottie-code','lottie-asset','webm','img-seq','gltf-asset','glsl','three-instanced','ogl','pixi','babylon','curtains','scroll-css','spline-embed','rive']
def assemble():
    parts={}
    for f in glob.glob('parts_lab2_*.html'):
        slug=f[len('parts_lab2_'):-5]
        if slug=='table': continue
        parts[slug]=open(f,encoding='utf-8').read()
    slugs=[s for s in ORDER if s in parts]+[s for s in parts if s not in ORDER]
    css=[];figs=[];srcs=[];inl=[];seen=set()
    for i,s in enumerate(slugs,1):
        p=parts[s]
        css+=re.findall(r'<style>(.*?)</style>',p,flags=re.S)
        for m in re.finditer(r'<script\s+src="([^"]+)"[^>]*>\s*</script>',p):
            u=m.group(1)
            if u not in seen: seen.add(u); srcs.append(m.group(0))
        inl+=re.findall(r'<script>(.*?)</script>',p,flags=re.S)
        fig=re.search(r'<figure class="lab2".*?</figure>',p,flags=re.S)
        if fig:
            f=fig.group(0); f=re.sub(r'<h3>\s*\d+\s*·\s*',f'<h3>{i} · ',f,count=1); figs.append(f)
    wire='''(function(){ const L=window.LAB2||{}; document.querySelectorAll('.lab2').forEach(fig=>{ const k=fig.dataset.tool, lab=L[k]; if(!lab||!lab.play) return; let done=false; const io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting&&!done){ done=true; try{lab.play();}catch(err){console.warn(k,err);} io.disconnect(); } }); },{threshold:.2}); io.observe(fig); const b=fig.querySelector('.replay'); if(b) b.addEventListener('click',()=>{ try{lab.play();}catch(err){console.warn(k,err);} }); }); })();'''
    base='''
/* ============ LAB 2 ============ */
#labo2 .labs2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
@media (max-width:900px){#labo2 .labs2{grid-template-columns:1fr}}
.lab2{background:var(--card);border-radius:18px;box-shadow:0 2px 6px rgba(11,11,12,.05),0 18px 50px rgba(60,40,90,.10);padding:18px;display:grid;gap:12px;margin:0;min-width:0;align-content:start}
.lab2 .lab-h{display:flex;justify-content:space-between;align-items:center;gap:10px}
.lab2 .lab-h h3{font-size:1.1rem}
.lab2 .replay{border:0;background:var(--bg-2);color:var(--ink);border-radius:999px;padding:7px 12px;font:600 .78rem var(--body);cursor:pointer}
.lab2 .replay:hover{background:#ECE9E6}
.lab2 .stage-area{position:relative;background:var(--bg-2);border-radius:12px;height:260px;overflow:hidden}
.lab2 .stage-area>svg,.lab2 .stage-area>canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.lab2 .lab-meta{display:grid;grid-template-columns:repeat(3,auto);gap:8px 16px;font:500 .76rem var(--body);color:var(--ink-3)}
.lab2 .lab-meta b{display:block;color:var(--ink);font-weight:600}
.lab2 p{font-size:.9rem;color:var(--ink-2)}
.lab2 p b{color:var(--ink)}
.lab2 .howto{font-size:.84rem;color:var(--ink-3)}
.lab2 .verdict{font:600 .8rem var(--body);color:var(--accent)}
.l2-table-wrap{margin-top:48px;display:grid;gap:14px}
.l2-h{font-size:1.5rem}
.l2-p{color:var(--ink-2);font-size:.95rem;max-width:80ch}
.l2-table{width:100%;border-collapse:collapse;font-size:.82rem;background:var(--card);border-radius:14px;overflow:hidden;box-shadow:0 2px 6px rgba(11,11,12,.05)}
.l2-table th,.l2-table td{padding:10px 12px;text-align:left;vertical-align:top;border-bottom:1px solid #EEECE9}
.l2-table th{background:var(--bg-2);font-weight:600;color:var(--ink)}
.l2-table td:first-child{font-weight:600;color:var(--ink);white-space:nowrap}
.l2-table td:nth-child(n+6){text-align:center;font-variant-numeric:tabular-nums}
@media (max-width:900px){.l2-table{display:block;overflow-x:auto}}
'''
    section='''
<!-- ============ LABO 2 ============ -->
<section id="labo2">
  <div class="wrap">
    <div class="sec-head">
      <h2>Labo 2 : un outil, <em>une douleur ou un bénéfice</em></h2>
      <p class="sub">Section de test, à retirer avant la mise en ligne. Chaque carte exploite un outil au maximum et montre une seule chose au persona. Le tableau comparatif est en fin de section.</p>
    </div>
    <div class="labs2">
'''+'\n'.join(figs)+'''
    </div>
'''+open('parts_lab2_table.html',encoding='utf-8').read()+'''
  </div>
</section>
'''
    return base+'\n'.join(css), section, '\n'.join(srcs), ';\n'.join(x.strip() for x in inl)+';\n'+wire, slugs
if __name__=='__main__':
    c,h,s,j,sl=assemble(); print(len(sl),sl)
