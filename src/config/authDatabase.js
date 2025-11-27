const mongoose = require('mongoose');

let authConnection;

function connectAuthDatabase() {
  const uri = process.env.MONGO_AUTH_URI || 'mongodb://mongo:27017/auth_db';
  if (authConnection) return authConnection;

  authConnection = mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 3000
  });

  authConnection.on('connected', () => console.log('Connecté à MongoDB '));
  authConnection.on('open', () => console.log('Auth DB connection ok'));
  authConnection.on('error', (err) => console.warn('Impossible de se connecter à MongoDB :', err.message));

  authConnection.isReady = function () {
    return authConnection && authConnection.readyState === 1;
  };

  return authConnection;
}

module.exports = connectAuthDatabase();
