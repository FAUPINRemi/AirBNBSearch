# AirBNBSearch
Projet scolaire : Système de recherche d'annonce airbnb avec critère
Stack : ExpressJS, EJS, MongoDB, Mongoose


# LANCER L'APP
 
Pour lancer le projet :

- À la racine :
    - `docker compose up --build`
- Une fois les conteneurs démarrés, ouvrir le navigateur à l’adresse :
    - [`http://localhost:4200`](http://localhost:4200)

Identifiants de connexion :

- **Login** : `admin`
- **Mot de passe** : `admin`


# .env à ajouter à la racine

MONGO_URI=mongodb://localhost:27017/sample_airbnb
PORT=4200
SESSION_SECRET=test