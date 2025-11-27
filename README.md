# AirBNBSearch

## Démarrage local (sans Docker)

1. Installer les dépendances :

```powershell
npm install
```

2. Créer un fichier `.env` à la racine (exemple minimum) :

```
MONGO_URI=uri-db-data
MONGO_AUTH_URI=uri-data-auth
PORT=4200
SESSION_SECRET=test
```

3. Lancer l'application :

```powershell
npm start
```

Ouvrir http://localhost:4200


## Tests rapides sans Docker

Les tests utilisent `mongodb-memory-server` (base Mongo en mémoire) et ne nécessitent pas Docker.

Pour exécuter les tests :

```powershell
npm test
```

Les tests ajoutés se trouvent dans le dossier `test/` :

- `test/setup.js` : démarre MongoDB en mémoire et configure les connexions
- `test/auth.test.js` : tests du modèle `User`
- `test/list.test.js` : tests du service `searchListings`
- `test/integration.test.js` : petite vérification d'intégration

## Démarrage avec Docker (docker-compose)

1. Créer un fichier `.env` avec :

```
MONGO_URI=mongodb://mongo:27017/sample_airbnb ou votre url
MONGO_AUTH_URI=mongodb://mongo:27017/auth_db ou votre url
PORT=4200
SESSION_SECRET=change-me
```

2. Lancer les conteneurs :

```powershell
docker compose up --build
```

3. Ouvrir http://localhost:4200

