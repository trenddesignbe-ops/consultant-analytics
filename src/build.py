import json,re
s=open('v5.src.html',encoding='utf-8').read()
lab_html=open('parts_lab_html.txt').read()
lab_html=lab_html.replace('''    <div class="lab-intro">
      <div class="eyebrow">Labo · section de test, à retirer avant mise en ligne</div>
      <h2>La même animation, outil par outil</h2>
      <p class="lede">Un seul concept, implémenté avec chaque outil disponible, pour voir ce que chacun coûte et ce qu'il apporte. Le prompt ci-dessous est celui que j'ai validé. Tu peux le coller tel quel dans Antigravity, Fable ou n'importe quel autre agent.</p>''',
'''    <div class="lab-intro">
      <div class="sec-head" style="margin-bottom:0">
        <h2>Labo : la même animation, <em>outil par outil</em></h2>
        <p class="sub">Section de test, à retirer avant la mise en ligne. Un seul concept, implémenté avec chaque outil, pour voir ce que chacun coûte et apporte. Le prompt validé est ci-dessous.</p>
      </div>''')
lab_html=lab_html.replace("Fond clair #F5F7F6, accent vert signal #15A34A (en sombre : fond #0B0D10, accent #4ADE80), grille papier millimétré à 9 % d'opacité, chiffres en JetBrains Mono.","Fond blanc cassé #FDFCFC, accent bleu #2E5BFF, grille discrète à 8 % d'opacité, chiffres en JetBrains Mono.").replace('<span class="tag">connecté, éditeur fermé</span>','<span class="tag">Connecté, éditeur fermé</span>').replace('<span class="tag">connecté, lecture seule utile</span>','<span class="tag">Connecté, lecture seule</span>').replace('<span class="tag">pas de connecteur</span>','<span class="tag">Pas de connecteur</span>')
three_d=open('parts_3d_html.txt').read(); anchor='      <figure class="lab off" data-tool="spline">'; lab_html=lab_html.replace(anchor, three_d+'\n'+anchor)
lab_css=open('parts_lab_css.txt').read().replace('.lab.off{border-style:dashed}','.lab.off{background:var(--bg-2)}')
import sys,os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); import build_lab2; L2_CSS,L2_HTML,L2_SRC,L2_JS,L2_SLUGS=build_lab2.assemble(); lab_css+=L2_CSS
fl=open('parts_flow_js.txt').read(); tool=open('parts_tool_js.txt').read(); lab_js=open('parts_lab_js.txt').read()+'\n'+open('parts_3d_js.txt').read()
for k,v in [('__LAB_CSS__',lab_css),('__LAB_HTML__',lab_html),('__TOOL_FUNNEL_JS__',tool+'\n'+fl),('__LAB_JS__',lab_js)]: s=s.replace(k,v)
d=json.load(open('lottie/trend.json'))
def walk(o):
    if isinstance(o,dict):
        if o.get('ty') in ('fl','st') and 'c' in o and isinstance(o['c'].get('k'),list):
            k=o['c']['k']
            if len(k)>=3 and all(isinstance(x,(int,float)) for x in k[:3]):
                r,g,b_=[round(x,3) for x in k[:3]]
                if (r,g,b_)==(0.988,0.588,0.012): o['c']['k']=[0.18,0.357,1,1]
                elif (r,g,b_)==(1,1,1): o['c']['k']=[0.54,0.54,0.58,1]
        for v in o.values(): walk(v)
    elif isinstance(o,list):
        for v in o: walk(v)
walk(d)
s=s.replace('<footer>',L2_HTML+'\n<footer>',1); s=s+'\n'+L2_SRC+'\n<script>\n'+L2_JS+'\n</script>\n'
out=s.replace('__LOTTIE_JSON__',json.dumps(d,separators=(',',':')))
open('consultant-analytics-home.html','w',encoding='utf-8').write(out)
open('check.js','w',encoding='utf-8').write('\n'.join(re.findall(r'<script>(.*?)</script>',out,flags=re.S)))
print('built',len(out)//1024,'KB')
