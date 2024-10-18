# MemoryCard

MemoryCard est une application web interactive conçue pour créer et gérer des dossiers thématiques contenant des cartes de questions-réponses. Chaque dossier représente un thème spécifique, et les cartes à l'intérieur contiennent des questions sur ce thème. Lorsque l'utilisateur survole une carte, celle-ci se retourne pour afficher la réponse correspondante.

## Prérequis
Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :
-	Node.js (version 14 ou supérieure)
-	npm (version 6 ou supérieure)
-	MongoDB (pour la base de données)
-	Un client de gestion d'API tel que Postman (pour tester les endpoints backend)

## Installation
1. Cloner le projet
Tout d'abord, clonez le dépôt GitHub du projet sur votre machine locale :
```sh
git clone https://github.com/votre-utilisateur/MemoryCard.git
```

Accédez ensuite au répertoire du projet :
```sh
cd MemoryCard
```

2. Installation des dépendances
#### Frontend
Ouvrez un terminal et naviguez vers le dossier MemoryCard/MemoryCard :
```sh
cd MemoryCard/MemoryCard
```

Installez les dépendances du frontend avec la commande suivante :
```sh
npm install
```

#### Backend
Ouvrez un terminal et naviguez vers le dossier MemoryCard/back :
```sh
cd MemoryCard/back
```

Installez les dépendances du backend avec la commande suivante :
```sh
npm install
```

3. Configuration du backend
#### Dépendances à installer pour le backend
Pour que le backend fonctionne correctement, vous aurez besoin des modules suivants :
-	express : framework pour gérer les routes et les requêtes http
-	mongoose : ORM pour MongoDB
-	cors : module pour gérer les requêtes cross-origin
-	body-parser : middleware pour parser les requêtes http
-   bcrypt : bibliothèque pour le hachage des mots de passe.
-   compression : middleware pour compresser les réponses HTTP.
-   cors : module pour gérer les requêtes cross-origin.
-   jsonwebtoken : bibliothèque pour créer et vérifier les JSON Web Tokens (JWT).
-   uuid : bibliothèque pour générer des identifiants uniques universels (UUID).

Installez-les avec la commande suivante :
```sh
npm install express mongoose cors body-parser
```

## Démarrage
### Frontend
Pour démarrer le serveur de développement du frontend, suivez les étapes suivantes :

Accédez au répertoire du frontend MemoryCard/MemoryCard :
```sh
cd MemoryCard/MemoryCard
```

Exécutez la commande suivante pour lancer le serveur Angular :
```sh
ng serve
```

Ouvrez votre navigateur et accédez à l'URL suivante :
```sh
http://localhost:4200
```
### Backend
Pour démarrer le serveur de développement du backend, suivez les étapes suivantes :

Accédez au répertoire du backend MemoryCard/back :
```sh
cd MemoryCard/back
```
Exécutez la commande suivante pour lancer le serveur Node.js :
```sh
nodemon server.js
```
Le backend sera disponible sur :
```sh
http://localhost:3000
```

## Technologies utilisées
-	Frontend: Angular, HTML, CSS, TypeScript
-	Backend: Node.js, Express, MongoDB
-	Base de données : MongoDB
-	Gestion des dépendances : npm

## Contributeurs
-	Kenza DAHMANI
-	Tommy ANGIBAUD
-	Paul PIAUGER
-	Adrien RAYNAUD

## Licence
Ce projet est sous licence MIT.