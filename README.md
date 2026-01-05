# Meteo Newz — Agrégateur de flux RSS façon bandeau d'info

Démo : https://meteo-newz.netlify.app/

Description
-----------
Meteo Newz est un agrégateur web qui affiche les flux RSS des principales chaînes d'information françaises dans un style inspiré des bandeaux / tickers télévisés. L'interface met l'accent sur la lisibilité et la rapidité : sélection des chaînes, défilement en bandeau, actualisation automatique des flux.

Points clés
-----------
- Affiche plusieurs flux RSS (chaînes d'info françaises) sous forme de bandeaux/tickers.
- Design inspiré des bandeaux d'information télévisés (priorité visuelle, couleurs de chaîne, horodatage).
- Choix des chaînes à afficher, mise en pause du défilement, filtrage/recherche de titres.
- Rafraîchissement automatique configurable et cache local pour limiter les requêtes.
- Déployé en tant que site statique (Netlify) avec option de proxy / fonction serverless pour contourner les restrictions CORS si nécessaire.

Fonctionnalités
---------------
- Liste / sélection des chaînes (activer / désactiver).
- Bandeau principal déroulant affichant les titres en continu.
- Fiches détaillées pour chaque actualité (aperçu, source, lien vers l'article).
- Réglage de la vitesse du ticker et de l'intervalle d'actualisation.
- Option "Favoris" / historique (si implémentée).
- Support responsive (bureau & mobile).

Installation (exécution locale)
-------------------------------
Remplacez les commandes ci-dessous si votre projet utilise un gestionnaire ou une configuration différente (ex. Yarn, pnpm, Vite, Create React App, Nuxt, etc.).

Prérequis :
- Node.js (>= 14) et npm

Exemples de commandes :
```bash
# cloner le dépôt
git clone <URL_DU_REPO>
cd <NOM_DU_PROJET>

# installer les dépendances
npm install

# démarrer en mode développement
npm run dev    # ou npm start selon le projet
```

Construction et déploiement
--------------------------
Pour créer une version de production :
```bash
npm run build
```

Déploiement sur Netlify :
- Connectez votre dépôt Git à Netlify.
- Définissez la commande de build (`npm run build`) et le dossier de publication (`build`, `dist` ou le dossier configuré).
- Si vous utilisez une fonction serverless (Netlify Functions), vérifiez la configuration du dossier `netlify/functions` ou `functions`.

Gestion des flux RSS
--------------------
Les flux sont définis par une liste (fichier JSON, base de données ou configuration). Exemple (fichier channels.json) :

```json
[
  {
    "id": "chaine1",
    "name": "Chaîne Exemple",
    "color": "#d02b2b",
    "rss": "https://exemple.fr/rss"
  },
  {
    "id": "chaine2",
    "name": "Autre Chaîne",
    "color": "#1a73e8",
    "rss": "https://autre.fr/feed"
  }
]
```

- `id` : identifiant unique.
- `name` : nom affiché.
- `color` : couleur associée au bandeau (optionnel).
- `rss` : URL du flux RSS.

CORS / Proxy des flux
---------------------
Les navigateurs bloquent souvent les requêtes cross-origin vers des flux RSS. Deux options :
1. Utiliser un proxy côté serveur (Netlify Functions, Vercel Serverless, Cloud Function) qui récupère le RSS et le retourne au client.
2. Utiliser un service public de conversion RSS→JSON / proxy (pas recommandé en production pour raisons de fiabilité/sécurité).

Exemple d'environnement pour Netlify Functions :
```
# .env (NEVER commit .env)
RSS_REFRESH_INTERVAL=300000   # en ms
USE_RSS_PROXY=true
```

Exemple simple de requête (front) vers la fonction serverless :
GET /.netlify/functions/fetch-rss?url=<ENCODED_RSS_URL>

Performance & cache
-------------------
- Cacher les réponses RSS en localStorage ou IndexedDB pour limiter le trafic.
- Mettre en place un délai minimum entre deux requêtes au même flux (par ex. 5 minutes).
- Filtrer/normaliser les items RSS côté proxy pour alléger les réponses JSON.

Accessibilité
-------------
- S'assurer que le ticker peut être mis en pause par l'utilisateur (WCAG).
- Contraste suffisant pour les couleurs de bandeaux.
- Navigation clavier pour parcourir les articles.

Personnalisation & thèmes
-------------------------
- Couleurs par chaîne.
- Mode sombre / clair.
- Réglage de la taille de police et de la vitesse du défilement.

Tests
-----
Ajouter les commandes de test si présentes dans le projet :
```bash
npm test
```

Contribuer
----------
1. Fork du projet
2. Créer une branche feature/fix
3. Committer et pousser
4. Ouvrir une Pull Request

Guidelines :
- Respecter le style de code (ESLint / Prettier si présents).
- Ajouter des tests pour les nouvelles fonctionnalités critiques (par ex. parsing RSS, fonctions serverless).

Sécurité & confidentialité
--------------------------
- Ne pas commiter de clés ou secrets.
- Si vous stockez des préférences utilisateur/localement, informer sur la conservation des données (politique de confidentialité).
- Valider/saniter le contenu provenant des flux (protection contre XSS).

Licence
-------
Indiquer ici la licence du projet (ex. MIT). Remplacez si nécessaire.

Auteurs / Contact
-----------------
- Auteur / Mainteneur : [Nom ou pseudo]
- Site / Démo : https://meteo-newz.netlify.app/
- Contact : [email ou lien profil]

Notes finales / TODO
--------------------
- Ajouter captures d'écran et GIFs du bandeau en action.
- Ajouter badge de build / Netlify / license.
- Lister les flux par défaut et proposer un mécanisme d'import/export de la configuration des chaînes.

Besoin d'un README adapté exactement à la stack (React / Vue / Vanilla) ou au dépôt Git ? Donne-moi :
- le fichier package.json ou la stack utilisée, et
- si tu veux que j'ajoute des badges et captures d'écran,
je m'occupe de le reformater précisément pour ton repo.
