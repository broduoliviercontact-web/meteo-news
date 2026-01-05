# Meteo Newz

Lien démo : https://meteo-newz.netlify.app/

Description
-----------
Meteo Newz est une application web qui permet de consulter la météo (actuelle et prévisionnelle) et les informations associées de manière simple et réactive. L'interface est conçue pour être facile d'utilisation sur desktop et mobile.

Fonctionnalités
---------------
- Recherche de la météo par ville
- Affichage des conditions météo actuelles (température, humidité, vent, etc.)
- Prévisions (ex. : 3/5/7 jours) — adapter selon l'implémentation
- Interface responsive
- (Optionnel) Intégration de flux d'actualités liées au temps/climat (si présent)
- Gestion des unités (°C / °F) — si implémentée

Démo
----
La version en ligne est disponible ici : https://meteo-newz.netlify.app/

Technologies
------------
Remplace la liste ci-dessous par la stack exacte utilisée dans le projet :
- Frontend : [React | Vue | Vanilla JS]  
- Styles : [CSS / Sass / Tailwind / Bootstrap]
- API météo : [OpenWeatherMap, WeatherAPI, etc.]
- Déploiement : Netlify

Installation (exécution locale)
-------------------------------
Prérequis :
- Node.js (>= 14) et npm ou yarn

Étapes génériques :
```bash
# cloner le dépôt
git clone <URL_DU_REPO>
cd <NOM_DU_PROJET>

# installer les dépendances
npm install
# ou
yarn install

# démarrer en mode développement
npm start
# ou
yarn start
```

Configuration
-------------
Si le projet utilise des clés d'API, crée un fichier `.env` à la racine et ajoute les variables nécessaires. Exemple générique :
```
REACT_APP_WEATHER_API_KEY=ta_cle_api_meteo
REACT_APP_NEWS_API_KEY=ta_cle_api_news
```
Remplace les noms et les valeurs par ceux effectifs du projet.

Construction et déploiement
--------------------------
Pour créer une version de production :
```bash
npm run build
# ou
yarn build
```
La build peut ensuite être déployée sur Netlify, Vercel ou tout autre hébergeur statique. Pour Netlify, tu peux simplement connecter ton dépôt et définir la commande de build (`npm run build`) et le dossier de publication (`build` ou `dist` selon la configuration).

Tests
-----
Si des tests sont présents :
```bash
npm test
# ou
yarn test
```
Sinon, ajouter des tests unitaires/intégration est recommandé.

Contribuer
----------
Contributions bienvenues :
1. Fork le dépôt
2. Crée une branche feature/fix : `git checkout -b feature/ma-fonctionnalite`
3. Commit tes changements : `git commit -m "Description des changements"`
4. Push et ouvre une Pull Request

Styles de code, linters et conventions
-------------------------------------
Ajouter ici les conventions utilisées (ESLint, Prettier, format de commit, etc.) ou supprimer si non applicable.

Sécurité
--------
Ne commite jamais de clés API dans le dépôt. Utilise des variables d'environnement ou un service de secret management.

Licence
-------
Ce projet est sous licence [MIT] — remplace par la licence réelle si différente.

Auteurs / Contact
-----------------
- Auteur : [Nom ou pseudo]
- Site / Contact : [email ou lien vers profil]

Remarques / TODO
----------------
- Liste des améliorations prévues (ex. : historique des recherches, favoris, géolocalisation, animations)
- Indiquer les fonctionnalités manquantes ou les améliorations souhaitées
