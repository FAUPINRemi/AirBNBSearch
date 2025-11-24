const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: String,
  country: String,
  city: String,
  price: Number,
  accommodates: Number,   
  review_scores_rating: Number 
});

module.exports = mongoose.model('Liste', listingSchema, 'listings');