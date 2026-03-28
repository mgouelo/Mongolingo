# PROJET R403 - NOSQL : MONGOLINGO
Matthieu Gouélo

Lien vers la vidéo de démonstration (2 min) :  
> [https://www.youtube.com/watch?v=U0jLoL2oY9g](https://www.youtube.com/watch?v=U0jLoL2oY9g)

---

## I - PRÉSENTATION DU PROJET

**Mongolingo** est une application web d'apprentissage interactive en React/Next.js, inspirée de Duolingo.  
Elle permet de s'exercer à la syntaxe MongoDB via 35 requêtes CRUD allant du niveau facile au niveau extrême.

L'architecture du rendu respecte la structure demandée :
- Le code source du projet (Next.js) est fourni sans le dossier `/node_modules`.
- `/database/schemas/` : Contient les scripts définissant les validateurs JSON Schema des collections.
- `/database/default_data/` : Contient les données brutes de démonstration.
- `/database/backups/` : Dossier destiné à recevoir les sauvegardes BSON et JSON générées par l'application.

---

## II - PRÉREQUIS SYSTÈME (Ubuntu récent)

Pour exécuter ce projet sur une distribution Ubuntu récente, vous devez disposer de :
- **Node.js** (version 18 ou supérieure) et **npm**.
- **MongoDB Server** (`mongod`) installé et fonctionnel en local sur le port par défaut (`27017`).

---

## III - INSTALLATION ET LANCEMENT ÉTAPE PAR ÉTAPE

### ÉTAPE 1 : Restauration des dépendances
Ouvrez un terminal à la racine du projet et installez les dépendances Node.js :
> npm install

### ÉTAPE 2 : Démarrage du serveur MongoDB
Assurez-vous que votre service MongoDB est en cours d'exécution.
> mongod --dbpath=./mongo_data

### ÉTAPE 3 : Initialisation de la base de données
Dans un terminal à la racine du projet, lancez le script d'initialisation.  
Ce script va nettoyer la base, appliquer les schémas de validation et charger les données de démonstration :
> node database/init.js

### ÉTAPE 4 : Lancement de l'application web Mongolingo
Démarrez le serveur de développement Next.js :
> npm run dev

Ouvrez ensuite votre navigateur web à l'adresse suivante :  
> [http://localhost:3000](http://localhost:3000)

---

## IV - FONCTIONNALITÉS D'ADMINISTRATION (Import / Export)

L'application intègre nativement la gestion des sauvegardes :
- **Bouton "Exporter"** : Permet de télécharger une sauvegarde de la base actuelle au format EJSON (préserve les types Date et ObjectId) ou au format binaire BSON.
- **Bouton "Importer"** : Permet de charger un fichier `.json` ou `.bson` pour écraser la base actuelle et restaurer une sauvegarde.
- **Bouton "Réinitialiser"** : Relance l'`init.js` pour retrouver le jeu de données par défaut.