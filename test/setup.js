
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

let mongod;
let authConn;
let mongooseGlobal;

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
async function waitFor(cond, timeout = 10000) {
  const start = Date.now();
  while (!cond()) {
    if (Date.now() - start > timeout) throw new Error('timeout en attente de connexion');
    await wait(100);
  }
}

before(async function () {
  this.timeout(20000);
  console.log(' démarrage du serveur mongo en mémoire...');
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  process.env.MONGO_AUTH_URI = `${uri}auth_db`;
  process.env.MONGO_URI = `${uri}sample_airbnb`;
  console.log(' URI  définies pour auth et data');

  const mongoose = require('mongoose');
  console.log(' création connexion auth en mémoire');
  authConn = mongoose.createConnection(process.env.MONGO_AUTH_URI, { serverSelectionTimeoutMS: 3000 });
  await waitFor(() => authConn && authConn.readyState === 1, 10000);
  console.log(' connexion auth ok');

  try {
    const authModulePath = require.resolve('../src/config/authDatabase');
    require.cache[authModulePath] = {
      id: authModulePath,
      filename: authModulePath,
      loaded: true,
      exports: authConn
    };
  } catch (e) {
  }

  const connectDatabase = require('../src/config/database');
  console.log(' création/attente connexion data airbnb');
  mongooseGlobal = connectDatabase();
  await waitFor(() => mongooseGlobal && mongooseGlobal.connection && mongooseGlobal.connection.readyState === 1, 10000);
  console.log(' connexion data airbnb ok');
  global.__AUTH_CONN__ = authConn;
  global.__MONGO_GLOBAL__ = mongooseGlobal;
  console.log(' initialisation terminée — debut des tests');
});

after(async function () {
  this.timeout(10000);
  console.log('fermeture des connexions et arrêt du serveur mongo db');
  try {
    if (mongooseGlobal && mongooseGlobal.connection) await mongooseGlobal.connection.close();
    console.log(' connexion data fermée');
  } catch (e) {
    console.warn(' erreur fermeture data', e.message);
  }
  try {
    if (authConn && authConn.close) await authConn.close();
    console.log(' connexion auth fermée');
  } catch (e) {
    console.warn(' erreur fermeture auth', e.message);
  }
  try {
    if (mongod) await mongod.stop();
    console.log(' mongodb db server stop');
  } catch (e) {
    console.warn(' erreur stop mongodb db server', e.message);
  }
});

module.exports = {};
