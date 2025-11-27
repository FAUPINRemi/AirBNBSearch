require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const configureCors = require('./src/middleware/corsMiddleware');
const connectDatabase = require('./src/config/database');
const routes = require('./src/routes/index');
const authRoutes = require('./src/routes/auth');

const app = express();

// Connexion MongoDB
connectDatabase();

// EJS + static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS (utilise le middleware configurable)
app.use(configureCors());

// Sessions
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'dev-secret',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 }
	})
);

// Routes
app.use('/', routes);

// Routes API d'auth (JWT)
app.use('/api/auth', authRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Serveur démarré sur http://localhost:${PORT}`);
});