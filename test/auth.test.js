const { expect } = require('chai');
const mongoose = require('mongoose');

function getUserModel() {
  const authConn = global.__AUTH_CONN__;
  if (!authConn) {
    return require('../src/models/user');
  }

  const schema = new mongoose.Schema({ username: { type: String, required: true, unique: true }, password: { type: String, required: true } });
  return authConn.models.User || authConn.model('User', schema, 'users');
}

describe('Auth model', function () {
  let User;

  beforeEach(async () => {
    User = getUserModel();
    await User.deleteMany({});
  });

  it('creer et trouver un user', async function () {
    console.log('Ccréation d\'un utilisateur admin/admin...');
    await User.create({ username: 'admintest', password: 'admintest' });
    console.log('recherche de l\'utilisateur créé...');
    const u = await User.findOne({ username: 'admintest' }).lean();
    expect(u).to.exist;
    expect(u.username).to.equal('admintest');
    expect(u.password).to.equal('admintest');
    console.log(' utilisateur trouvé — OK');
  });
});
