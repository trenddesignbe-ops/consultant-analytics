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

- Accueil : quatre expertises en onglets, explication interactive des achats mesurés, prédiagnostic public, menu des prestations, méthode, présentation et contact.
- Quatre pages de services : GA4, GTM, Google Ads et Looker Studio. Pas de page Wix, conformément au choix du propriétaire.
- Trois guides détaillés et leur index, page confidentialité et vraie page 404.
- Métadonnées uniques, canonical, sitemap, données structurées et ressources locales.

`site/build.mjs` contient les gabarits et `site/home.mjs` la home ; `site/services.mjs` et `site/articles.mjs` contiennent les pages éditoriales. `site/assets/` contient le CSS, le JavaScript et les médias. Les fichiers historiques de la racine et de `src/` restent conservés mais ne sont pas publiés.

## Réglages métier

Modifier `site/config.mjs` pour les coordonnées, le domaine final et les prix. Calendly confirmé par le propriétaire : https://calendly.com/alexandre-cottret/votre-projet-web.

Les tarifs restent **sur devis** tant que montants, périmètres et HT/TTC ne sont pas confirmés. L’adresse email de contact vient de la page publique Trend Design. Le formulaire de contact du pied de page ouvre explicitement la messagerie du visiteur.

Le formulaire `analyse-tracking` enregistre les demandes dans Netlify Forms (détection activée sur le site existant). Il contient email, site, besoin, constats et accord de contact, avec honeypot et erreurs réelles. La réponse approfondie est manuelle : aucun envoi automatique de rapport par email n’est annoncé. Les notifications email ne sont pas configurées par le code ; consulter Netlify Forms pour les demandes ou configurer une notification dans Netlify.

`netlify/functions/tracking-check.mjs` lit le HTML public en HTTPS : références GA4, GTM et CMP courantes. Pas d’exécution des scripts, de test d’achat, de vérification de doublon ni de conclusion de conformité. Limite 8 secondes, 1 Mo de HTML (lecture partielle signalée), 3 redirections ; IP privées et réservées bloquées, DNS épinglé par requête TLS, chaque redirection revalidée. Limitation plateforme : 6 requêtes/minute/IP et domaine. Les champs de résultat sont rendus avec `textContent`.

Animation retenue après lecture du labo : SVG, CSS et Web Animations API native, sans bibliothèque externe. Respect de la préférence de réduction du mouvement. Le labo historique n’est pas publié.

Les visuels de reporting sont des exemples fictifs, pas des cas clients. Aucun témoignage ou résultat commercial n’est inventé. Sources des médias dans `site/ASSETS.md`.

## Avant lancement public du domaine

Le domaine primaire HTTPS `https://www.consultant-analytics.fr` a été vérifié le 20 octobre 2026. Les canoniques et le sitemap utilisent ce domaine.

L’indexation est activée dans le contexte Netlify `production` et désactivée par défaut pour l’aperçu local et les autres contextes. La page de confirmation et la 404 portent `noindex`. Ne pas demander d’indexation des deploy previews. Les mentions complètes de l’éditeur et les preuves de mission restent à enrichir avec les informations réelles du propriétaire.

Cette version ne charge pas GA4, GTM ni de pixel publicitaire. Aucune CMP fictive n’est ajoutée. Un futur plan de mesure doit distinguer clic Calendly et réservation confirmée, respecter les choix de consentement et ne pas envoyer d’informations personnelles à GA4.

## Vérifications

`npm test` vérifie toutes les pages générées, les liens et ancres internes, les assets, les titres/descriptions uniques, un H1 par page, le JSON-LD, le formulaire, les onglets et les cibles SEO. Les tests du prédiagnostic vérifient les cibles privées, DNS mixtes, requêtes malformées, origine et détection des scripts. Recette navigateur : ordinateur, mobile, onglets, bascule ventes/demandes, simulation et contrôle public en production. Le calendrier n’est pas réservé durant les tests.
