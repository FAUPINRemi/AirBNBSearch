const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authConn = require('../config/authDatabase');

async function apiLogin(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username & password requis' });

  try {
    const authReady = authConn && (typeof authConn.isReady === 'function' ? authConn.isReady() : authConn.readyState === 1);
    if (!authReady) {
      return res.status(503).json({ message: "Service d'authentification indisponible" });
    }
    const user = await User.findOne({ username, password }).lean();
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    const payload = { userId: user._id.toString(), username: user.username };
    const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'dev-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '8h' });

    return res.json({ token, user: { username: user.username, _id: user._id } });
  } catch (err) {
    console.error('apiLogin error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function apiProfile(req, res) {
  return res.json({ profile: req.user });
}

// Inscription d'un nouvel utilisateur
async function apiRegister(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username & password requis' });

  try {
    const authReady = authConn && (typeof authConn.isReady === 'function' ? authConn.isReady() : authConn.readyState === 1);
    if (!authReady) {
      return res.status(503).json({ message: "Service d'authentification indisponible" });
    }

    const existing = await User.findOne({ username }).lean();
    if (existing) return res.status(409).json({ message: 'Nom d’utilisateur déjà pris' });

    const newUser = await User.create({ username, password });

    const payload = { userId: newUser._id.toString(), username: newUser.username };
    const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'dev-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '8h' });

    return res.status(201).json({ token, user: { username: newUser.username, _id: newUser._id } });
  } catch (err) {
    console.error('apiRegister error:', err);
    if (err && err.code === 11000) return res.status(409).json({ message: 'Nom d’utilisateur déjà pris' });
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  apiLogin,
  apiProfile,
  apiRegister
};
