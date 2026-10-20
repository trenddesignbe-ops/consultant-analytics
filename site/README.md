# Consultant Analytics · refonte v2

Site statique multipage pour Alexandre Cottret. Direction visuelle inspirée de PipelinePro à la demande du propriétaire : Switzer, grands espacements, boutons noirs, fonds sobres et blocs visuels colorés. Aucune dépendance JavaScript de production.

## Construire et prévisualiser

Node.js 22 recommandé. Aucune installation de dépendance requise.

```sh
npm run build
npm test
npm run preview
```

L’aperçu s’ouvre sur http://127.0.0.1:4173. `dist/` est généré et ignoré par Git. Netlify publie exclusivement ce dossier après construction et contrôle.

## Contenu

- Accueil : problèmes clients, quatre expertises, exemple de dashboard interactif, méthode, trois personas, prestations, présentation et contact.
- Quatre pages de services : GA4, GTM, Google Ads et Looker Studio. Pas de page Wix, conformément au choix du propriétaire.
- Trois guides détaillés et leur index, page confidentialité et vraie page 404.
- Métadonnées uniques, canonical, sitemap, données structurées et ressources locales.

`site/build.mjs` contient les gabarits et la home ; `site/services.mjs` et `site/articles.mjs` contiennent les pages éditoriales. `site/assets/` contient le CSS, le JavaScript et les médias. Les fichiers historiques de la racine et de `src/` restent conservés mais ne sont pas publiés.

## Réglages métier

Modifier `site/config.mjs` pour les coordonnées, le domaine final et les prix. Calendly confirmé par le propriétaire : https://calendly.com/alexandre-cottret/votre-projet-web.

Les tarifs restent **sur devis** tant que montants, périmètres et HT/TTC ne sont pas confirmés. L’adresse email vient de la page publique Trend Design ; elle doit être confirmée avant lancement définitif. Le formulaire est un composeur email explicite : il ouvre la messagerie du visiteur, sans annoncer qu’un envoi serveur aurait eu lieu. Le site ne stocke pas les saisies. Une future collecte serveur nécessitera un raccordement réel, une gestion des erreurs et une mise à jour des informations de confidentialité.

Les visuels de reporting sont des exemples fictifs, pas des cas clients. Aucun témoignage ou résultat commercial n’est inventé. Sources des médias dans `site/ASSETS.md`.

## Avant lancement public du domaine

L’indexation est désactivée par défaut dans le HTML et les en-têtes générés. `robots.txt` autorise l’exploration pour que `noindex` puisse être lu. Ne pas demander d’indexation de cette préversion.

Après validation du domaine, des coordonnées, des mentions de l’éditeur et de la politique de conservation réelle, passer `SITE_INDEXABLE` à `true` dans la configuration de production Netlify et reconstruire. Le domaine canonique doit correspondre au domaine servi, avec HTTPS et les redirections appropriées. Conserver les deploy previews hors index.

Cette version ne charge pas GA4, GTM ni de pixel publicitaire. Aucune CMP fictive n’est ajoutée. Un futur plan de mesure doit distinguer clic Calendly et réservation confirmée, respecter les choix de consentement et ne pas envoyer d’informations personnelles à GA4.

## Vérifications

`npm test` vérifie toutes les pages générées, les liens et ancres internes, les assets, les titres/descriptions uniques, un H1 par page, le JSON-LD et le retrait de la page Wix. Recette navigateur : desktop, mobile, menu, FAQ et bascule ventes/demandes du dashboard. Le calendrier n’est pas réservé et aucun message n’est envoyé durant les tests.
