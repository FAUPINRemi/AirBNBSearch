const { searchListings } = require('../services/listService');
const User = require('../models/user');
const mongoose = require('mongoose');

function dataDbReady() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

async function getIndex(req, res) {
  const isAuthenticated = !!req.session.userId;

  const filters = {};
  let listings = [];
  let dbError = null;

  if (isAuthenticated) {
    // on regarde si la DB data est indisponible
    if (!dataDbReady()) {
      dbError = "Base d'annonces indisponible, réessayez plus tard.";
      listings = [];
    } else {
      //on affiche toutes les annonces par defaut
      listings = await searchListings(filters);
    }
  }

  res.render('index', {
    user: isAuthenticated ? { username: req.session.username } : null,
    errorLogin: null,
    filters,
    listings,
    dbError
  });
}

async function postLogin(req, res) {
  const { username, password } = req.body;

  try {
    // vérification disponibilité DB
    if (!User.db || User.db.readyState !== 1) {
      return res.render('index', {
        user: null,
        errorLogin: "Service d'authentification indisponible, réessayez plus tard.",
        filters: {},
        listings: [],
        dbError: null
      });
    }

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.render('index', {
        user: null,
        errorLogin: 'Identifiants invalides',
        filters: {},
        listings: []
      });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/');
  } catch (err) {
    console.error('Erreur login :', err);
    res.status(500).send('Erreur serveur');
  }
}

// Inscription formulaire crée l'utilisateur, redirection vers /search
async function postRegister(req, res) {
  const { username, password } = req.body;

  try {
    // vérification disponibilité DB
    if (!User.db || User.db.readyState !== 1) {
      return res.render('index', {
        user: null,
        errorLogin: "Service d'authentification indisponible, réessayez plus tard.",
        filters: {},
        listings: [],
        dbError: null
      });
    }

    // on vérifie si l'utilisateur existe déjà
    const exists = await User.findOne({ username }).lean();
    if (exists) {
      return res.render('index', {
        user: null,
        errorLogin: 'Nom d\'utilisateur déjà pris',
        filters: {},
        listings: []
      });
    }

    const newUser = await User.create({ username, password });

    //  session start
    req.session.userId = newUser._id;
    req.session.username = newUser.username;

    // redirection vers la page de recherche une fois connecté
    return res.redirect('/search');
  } catch (err) {
    console.error('Erreur register :', err);
    return res.status(500).send('Erreur serveur');
  }
}

function postLogout(req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

async function getSearch(req, res) {
  if (!req.session.userId) {
    return res.redirect('/');
  }

  const filters = {
    country: req.query.country || '',
    guests: req.query.guests || '',
    priceMin: req.query.priceMin || '',
    priceMax: req.query.priceMax || '',
    sortPopular: req.query.sortPopular || ''
  };

  try {
    if (!dataDbReady()) {
      return res.render('index', {
        user: { username: req.session.username },
        errorLogin: null,
        filters,
        listings: [],
        dbError: "Base d'annonces indisponible, réessayez plus tard."
      });
    }

    const listings = await searchListings(filters);

    res.render('index', {
      user: { username: req.session.username },
      errorLogin: null,
      filters,
      listings,
      dbError: null
    });
  } catch (err) {
    console.error('Erreur recherche :', err);
    res.status(500).send('Erreur serveur');
  }
}

module.exports = {
  getIndex,
  postLogin,
  postRegister,
  postLogout,
  getSearch
};