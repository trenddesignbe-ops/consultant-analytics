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

Modifier `site/config.mjs` pour les coordonnées, le domaine final et les prix. Calendly (événement « Diagnostic tracking · 30 min », décision du 04/11/2026) : https://calendly.com/alexandre-cottret/diagnostic-tracking-30-min.

Les tarifs restent **sur devis** tant que montants, périmètres et HT/TTC ne sont pas confirmés. L’adresse email vient de la page publique Trend Design ; elle doit être confirmée avant lancement définitif. Le formulaire est un composeur email explicite : il ouvre la messagerie du visiteur, sans annoncer qu’un envoi serveur aurait eu lieu. Le site ne stocke pas les saisies. Une future collecte serveur nécessitera un raccordement réel, une gestion des erreurs et une mise à jour des informations de confidentialité.

Les visuels de reporting sont des exemples fictifs, pas des cas clients. Aucun témoignage ou résultat commercial n’est inventé. Sources des médias dans `site/ASSETS.md`.

## Avant lancement public du domaine

L’indexation est désactivée par défaut dans le HTML et les en-têtes générés. `robots.txt` autorise l’exploration pour que `noindex` puisse être lu. Ne pas demander d’indexation de cette préversion.

Après validation du domaine, des coordonnées, des mentions de l’éditeur et de la politique de conservation réelle, passer `SITE_INDEXABLE` à `true` dans la configuration de production Netlify et reconstruire. Le domaine canonique doit correspondre au domaine servi, avec HTTPS et les redirections appropriées. Conserver les deploy previews hors index.

GA4 (propriété « Consultant analytics », ID de mesure G-EMHNVQB9NN, réglé dans `site/config.mjs` ou par la variable GA4_MEASUREMENT_ID) ne se charge qu’après un clic sur « Accepter » dans le bandeau (`site/assets/consent.js`, mode consentement Google, signaux Google et personnalisation publicitaire désactivés). Événements : `page_view` (adresse sans paramètres), `generate_lead` (form_name analyse-tracking, à l’envoi réussi du formulaire de bilan ou sur /demande-recue/) et `contact_click` (contact_method calendly, whatsapp, phone ou email). Aucun GTM ni pixel publicitaire. Les pages légales sont en noindex et hors du sitemap.

## Vérifications

`npm test` vérifie toutes les pages générées, les liens et ancres internes, les assets, les titres/descriptions uniques, un H1 par page, le JSON-LD et le retrait de la page Wix. Recette navigateur : desktop, mobile, menu, FAQ et bascule ventes/demandes du dashboard. Le calendrier n’est pas réservé et aucun message n’est envoyé durant les tests.
