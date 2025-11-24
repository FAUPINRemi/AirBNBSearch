const Liste = require('../models/liste');


async function searchListings(filters = {}) {
  const { country, guests, priceMin, priceMax, sortPopular } = filters;
  const query = {};

  // Pays: chercher sur plusieurs chemins possibles (champ plat ou imbriqué)
  if (country) {
    const countryRegex = new RegExp(country.trim(), 'i');
    query.$or = [
      { country: countryRegex },
      { 'address.country': countryRegex },
      { 'address.country_name': countryRegex },
      { 'address.country_code': countryRegex },
      { 'location.country': countryRegex },
      { 'address.location.country': countryRegex }
    ];
  }

  //nombre de personne
  if (guests) {
    query.accommodates = { $gte: Number(guests) };
  }

  //prix min / max
  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }

  let mongooseQuery = Liste.find(query).lean();

  //popularité
  if (sortPopular === 'on') {
    mongooseQuery = mongooseQuery.sort({ review_scores_rating: -1 });
  }

  const results = await mongooseQuery.limit(100).exec();

  return (results || []).map(doc => {
    if (!doc.country) {
      doc.country = (
        (doc.address && (doc.address.country || doc.address.country_name || doc.address.country_code)) ||
        (doc.location && doc.location.country) ||
        (doc.address && doc.address.location && doc.address.location.country) ||
        null
      );
    }

    if (doc.accommodates != null) {
      doc.accommodates = Number(doc.accommodates) || doc.accommodates;
    }

    if (doc.price != null) {
      if (typeof doc.price === 'string') {
        const num = parseFloat(doc.price.replace(/[^0-9.,]/g, '').replace(',', '.'));
        doc.price = Number.isFinite(num) ? num : doc.price;
      } else if (typeof doc.price === 'object') {
        const candidate = doc.price.$numberDecimal || doc.price.$numberInt || doc.price.value || null;
        if (candidate != null) {
          const num = Number(candidate);
          if (!Number.isNaN(num)) doc.price = num;
        }
      } else {
        doc.price = Number(doc.price) || doc.price;
      }
    }

    if (doc.review_scores_rating == null) {
      const candidate =
        (doc.review_scores && (doc.review_scores.rating ?? doc.review_scores.review_scores_rating)) ||
        (doc.reviewScores && (doc.reviewScores.rating ?? doc.reviewScores.review_scores_rating)) ||
        doc.review_scores_rating ||
        null;

      if (candidate != null) {
        let val = candidate;
        if (typeof val === 'object') {
          val = val.$numberDecimal || val.$numberDouble || val.$numberInt || val.value || null;
        }
        const n = Number(val);
        if (!Number.isNaN(n)) {
          doc.review_scores_rating = n;
        }
      }
    } else {
      const n = Number(doc.review_scores_rating);
      if (!Number.isNaN(n)) doc.review_scores_rating = n;
    }

    return doc;
  });
}

module.exports = {
  searchListings
};