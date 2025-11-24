const { searchListings } = require('../services/listService');
const User = require('../models/user');

async function getIndex(req, res) {
  const isAuthenticated = !!req.session.userId;

  const filters = {};
  let listings = [];

  if (isAuthenticated) {
    //on affiche toutes les annonces par defaut
    listings = await searchListings(filters);
  }

  res.render('index', {
    user: isAuthenticated ? { username: req.session.username } : null,
    errorLogin: null,
    filters,
    listings
  });
}

async function postLogin(req, res) {
  const { username, password } = req.body;

  try {
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
    const listings = await searchListings(filters);

    res.render('index', {
      user: { username: req.session.username },
      errorLogin: null,
      filters,
      listings
    });
  } catch (err) {
    console.error('Erreur recherche :', err);
    res.status(500).send('Erreur serveur');
  }
}

module.exports = {
  getIndex,
  postLogin,
  postLogout,
  getSearch
};