const { expect } = require('chai');
const mongoose = require('mongoose');
const Liste = require('../src/models/liste');
const { searchListings } = require('../src/services/listService');

function getUserModel() {
  const authConn = global.__AUTH_CONN__;
  if (!authConn) {
    return require('../src/models/user');
  }

  const schema = new mongoose.Schema({ username: { type: String, required: true, unique: true }, password: { type: String, required: true } });
  return authConn.models.User || authConn.model('User', schema, 'users');
}

describe('Integration (auth + listings)', function () {
  let User;

  beforeEach(async () => {
    User = getUserModel();
    await User.deleteMany({});
    await Liste.deleteMany({});

    console.log(' création user admintest/admintest...');
    await User.create({ username: 'admintest', password: 'admintest' });
    await Liste.create([
      { name: 'Maison Paris', country: 'France', city: 'Paris', price: 100, accommodates: 2, review_scores_rating: 90 },
      { name: 'Appartement Lyon', country: 'France', city: 'Lyon', price: 60, accommodates: 4, review_scores_rating: 80 }
    ]);
  });

  it('finds user and can search listings', async function () {
    console.log(' vérification présence user admintest');
    const u = await User.findOne({ username: 'admintest' }).lean();
    expect(u).to.exist;
    console.log(' user trouvé — OK');

    console.log(' exécution de de la recher par pays({ country: "France" })');
    const results = await searchListings({ country: 'France' });
    console.log(' résultats reçus — count =', results.length);
    expect(results).to.be.an('array').with.lengthOf(2);
    console.log(' recherche — OK');
  });
});
