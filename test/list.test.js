const { expect } = require('chai');
const Liste = require('../src/models/liste');
const { searchListings } = require('../src/services/listService');

describe('List service', function () {
  beforeEach(async () => {
    await Liste.deleteMany({});
    await Liste.create([
      { name: 'Maison Paris', country: 'France', city: 'Paris', price: 100, accommodates: 2, review_scores_rating: 90 },
      { name: 'Appartement Lyon', country: 'France', city: 'Lyon', price: 60, accommodates: 4, review_scores_rating: 80 },
      { name: 'Studio Berlin', country: 'Allemagne', city: 'Berlin', price: 50, accommodates: 1, review_scores_rating: 85 }
    ]);
  });

  it('finds listings by country', async function () {
    console.log(' exécution de de la recher par pays({ country: "France" })');
    const results = await searchListings({ country: 'France' });
    console.log(' résultats reçus — count =', results.length);
    expect(results).to.be.an('array');
    expect(results.length).to.equal(2);
    const names = results.map(r => r.name);
    expect(names).to.include('Maison Paris');
    expect(names).to.include('Appartement Lyon');
    console.log(' vérifications country — OK');
  });

  it('filters by guests (accommodates)', async function () {
    console.log(' exécution de de la recher par nb de personne({ guests: 4 })');
    const results = await searchListings({ guests: 4 });
    console.log(' résultats reçus — count =', results.length);
    expect(results).to.be.an('array');
    expect(results.some(r => r.name === 'Appartement Lyon')).to.be.true;
    console.log(' vérifications personne — OK');
  });
});
