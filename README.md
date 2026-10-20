# consultant-analytics.fr

Page d'accueil du site satellite **consultant-analytics.fr** (Alexandre Cottret, Trend Design).
Consultant web analytics freelance : Google Analytics, Google Tag Manager, Google Ads, Looker Studio.

## Ce que contient le dépôt

| Chemin | Rôle |
|---|---|
| `index.html` | La page d'accueil complète, autonome (un seul fichier) |
| `assets/signal.json` | Modèle 3D « le signal » au format glTF JSON, chargé par Three.js |
| `assets/signal.glb` | Même modèle au format binaire (source) |
| `src/` | Sources du build : `v5.src.html`, les `parts_*.txt`, les cartes `parts_lab2_*.html` et les scripts `build.py` / `build_lab2.py` |
| `netlify.toml` | Déploiement Netlify (site statique, en-têtes noindex tant que le site n'est pas lancé) |
| `robots.txt` | Interdit l'exploration pour l'instant (pas d'indexation avant la mise en ligne réelle) |

## Reconstruire la page

```bash
cd src
python3 -I build.py        # écrit ../index.html et check.js
node --check check.js      # contrôle de syntaxe du JavaScript
```

`build.py` assemble `v5.src.html` avec les parties (labo, tunnel 3D, simulateurs) et `build_lab2.py`
ajoute les 26 cartes du Labo 2 plus le tableau comparatif des outils d'animation.

## À savoir

- La section **Labo 2** en bas de page est une section de test destinée à comparer les outils
  d'animation. Elle charge une quinzaine de bibliothèques et doit être retirée avant la mise en
  ligne définitive (la page tombe alors sous les 200 Ko).
- Deux cartes du labo attendent un fichier pour s'animer réellement : `assets/consent.riv`
  (export depuis l'éditeur Rive) et `assets/scene.splinecode` (export depuis Spline).
- Contenus encore à fournir avant le lancement : photo, tarifs définitifs, deux cas clients
  chiffrés, lien Calendly.
