//on vérifie la présence d'un user pour le test : admintest/admintest dans la DB d'auth

process.env.MONGO_AUTH_URI = process.env.MONGO_AUTH_URI || 'mongodb://localhost:27017/auth_db';

const authConn = require('../src/config/authDatabase');
const User = require('../src/models/user');

function waitForReady(conn, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check() {
      if (conn && conn.readyState === 1) return resolve();
      if (Date.now() - start > timeout) return reject(new Error('Timeout waiting for auth DB'));
      setTimeout(check, 100);
    })();
  });
}

async function run() {
  try {
    await waitForReady(authConn, 5000);
    const user = await User.findOne({ username: 'admintest', password: 'admintest' }).lean();
    if (user) {
      console.log('user trouver:', user);
      process.exit(0);
    } else {
      console.error('admintest admintest inconnu dans la BDD');
      process.exit(1);
    }
  } catch (err) {
    console.error('Erreur test auth:', err);
    process.exit(2);
  }
}

run();
